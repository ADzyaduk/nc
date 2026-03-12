<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const telegram = useTelegram()
const { translateSign, translatePlanet, getPlanetEmoji, getSignIcon, getElementBgColor, getElementColor } = useZodiac()
const { renderMarkdown } = useReportRenderer()

const chartId = computed(() => route.params.id as string)

definePageMeta({ layout: 'default' })

const chart = ref<any>(null)
const fullReport = ref<any>(null)
const isLoading = ref(true)
const fetchError = ref<string | null>(null)

onMounted(async () => {
  telegram.showBackButton(() => router.push('/'))

  try {
    const data = await $fetch<{ chart: any, fullReport: any }>(`/api/shared/chart/${chartId.value}`)
    chart.value = data.chart
    fullReport.value = data.fullReport
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
const ownerCity = computed(() => chart.value?.birth_city || null)
const otherPlanets = computed(() =>
  chartJson.value?.planets?.filter((p: any) => p.name !== 'Sun' && p.name !== 'Moon') || [],
)
const renderedReport = computed(() =>
  fullReport.value?.content ? renderMarkdown(fullReport.value.content) : null,
)
</script>

<template>
  <div class="px-4 py-4 space-y-4">
    <!-- Header -->
    <div class="text-center">
      <div class="w-16 h-16 rounded-full bg-linear-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-3">
        <span class="text-3xl">🌌</span>
      </div>
      <h1 class="text-lg font-bold text-white">
        {{ ownerCity ? `Натальная карта · ${ownerCity}` : 'Натальная карта' }}
      </h1>
      <p class="text-sm text-violet-300 mt-1">Космический код этого человека</p>
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

    <template v-else-if="chartJson">
      <!-- Big Three -->
      <UCard variant="outline" :ui="{ root: 'card-mystical glow-border' }">
        <h3 class="text-sm font-semibold text-violet-300 uppercase tracking-wider mb-3 text-center">
          ✨ Большая тройка
        </h3>
        <div class="grid grid-cols-3 gap-2">
          <div class="text-center p-3 rounded-xl border" :class="getElementBgColor(chartJson.sun.sign)">
            <p class="text-2xl mb-1">{{ getSignIcon(chartJson.sun.sign) }}</p>
            <p class="text-[10px] uppercase tracking-wider" :class="getElementColor(chartJson.sun.sign)">
              ☀️ {{ t('report.planets.sun') }}
            </p>
            <p class="text-sm font-bold text-white">{{ translateSign(chartJson.sun.sign) }}</p>
          </div>
          <div class="text-center p-3 rounded-xl border" :class="getElementBgColor(chartJson.moon.sign)">
            <p class="text-2xl mb-1">{{ getSignIcon(chartJson.moon.sign) }}</p>
            <p class="text-[10px] uppercase tracking-wider" :class="getElementColor(chartJson.moon.sign)">
              🌙 {{ t('report.planets.moon') }}
            </p>
            <p class="text-sm font-bold text-white">{{ translateSign(chartJson.moon.sign) }}</p>
          </div>
          <div class="text-center p-3 rounded-xl border" :class="getElementBgColor(chartJson.ascendant.sign)">
            <p class="text-2xl mb-1">{{ getSignIcon(chartJson.ascendant.sign) }}</p>
            <p class="text-[10px] uppercase tracking-wider" :class="getElementColor(chartJson.ascendant.sign)">
              ⬆️ {{ t('report.planets.ascendant') }}
            </p>
            <p class="text-sm font-bold text-white">{{ translateSign(chartJson.ascendant.sign) }}</p>
          </div>
        </div>
      </UCard>

      <!-- Other planets -->
      <UCard v-if="otherPlanets.length" variant="outline" :ui="{ root: 'card-mystical' }">
        <h3 class="text-sm font-semibold text-violet-300 uppercase tracking-wider mb-3">
          🪐 Планеты
        </h3>
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="planet in otherPlanets"
            :key="planet.name"
            class="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10"
          >
            <span class="text-lg">{{ getPlanetEmoji(planet.name) }}</span>
            <div class="min-w-0">
              <p class="text-xs text-violet-400">{{ translatePlanet(planet.name) }}</p>
              <p class="text-sm font-medium text-white truncate">{{ translateSign(planet.sign) }}</p>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Full report content -->
      <UCard v-if="renderedReport" variant="outline" :ui="{ root: 'card-mystical' }">
        <div class="flex items-center gap-2 mb-4">
          <UBadge color="primary" variant="subtle" size="sm">Premium</UBadge>
          <h3 class="text-sm font-semibold text-white">Полный разбор карты</h3>
        </div>
        <div class="prose prose-invert prose-sm max-w-none text-violet-100/90" v-html="renderedReport" />
      </UCard>

      <!-- CTA -->
      <UCard variant="outline" :ui="{ root: 'card-mystical border-violet-500/40' }">
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
