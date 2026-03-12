export default defineEventHandler(async (event) => {
    const reportId = getRouterParam(event, 'id')
    if (!reportId) {
        throw createError({ statusCode: 400, statusMessage: 'Missing report ID' })
    }

    const supabase = await useSupabaseAdmin(event)

    const { data: report } = await supabase
        .from('compatibility_reports')
        .select('id, scores, person1_name, person2_name, person1_chart_json, person2_chart_json')
        .eq('id', reportId)
        .single()

    if (!report) {
        throw createError({ statusCode: 404, statusMessage: 'Report not found' })
    }

    return { report }
})
