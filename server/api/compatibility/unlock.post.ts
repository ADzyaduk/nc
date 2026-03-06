export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const reportId = body?.reportId as string | undefined
    if (!reportId) {
        throw createError({ statusCode: 400, statusMessage: 'Missing reportId' })
    }

    const supabase = await useSupabaseAdmin(event)

    // Ensure report exists
    const { data: report } = await supabase
        .from('compatibility_reports')
        .select('*')
        .eq('id', reportId)
        .maybeSingle()

    if (!report) {
        throw createError({ statusCode: 404, statusMessage: 'Report not found' })
    }

    // Mark report as paid (best effort — do not fail client if update has an issue)
    let updatedReport = report

    try {
        const { data, error } = await supabase
            .from('compatibility_reports')
            .update({ is_paid: true })
            .eq('id', reportId)
            .select()
            .maybeSingle()

        if (!error && data) {
            updatedReport = data
        }
        else if (error) {
            console.warn('[compatibility/unlock] Failed to persist is_paid=true:', error)
        }
    }
    catch (e) {
        console.warn('[compatibility/unlock] Unexpected error while updating report:', e)
    }

    return { report: { ...updatedReport, is_paid: true } }
})

