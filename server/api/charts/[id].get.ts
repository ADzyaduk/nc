export default defineEventHandler(async (event) => {
    const chartId = getRouterParam(event, 'id')
    if (!chartId) {
        throw createError({ statusCode: 400, statusMessage: 'Missing chart ID' })
    }

    const query = getQuery(event)
    const telegramId = query.telegramId as string
    if (!telegramId) {
        throw createError({ statusCode: 400, statusMessage: 'Missing telegramId' })
    }

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

    // Get chart
    const { data: chart } = await supabase
        .from('birth_charts')
        .select('*')
        .eq('id', chartId)
        .eq('user_id', user.id)
        .single()

    if (!chart) {
        throw createError({ statusCode: 404, statusMessage: 'Chart not found' })
    }

    // Get associated reports
    const { data: reports } = await supabase
        .from('reports')
        .select('*')
        .eq('birth_chart_id', chartId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return { chart, reports: reports || [] }
})
