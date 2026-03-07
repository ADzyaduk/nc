import { verifyPaymentSchema } from '~~/server/utils/schemas'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const parsed = verifyPaymentSchema.safeParse(body)
    if (!parsed.success) {
        throw createError({
            statusCode: 400,
            statusMessage: parsed.error.issues[0]?.message || 'Invalid request',
        })
    }

    const { reportId, telegramId, telegramPaymentId } = parsed.data
    const supabase = await useSupabaseAdmin(event)

    const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('telegram_id', telegramId)
        .single()

    if (!user) {
        throw createError({ statusCode: 401, statusMessage: 'User not found' })
    }

    const { data: report } = await supabase
        .from('reports')
        .select('*')
        .eq('id', reportId)
        .eq('user_id', user.id)
        .single()

    if (!report) {
        throw createError({ statusCode: 404, statusMessage: 'Report not found' })
    }

    const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
            user_id: user.id,
            report_id: reportId,
            amount: 50,
            currency: 'XTR',
            status: 'completed',
            telegram_payment_id: telegramPaymentId || `sim_${Date.now()}`,
        })
        .select()
        .single()

    if (paymentError) {
        throw createError({ statusCode: 500, statusMessage: 'Failed to record payment' })
    }

    await supabase
        .from('reports')
        .update({ is_paid: true })
        .eq('id', reportId)

    return { success: true, payment }
})
