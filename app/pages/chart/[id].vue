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

  if (!hasPrefetchedChart || !hasPrefetchedReport) {
    await loadChartData()

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

const isLoading = computed(() =>
  isFetchingData.value
  || (!chartStore.currentChart && !fetchError.value && !chartStore.error && !reportStore.error),
)

const hasChart = computed(() => !!chartStore.currentChart)
const hasBasicOverview = computed(() => !!reportStore.basicReport)
const hasFullReport = computed(() => !!reportStore.fullReport && reportStore.fullReport.is_paid)

const loadingTitle = computed(() => {
  if (isUnlocking.value) return t('report.unlocking')
  return t('loading.fetchingChart')
})

const loadingIcon = computed(() => {
  if (isUnlocking.value) return 'i-heroicons-lock-open'
  return 'i-heroicons-sparkles'
})

function openPaywall() {
  showPaywall.value = true
}

async function handlePayment() {
  showPaywall.value = false

  try {
    const telegramId = telegram.telegramId.value || 'dev-user'
    const { invoiceLink } = await $fetch<{ invoiceLink: string }>('/api/payments/invoice', {
      method: 'POST',
      body: { type: 'natal', reportId: chartId.value, telegramId },
    })

    await new Promise<void>((resolve, reject) => {
      telegram.openInvoice(invoiceLink, async (status) => {
        if (status !== 'paid') {
          reject(new Error('Payment cancelled or failed'))
          return
        }
        isUnlocking.value = true
        try {
          await unlockFullReport(chartId.value)
          try { telegram.hapticFeedback('success') } catch { }
          resolve()
        }
        catch (e) {
          try { telegram.hapticFeedback('error') } catch { }
          reject(e)
        }
        finally {
          isUnlocking.value = false
        }
      })
    })
  }
  catch {
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

    <!-- Loading / Unlocking -->
    <LoadingOverlay
      v-if="isLoading || isUnlocking"
      variant="card"
      :title="loadingTitle"
      :icon="loadingIcon"
    />

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
    <LoadingOverlay
      v-else-if="hasChart && !hasBasicOverview && !hasFullReport"
      variant="card"
      :title="t('loading.titleReport')"
      :subtitle="t('loading.subtitleChart')"
      icon="i-heroicons-sparkles"
    />

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

    <!-- Fallback: prevents blank screen -->
    <LoadingOverlay
      v-else
      variant="card"
      :title="t('loading.fetchingChart')"
      icon="i-heroicons-sparkles"
    />

    <!-- Paywall modal -->
    <PaywallModal
      v-model:open="showPaywall"
      :is-paying="isUnlocking"
      @pay="handlePayment"
    />
  </div>
</template>
