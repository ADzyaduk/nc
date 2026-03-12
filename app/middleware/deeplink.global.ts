/**
 * Global middleware: handles Telegram deeplinks (startapp parameter).
 * Runs after plugins (auth complete), before page renders.
 */
function restoreUUID(compact: string): string {
    return `${compact.slice(0, 8)}-${compact.slice(8, 12)}-${compact.slice(12, 16)}-${compact.slice(16, 20)}-${compact.slice(20)}`
}

export default defineNuxtRouteMiddleware((to) => {
    // Only intercept initial navigation to home
    if (to.path !== '/') return

    const telegram = useTelegram()
    if (!telegram.isAvailable.value) return

    const rawInitData = telegram.initData.value
    const initParams = rawInitData ? new URLSearchParams(rawInitData) : null
    const startParam = (initParams?.get('start_param')
        ?? telegram.webApp.value?.initDataUnsafe?.start_param) as string | undefined

    if (startParam?.startsWith('chart_')) {
        const id = restoreUUID(startParam.slice('chart_'.length))
        return navigateTo(`/shared/chart/${id}`)
    }

    if (startParam?.startsWith('compat_')) {
        const id = restoreUUID(startParam.slice('compat_'.length))
        return navigateTo(`/shared/compatibility/${id}`)
    }
})
