import { defineStore } from 'pinia'
import type { CompatibilityScores } from '~~/server/utils/schemas'

interface CompatibilityReport {
    id: string
    user_id: string
    person1_name: string | null
    person1_birth_date: string
    person1_birth_city: string
    person1_chart_json: any
    person2_name: string | null
    person2_birth_date: string
    person2_birth_city: string
    person2_chart_json: any
    synastry_json: any
    scores: CompatibilityScores
    content: string
    type: 'basic' | 'full'
    is_paid: boolean
    created_at: string
}

export const useCompatibilityStore = defineStore('compatibility', () => {
    const currentReport = ref<CompatibilityReport | null>(null)
    const isGenerating = ref(false)
    const error = ref<string | null>(null)

    async function generateCompatibility(params: {
        person1: {
            name?: string
            birthDate: string
            birthTime: string
            birthCity: string
            latitude: number
            longitude: number
        }
        person2: {
            name?: string
            birthDate: string
            birthTime: string
            birthCity: string
            latitude: number
            longitude: number
        }
        telegramId: string
        locale: string
    }) {
        isGenerating.value = true
        error.value = null

        try {
            const data = await $fetch<{ report: CompatibilityReport }>('/api/compatibility/generate', {
                method: 'POST',
                body: params,
            })

            if (data.report) {
                currentReport.value = data.report
                return data.report
            }
        }
        catch (e: any) {
            error.value = e.data?.message || e.message || 'Compatibility generation failed'
            throw e
        }
        finally {
            isGenerating.value = false
        }
    }

    async function interpretCompatibility(params: {
        reportId: string
        telegramId: string
        locale: string
    }) {
        isGenerating.value = true
        error.value = null

        try {
            const data = await $fetch<{ report: CompatibilityReport }>('/api/compatibility/interpret', {
                method: 'POST',
                body: params,
            })

            if (data.report) {
                currentReport.value = data.report
                return data.report
            }
        }
        catch (e: any) {
            error.value = e.data?.message || e.message || 'Compatibility interpretation failed'
            throw e
        }
        finally {
            isGenerating.value = false
        }
    }

    function $reset() {
        currentReport.value = null
        isGenerating.value = false
        error.value = null
    }

    return {
        currentReport,
        isGenerating,
        error,
        generateCompatibility,
        interpretCompatibility,
        $reset,
    }
})
