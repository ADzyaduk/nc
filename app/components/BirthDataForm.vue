<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'

const { t } = useI18n()
const router = useRouter()
const { createChart, generateBasicReport, isProcessing } = useNatalChart()

// Form data
const birthDateValue = ref<CalendarDate>() 

const form = reactive({
  birthDate: '',
  birthTime: '',
  birthCity: '',
  latitude: 0,
  longitude: 0,
})

// Sync CalendarDate → string
watch(birthDateValue, (val) => {
  if (val) {
    form.birthDate = `${val.year}-${String(val.month).padStart(2, '0')}-${String(val.day).padStart(2, '0')}`
  }
  else {
    form.birthDate = ''
  }
})

const errors = reactive({
  birthDate: '',
  birthTime: '',
  birthCity: '',
})

// ---- City autocomplete ----
interface CityItem {
  label: string
  latitude: number
  longitude: number
}

const searchTerm = ref('')
const cityItems = ref<CityItem[]>([])
const isCityLoading = ref(false)
const citySelected = ref(false)
let debounceTimer: ReturnType<typeof setTimeout> | undefined

// Debounced fetch from Nominatim API
async function fetchCities(query: string) {
  if (query.length < 2) {
    cityItems.value = []
    return
  }

  isCityLoading.value = true
  try {
    const data = await $fetch<{ cities: CityItem[] }>('/api/cities/search', {
      params: { q: query },
    })
    cityItems.value = data.cities || []
  }
  catch {
    cityItems.value = []
  }
  finally {
    isCityLoading.value = false
  }
}

// Watch search term with debounce
watch(searchTerm, (val) => {
  if (citySelected.value) {
    citySelected.value = false
    return
  }
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    fetchCities(val)
  }, 350)
})

// When city is selected from dropdown
const selectedCityLabel = ref<string>('')

function handleCitySelect(item: CityItem) {
  if (item && typeof item === 'object') {
    form.birthCity = item.label
    form.latitude = item.latitude
    form.longitude = item.longitude
    selectedCityLabel.value = item.label
    citySelected.value = true
    errors.birthCity = ''
  }
}

// ---- Validation ----
function validate(): boolean {
  let valid = true
  errors.birthDate = ''
  errors.birthTime = ''
  errors.birthCity = ''

  if (!form.birthDate) {
    errors.birthDate = t('form.errors.birthDateRequired')
    valid = false
  }
  if (!form.birthTime) {
    errors.birthTime = t('form.errors.birthTimeRequired')
    valid = false
  }
  if (!form.birthCity) {
    errors.birthCity = t('form.errors.birthCityRequired')
    valid = false
  }

  return valid
}

async function handleSubmit() {
  if (!validate()) return

  try {
    const chart = await createChart({
      birthDate: form.birthDate,
      birthTime: form.birthTime,
      birthCity: form.birthCity,
      latitude: form.latitude,
      longitude: form.longitude,
    })

    if (chart) {
      // Сначала дожидаемся базового отчёта, чтобы использовать один лоадер на экране формы
      await generateBasicReport(chart.id)

      await router.push(`/chart/${chart.id}`)
    }
  }
  catch {
    // Error handled in store
  }
}
</script>

<template>
  <form class="space-y-5" @submit.prevent="handleSubmit">
    <!-- Date of Birth -->
    <div>
      <label class="block text-sm font-medium text-violet-200 mb-1.5">
        📅 {{ t('form.birthDate') }}
      </label>
      <DatePicker
        v-model="birthDateValue"
        :placeholder="t('form.birthDate')"
        icon="i-heroicons-calendar-days"
      />
      <p v-if="errors.birthDate" class="text-red-400 text-xs mt-1">
        {{ errors.birthDate }}
      </p>
    </div>

    <!-- Time of Birth -->
    <div>
      <label class="block text-sm font-medium text-violet-200 mb-1.5">
        🕐 {{ t('form.birthTime') }}
      </label>
      <UInput
        v-model="form.birthTime"
        type="time"
        size="lg"
        color="primary"
        :ui="{ root: 'w-full' }"
      />
      <p v-if="errors.birthTime" class="text-red-400 text-xs mt-1">
        {{ errors.birthTime }}
      </p>
    </div>

    <!-- Place of Birth (autocomplete) -->
    <div>
      <label class="block text-sm font-medium text-violet-200 mb-1.5">
        📍 {{ t('form.birthCity') }}
      </label>
      <UInputMenu
        v-model="selectedCityLabel"
        v-model:search-term="searchTerm"
        :items="cityItems"
        value-key="label"
        size="lg"
        color="primary"
        icon="i-heroicons-map-pin"
        :placeholder="t('form.cityPlaceholder')"
        :loading="isCityLoading"
        :ignore-filter="true"
        :highlight="!!errors.birthCity"
        :ui="{ root: 'w-full' }"
        @update:model-value="(val: any) => {
          const found = cityItems.find(c => c.label === val)
          if (found) handleCitySelect(found)
        }"
      >
        <template #empty>
          <div class="text-sm text-violet-400/60 px-3 py-2">
            {{ searchTerm.length < 2 ? t('form.cityHint') : t('form.cityEmpty') }}
          </div>
        </template>
      </UInputMenu>
      <p v-if="errors.birthCity" class="text-red-400 text-xs mt-1">
        {{ errors.birthCity }}
      </p>
    </div>

    <!-- Submit -->
    <UButton
      type="submit"
      size="xl"
      color="primary"
      variant="solid"
      block
      :loading="isProcessing"
      :label="t('form.submit')"
      icon="i-heroicons-sparkles"
      class="cursor-pointer mt-6 shadow-lg shadow-violet-600/30"
    />
  </form>
</template>
