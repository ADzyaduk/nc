<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'

const { t } = useI18n()
const router = useRouter()
const { createCompatibility, isProcessing } = useCompatibility()

// CalendarDate refs for UInputDate
const birthDateValue1 = ref<CalendarDate>()
const birthDateValue2 = ref<CalendarDate>()

// Person 1 form
const person1 = reactive({
  name: '',
  birthDate: '',
  birthTime: '',
  birthCity: '',
  latitude: 0,
  longitude: 0,
})

// Person 2 form
const person2 = reactive({
  name: '',
  birthDate: '',
  birthTime: '',
  birthCity: '',
  latitude: 0,
  longitude: 0,
})

// Sync CalendarDate → string
function calendarDateToString(val: CalendarDate | undefined): string {
  if (!val) return ''
  return `${val.year}-${String(val.month).padStart(2, '0')}-${String(val.day).padStart(2, '0')}`
}

watch(birthDateValue1, (val) => {
  person1.birthDate = calendarDateToString(val)
})

watch(birthDateValue2, (val) => {
  person2.birthDate = calendarDateToString(val)
})

const errors = reactive({
  person1: { birthDate: '', birthTime: '', birthCity: '' },
  person2: { birthDate: '', birthTime: '', birthCity: '' },
})

// ---- City autocomplete for Person 1 ----
interface CityItem {
  label: string
  latitude: number
  longitude: number
}

const searchTerm1 = ref('')
const cityItems1 = ref<CityItem[]>([])
const isCityLoading1 = ref(false)
const selectedCityLabel1 = ref<string>('')
let debounceTimer1: ReturnType<typeof setTimeout> | undefined

async function fetchCities(query: string, items: Ref<CityItem[]>, loading: Ref<boolean>) {
  if (query.length < 2) {
    items.value = []
    return
  }
  loading.value = true
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
    loading.value = false
  }
}

watch(searchTerm1, (val) => {
  if (debounceTimer1) clearTimeout(debounceTimer1)
  debounceTimer1 = setTimeout(() => fetchCities(val, cityItems1, isCityLoading1), 350)
})

function handleCitySelect1(item: CityItem) {
  if (item && typeof item === 'object') {
    person1.birthCity = item.label
    person1.latitude = item.latitude
    person1.longitude = item.longitude
    selectedCityLabel1.value = item.label
    errors.person1.birthCity = ''
  }
}

// ---- City autocomplete for Person 2 ----
const searchTerm2 = ref('')
const cityItems2 = ref<CityItem[]>([])
const isCityLoading2 = ref(false)
const selectedCityLabel2 = ref<string>('')
let debounceTimer2: ReturnType<typeof setTimeout> | undefined

watch(searchTerm2, (val) => {
  if (debounceTimer2) clearTimeout(debounceTimer2)
  debounceTimer2 = setTimeout(() => fetchCities(val, cityItems2, isCityLoading2), 350)
})

function handleCitySelect2(item: CityItem) {
  if (item && typeof item === 'object') {
    person2.birthCity = item.label
    person2.latitude = item.latitude
    person2.longitude = item.longitude
    selectedCityLabel2.value = item.label
    errors.person2.birthCity = ''
  }
}

// ---- Validation ----
function validate(): boolean {
  let valid = true

  errors.person1.birthDate = ''
  errors.person1.birthTime = ''
  errors.person1.birthCity = ''
  errors.person2.birthDate = ''
  errors.person2.birthTime = ''
  errors.person2.birthCity = ''

  if (!person1.birthDate) { errors.person1.birthDate = t('compatibility.form.errors.birthDateRequired'); valid = false }
  if (!person1.birthTime) { errors.person1.birthTime = t('compatibility.form.errors.birthTimeRequired'); valid = false }
  if (!person1.birthCity) { errors.person1.birthCity = t('compatibility.form.errors.birthCityRequired'); valid = false }

  if (!person2.birthDate) { errors.person2.birthDate = t('compatibility.form.errors.birthDateRequired'); valid = false }
  if (!person2.birthTime) { errors.person2.birthTime = t('compatibility.form.errors.birthTimeRequired'); valid = false }
  if (!person2.birthCity) { errors.person2.birthCity = t('compatibility.form.errors.birthCityRequired'); valid = false }

  return valid
}

async function handleSubmit() {
  if (!validate()) return

  try {
    const report = await createCompatibility(
      {
        name: person1.name || undefined,
        birthDate: person1.birthDate,
        birthTime: person1.birthTime,
        birthCity: person1.birthCity,
        latitude: person1.latitude,
        longitude: person1.longitude,
      },
      {
        name: person2.name || undefined,
        birthDate: person2.birthDate,
        birthTime: person2.birthTime,
        birthCity: person2.birthCity,
        latitude: person2.latitude,
        longitude: person2.longitude,
      },
    )

    if (report) {
      await router.push(`/compatibility/${report.id}`)
    }
  }
  catch {
    // Error handled in store
  }
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="handleSubmit">
    <!-- Person 1 -->
    <div class="space-y-4">
      <div class="flex items-center gap-2 mb-2">
        <div class="w-8 h-8 rounded-full bg-pink-500/20 border border-pink-500/30 flex items-center justify-center">
          <UIcon name="i-heroicons-heart" class="size-4 text-pink-400" />
        </div>
        <h3 class="text-sm font-semibold text-violet-200">{{ t('compatibility.form.person1') }}</h3>
      </div>

      <UInput
        v-model="person1.name"
        size="lg"
        color="primary"
        icon="i-heroicons-user"
        :placeholder="t('compatibility.form.namePlaceholder')"
        :ui="{ root: 'w-full' }"
      />

      <div class="grid grid-cols-2 gap-3">
        <div>
          <DatePicker
          v-model="birthDateValue1"
          :placeholder="t('form.birthDate')"
          icon="i-heroicons-calendar-days"
        />
          <p v-if="errors.person1.birthDate" class="text-red-400 text-xs mt-1">
            {{ errors.person1.birthDate }}
          </p>
        </div>
        <div>
          <UInput
            v-model="person1.birthTime"
            type="time"
            size="lg"
            color="primary"
            :ui="{ root: 'w-full' }"
          />
          <p v-if="errors.person1.birthTime" class="text-red-400 text-xs mt-1">
            {{ errors.person1.birthTime }}
          </p>
        </div>
      </div>

      <div>
        <UInputMenu
          v-model="selectedCityLabel1"
          v-model:search-term="searchTerm1"
          :items="cityItems1"
          value-key="label"
          size="lg"
          color="primary"
          icon="i-heroicons-map-pin"
          :placeholder="t('form.cityPlaceholder')"
          :loading="isCityLoading1"
          :ignore-filter="true"
          :highlight="!!errors.person1.birthCity"
          :ui="{ root: 'w-full' }"
          @update:model-value="(val: any) => {
            const found = cityItems1.find(c => c.label === val)
            if (found) handleCitySelect1(found)
          }"
        >
          <template #empty>
            <div class="text-sm text-violet-400/60 px-3 py-2">
              {{ searchTerm1.length < 2 ? t('form.cityHint') : t('form.cityEmpty') }}
            </div>
          </template>
        </UInputMenu>
        <p v-if="errors.person1.birthCity" class="text-red-400 text-xs mt-1">
          {{ errors.person1.birthCity }}
        </p>
      </div>
    </div>

    <!-- Divider with hearts -->
    <div class="flex items-center gap-3 py-2">
      <div class="flex-1 h-px bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />
      <div class="flex gap-1">
        <UIcon name="i-heroicons-heart" class="size-4 text-pink-400 animate-pulse" />
        <UIcon name="i-heroicons-heart" class="size-5 text-pink-500" />
        <UIcon name="i-heroicons-heart" class="size-4 text-pink-400 animate-pulse" />
      </div>
      <div class="flex-1 h-px bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />
    </div>

    <!-- Person 2 -->
    <div class="space-y-4">
      <div class="flex items-center gap-2 mb-2">
        <div class="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
          <UIcon name="i-heroicons-heart" class="size-4 text-violet-400" />
        </div>
        <h3 class="text-sm font-semibold text-violet-200">{{ t('compatibility.form.person2') }}</h3>
      </div>

      <UInput
        v-model="person2.name"
        size="lg"
        color="primary"
        icon="i-heroicons-user"
        :placeholder="t('compatibility.form.namePlaceholder')"
        :ui="{ root: 'w-full' }"
      />

      <div class="grid grid-cols-2 gap-3">
        <div>
          <DatePicker
          v-model="birthDateValue2"
          :placeholder="t('form.birthDate')"
          icon="i-heroicons-calendar-days"
        />
          <p v-if="errors.person2.birthDate" class="text-red-400 text-xs mt-1">
            {{ errors.person2.birthDate }}
          </p>
        </div>
        <div>
          <UInput
            v-model="person2.birthTime"
            type="time"
            size="lg"
            color="primary"
            :ui="{ root: 'w-full' }"
          />
          <p v-if="errors.person2.birthTime" class="text-red-400 text-xs mt-1">
            {{ errors.person2.birthTime }}
          </p>
        </div>
      </div>

      <div>
        <UInputMenu
          v-model="selectedCityLabel2"
          v-model:search-term="searchTerm2"
          :items="cityItems2"
          value-key="label"
          size="lg"
          color="primary"
          icon="i-heroicons-map-pin"
          :placeholder="t('form.cityPlaceholder')"
          :loading="isCityLoading2"
          :ignore-filter="true"
          :highlight="!!errors.person2.birthCity"
          :ui="{ root: 'w-full' }"
          @update:model-value="(val: any) => {
            const found = cityItems2.find(c => c.label === val)
            if (found) handleCitySelect2(found)
          }"
        >
          <template #empty>
            <div class="text-sm text-violet-400/60 px-3 py-2">
              {{ searchTerm2.length < 2 ? t('form.cityHint') : t('form.cityEmpty') }}
            </div>
          </template>
        </UInputMenu>
        <p v-if="errors.person2.birthCity" class="text-red-400 text-xs mt-1">
          {{ errors.person2.birthCity }}
        </p>
      </div>
    </div>

    <!-- Submit -->
    <UButton
      type="submit"
      size="xl"
      color="primary"
      variant="solid"
      block
      :loading="isProcessing"
      :label="t('compatibility.form.submit')"
      icon="i-heroicons-heart"
      class="cursor-pointer mt-6 shadow-lg shadow-pink-600/30"
    />
  </form>
</template>
