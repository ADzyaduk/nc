/**
 * Composable that orchestrates the full natal chart flow:
 * submit form → generate chart → generate report → display
 *
 * IMPORTANT: currentStep uses useState() to share state across all instances
 * (new.vue, BirthDataForm.vue, etc. all call this composable separately)
 */

export function useNatalChart() {
    const chartStore = useChartStore()
    const reportStore = useReportStore()
    const telegram = useTelegram()
    const { locale } = useI18n()

    // Shared across all instances via useState — prevents flash between composable calls
    const currentStep = useState<'idle' | 'chart' | 'report' | 'done'>('natal-step', () => 'idle')

    const isProcessing = computed(() =>
        chartStore.isGenerating || reportStore.isGenerating || currentStep.value !== 'idle',
    )

    async function createChart(params: {
        birthDate: string
        birthTime: string
        birthCity: string
        latitude: number
        longitude: number
    }) {
        const telegramId = telegram.telegramId.value || 'dev-user'

        try {
            currentStep.value = 'chart'
            const chart = await chartStore.generateChart({
                ...params,
                telegramId,
            })

            if (!chart) throw new Error('Chart generation failed')

            // currentStep stays as 'chart' — isProcessing remains true until router redirect
            // It will be reset in reset() or when new.vue unmounts
            return chart
        }
        catch (error) {
            currentStep.value = 'idle'
            try { telegram.hapticFeedback('error') } catch { }
            throw error
        }
    }

    async function generateBasicReport(birthChartId: string) {
        const telegramId = telegram.telegramId.value || 'dev-user'
        currentStep.value = 'report'
        try {
            await reportStore.generateReport({
                birthChartId,
                type: 'basic',
                telegramId,
                locale: locale.value,
            })
            currentStep.value = 'done'
            try { telegram.hapticFeedback('success') } catch { }
        }
        catch (error) {
            currentStep.value = 'idle'
            throw error
        }
    }

    async function unlockFullReport(birthChartId: string) {
        const telegramId = telegram.telegramId.value || 'dev-user'

        try {
            await reportStore.simulatePayment(telegramId)

            await reportStore.generateReport({
                birthChartId,
                type: 'full',
                telegramId,
                locale: locale.value,
            })

            try { telegram.hapticFeedback('success') }
            catch { /* ignore */ }
        }
        catch (error) {
            try { telegram.hapticFeedback('error') }
            catch { /* ignore */ }
            throw error
        }
    }

    function reset() {
        chartStore.$reset()
        reportStore.$reset()
        currentStep.value = 'idle'
    }

    return {
        isProcessing,
        currentStep,
        createChart,
        generateBasicReport,
        unlockFullReport,
        reset,
    }
}
