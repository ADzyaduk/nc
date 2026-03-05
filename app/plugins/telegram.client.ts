/**
 * Telegram client plugin.
 * Runs only on client-side. Initializes Telegram WebApp
 * and auto-authenticates the user.
 */

export default defineNuxtPlugin(async (nuxtApp) => {
    const telegram = useTelegram()
    const userStore = useUserStore()

    if (telegram.isAvailable.value) {
        // ---- Inside Telegram ----
        telegram.ready()
        telegram.expand()

        // Auto-detect language from Telegram
        const langCode = telegram.languageCode.value
        const i18n = nuxtApp.$i18n as { setLocale: (locale: string) => Promise<void> }
        if (langCode === 'en') {
            await i18n.setLocale('en')
        }
        else {
            await i18n.setLocale('ru')
        }

        // Auto-authenticate
        if (telegram.initData.value) {
            try {
                await userStore.authenticate(telegram.initData.value)
            }
            catch {
                console.warn('Telegram auth failed — running in demo mode')
            }
        }
    }
    else {
        // ---- Dev mode (outside Telegram) ----
        console.info('Telegram WebApp not available — running in dev mode')

        // Auto-create dev user for testing
        try {
            const data = await $fetch<{ user: any }>('/api/auth/dev', {
                method: 'POST',
            })
            if (data.user) {
                userStore.setUser(data.user)
                console.info('Dev user authenticated:', data.user.username)
            }
        }
        catch (e) {
            console.warn('Dev auth failed:', e)
        }
    }
})
