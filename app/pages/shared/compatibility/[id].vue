<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const telegram = useTelegram()
const { translateSign, getSignIcon, getElementBgColor } = useZodiac()
const { animateScore, getCircleDashArray } = useScoreAnimation()

const reportId = computed(() => route.params.id as string)

definePageMeta({ layout: 'default' })

const report = ref<any>(null)
const isLoading = ref(true)
const fetchError = ref<string | null>(null)

const animatedOverall = ref(0)

onMounted(async () => {
  telegram.showBackButton(() => router.push('/'))

  try {
    const data = await $fetch<{ report: any }>(`/api/shared/compatibility/${reportId.value}`)
    report.value = data.report
    animateScore(data.report.scores.overall, (v) => { animatedOverall.value = v }, 300)
  }
  catch {
    fetchError.value = 'Отчёт не найден'
  }
  finally {
    isLoading.value = false
  }
})

onUnmounted(() => {
  telegram.hideBackButton()
})

const person1Label = computed(() => report.value?.person1_name || 'Человек 1')
const person2Label = computed(() => report.value?.person2_name || 'Человек 2')

const categories = computed(() => {
  if (!report.value) return []
  return [
    { label: 'Эмоции', icon: 'i-heroicons-heart', score: report.value.scores.emotional, color: 'text-pink-400', ringColor: '#f472b6' },
    { label: 'Страсть', icon: 'i-heroicons-fire', score: report.value.scores.passion, color: 'text-red-400', ringColor: '#f87171' },
    { label: 'Общение', icon: 'i-heroicons-chat-bubble-left-right', score: report.value.scores.communication, color: 'text-blue-400', ringColor: '#60a5fa' },
    { label: 'Ценности', icon: 'i-heroicons-star', score: report.value.scores.values, color: 'text-amber-400', ringColor: '#fbbf24' },
  ]
})
</script>

<template>
  <div class="px-4 py-4 space-y-4">
    <!-- Header -->
    <div class="text-center">
      <div class="w-16 h-16 rounded-full bg-linear-to-br from-pink-500/20 to-violet-600/20 border border-pink-500/30 flex items-center justify-center mx-auto mb-3">
        <span class="text-3xl">💫</span>
      </div>
      <h1 class="text-lg font-bold text-white">Совместимость</h1>
      <p class="text-sm text-violet-300 mt-1">Астрологический анализ пары</p>
    </div>

    <!-- Loading -->
    <LoadingOverlay
      v-if="isLoading"
      variant="card"
      title="Загружаем отчёт..."
      icon="i-heroicons-heart"
    />

    <!-- Error -->
    <UCard v-else-if="fetchError" variant="outline" :ui="{ root: 'card-mystical' }">
      <div class="text-center py-8">
        <UIcon name="i-heroicons-exclamation-triangle" class="size-12 text-red-400 mx-auto mb-4" />
        <p class="text-red-300">{{ fetchError }}</p>
      </div>
    </UCard>

    <template v-else-if="report">
      <!-- Overall score ring -->
      <UCard variant="outline" :ui="{ root: 'card-mystical glow-border' }">
        <div class="text-center py-4">
          <h2 class="text-base font-semibold text-violet-200 mb-4">Общая совместимость</h2>

          <div class="relative mx-auto w-36 h-36 mb-4">
            <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(139, 92, 246, 0.15)" stroke-width="6" />
              <circle
                cx="50" cy="50" r="45" fill="none"
                stroke="url(#sharedCompatGrad)"
                stroke-width="6"
                stroke-linecap="round"
                :stroke-dasharray="getCircleDashArray(animatedOverall)"
              />
              <defs>
                <linearGradient id="sharedCompatGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#f472b6" />
                  <stop offset="100%" stop-color="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-3xl font-bold text-white">{{ animatedOverall }}%</span>
              <span class="text-xs text-violet-400">совместимость</span>
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

      <!-- Category scores -->
      <div class="grid grid-cols-2 gap-3">
        <UCard
          v-for="cat in categories"
          :key="cat.label"
          variant="outline"
          :ui="{ root: 'card-mystical' }"
        >
          <div class="text-center p-1">
            <div class="relative mx-auto w-14 h-14 mb-2">
              <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(139, 92, 246, 0.1)" stroke-width="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  :stroke="cat.ringColor"
                  stroke-width="8"
                  stroke-linecap="round"
                  :stroke-dasharray="getCircleDashArray(cat.score, 42)"
                  stroke-opacity="0.8"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-xs font-bold text-white">{{ cat.score }}%</span>
              </div>
            </div>
            <UIcon :name="cat.icon" class="size-4 mx-auto mb-1" :class="cat.color" />
            <p class="text-xs text-violet-300">{{ cat.label }}</p>
          </div>
        </UCard>
      </div>

      <!-- Signs -->
      <UCard variant="outline" :ui="{ root: 'card-mystical' }">
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <div class="flex-1 flex items-center gap-2 rounded-lg px-3 py-2 border border-violet-500/20 bg-violet-500/5">
              <span class="text-lg">{{ getSignIcon(report.person1_chart_json.sun.sign) }}</span>
              <span class="text-xs text-white font-medium">{{ translateSign(report.person1_chart_json.sun.sign) }}</span>
            </div>
            <span class="text-xs text-violet-400 shrink-0">☀️</span>
            <div class="flex-1 flex items-center gap-2 rounded-lg px-3 py-2 border border-violet-500/20 bg-violet-500/5">
              <span class="text-lg">{{ getSignIcon(report.person2_chart_json.sun.sign) }}</span>
              <span class="text-xs text-white font-medium">{{ translateSign(report.person2_chart_json.sun.sign) }}</span>
            </div>
          </div>
        </div>
      </UCard>

      <!-- CTA -->
      <UCard variant="outline" :ui="{ root: 'card-mystical border-pink-500/30' }">
        <div class="text-center py-3">
          <p class="text-base font-bold text-white mb-1">Проверь свою совместимость</p>
          <p class="text-sm text-violet-300/80 mb-4">
            Узнай, насколько вы совместимы с любимым человеком
          </p>
          <UButton
            color="primary"
            variant="solid"
            size="lg"
            label="Проверить совместимость"
            icon="i-heroicons-heart"
            class="cursor-pointer shadow-lg shadow-violet-600/30"
            to="/compatibility/new"
          />
        </div>
      </UCard>
    </template>
  </div>
</template>
