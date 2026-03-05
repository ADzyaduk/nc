/**
 * Composable that orchestrates the compatibility check flow:
 * submit two persons → calculate synastry → generate report → display
 *
 * IMPORTANT: currentStep uses useState() to share state across all instances
 * (new.vue, CompatibilityForm.vue, etc. all call this composable separately)
 */

export function useCompatibility() {
    const compatibilityStore = useCompatibilityStore()
    const telegram = useTelegram()
    const { locale } = useI18n()

    // Shared across all instances via useState
    const currentStep = useState<'idle' | 'calculating' | 'interpreting' | 'done'>('compat-step', () => 'idle')

    const isProcessing = computed(() => compatibilityStore.isGenerating || currentStep.value !== 'idle')

    async function createCompatibility(
        person1: any,
        person2: any
    ) {
        const telegramId = telegram.telegramId.value || 'dev-user'

        try {
            currentStep.value = 'calculating'
            const report = await compatibilityStore.generateCompatibility({
                person1,
                person2,
                telegramId,
                locale: locale.value,
            })

            // currentStep stays as 'calculating' — loader visible until router redirect
            return report
        }
        catch (error) {
            currentStep.value = 'idle'
            try { telegram.hapticFeedback('error') } catch { }
            throw error
        }
    }

    async function triggerInterpret(reportId: string) {
        const telegramId = telegram.telegramId.value || 'dev-user'
        currentStep.value = 'interpreting'
        try {
            await compatibilityStore.interpretCompatibility({
                reportId,
                telegramId,
                locale: locale.value
            })
            currentStep.value = 'done'
            try { telegram.hapticFeedback('success') } catch { }
        }
        catch (error) {
            currentStep.value = 'idle'
            throw error
        }
    }

    function reset() {
        compatibilityStore.$reset()
        currentStep.value = 'idle'
    }

    return {
        isProcessing,
        currentStep,
        createCompatibility,
        triggerInterpret,
        reset,
    }
}
