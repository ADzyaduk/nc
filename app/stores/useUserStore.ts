import { defineStore } from 'pinia'

interface User {
    id: string
    telegram_id: string
    username: string
    created_at: string
    subscription_status: string
}

export const useUserStore = defineStore('user', () => {
    const user = ref<User | null>(null)
    const isAuthenticated = computed(() => !!user.value)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    async function authenticate(initData: string) {
        isLoading.value = true
        error.value = null

        try {
            const data = await $fetch<{ user: User }>('/api/auth/telegram', {
                method: 'POST',
                body: { initData },
            })

            if (data.user) {
                user.value = data.user
                return data
            }
        }
        catch (e: any) {
            error.value = e.data?.message || e.message || 'Authentication failed'
            throw e
        }
        finally {
            isLoading.value = false
        }
    }

    function setUser(userData: User) {
        user.value = userData
    }

    function $reset() {
        user.value = null
        isLoading.value = false
        error.value = null
    }

    return {
        user,
        isAuthenticated,
        isLoading,
        error,
        authenticate,
        setUser,
        $reset,
    }
})
