/**
 * Nitro server plugin — registers the Telegram bot webhook on startup.
 *
 * Set the following environment variables in production (e.g. Amvera config):
 *   NUXT_TELEGRAM_BOT_TOKEN=<your token>
 *   NUXT_PUBLIC_URL=https://your-deployed-app.com
 *
 * Nuxt automatically maps NUXT_<KEY> env vars to runtimeConfig at runtime,
 * so no .env file is needed on the server.
 */
export default defineNitroPlugin(async () => {
    const config = useRuntimeConfig()
    const botToken = config.telegramBotToken as string | undefined
    const publicUrl = (config.publicUrl as string | undefined)?.replace(/\/$/, '')

    if (!botToken || !publicUrl) {
        console.info('[Telegram] Webhook registration skipped — set NUXT_TELEGRAM_BOT_TOKEN and NUXT_PUBLIC_URL.')
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
