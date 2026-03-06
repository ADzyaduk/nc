import { defineStore } from 'pinia'
import type { TarotCard } from '~~/server/utils/tarot'

interface TarotReadingResponse {
    cards: TarotCard[]
    positions: string[]
    interpretation: string
}

export const useTarotStore = defineStore('tarot', () => {
    const question = ref('')
    const cards = ref<TarotCard[]>([])
    const positions = ref<string[]>([])
    const interpretation = ref('')
    const isLoading = ref(false)
    const isPaying = ref(false)
    const isRevealed = ref(false)
    const error = ref<string | null>(null)

    const hasReading = computed(() => cards.value.length > 0 && !!interpretation.value)

    async function simulatePayment(telegramId: string) {
        isPaying.value = true
        error.value = null

        try {
            const data = await $fetch<{ success: boolean }>('/api/tarot/payment', {
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

    async function requestReading(telegramId: string, userQuestion: string, locale: string) {
        isLoading.value = true
        error.value = null
        isRevealed.value = false

        try {
            const data = await $fetch<TarotReadingResponse>('/api/tarot/reading', {
                method: 'POST',
                body: {
                    question: userQuestion,
                    telegramId,
                    locale,
                },
            })

            question.value = userQuestion
            cards.value = data.cards
            positions.value = data.positions
            interpretation.value = data.interpretation

            return data
        }
        catch (e: any) {
            error.value = e.data?.message || e.message || 'Reading failed'
            throw e
        }
        finally {
            isLoading.value = false
        }
    }

    function revealCards() {
        isRevealed.value = true
    }

    function $reset() {
        question.value = ''
        cards.value = []
        positions.value = []
        interpretation.value = ''
        isLoading.value = false
        isPaying.value = false
        isRevealed.value = false
        error.value = null
    }

    return {
        question,
        cards,
        positions,
        interpretation,
        isLoading,
        isPaying,
        isRevealed,
        error,
        hasReading,
        simulatePayment,
        requestReading,
        revealCards,
        $reset,
    }
})
