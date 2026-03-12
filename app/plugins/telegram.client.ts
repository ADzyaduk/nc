/**
 * Telegram client plugin.
 * Runs only on client-side. Initializes Telegram WebApp
 * and auto-authenticates the user.
 */

export default defineNuxtPlugin(async (nuxtApp) => {
    const telegram = useTelegram()
    const userStore = useUserStore()
    const router = useRouter()

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

        // Handle shared deeplinks: startapp=chart_<id> or startapp=compat_<id>
        // Parse from raw initData string (more reliable than initDataUnsafe)
        const rawInitData = telegram.initData.value
        const initParams = rawInitData ? new URLSearchParams(rawInitData) : null
        const startParam = initParams?.get('start_param')
            ?? telegram.webApp.value?.initDataUnsafe?.start_param as string | undefined
        // DEBUG: временно показываем start_param — убери после отладки
        if (startParam) {
            telegram.webApp.value?.showAlert?.(`start_param: ${startParam}`)
        }
        if (startParam?.startsWith('chart_')) {
            const compactId = startParam.slice('chart_'.length)
            // Restore UUID hyphens: 8-4-4-4-12
            const id = `${compactId.slice(0, 8)}-${compactId.slice(8, 12)}-${compactId.slice(12, 16)}-${compactId.slice(16, 20)}-${compactId.slice(20)}`
            router.push(`/shared/chart/${id}`)
        }
        else if (startParam?.startsWith('compat_')) {
            const compactId = startParam.slice('compat_'.length)
            const id = `${compactId.slice(0, 8)}-${compactId.slice(8, 12)}-${compactId.slice(12, 16)}-${compactId.slice(16, 20)}-${compactId.slice(20)}`
            router.push(`/shared/compatibility/${id}`)
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
