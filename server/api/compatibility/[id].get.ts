export default defineEventHandler(async (event) => {
    const reportId = getRouterParam(event, 'id')
    if (!reportId) {
        throw createError({ statusCode: 400, statusMessage: 'Missing report ID' })
    }

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

    // Get compatibility report
    const { data: report } = await supabase
        .from('compatibility_reports')
        .select('*')
        .eq('id', reportId)
        .eq('user_id', user.id)
        .single()

    if (!report) {
        throw createError({ statusCode: 404, statusMessage: 'Report not found' })
    }

    return { report }
})
