<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const telegram = useTelegram()
const chartStore = useChartStore()
const reportStore = useReportStore()
const { unlockFullReport, generateBasicReport } = useNatalChart()

const isDev = import.meta.dev

const chartId = computed(() => route.params.id as string)

const showPaywall = ref(false)
const isUnlocking = ref(false)
const isFetchingData = ref(false)
const fetchError = ref<string | null>(null)

definePageMeta({
  layout: 'default',
})

onMounted(async () => {
  telegram.showBackButton(() => {
    if (window.history.length > 1) router.back()
    else router.push('/')
  })

  const hasPrefetchedChart = !!chartStore.currentChart
  const hasPrefetchedReport = !!(reportStore.basicReport || reportStore.fullReport)

  // Если пришли по прямой ссылке или после обновления страницы — подгружаем всё с сервера
  if (!hasPrefetchedChart || !hasPrefetchedReport) {
    await loadChartData()

    // Если отчёта до сих пор нет, генерируем его уже на странице карты (fallback-сценарий)
    if (!reportStore.basicReport && !reportStore.fullReport && chartStore.currentChart) {
      generateBasicReport(chartId.value).catch(() => {})
    }
  }
})

onUnmounted(() => {
  telegram.hideBackButton()
  telegram.hideMainButton()
})

async function loadChartData() {
  isFetchingData.value = true
  fetchError.value = null

  try {
    const telegramId = telegram.telegramId.value || 'dev-user'
    const data = await $fetch<{ chart: any, reports: any[] }>(`/api/charts/${chartId.value}`, {
      params: { telegramId },
    })

    if (data.chart) {
      chartStore.setChart(data.chart)
    }

    if (data.reports && data.reports.length > 0) {
      const basic = data.reports.find(r => r.type === 'basic')
      const full = data.reports.find(r => r.type === 'full')

      if (basic) reportStore.basicReport = basic
      if (full) reportStore.fullReport = full
    }
  }
  catch (e: any) {
    fetchError.value = e.data?.message || e.message || 'Failed to load chart'
  }
  finally {
    isFetchingData.value = false
  }
}

const isLoading = computed(() => isFetchingData.value)

const hasChart = computed(() => !!chartStore.currentChart)
const hasBasicOverview = computed(() => !!reportStore.basicReport)
const hasFullReport = computed(() => !!reportStore.fullReport && reportStore.fullReport.is_paid)

function openPaywall() {
  showPaywall.value = true
}

async function handlePayment() {
  isUnlocking.value = true
  try {
    const telegramId = telegram.telegramId.value || 'dev-user'
    await unlockFullReport(chartId.value)
    showPaywall.value = false
    try { telegram.hapticFeedback('success') } catch { }
  }
  catch (error) {
    try { telegram.hapticFeedback('error') } catch { }
  }
  finally {
    isUnlocking.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto pt-4">
    <BackButton />

    <!-- DEV-only: quick unlock for premium testing -->
    <div v-if="isDev && hasBasicOverview && !hasFullReport" class="mb-3 flex justify-end">
      <UButton
        size="xs"
        color="warning"
        variant="soft"
        icon="i-heroicons-lock-open"
        label="Dev: Unlock Premium"
        class="cursor-pointer opacity-70 hover:opacity-100"
        @click="openPaywall"
      />
    </div>

    <!-- Light loading: only while fetching chart data (no heavy ChartLoading to avoid double-mount flicker) -->
    <UCard v-if="isLoading" variant="outline" :ui="{ root: 'card-mystical glow-border' }">
      <div class="py-8 text-center">
        <div class="relative mx-auto mb-4 w-12 h-12">
          <div class="absolute inset-0 rounded-full border-2 border-t-violet-400 border-r-violet-400/20 border-b-transparent border-l-transparent animate-spin" />
        </div>
        <p class="text-violet-200">{{ t('loading.fetchingChart') }}</p>
      </div>
    </UCard>

    <!-- Unlocking full report loading -->
    <template v-else-if="isUnlocking">
      <UCard variant="outline" :ui="{ root: 'card-mystical glow-border' }">
        <div class="py-8 text-center">
          <div class="relative mx-auto mb-6 w-16 h-16">
            <div class="absolute inset-0 rounded-full border-2 border-t-amber-400 border-r-amber-400/20 border-b-transparent border-l-transparent animate-spin" />
            <div class="absolute inset-4 rounded-full bg-amber-500/15 flex items-center justify-center">
              <span class="text-xl">🔓</span>
            </div>
          </div>
          <h2 class="text-lg font-semibold text-white mb-2">{{ t('report.unlocking') }}</h2>
          <p class="text-sm text-violet-300/70">{{ t('loading.steps.ai') }}</p>
        </div>
      </UCard>
    </template>

    <!-- Full report -->
    <template v-else-if="hasFullReport">
      <ReportFull
        :report="reportStore.fullReport!"
        :chart="chartStore.currentChart!"
      />
    </template>

    <!-- Basic report -->
    <template v-else-if="hasBasicOverview">
      <ReportPreview
        :report="reportStore.basicReport!"
        :chart="chartStore.currentChart!"
        @unlock="openPaywall"
      />
    </template>

    <!-- Chart loaded, report still generating -->
    <UCard v-else-if="hasChart && !hasBasicOverview && !hasFullReport" variant="outline" :ui="{ root: 'card-mystical glow-border' }">
      <div class="py-8 text-center">
        <div class="relative mx-auto mb-4 w-12 h-12">
          <div class="absolute inset-0 rounded-full border-2 border-t-violet-400 border-r-violet-400/20 border-b-transparent border-l-transparent animate-spin" />
        </div>
        <p class="text-violet-200">{{ t('loading.titleReport') }}</p>
      </div>
    </UCard>

    <!-- Error state -->
    <UCard v-else-if="fetchError || chartStore.error || reportStore.error" variant="outline" :ui="{ root: 'card-mystical' }">
      <div class="text-center py-8">
        <UIcon name="i-heroicons-exclamation-triangle" class="size-12 text-red-400 mx-auto mb-4" />
        <p class="text-red-300">{{ fetchError || chartStore.error || reportStore.error || t('errors.generic') }}</p>
        <UButton
          class="mt-4 cursor-pointer"
          color="primary"
          variant="solid"
          :label="t('nav.newChart')"
          to="/chart/new"
        />
      </div>
    </UCard>

    <!-- Paywall modal -->
    <PaywallModal
      v-model:open="showPaywall"
      :is-paying="isUnlocking"
      @pay="handlePayment"
    />
  </div>
</template>
