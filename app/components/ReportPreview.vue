<script setup lang="ts">
const { t } = useI18n()
const { translateSign, getSignIcon, getElementBgColor, getElementColor } = useZodiac()
const { renderMarkdown } = useReportRenderer()

const props = defineProps<{
  report: {
    id: string
    content: string
    type: string
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

const emit = defineEmits<{
  unlock: []
}>()

// Rendered HTML content
const renderedContent = computed(() => renderMarkdown(props.report.content))

// Planet label helper
function getPlanetLabel(key: string): string {
  return t(`report.planets.${key}`)
}
</script>

<template>
  <div class="space-y-4">
    <!-- Big Three Cards -->
    <div class="space-y-3">
      <!-- Sun -->
      <UCard
        variant="outline"
        :ui="{ root: `card-mystical border ${getElementBgColor(chart.chart_json.sun.sign)}` }"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border"
            :class="getElementBgColor(chart.chart_json.sun.sign)"
          >
            {{ getSignIcon(chart.chart_json.sun.sign) }}
          </div>
          <div class="flex-1">
            <p class="text-xs uppercase tracking-wider" :class="getElementColor(chart.chart_json.sun.sign)">
              ☀️ {{ getPlanetLabel('sun') }}
            </p>
            <p class="text-lg font-bold text-white">
              {{ translateSign(chart.chart_json.sun.sign) }}
            </p>
            <p class="text-xs text-violet-400">
              {{ chart.chart_json.sun.degree }}° · {{ t('report.house') }} {{ chart.chart_json.sun.house }}
            </p>
          </div>
        </div>
      </UCard>

      <!-- Moon -->
      <UCard
        variant="outline"
        :ui="{ root: `card-mystical border ${getElementBgColor(chart.chart_json.moon.sign)}` }"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border"
            :class="getElementBgColor(chart.chart_json.moon.sign)"
          >
            {{ getSignIcon(chart.chart_json.moon.sign) }}
          </div>
          <div class="flex-1">
            <p class="text-xs uppercase tracking-wider" :class="getElementColor(chart.chart_json.moon.sign)">
              🌙 {{ getPlanetLabel('moon') }}
            </p>
            <p class="text-lg font-bold text-white">
              {{ translateSign(chart.chart_json.moon.sign) }}
            </p>
            <p class="text-xs text-violet-400">
              {{ chart.chart_json.moon.degree }}° · {{ t('report.house') }} {{ chart.chart_json.moon.house }}
            </p>
          </div>
        </div>
      </UCard>

      <!-- Ascendant -->
      <UCard
        variant="outline"
        :ui="{ root: `card-mystical border ${getElementBgColor(chart.chart_json.ascendant.sign)}` }"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border"
            :class="getElementBgColor(chart.chart_json.ascendant.sign)"
          >
            {{ getSignIcon(chart.chart_json.ascendant.sign) }}
          </div>
          <div class="flex-1">
            <p class="text-xs uppercase tracking-wider" :class="getElementColor(chart.chart_json.ascendant.sign)">
              ⬆️ {{ getPlanetLabel('ascendant') }}
            </p>
            <p class="text-lg font-bold text-white">
              {{ translateSign(chart.chart_json.ascendant.sign) }}
            </p>
            <p class="text-xs text-violet-400">
              {{ chart.chart_json.ascendant.degree }}°
            </p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- AI Interpretation -->
    <UCard
      variant="outline"
      :ui="{ root: 'card-mystical glow-border' }"
    >
      <div class="flex items-center gap-2 mb-4">
        <UIcon name="i-heroicons-sparkles" class="size-5 text-violet-400" />
        <h3 class="text-base font-semibold text-violet-200">
          {{ t('report.basicTitle') }}
        </h3>
      </div>

      <div
        class="report-content text-sm text-violet-100/80 leading-relaxed space-y-1"
        v-html="renderedContent"
      />
    </UCard>

    <!-- Unlock Full Report CTA -->
    <UCard
      variant="outline"
      :ui="{ root: 'card-mystical border-amber-500/30 cursor-pointer hover:border-amber-400/50 transition-colors' }"
      @click="emit('unlock')"
    >
      <div class="text-center py-3">
        <div class="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-3">
          <span class="text-2xl">🔮</span>
        </div>
        <p class="text-lg font-bold text-white mb-1">
          {{ t('report.unlockFull') }}
        </p>
        <p class="text-sm text-amber-300/80 mb-4">
          {{ t('paywall.description') }}
        </p>

        <!-- Feature mini-list -->
        <div class="flex flex-wrap justify-center gap-2 mb-4">
          <UBadge color="neutral" variant="subtle" size="sm">
            <span class="mr-1">💕</span> {{ t('paywall.feature2') }}
          </UBadge>
          <UBadge color="neutral" variant="subtle" size="sm">
            <span class="mr-1">💼</span> {{ t('paywall.feature3') }}
          </UBadge>
          <UBadge color="neutral" variant="subtle" size="sm">
            <span class="mr-1">🔮</span> {{ t('paywall.feature4') }}
          </UBadge>
        </div>

        <UButton
          color="primary"
          variant="solid"
          size="lg"
          :label="`${t('report.unlockFull')} · ${t('paywall.price')}`"
          icon="i-heroicons-lock-open"
          class="cursor-pointer shadow-lg shadow-violet-600/30"
          @click.stop="emit('unlock')"
        />
      </div>
    </UCard>
  </div>
</template>
