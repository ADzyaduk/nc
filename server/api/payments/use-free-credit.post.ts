export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const telegramId = body?.telegramId

    if (!telegramId) {
        throw createError({ statusCode: 400, statusMessage: 'Missing telegramId' })
    }

    const supabase = await useSupabaseAdmin(event)

    const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('telegram_id', telegramId)
        .single()

    if (!user) {
        throw createError({ statusCode: 401, statusMessage: 'User not found' })
    }

    const { data: remaining, error: rpcError } = await supabase.rpc('consume_free_use', { p_user_id: user.id })

    if (rpcError || remaining === null || remaining === -1) {
        throw createError({ statusCode: 402, statusMessage: 'No free uses remaining' })
    }

    return { success: true, freeUsesRemaining: remaining }
})
