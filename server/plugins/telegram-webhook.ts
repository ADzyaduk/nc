/**
 * Nitro server plugin — registers the Telegram bot webhook on startup.
 *
 * Requires PUBLIC_URL in .env (e.g. https://your-app.example.com).
 * If PUBLIC_URL is not set the plugin silently skips registration,
 * which is fine for local development where you can use ngrok manually.
 */
export default defineNitroPlugin(async () => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const publicUrl = process.env.PUBLIC_URL?.replace(/\/$/, '')

    if (!botToken || !publicUrl) {
        if (!publicUrl) {
            console.info('[Telegram] PUBLIC_URL not set — skipping webhook registration.')
        }
        return
    }

    const webhookUrl = `${publicUrl}/api/telegram/webhook`

    try {
        const response = await $fetch<{ ok: boolean, description?: string }>(
            `https://api.telegram.org/bot${botToken}/setWebhook`,
            {
                method: 'POST',
                body: {
                    url: webhookUrl,
                    allowed_updates: ['message', 'pre_checkout_query'],
                    drop_pending_updates: false,
                },
            },
        )

        if (response.ok) {
            console.info('[Telegram] Webhook registered:', webhookUrl)
        }
        else {
            console.warn('[Telegram] setWebhook returned not-ok:', response.description)
        }
    }
    catch (e) {
        console.error('[Telegram] Failed to register webhook:', e)
    }
})
