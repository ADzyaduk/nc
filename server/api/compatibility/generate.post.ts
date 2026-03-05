import { generateCompatibilitySchema } from '~~/server/utils/schemas'
import { calculateSynastry } from '~~/server/utils/astrology'
import { generateCompatibilityInterpretation } from '~~/server/utils/openrouter'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const parsed = generateCompatibilitySchema.safeParse(body)
    if (!parsed.success) {
        throw createError({
            statusCode: 400,
            statusMessage: parsed.error.issues[0]?.message || 'Invalid request',
        })
    }

    const { person1, person2, telegramId, locale } = parsed.data
    const supabase = await useSupabaseAdmin(event)

    // Find user
    const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('telegram_id', telegramId)
        .single()

    if (!user) {
        throw createError({ statusCode: 401, statusMessage: 'User not found' })
    }

    // Calculate synastry (both charts + cross-aspects + scores)
    const synastry = calculateSynastry(person1, person2)

    // Generate AI interpretation - Moved to interpret.post.ts to avoid timeouts
    const content = ''

    // Store in database
    const { data: report, error } = await supabase
        .from('compatibility_reports')
        .insert({
            user_id: user.id,
            person1_name: person1.name || null,
            person1_birth_date: person1.birthDate,
            person1_birth_time: person1.birthTime,
            person1_birth_city: person1.birthCity,
            person1_latitude: person1.latitude,
            person1_longitude: person1.longitude,
            person1_chart_json: synastry.chart1,
            person2_name: person2.name || null,
            person2_birth_date: person2.birthDate,
            person2_birth_time: person2.birthTime,
            person2_birth_city: person2.birthCity,
            person2_latitude: person2.latitude,
            person2_longitude: person2.longitude,
            person2_chart_json: synastry.chart2,
            synastry_json: { crossAspects: synastry.crossAspects },
            scores: synastry.scores,
            content,
            type: 'basic',
        })
        .select()
        .single()

    if (error) {
        throw createError({ statusCode: 500, statusMessage: 'Failed to save compatibility report' })
    }

    return { report }
})
