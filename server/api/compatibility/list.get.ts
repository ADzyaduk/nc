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

    // Get all compatibility reports for user
    const { data: reports, error } = await supabase
        .from('compatibility_reports')
        .select('id, person1_name, person2_name, person1_chart_json, person2_chart_json, scores, type, is_paid, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        throw createError({ statusCode: 500, statusMessage: 'Failed to fetch compatibility reports' })
    }

    return { reports: reports || [] }
})
