<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const telegram = useTelegram()
const compatibilityStore = useCompatibilityStore()
const { triggerInterpret, currentStep } = useCompatibility()

const reportId = computed(() => route.params.id as string)

const showPaywall = ref(false)
const isUnlocking = ref(false)
const isFetchingData = ref(false)
const fetchError = ref<string | null>(null)

definePageMeta({
  layout: 'default',
})

onMounted(async () => {
  telegram.showBackButton(() => {
    router.push('/')
  })

  // Fetch report if missing
  if (!compatibilityStore.currentReport && !compatibilityStore.isGenerating) {
    await loadReportData()
  }

  // Trigger interpretation if content is still missing
  if (compatibilityStore.currentReport && !compatibilityStore.currentReport.content) {
    triggerInterpret(reportId.value).catch(() => {})
  }
})

onUnmounted(() => {
  telegram.hideBackButton()
  telegram.hideMainButton()
})

async function loadReportData() {
  isFetchingData.value = true
  fetchError.value = null

  try {
    const telegramId = telegram.telegramId.value || 'dev-user'
    const data = await $fetch<{ report: any }>(`/api/compatibility/${reportId.value}`, {
      params: { telegramId },
    })

    if (data.report) {
      compatibilityStore.currentReport = data.report
    }
  }
  catch (e: any) {
    fetchError.value = e.data?.message || e.message || 'Failed to load report'
  }
  finally {
    isFetchingData.value = false
  }
}

const isLoading = computed(() =>
  isFetchingData.value || compatibilityStore.isGenerating
)

const hasReport = computed(() => !!compatibilityStore.currentReport && !!compatibilityStore.currentReport.content)
const hasFullReport = computed(() =>
  !!compatibilityStore.currentReport && compatibilityStore.currentReport.is_paid && !!compatibilityStore.currentReport.content,
)

function openPaywall() {
  showPaywall.value = true
}

async function handlePayment() {
  isUnlocking.value = true
  try {
    const telegramId = telegram.telegramId.value || 'dev-user'
    await $fetch('/api/payments/simulate', {
      method: 'POST',
      body: { telegramId },
    })

    // Mark as paid locally for instant UI update
    if (compatibilityStore.currentReport) {
      compatibilityStore.currentReport.is_paid = true
    }
    showPaywall.value = false
    // Reload from server to get fresh is_paid state
    await loadReportData()
    try { telegram.hapticFeedback('success') } catch { }
  }
  catch {
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

    <!-- Loading state with Animated Loader instead of Skeletons as requested -->
    <CompatibilityLoading v-if="isLoading" :step="currentStep === 'idle' ? 'interpreting' : currentStep" />

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

    <!-- Full paid report -->
    <template v-else-if="hasFullReport">
      <CompatibilityResult :report="compatibilityStore.currentReport!" />
    </template>

    <!-- Basic (free) preview — freemium -->
    <template v-else-if="hasReport">
      <CompatibilityPreview
        :report="compatibilityStore.currentReport!"
        @unlock="openPaywall"
      />
    </template>

    <!-- Error state -->
    <UCard v-else-if="compatibilityStore.error" variant="outline" :ui="{ root: 'card-mystical' }">
      <div class="text-center py-8">
        <UIcon name="i-heroicons-exclamation-triangle" class="size-12 text-red-400 mx-auto mb-4" />
        <p class="text-red-300">{{ compatibilityStore.error || t('errors.generic') }}</p>
        <UButton
          class="mt-4 cursor-pointer"
          color="primary"
          variant="solid"
          :label="t('compatibility.form.tryAgain')"
          to="/compatibility/new"
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
