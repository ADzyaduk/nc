import { defineStore } from 'pinia'
import type { NatalChartData } from '~~/server/utils/schemas'

interface BirthChart {
    id: string
    user_id: string
    birth_date: string
    birth_time: string
    birth_city: string
    latitude: number
    longitude: number
    chart_json: NatalChartData
    created_at: string
}

export const useChartStore = defineStore('chart', () => {
    const currentChart = ref<BirthChart | null>(null)
    const isGenerating = ref(false)
    const error = ref<string | null>(null)

    async function generateChart(params: {
        birthDate: string
        birthTime: string
        birthCity: string
        latitude: number
        longitude: number
        telegramId: string
    }) {
        isGenerating.value = true
        error.value = null

        try {
            const data = await $fetch<{ chart: BirthChart }>('/api/charts/generate', {
                method: 'POST',
                body: params,
            })

            if (data.chart) {
                currentChart.value = data.chart
                return data.chart
            }
        }
        catch (e: any) {
            error.value = e.data?.message || e.message || 'Chart generation failed'
            throw e
        }
        finally {
            isGenerating.value = false
        }
    }

    function setChart(chart: BirthChart) {
        currentChart.value = chart
    }

    function $reset() {
        currentChart.value = null
        isGenerating.value = false
        error.value = null
    }

    return {
        currentChart,
        isGenerating,
        error,
        generateChart,
        setChart,
        $reset,
    }
})
