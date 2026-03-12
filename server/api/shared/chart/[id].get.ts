export default defineEventHandler(async (event) => {
    const chartId = getRouterParam(event, 'id')
    if (!chartId) {
        throw createError({ statusCode: 400, statusMessage: 'Missing chart ID' })
    }

    const supabase = await useSupabaseAdmin(event)

    const { data: chart } = await supabase
        .from('birth_charts')
        .select('id, birth_city, birth_date, chart_json, user_id')
        .eq('id', chartId)
        .single()

    if (!chart) {
        throw createError({ statusCode: 404, statusMessage: 'Chart not found' })
    }

    // Fetch full report if available (show to friend to entice them)
    const { data: fullReport } = await supabase
        .from('reports')
        .select('content, type')
        .eq('birth_chart_id', chartId)
        .eq('user_id', chart.user_id)
        .eq('type', 'full')
        .maybeSingle()

    return { chart, fullReport: fullReport || null }
})
