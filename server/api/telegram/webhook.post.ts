/**
 * Telegram bot webhook endpoint.
 *
 * Two update types are handled here:
 *
 * 1. pre_checkout_query  — Telegram sends this before charging the user.
 *    The bot MUST answer within 10 seconds via answerPreCheckoutQuery,
 *    otherwise the payment is cancelled and openInvoice never fires 'paid'.
 *
 * 2. message.successful_payment — fired after a real Stars charge succeeds.
 *    We persist the real telegram_payment_charge_id so it can be used
 *    for refunds in future.
 */

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const botToken = process.env.TELEGRAM_BOT_TOKEN

    if (!botToken) {
        return { ok: true }
    }

    // ── 1. Pre-checkout query ─────────────────────────────────────────────
    // Telegram waits up to 10 s for this reply. Auto-approve everything.
    if (body?.pre_checkout_query) {
        const queryId = body.pre_checkout_query.id as string
        await $fetch(`https://api.telegram.org/bot${botToken}/answerPreCheckoutQuery`, {
            method: 'POST',
            body: { pre_checkout_query_id: queryId, ok: true },
        })
        return { ok: true }
    }

    // ── 2. Successful payment ─────────────────────────────────────────────
    // Record the real Telegram charge ID for audit / refund purposes.
    if (body?.message?.successful_payment) {
        const sp = body.message.successful_payment as {
            invoice_payload: string
            telegram_payment_charge_id: string
            total_amount: number
            currency: string
        }

        try {
            const payload = JSON.parse(sp.invoice_payload) as {
                type: string
                reportId?: string
                telegramId?: string
            }

            const supabase = await useSupabaseAdmin(event)

            const { data: user } = await supabase
                .from('users')
                .select('id')
                .eq('telegram_id', String(payload.telegramId ?? body.message.from?.id))
                .maybeSingle()

            if (user) {
                await supabase.from('payments').insert({
                    user_id: user.id,
                    amount: sp.total_amount,
                    currency: sp.currency,
                    status: 'completed',
                    telegram_payment_id: sp.telegram_payment_charge_id,
                })
            }
        }
        catch (e) {
            // Non-critical — client already unlocks content after 'paid' callback.
            console.warn('[webhook] Failed to persist successful_payment:', e)
        }

        return { ok: true }
    }

    return { ok: true }
})
