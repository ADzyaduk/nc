export interface CityItem {
    label: string
    latitude: number
    longitude: number
}

export function useCitySearch() {
    const searchTerm = ref('')
    const items = ref<CityItem[]>([])
    const isLoading = ref(false)
    const selectedLabel = ref('')
    const citySelected = ref(false)

    let debounceTimer: ReturnType<typeof setTimeout> | undefined

    async function fetchCities(query: string) {
        if (query.length < 2) {
            items.value = []
            return
        }

        isLoading.value = true
        try {
            const data = await $fetch<{ cities: CityItem[] }>('/api/cities/search', {
                params: { q: query },
            })
            items.value = data.cities || []
        }
        catch {
            items.value = []
        }
        finally {
            isLoading.value = false
        }
    }

    watch(searchTerm, (val) => {
        if (citySelected.value) {
            citySelected.value = false
            return
        }
        if (debounceTimer) clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => fetchCities(val), 350)
    })

    function selectCity(labelValue: string): CityItem | null {
        const found = items.value.find(c => c.label === labelValue)
        if (found) {
            selectedLabel.value = found.label
            citySelected.value = true
            return found
        }
        return null
    }

    return {
        searchTerm,
        items,
        isLoading,
        selectedLabel,
        selectCity,
    }
}
