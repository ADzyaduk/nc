import { generateChartSchema } from '~~/server/utils/schemas'
import { calculateNatalChart } from '~~/server/utils/astrology'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const parsed = generateChartSchema.safeParse(body)
    if (!parsed.success) {
        throw createError({
            statusCode: 400,
            statusMessage: parsed.error.issues[0]?.message || 'Invalid request',
        })
    }

    const { birthDate, birthTime, birthCity, latitude, longitude, telegramId } = parsed.data
    const supabase = await useSupabaseAdmin(event)

    const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('telegram_id', telegramId)
        .single()

    if (!user) {
        throw createError({ statusCode: 401, statusMessage: 'User not found' })
    }

    const chartJson = calculateNatalChart(birthDate, birthTime, latitude, longitude)

    const { data: chart, error } = await supabase
        .from('birth_charts')
        .insert({
            user_id: user.id,
            birth_date: birthDate,
            birth_time: birthTime,
            birth_city: birthCity,
            latitude,
            longitude,
            chart_json: chartJson,
        })
        .select()
        .single()

    if (error) {
        throw createError({ statusCode: 500, statusMessage: 'Failed to save chart' })
    }

    return { chart }
})
