<script setup lang="ts">
const { t } = useI18n()
const { translateSign, getSignIcon, getElementBgColor, getElementColor } = useZodiac()
const { renderMarkdown } = useReportRenderer()
const { animateScore, getCircleDashArray } = useScoreAnimation()

const props = defineProps<{
  report: {
    id: string
    content: string
    type: string
    scores: {
      overall: number
      emotional: number
      passion: number
      communication: number
      values: number
    }
    person1_chart_json: {
      sun: { sign: string; degree: number; house: number }
      moon: { sign: string; degree: number; house: number }
      ascendant: { sign: string; degree: number }
    }
    person2_chart_json: {
      sun: { sign: string; degree: number; house: number }
      moon: { sign: string; degree: number; house: number }
      ascendant: { sign: string; degree: number }
    }
    person1_name: string | null
    person2_name: string | null
  }
}>()

const renderedContent = computed(() => renderMarkdown(props.report.content))

// Score ring categories
const categories = computed(() => [
  {
    key: 'emotional',
    label: t('compatibility.scores.emotional'),
    icon: 'i-heroicons-heart',
    score: props.report.scores.emotional,
    color: 'text-pink-400',
    ringColor: '#f472b6',
  },
  {
    key: 'passion',
    label: t('compatibility.scores.passion'),
    icon: 'i-heroicons-fire',
    score: props.report.scores.passion,
    color: 'text-orange-400',
    ringColor: '#fb923c',
  },
  {
    key: 'communication',
    label: t('compatibility.scores.communication'),
    icon: 'i-heroicons-chat-bubble-left-right',
    score: props.report.scores.communication,
    color: 'text-blue-400',
    ringColor: '#60a5fa',
  },
  {
    key: 'values',
    label: t('compatibility.scores.values'),
    icon: 'i-heroicons-shield-check',
    score: props.report.scores.values,
    color: 'text-emerald-400',
    ringColor: '#34d399',
  },
])

// Animated score values
const animatedOverall = ref(0)
const animatedScores = ref<Record<string, number>>({
  emotional: 0,
  passion: 0,
  communication: 0,
  values: 0,
})

onMounted(() => {
  animateScore(props.report.scores.overall, v => animatedOverall.value = v, 200)
  animateScore(props.report.scores.emotional, v => animatedScores.value.emotional = v, 400)
  animateScore(props.report.scores.passion, v => animatedScores.value.passion = v, 500)
  animateScore(props.report.scores.communication, v => animatedScores.value.communication = v, 600)
  animateScore(props.report.scores.values, v => animatedScores.value.values = v, 700)
})

const person1Label = computed(() => props.report.person1_name || t('compatibility.form.person1'))
const person2Label = computed(() => props.report.person2_name || t('compatibility.form.person2'))
</script>

<template>
  <div class="space-y-4">
    <!-- Overall Score Ring -->
    <UCard
      variant="outline"
      :ui="{ root: 'card-mystical glow-border' }"
    >
      <div class="text-center py-4">
        <h2 class="text-base font-semibold text-violet-200 mb-4">
          {{ t('compatibility.result.overallTitle') }}
        </h2>

        <!-- Big SVG Ring -->
        <div class="relative mx-auto w-36 h-36 mb-4">
          <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90">
            <!-- Background circle -->
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke="rgba(139, 92, 246, 0.15)"
              stroke-width="6"
            />
            <!-- Score arc -->
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke="url(#overallGradient)"
              stroke-width="6"
              stroke-linecap="round"
              :stroke-dasharray="getCircleDashArray(animatedOverall)"
              class="transition-all duration-500"
            />
            <defs>
              <linearGradient id="overallGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#f472b6" />
                <stop offset="100%" stop-color="#a78bfa" />
              </linearGradient>
            </defs>
          </svg>
          <!-- Score text overlay -->
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-3xl font-bold text-white">{{ animatedOverall }}%</span>
            <span class="text-xs text-violet-400">{{ t('compatibility.scores.overall') }}</span>
          </div>
        </div>

        <!-- Names -->
        <div class="flex items-center justify-center gap-3 text-sm">
          <span class="text-pink-300">{{ person1Label }}</span>
          <UIcon name="i-heroicons-heart" class="size-4 text-pink-500" />
          <span class="text-violet-300">{{ person2Label }}</span>
        </div>
      </div>
    </UCard>

    <!-- Category Scores — 2x2 grid -->
    <div class="grid grid-cols-2 gap-3">
      <UCard
        v-for="cat in categories"
        :key="cat.key"
        variant="outline"
        :ui="{ root: 'card-mystical' }"
      >
        <div class="text-center py-2">
          <!-- Mini SVG ring -->
          <div class="relative mx-auto w-16 h-16 mb-2">
            <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(139, 92, 246, 0.1)" stroke-width="8" />
              <circle
                cx="50" cy="50" r="45"
                fill="none"
                :stroke="cat.ringColor"
                stroke-width="8"
                stroke-linecap="round"
                :stroke-dasharray="getCircleDashArray(animatedScores[cat.key] ?? 0)"
                class="transition-all duration-500"
              />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-sm font-bold text-white">{{ animatedScores[cat.key] ?? 0 }}%</span>
            </div>
          </div>
          <div class="flex items-center justify-center gap-1">
            <UIcon :name="cat.icon" :class="`size-3.5 ${cat.color}`" />
            <span class="text-xs text-violet-300">{{ cat.label }}</span>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Big Three Comparison -->
    <UCard variant="outline" :ui="{ root: 'card-mystical' }">
      <h3 class="text-sm font-semibold text-violet-200 mb-3 flex items-center gap-2">
        <UIcon name="i-heroicons-sparkles" class="size-4 text-violet-400" />
        {{ t('compatibility.result.bigThree') }}
      </h3>

      <div class="space-y-3">
        <!-- Sun -->
        <div class="flex items-center gap-2">
          <div
            class="flex-1 flex items-center gap-2 rounded-lg px-3 py-2 border"
            :class="getElementBgColor(report.person1_chart_json.sun.sign)"
          >
            <span class="text-lg">{{ getSignIcon(report.person1_chart_json.sun.sign) }}</span>
            <span class="text-xs text-white font-medium">{{ translateSign(report.person1_chart_json.sun.sign) }}</span>
          </div>
          <span class="text-xs text-violet-400 shrink-0">☀️</span>
          <div
            class="flex-1 flex items-center gap-2 rounded-lg px-3 py-2 border"
            :class="getElementBgColor(report.person2_chart_json.sun.sign)"
          >
            <span class="text-lg">{{ getSignIcon(report.person2_chart_json.sun.sign) }}</span>
            <span class="text-xs text-white font-medium">{{ translateSign(report.person2_chart_json.sun.sign) }}</span>
          </div>
        </div>

        <!-- Moon -->
        <div class="flex items-center gap-2">
          <div
            class="flex-1 flex items-center gap-2 rounded-lg px-3 py-2 border"
            :class="getElementBgColor(report.person1_chart_json.moon.sign)"
          >
            <span class="text-lg">{{ getSignIcon(report.person1_chart_json.moon.sign) }}</span>
            <span class="text-xs text-white font-medium">{{ translateSign(report.person1_chart_json.moon.sign) }}</span>
          </div>
          <span class="text-xs text-violet-400 shrink-0">🌙</span>
          <div
            class="flex-1 flex items-center gap-2 rounded-lg px-3 py-2 border"
            :class="getElementBgColor(report.person2_chart_json.moon.sign)"
          >
            <span class="text-lg">{{ getSignIcon(report.person2_chart_json.moon.sign) }}</span>
            <span class="text-xs text-white font-medium">{{ translateSign(report.person2_chart_json.moon.sign) }}</span>
          </div>
        </div>

        <!-- Ascendant -->
        <div class="flex items-center gap-2">
          <div
            class="flex-1 flex items-center gap-2 rounded-lg px-3 py-2 border"
            :class="getElementBgColor(report.person1_chart_json.ascendant.sign)"
          >
            <span class="text-lg">{{ getSignIcon(report.person1_chart_json.ascendant.sign) }}</span>
            <span class="text-xs text-white font-medium">{{ translateSign(report.person1_chart_json.ascendant.sign) }}</span>
          </div>
          <span class="text-xs text-violet-400 shrink-0">⬆️</span>
          <div
            class="flex-1 flex items-center gap-2 rounded-lg px-3 py-2 border"
            :class="getElementBgColor(report.person2_chart_json.ascendant.sign)"
          >
            <span class="text-lg">{{ getSignIcon(report.person2_chart_json.ascendant.sign) }}</span>
            <span class="text-xs text-white font-medium">{{ translateSign(report.person2_chart_json.ascendant.sign) }}</span>
          </div>
        </div>
      </div>
    </UCard>

    <!-- AI Interpretation -->
    <UCard variant="outline" :ui="{ root: 'card-mystical glow-border' }">
      <div class="flex items-center gap-2 mb-4">
        <UIcon name="i-heroicons-sparkles" class="size-5 text-violet-400" />
        <h3 class="text-base font-semibold text-violet-200">
          {{ t('compatibility.result.interpretation') }}
        </h3>
      </div>

      <div
        class="report-content text-sm text-violet-100/80 leading-relaxed space-y-1"
        v-html="renderedContent"
      />
    </UCard>
  </div>
</template>
