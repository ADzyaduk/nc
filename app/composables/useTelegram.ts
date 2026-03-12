/**
 * Composable for Telegram WebApp API access.
 * Provides safe access to Telegram.WebApp with type safety.
 */

interface TelegramWebApp {
    initData: string
    initDataUnsafe: {
        user?: {
            id: number
            first_name: string
            last_name?: string
            username?: string
            language_code?: string
        }
        auth_date: number
        hash: string
        start_param?: string
    }
    version: string
    themeParams: Record<string, string>
    colorScheme: 'dark' | 'light'
    ready: () => void
    expand: () => void
    close: () => void
    isVersionAtLeast: (version: string) => boolean
    MainButton: {
        text: string
        color: string
        textColor: string
        isVisible: boolean
        isActive: boolean
        show: () => void
        hide: () => void
        onClick: (callback: () => void) => void
        offClick: (callback: () => void) => void
        setText: (text: string) => void
        enable: () => void
        disable: () => void
        showProgress: (leaveActive?: boolean) => void
        hideProgress: () => void
    }
    BackButton: {
        isVisible: boolean
        show: () => void
        hide: () => void
        onClick: (callback: () => void) => void
        offClick: (callback: () => void) => void
    }
    HapticFeedback: {
        impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
        notificationOccurred: (type: 'error' | 'success' | 'warning') => void
        selectionChanged: () => void
    }
    showConfirm: (message: string, callback: (confirmed: boolean) => void) => void
    showAlert: (message: string, callback?: () => void) => void
    openInvoice: (url: string, callback: (status: string) => void) => void
    openLink: (url: string) => void
    openTelegramLink: (url: string) => void
}

declare global {
    interface Window {
        Telegram?: {
            WebApp: TelegramWebApp
        }
    }
}

export function useTelegram() {
    const isAvailable = computed(() => {
        if (import.meta.server) return false
        return !!window.Telegram?.WebApp
    })

    const webApp = computed(() => {
        if (!isAvailable.value) return null
        return window.Telegram!.WebApp
    })

    const initData = computed(() => webApp.value?.initData || '')

    const user = computed(() => webApp.value?.initDataUnsafe?.user || null)

    const languageCode = computed(() => user.value?.language_code || 'ru')

    const telegramId = computed(() => user.value ? String(user.value.id) : '')

    const version = computed(() => webApp.value?.version || '6.0')

    function isVersionAtLeast(ver: string): boolean {
        return webApp.value?.isVersionAtLeast?.(ver) ?? false
    }

    function ready() {
        webApp.value?.ready()
    }

    function expand() {
        webApp.value?.expand()
    }

    // Version-safe haptic feedback (requires 6.1+)
    function hapticFeedback(type: 'success' | 'error' | 'warning') {
        try {
            if (isVersionAtLeast('6.1')) {
                webApp.value?.HapticFeedback?.notificationOccurred(type)
            }
        }
        catch { /* silently ignore in dev */ }
    }

    function hapticImpact(style: 'light' | 'medium' | 'heavy' = 'medium') {
        try {
            if (isVersionAtLeast('6.1')) {
                webApp.value?.HapticFeedback?.impactOccurred(style)
            }
        }
        catch { /* silently ignore */ }
    }

    // Back Button (requires 6.1+)
    function showBackButton(callback: () => void) {
        if (!isVersionAtLeast('6.1')) return
        webApp.value?.BackButton?.show()
        webApp.value?.BackButton?.onClick(callback)
    }

    function hideBackButton() {
        webApp.value?.BackButton?.hide()
    }

    // Main Button
    function showMainButton(text: string, callback: () => void) {
        if (!webApp.value) return
        webApp.value.MainButton.setText(text)
        webApp.value.MainButton.show()
        webApp.value.MainButton.onClick(callback)
    }

    function hideMainButton() {
        webApp.value?.MainButton?.hide()
    }

    function setMainButtonLoading(loading: boolean) {
        if (!webApp.value) return
        if (loading) {
            webApp.value.MainButton.showProgress(true)
        }
        else {
            webApp.value.MainButton.hideProgress()
        }
    }

    // Dialogs
    function showConfirm(message: string): Promise<boolean> {
        return new Promise((resolve) => {
            if (webApp.value?.showConfirm) {
                webApp.value.showConfirm(message, resolve)
            }
            else {
                resolve(confirm(message))
            }
        })
    }

    function showAlert(message: string): Promise<void> {
        return new Promise((resolve) => {
            if (webApp.value?.showAlert) {
                webApp.value.showAlert(message, resolve)
            }
            else {
                alert(message)
                resolve()
            }
        })
    }

    function openLink(url: string) {
        if (webApp.value?.openLink) {
            webApp.value.openLink(url)
        }
        else {
            window.open(url, '_blank')
        }
    }

    function openTelegramLink(url: string) {
        if (webApp.value?.openTelegramLink) {
            webApp.value.openTelegramLink(url)
        }
        else {
            window.open(url, '_blank')
        }
    }

    // Opens a Telegram Stars invoice. Falls back to immediate 'paid' in dev/non-Telegram env.
    function openInvoice(url: string, callback: (status: string) => void) {
        if (webApp.value?.openInvoice) {
            webApp.value.openInvoice(url, callback)
        }
        else {
            // Dev/browser fallback: auto-confirm payment
            callback('paid')
        }
    }

    return {
        isAvailable,
        webApp,
        initData,
        user,
        languageCode,
        telegramId,
        version,
        isVersionAtLeast,
        ready,
        expand,
        hapticFeedback,
        hapticImpact,
        showBackButton,
        hideBackButton,
        showMainButton,
        hideMainButton,
        setMainButtonLoading,
        showConfirm,
        showAlert,
        openInvoice,
        openLink,
        openTelegramLink,
    }
}
