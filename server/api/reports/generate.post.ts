import { generateReportSchema } from '~~/server/utils/schemas'
import { generateInterpretation } from '~~/server/utils/openrouter'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const parsed = generateReportSchema.safeParse(body)
    if (!parsed.success) {
        throw createError({
            statusCode: 400,
            statusMessage: parsed.error.issues[0]?.message || 'Invalid request',
        })
    }

    const { birthChartId, type, telegramId, locale } = parsed.data
    const config = useRuntimeConfig()
    const supabase = await useSupabaseAdmin(event)

    const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('telegram_id', telegramId)
        .single()

    if (!user) {
        throw createError({ statusCode: 401, statusMessage: 'User not found' })
    }

    const { data: chart } = await supabase
        .from('birth_charts')
        .select('*')
        .eq('id', birthChartId)
        .eq('user_id', user.id)
        .single()

    if (!chart) {
        throw createError({ statusCode: 404, statusMessage: 'Chart not found' })
    }

    if (type === 'full') {
        const { data: existingReport } = await supabase
            .from('reports')
            .select('*')
            .eq('birth_chart_id', birthChartId)
            .eq('type', 'full')
            .eq('is_paid', true)
            .maybeSingle()

        if (existingReport) {
            return { report: existingReport }
        }

        const { data: existingPayment } = await supabase
            .from('payments')
            .select('status')
            .eq('user_id', user.id)
            .eq('status', 'completed')
            .limit(1)
            .maybeSingle()

        if (!existingPayment) {
            throw createError({ statusCode: 402, statusMessage: 'Payment required for full report' })
        }
    }

    if (type === 'basic') {
        const { data: existingReport } = await supabase
            .from('reports')
            .select('*')
            .eq('birth_chart_id', birthChartId)
            .eq('type', 'basic')
            .maybeSingle()

        if (existingReport) {
            return { report: existingReport }
        }
    }

    const content = await generateInterpretation(
        chart.chart_json,
        type,
        config.openrouterApiKey,
        config.openrouterModelId,
        locale,
    )

    const { data: report, error } = await supabase
        .from('reports')
        .insert({
            user_id: user.id,
            birth_chart_id: birthChartId,
            type,
            content,
            is_paid: type === 'basic' || type === 'full',
        })
        .select()
        .single()

    if (error) {
        throw createError({ statusCode: 500, statusMessage: 'Failed to save report' })
    }

    return { report }
})
