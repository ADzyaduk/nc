export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const telegramId = query.telegramId as string

    if (!telegramId) {
        throw createError({ statusCode: 400, statusMessage: 'telegramId is required' })
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

    // Get all charts for user
    const { data: charts, error } = await supabase
        .from('birth_charts')
        .select('id, birth_date, birth_time, birth_city, chart_json, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        throw createError({ statusCode: 500, statusMessage: 'Failed to fetch charts' })
    }

    // Check which charts have paid reports
    const chartIds = (charts || []).map(c => c.id)
    const { data: paidReports } = await supabase
        .from('reports')
        .select('birth_chart_id')
        .in('birth_chart_id', chartIds)
        .eq('is_paid', true)

    const paidChartIds = new Set((paidReports || []).map(r => r.birth_chart_id))

    const chartsWithStatus = (charts || []).map(chart => ({
        ...chart,
        hasPaidReport: paidChartIds.has(chart.id),
    }))

    return { charts: chartsWithStatus }
})
