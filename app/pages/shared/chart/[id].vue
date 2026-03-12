<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const telegram = useTelegram()
const { translateSign, getSignIcon, getElementBgColor, getElementColor } = useZodiac()

const chartId = computed(() => route.params.id as string)

definePageMeta({ layout: 'default' })

const chart = ref<any>(null)
const isLoading = ref(true)
const fetchError = ref<string | null>(null)

onMounted(async () => {
  telegram.showBackButton(() => router.push('/'))

  try {
    const data = await $fetch<{ chart: any }>(`/api/shared/chart/${chartId.value}`)
    chart.value = data.chart
  }
  catch {
    fetchError.value = 'Карта не найдена'
  }
  finally {
    isLoading.value = false
  }
})

onUnmounted(() => {
  telegram.hideBackButton()
})

const chartJson = computed(() => chart.value?.chart_json)
const ownerName = computed(() => chart.value?.birth_name || null)
</script>

<template>
  <div class="px-4 py-4 space-y-4">
    <!-- Header -->
    <div class="text-center">
      <div class="w-16 h-16 rounded-full bg-linear-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-3">
        <span class="text-3xl">🌌</span>
      </div>
      <h1 class="text-lg font-bold text-white">
        {{ ownerName ? `Натальная карта ${ownerName}` : 'Натальная карта' }}
      </h1>
      <p class="text-sm text-violet-300 mt-1">
        Космический код этого человека
      </p>
    </div>

    <!-- Loading -->
    <LoadingOverlay
      v-if="isLoading"
      variant="card"
      title="Загружаем карту..."
      icon="i-heroicons-sparkles"
    />

    <!-- Error -->
    <UCard v-else-if="fetchError" variant="outline" :ui="{ root: 'card-mystical' }">
      <div class="text-center py-8">
        <UIcon name="i-heroicons-exclamation-triangle" class="size-12 text-red-400 mx-auto mb-4" />
        <p class="text-red-300">{{ fetchError }}</p>
      </div>
    </UCard>

    <!-- Chart positions -->
    <template v-else-if="chartJson">
      <!-- Big Three -->
      <div class="space-y-3">
        <!-- Sun -->
        <UCard
          variant="outline"
          :ui="{ root: `card-mystical border ${getElementBgColor(chartJson.sun.sign)}` }"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border"
              :class="getElementBgColor(chartJson.sun.sign)"
            >
              {{ getSignIcon(chartJson.sun.sign) }}
            </div>
            <div class="flex-1">
              <p class="text-xs uppercase tracking-wider" :class="getElementColor(chartJson.sun.sign)">
                ☀️ {{ t('report.planets.sun') }}
              </p>
              <p class="text-lg font-bold text-white">{{ translateSign(chartJson.sun.sign) }}</p>
              <p class="text-xs text-violet-400">
                {{ chartJson.sun.degree }}° · {{ t('report.house') }} {{ chartJson.sun.house }}
              </p>
            </div>
          </div>
        </UCard>

        <!-- Moon -->
        <UCard
          variant="outline"
          :ui="{ root: `card-mystical border ${getElementBgColor(chartJson.moon.sign)}` }"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border"
              :class="getElementBgColor(chartJson.moon.sign)"
            >
              {{ getSignIcon(chartJson.moon.sign) }}
            </div>
            <div class="flex-1">
              <p class="text-xs uppercase tracking-wider" :class="getElementColor(chartJson.moon.sign)">
                🌙 {{ t('report.planets.moon') }}
              </p>
              <p class="text-lg font-bold text-white">{{ translateSign(chartJson.moon.sign) }}</p>
              <p class="text-xs text-violet-400">
                {{ chartJson.moon.degree }}° · {{ t('report.house') }} {{ chartJson.moon.house }}
              </p>
            </div>
          </div>
        </UCard>

        <!-- Ascendant -->
        <UCard
          variant="outline"
          :ui="{ root: `card-mystical border ${getElementBgColor(chartJson.ascendant.sign)}` }"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border"
              :class="getElementBgColor(chartJson.ascendant.sign)"
            >
              {{ getSignIcon(chartJson.ascendant.sign) }}
            </div>
            <div class="flex-1">
              <p class="text-xs uppercase tracking-wider" :class="getElementColor(chartJson.ascendant.sign)">
                ⬆️ {{ t('report.planets.ascendant') }}
              </p>
              <p class="text-lg font-bold text-white">{{ translateSign(chartJson.ascendant.sign) }}</p>
              <p class="text-xs text-violet-400">{{ chartJson.ascendant.degree }}°</p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- CTA -->
      <UCard
        variant="outline"
        :ui="{ root: 'card-mystical border-violet-500/40' }"
      >
        <div class="text-center py-3">
          <p class="text-base font-bold text-white mb-1">Узнай свой космический код</p>
          <p class="text-sm text-violet-300/80 mb-4">
            Создай свою натальную карту и получи персональный разбор
          </p>
          <UButton
            color="primary"
            variant="solid"
            size="lg"
            label="Создать свою карту"
            icon="i-heroicons-sparkles"
            class="cursor-pointer shadow-lg shadow-violet-600/30"
            to="/chart/new"
          />
        </div>
      </UCard>
    </template>
  </div>
</template>
