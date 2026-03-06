import { z } from 'zod'
import { generateCompatibilityInterpretation } from '~~/server/utils/openrouter'

const schema = z.object({
    reportId: z.string().uuid(),
    telegramId: z.string(),
    locale: z.string().default('ru'),
})

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const parsed = schema.safeParse(body)
    if (!parsed.success) {
        throw createError({
            statusCode: 400,
            statusMessage: parsed.error.issues[0]?.message || 'Invalid request',
        })
    }

    const { reportId, telegramId, locale } = parsed.data
    const supabase = await useSupabaseAdmin(event)
    const config = useRuntimeConfig()

    // 1. Fetch user
    const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('telegram_id', telegramId)
        .single()

    if (!user) {
        throw createError({ statusCode: 401, statusMessage: 'User not found' })
    }

    // 2. Fetch the report that needs interpretation
    const { data: report } = await supabase
        .from('compatibility_reports')
        .select('*')
        .eq('id', reportId)
        .eq('user_id', user.id)
        .single()

    if (!report) {
        throw createError({ statusCode: 404, statusMessage: 'Report not found' })
    }

    if (report.content && report.content.length > 0) {
        // Already generated
        return { report }
    }

    // 3. Reconstruct SynastryData for OpenRouter
    const synastry = {
        chart1: report.person1_chart_json,
        chart2: report.person2_chart_json,
        crossAspects: (report.synastry_json as any)?.crossAspects || [],
        scores: report.scores
    }

    // 4. Generate AI interpretation
    const content = await generateCompatibilityInterpretation(
        synastry as any,
        'basic',
        config.openrouterApiKey,
        config.openrouterModelId,
        locale
    )

    // 5. Update row in database (best effort)
    let updatedReport = report

    try {
        const { data, error } = await supabase
            .from('compatibility_reports')
            .update({ content })
            .eq('id', reportId)
            .select()
            .maybeSingle()

        if (!error && data) {
            updatedReport = data
        }
        else if (error) {
            console.warn('[compatibility/interpret] Failed to persist compatibility report content:', error)
        }
    }
    catch (e) {
        console.warn('[compatibility/interpret] Unexpected error while updating report:', e)
    }

    // Always return a report to the client, even if DB update failed
    return { report: { ...updatedReport, content } }
})
