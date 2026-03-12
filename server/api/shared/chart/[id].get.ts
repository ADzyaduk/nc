export default defineEventHandler(async (event) => {
    const chartId = getRouterParam(event, 'id')
    if (!chartId) {
        throw createError({ statusCode: 400, statusMessage: 'Missing chart ID' })
    }

    const supabase = await useSupabaseAdmin(event)

    const { data: chart } = await supabase
        .from('birth_charts')
        .select('id, birth_name, birth_date, chart_json')
        .eq('id', chartId)
        .single()

    if (!chart) {
        throw createError({ statusCode: 404, statusMessage: 'Chart not found' })
    }

    return { chart }
})
