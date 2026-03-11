<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const telegram = useTelegram()
const compatibilityStore = useCompatibilityStore()
const userStore = useUserStore()
const { triggerInterpret, currentStep } = useCompatibility()

const reportId = computed(() => route.params.id as string)
const hasCurrentRouteReport = computed(() =>
  !!compatibilityStore.currentReport && compatibilityStore.currentReport.id === reportId.value,
)

const showPaywall = ref(false)
const isUnlocking = ref(false)
const isFetchingData = ref(false)
const fetchError = ref<string | null>(null)
const isLocallyUnlocked = ref(false)

definePageMeta({
  layout: 'default',
})

onMounted(async () => {
  telegram.showBackButton(() => {
    router.push('/')
  })

  if (!hasCurrentRouteReport.value && !compatibilityStore.isGenerating) {
    await loadReportData()
  }

  if (hasCurrentRouteReport.value && !compatibilityStore.currentReport?.content) {
    triggerInterpret(reportId.value).catch(() => {})
  }
})

onUnmounted(() => {
  telegram.hideBackButton()
  telegram.hideMainButton()
})

watch(reportId, async () => {
  fetchError.value = null
  isLocallyUnlocked.value = false

  if (!hasCurrentRouteReport.value && !compatibilityStore.isGenerating) {
    await loadReportData()
  }

  if (hasCurrentRouteReport.value && !compatibilityStore.currentReport?.content) {
    triggerInterpret(reportId.value).catch(() => {})
  }
})

async function loadReportData() {
  isFetchingData.value = true
  fetchError.value = null

  try {
    const telegramId = telegram.telegramId.value || 'dev-user'
    const data = await $fetch<{ report: any }>(`/api/compatibility/${reportId.value}`, {
      params: { telegramId },
    })

    if (!data.report) {
      throw new Error('Empty report payload')
    }

    compatibilityStore.currentReport = data.report
  }
  catch (e: any) {
    fetchError.value = e.data?.message || e.message || 'Failed to load report'
  }
  finally {
    isFetchingData.value = false
  }
}

const isLoading = computed(() =>
  isFetchingData.value
  || compatibilityStore.isGenerating
  || (!hasCurrentRouteReport.value && !fetchError.value && !compatibilityStore.error),
)

const loadingTitle = computed(() => {
  if (isUnlocking.value) return t('report.unlocking')
  return t('loading.titleCompatibility')
})

const loadingSubtitle = computed(() => {
  if (isUnlocking.value) return t('loading.steps.ai')
  return t('loading.subtitleCompatibility')
})

const loadingIcon = computed(() => {
  if (isUnlocking.value) return 'i-heroicons-lock-open'
  return 'i-heroicons-heart'
})

const hasReport = computed(() =>
  hasCurrentRouteReport.value && !!compatibilityStore.currentReport?.content,
)

const hasFullReport = computed(() =>
  !!compatibilityStore.currentReport
  && !!compatibilityStore.currentReport.content
  && (compatibilityStore.currentReport.is_paid || isLocallyUnlocked.value),
)

function openPaywall() {
  showPaywall.value = true
}

async function handlePayment() {
  showPaywall.value = false
  const telegramId = telegram.telegramId.value || 'dev-user'

  if (userStore.user && userStore.user.free_uses_remaining > 0) {
    isUnlocking.value = true
    try {
      await $fetch('/api/payments/use-free-credit', {
        method: 'POST',
        body: { telegramId },
      })
      userStore.user.free_uses_remaining--

      const data = await $fetch<{ report: any }>('/api/compatibility/unlock', {
        method: 'POST',
        body: { reportId: reportId.value },
      })
      if (data.report) compatibilityStore.currentReport = data.report
      isLocallyUnlocked.value = true
      if (compatibilityStore.currentReport) compatibilityStore.currentReport.is_paid = true
      try { telegram.hapticFeedback('success') } catch { }
    }
    catch {
      try { telegram.hapticFeedback('error') } catch { }
    }
    finally {
      isUnlocking.value = false
    }
    return
  }

  try {
    const { invoiceLink } = await $fetch<{ invoiceLink: string }>('/api/payments/invoice', {
      method: 'POST',
      body: { type: 'compatibility', reportId: reportId.value, telegramId },
    })

    await new Promise<void>((resolve, reject) => {
      telegram.openInvoice(invoiceLink, async (status) => {
        if (status !== 'paid') {
          reject(new Error('Payment cancelled or failed'))
          return
        }
        isUnlocking.value = true
        try {
          const data = await $fetch<{ report: any }>('/api/compatibility/unlock', {
            method: 'POST',
            body: { reportId: reportId.value },
          })

          if (data.report) {
            compatibilityStore.currentReport = data.report
          }

          isLocallyUnlocked.value = true
          if (compatibilityStore.currentReport) {
            compatibilityStore.currentReport.is_paid = true
          }

          try { telegram.hapticFeedback('success') } catch { }
          resolve()
        }
        catch {
          isLocallyUnlocked.value = true
          if (compatibilityStore.currentReport) {
            compatibilityStore.currentReport.is_paid = true
          }
          try { telegram.hapticFeedback('error') } catch { }
          resolve()
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

    <!-- Loading / Unlocking -->
    <LoadingOverlay
      v-if="isLoading || isUnlocking"
      variant="card"
      :title="loadingTitle"
      :subtitle="loadingSubtitle"
      :icon="loadingIcon"
    />

    <!-- Full paid report -->
    <template v-else-if="hasFullReport">
      <CompatibilityResult :report="compatibilityStore.currentReport!" />
    </template>

    <!-- Basic (free) preview -->
    <template v-else-if="hasReport">
      <CompatibilityPreview
        :report="compatibilityStore.currentReport!"
        @unlock="openPaywall"
      />
    </template>

    <!-- Error state -->
    <UCard v-else-if="fetchError || compatibilityStore.error" variant="outline" :ui="{ root: 'card-mystical' }">
      <div class="text-center py-8">
        <UIcon name="i-heroicons-exclamation-triangle" class="size-12 text-red-400 mx-auto mb-4" />
        <p class="text-red-300">{{ fetchError || compatibilityStore.error || t('errors.generic') }}</p>
        <UButton
          class="mt-4 cursor-pointer"
          color="primary"
          variant="solid"
          :label="t('compatibility.form.tryAgain')"
          to="/compatibility/new"
        />
      </div>
    </UCard>

    <!-- Fallback: prevents blank screen in edge cases -->
    <LoadingOverlay
      v-else
      variant="card"
      :title="t('loading.titleCompatibility')"
      icon="i-heroicons-heart"
    />

    <!-- Paywall modal -->
    <PaywallModal
      v-model:open="showPaywall"
      :is-paying="isUnlocking"
      :free-credits="userStore.user?.free_uses_remaining ?? 0"
      @pay="handlePayment"
    />
  </div>
</template>
