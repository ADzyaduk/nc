import { defineStore } from 'pinia'

interface Report {
    id: string
    user_id: string
    birth_chart_id: string
    type: 'basic' | 'full'
    content: string
    is_paid: boolean
    is_truncated?: boolean
    created_at: string
}

export const useReportStore = defineStore('report', () => {
    const basicReport = ref<Report | null>(null)
    const fullReport = ref<Report | null>(null)
    const isGenerating = ref(false)
    const isPaying = ref(false)
    const error = ref<string | null>(null)

    async function generateReport(params: {
        birthChartId: string
        type: 'basic' | 'full'
        telegramId: string
        locale: string
    }) {
        isGenerating.value = true
        error.value = null

        try {
            const data = await $fetch<{ report: Report }>('/api/reports/generate', {
                method: 'POST',
                body: params,
            })

            if (data.report) {
                if (params.type === 'basic') {
                    basicReport.value = data.report
                }
                else {
                    fullReport.value = data.report
                }
                return data.report
            }
        }
        catch (e: any) {
            error.value = e.data?.message || e.message || 'Report generation failed'
            throw e
        }
        finally {
            isGenerating.value = false
        }
    }

    async function simulatePayment(telegramId: string) {
        isPaying.value = true
        error.value = null

        try {
            // Create a simulated payment record
            const data = await $fetch<{ success: boolean }>('/api/payments/simulate', {
                method: 'POST',
                body: { telegramId },
            })

            return data.success
        }
        catch (e: any) {
            error.value = e.data?.message || e.message || 'Payment failed'
            throw e
        }
        finally {
            isPaying.value = false
        }
    }

    function setBasicReport(report: Report) {
        basicReport.value = report
    }

    function setFullReport(report: Report) {
        fullReport.value = report
    }

    function $reset() {
        basicReport.value = null
        fullReport.value = null
        isGenerating.value = false
        isPaying.value = false
        error.value = null
    }

    return {
        basicReport,
        fullReport,
        isGenerating,
        isPaying,
        error,
        generateReport,
        simulatePayment,
        setBasicReport,
        setFullReport,
        $reset,
    }
})
