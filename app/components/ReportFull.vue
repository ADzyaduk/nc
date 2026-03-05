<script setup lang="ts">
const { t } = useI18n()
const { translateSign, translatePlanet, getPlanetEmoji, getSignIcon, getElementBgColor, getElementColor } = useZodiac()
const { renderMarkdown } = useReportRenderer()

const props = defineProps<{
  report: {
    id: string
    content: string
    type: string
    is_paid: boolean
  }
  chart: {
    chart_json: {
      sun: { sign: string; degree: number; house: number }
      moon: { sign: string; degree: number; house: number }
      ascendant: { sign: string; degree: number }
      planets: Array<{ name: string; sign: string; degree: number; house: number }>
    }
  }
}>()

const renderedContent = computed(() => renderMarkdown(props.report.content))

// Filter out Sun and Moon (already in Big Three) from planets grid
const otherPlanets = computed(() =>
  props.chart.chart_json.planets?.filter(p => p.name !== 'Sun' && p.name !== 'Moon') || [],
)
</script>

<template>
  <div class="space-y-4">
    <!-- Header with star badge -->
    <UCard
      variant="outline"
      :ui="{ root: 'card-mystical glow-border' }"
    >
      <div class="text-center mb-4">
        <div class="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-3">
          <span class="text-2xl">⭐</span>
        </div>
        <h2 class="text-lg font-bold text-white">{{ t('report.fullTitle') }}</h2>
        <UBadge color="primary" variant="subtle" size="sm" class="mt-2">
          {{ t('report.premium') }}
        </UBadge>
      </div>

      <!-- Big Three grid -->
      <div class="grid grid-cols-3 gap-2">
        <div
          class="text-center p-3 rounded-xl border"
          :class="getElementBgColor(chart.chart_json.sun.sign)"
        >
          <p class="text-2xl mb-1">{{ getSignIcon(chart.chart_json.sun.sign) }}</p>
          <p class="text-[10px] uppercase tracking-wider" :class="getElementColor(chart.chart_json.sun.sign)">
            ☀️ {{ t('report.planets.sun') }}
          </p>
          <p class="text-sm font-bold text-white">{{ translateSign(chart.chart_json.sun.sign) }}</p>
        </div>
        <div
          class="text-center p-3 rounded-xl border"
          :class="getElementBgColor(chart.chart_json.moon.sign)"
        >
          <p class="text-2xl mb-1">{{ getSignIcon(chart.chart_json.moon.sign) }}</p>
          <p class="text-[10px] uppercase tracking-wider" :class="getElementColor(chart.chart_json.moon.sign)">
            🌙 {{ t('report.planets.moon') }}
          </p>
          <p class="text-sm font-bold text-white">{{ translateSign(chart.chart_json.moon.sign) }}</p>
        </div>
        <div
          class="text-center p-3 rounded-xl border"
          :class="getElementBgColor(chart.chart_json.ascendant.sign)"
        >
          <p class="text-2xl mb-1">{{ getSignIcon(chart.chart_json.ascendant.sign) }}</p>
          <p class="text-[10px] uppercase tracking-wider" :class="getElementColor(chart.chart_json.ascendant.sign)">
            ⬆️ {{ t('report.planets.ascendant') }}
          </p>
          <p class="text-sm font-bold text-white">{{ translateSign(chart.chart_json.ascendant.sign) }}</p>
        </div>
      </div>
    </UCard>

    <!-- Other planets -->
    <UCard
      v-if="chart.chart_json.planets?.length"
      variant="outline"
      :ui="{ root: 'card-mystical' }"
    >
      <div class="flex items-center gap-2 mb-3">
        <span class="text-base">🪐</span>
        <h3 class="text-sm font-semibold text-violet-200">{{ t('report.planets.title') }}</h3>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div
          v-for="planet in otherPlanets"
          :key="planet.name"
          class="flex items-center gap-2 p-2.5 rounded-lg border stagger-enter zodiac-pulse"
          :class="getElementBgColor(planet.sign)"
        >
          <span class="text-lg">{{ getSignIcon(planet.sign) }}</span>
          <div>
            <p class="text-xs font-medium" :class="getElementColor(planet.sign)">
              {{ getPlanetEmoji(planet.name) }} {{ translatePlanet(planet.name) }}
            </p>
            <p class="text-sm font-semibold text-white">{{ translateSign(planet.sign) }}</p>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Full report content -->
    <UCard
      variant="outline"
      :ui="{ root: 'card-mystical' }"
    >
      <div class="flex items-center gap-2 mb-4">
        <UIcon name="i-heroicons-sparkles" class="size-5 text-amber-400" />
        <h3 class="text-base font-semibold text-violet-200">{{ t('report.analysis') }}</h3>
      </div>

      <div
        class="report-content text-sm text-violet-100/80 leading-relaxed space-y-1"
        v-html="renderedContent"
      />
    </UCard>

    <!-- New chart button -->
    <div class="text-center pb-6">
      <UButton
        color="primary"
        variant="outline"
        :label="t('nav.newChart')"
        to="/chart/new"
        icon="i-heroicons-plus"
        class="cursor-pointer"
      />
    </div>
  </div>
</template>
