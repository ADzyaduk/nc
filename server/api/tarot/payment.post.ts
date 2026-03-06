/**
 * Simulated payment for tarot reading (50 XTR).
 * In production, replace with real Telegram Stars integration.
 */
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

    const { error } = await supabase
        .from('payments')
        .insert({
            user_id: user.id,
            amount: 50,
            currency: 'XTR',
            status: 'completed',
            telegram_payment_id: `sim_tarot_${Date.now()}`,
        })

    if (error) {
        throw createError({ statusCode: 500, statusMessage: 'Failed to record payment' })
    }

    return { success: true }
})
