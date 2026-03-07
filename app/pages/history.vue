<script setup lang="ts">
const { t } = useI18n()
const router = useRouter()
const telegram = useTelegram()
const { translateSign, getSignIcon, getElementBgColor } = useZodiac()

definePageMeta({
  layout: 'default',
})

// Telegram Back Button
onMounted(() => {
  telegram.showBackButton(() => {
    router.push('/')
  })
})

onUnmounted(() => {
  telegram.hideBackButton()
})

// Active tab
const activeTab = ref<'charts' | 'compatibility'>('charts')

// Fetch data
const telegramId = computed(() => telegram.telegramId.value || 'dev-user')

interface ChartListItem {
  id: string
  birth_date: string
  birth_time: string
  birth_city: string
  chart_json: any
  created_at: string | null
  hasPaidReport: boolean
}

interface CompatListItem {
  id: string
  person1_name: string | null
  person2_name: string | null
  person1_chart_json: any
  person2_chart_json: any
  scores: { overall: number }
  type: string
  is_paid: boolean
  created_at: string
}

const { data: chartsData, status: chartsStatus } = useFetch<{ charts: ChartListItem[] }>('/api/charts/list', {
  query: { telegramId },
  default: () => ({ charts: [] }),
})

const { data: compatData, status: compatStatus } = useFetch<{ reports: CompatListItem[] }>('/api/compatibility/list', {
  query: { telegramId },
  default: () => ({ reports: [] }),
})

const isLoading = computed(() =>
  chartsStatus.value === 'pending' || compatStatus.value === 'pending',
)

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }
  catch {
    return dateStr
  }
}

function getSunSign(chartJson: any): string {
  return chartJson?.sun?.sign || ''
}
</script>

<template>
  <div class="max-w-md mx-auto pt-4 h-full flex flex-col min-h-0">
    <BackButton />

    <!-- Header -->
    <div class="text-center mb-6 shrink-0">
      <h1 class="text-xl font-bold text-white">{{ t('history.title') }}</h1>
      <p class="text-sm text-violet-300 mt-1">{{ t('history.subtitle') }}</p>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 mb-4 shrink-0">
      <UButton
        :color="activeTab === 'charts' ? 'primary' : 'neutral'"
        :variant="activeTab === 'charts' ? 'solid' : 'ghost'"
        size="sm"
        icon="i-heroicons-sparkles"
        :label="t('history.tabs.charts')"
        class="cursor-pointer flex-1"
        @click="activeTab = 'charts'"
      />
      <UButton
        :color="activeTab === 'compatibility' ? 'primary' : 'neutral'"
        :variant="activeTab === 'compatibility' ? 'solid' : 'ghost'"
        size="sm"
        icon="i-heroicons-heart"
        :label="t('history.tabs.compatibility')"
        class="cursor-pointer flex-1"
        @click="activeTab = 'compatibility'"
      />
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="space-y-3">
      <USkeleton v-for="i in 3" :key="i" class="h-20 w-full rounded-xl" />
    </div>

    <!-- Charts Tab -->
    <template v-else-if="activeTab === 'charts'">
      <div v-if="chartsData?.charts?.length" class="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1">
        <UCard
          v-for="chart in chartsData.charts"
          :key="chart.id"
          variant="outline"
          :ui="{ root: 'card-mystical cursor-pointer hover:border-violet-500/40 transition-colors' }"
          @click="router.push(`/chart/${chart.id}`)"
        >
          <div class="flex items-center gap-3">
            <!-- Zodiac icon -->
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center border shrink-0"
              :class="getElementBgColor(getSunSign(chart.chart_json))"
            >
              <span class="text-lg">{{ getSignIcon(getSunSign(chart.chart_json)) }}</span>
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium text-white truncate">
                  {{ translateSign(getSunSign(chart.chart_json)) }}
                </span>
                <UBadge v-if="chart.hasPaidReport" color="warning" variant="subtle" size="xs">
                  {{ t('history.premium') }}
                </UBadge>
              </div>
              <p class="text-xs text-violet-300/60 truncate">
                {{ chart.birth_city }} · {{ formatDate(chart.birth_date) }}
              </p>
            </div>

            <!-- Arrow -->
            <UIcon name="i-heroicons-chevron-right" class="size-4 text-violet-400/40 shrink-0" />
          </div>
        </UCard>
      </div>

      <!-- Empty state -->
      <UCard v-else variant="outline" :ui="{ root: 'card-mystical' }">
        <div class="text-center py-6">
          <UIcon name="i-heroicons-sparkles" class="size-10 text-violet-400/30 mx-auto mb-3" />
          <p class="text-sm text-violet-300/60 mb-4">{{ t('history.emptyCharts') }}</p>
          <UButton
            color="primary"
            variant="solid"
            size="sm"
            :label="t('welcome.cta')"
            to="/chart/new"
            class="cursor-pointer"
          />
        </div>
      </UCard>
    </template>

    <!-- Compatibility Tab -->
    <template v-else-if="activeTab === 'compatibility'">
      <div v-if="compatData?.reports?.length" class="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1">
        <UCard
          v-for="report in compatData.reports"
          :key="report.id"
          variant="outline"
          :ui="{ root: 'card-mystical cursor-pointer hover:border-pink-500/40 transition-colors' }"
          @click="router.push(`/compatibility/${report.id}`)"
        >
          <div class="flex items-center gap-3">
            <!-- Hearts icon -->
            <div class="w-10 h-10 rounded-lg bg-pink-500/15 border border-pink-500/30 flex items-center justify-center shrink-0">
              <UIcon name="i-heroicons-heart" class="size-5 text-pink-400" />
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium text-white truncate">
                  {{ report.person1_name || t('compatibility.form.person1') }}
                  ❤️
                  {{ report.person2_name || t('compatibility.form.person2') }}
                </span>
              </div>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-xs text-pink-300/60">{{ report.scores?.overall || 0 }}%</span>
                <span class="text-xs text-violet-300/40">·</span>
                <span class="text-xs text-violet-300/60">{{ formatDate(report.created_at) }}</span>
                <UBadge v-if="report.is_paid" color="warning" variant="subtle" size="xs">
                  {{ t('history.premium') }}
                </UBadge>
              </div>
            </div>

            <!-- Arrow -->
            <UIcon name="i-heroicons-chevron-right" class="size-4 text-violet-400/40 shrink-0" />
          </div>
        </UCard>
      </div>

      <!-- Empty state -->
      <UCard v-else variant="outline" :ui="{ root: 'card-mystical' }">
        <div class="text-center py-6">
          <UIcon name="i-heroicons-heart" class="size-10 text-pink-400/30 mx-auto mb-3" />
          <p class="text-sm text-violet-300/60 mb-4">{{ t('history.emptyCompatibility') }}</p>
          <UButton
            color="primary"
            variant="solid"
            size="sm"
            :label="t('welcome.ctaCompatibility')"
            to="/compatibility/new"
            class="cursor-pointer"
          />
        </div>
      </UCard>
    </template>
  </div>
</template>
