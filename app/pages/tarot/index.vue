<script setup lang="ts">
const { t, locale } = useI18n()
const router = useRouter()
const telegram = useTelegram()
const tarotStore = useTarotStore()
const { renderMarkdown } = useReportRenderer()

const showPaywall = ref(false)
const userQuestion = ref('')

definePageMeta({
  layout: 'default',
})

onMounted(() => {
  tarotStore.$reset()

  telegram.showBackButton(() => {
    router.push('/')
  })
})

onUnmounted(() => {
  telegram.hideBackButton()
})

const questionValid = computed(() => {
  const q = userQuestion.value.trim()
  return q.length >= 3 && q.length <= 500
})

function onSubmit() {
  if (!questionValid.value) return
  showPaywall.value = true
}

async function handlePayment() {
  showPaywall.value = false
  const telegramId = telegram.telegramId.value || 'dev-user'

  try {
    const { invoiceLink } = await $fetch<{ invoiceLink: string }>('/api/payments/invoice', {
      method: 'POST',
      body: { type: 'tarot', telegramId },
    })

    await new Promise<void>((resolve, reject) => {
      telegram.openInvoice(invoiceLink, async (status) => {
        if (status !== 'paid') {
          reject(new Error('Payment cancelled or failed'))
          return
        }
        try {
          await tarotStore.simulatePayment(telegramId)

          await tarotStore.requestReading(
            telegramId,
            userQuestion.value.trim(),
            locale.value,
          )

          await nextTick()
          setTimeout(() => {
            tarotStore.revealCards()
          }, 600)

          try { telegram.hapticFeedback('success') } catch { }
          resolve()
        }
        catch (e) {
          try { telegram.hapticFeedback('error') } catch { }
          reject(e)
        }
      })
    })
  }
  catch { /* payment cancelled or failed — stay on form */ }
}

function newReading() {
  tarotStore.$reset()
  userQuestion.value = ''
}

const interpretationHtml = computed(() => renderMarkdown(tarotStore.interpretation))
</script>

<template>
  <div class="max-w-md mx-auto pt-4">
    <BackButton />

    <!-- Loading state -->
    <LoadingOverlay
      v-if="tarotStore.isLoading || tarotStore.isPaying"
      variant="card"
      :title="tarotStore.isPaying ? t('tarot.paying') : t('tarot.loading')"
      :subtitle="t('tarot.loadingSubtitle')"
      icon="i-heroicons-sparkles"
    />

    <!-- Results -->
    <template v-else-if="tarotStore.hasReading">
      <!-- Question recap -->
      <div class="mb-4 text-center">
        <p class="text-xs text-violet-400/60 uppercase tracking-wider mb-1">
          {{ t('tarot.yourQuestion') }}
        </p>
        <p class="text-sm text-violet-200/80 italic">
          "{{ tarotStore.question }}"
        </p>
      </div>

      <!-- Cards spread -->
      <div class="flex justify-center gap-3 mb-6">
        <TarotCard
          v-for="(card, idx) in tarotStore.cards"
          :key="card.id"
          :card="card"
          :position="tarotStore.positions[idx]"
          :revealed="tarotStore.isRevealed"
          :delay="idx * 300"
        />
      </div>

      <!-- Interpretation -->
      <Transition name="fade-slide">
        <UCard
          v-if="tarotStore.isRevealed"
          variant="outline"
          :ui="{
            root: 'card-mystical glow-border',
            header: 'border-b border-violet-500/20 pb-3',
            body: 'pt-4',
          }"
        >
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-sparkles" class="size-5 text-amber-400" />
              <h2 class="text-base font-semibold text-white">
                {{ t('tarot.interpretation') }}
              </h2>
            </div>
          </template>

          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="report-content" v-html="interpretationHtml" />
        </UCard>
      </Transition>

      <!-- New reading button -->
      <div v-if="tarotStore.isRevealed" class="mt-4 mb-6">
        <UButton
          size="lg"
          color="primary"
          variant="outline"
          block
          :label="t('tarot.newReading')"
          icon="i-heroicons-arrow-path"
          class="cursor-pointer border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
          @click="newReading"
        />
      </div>
    </template>

    <!-- Error state -->
    <UCard
      v-else-if="tarotStore.error"
      variant="outline"
      :ui="{ root: 'card-mystical' }"
    >
      <div class="text-center py-8">
        <UIcon name="i-heroicons-exclamation-triangle" class="size-12 text-red-400 mx-auto mb-4" />
        <p class="text-red-300 mb-4">
          {{ tarotStore.error }}
        </p>
        <UButton
          class="cursor-pointer"
          color="primary"
          variant="solid"
          :label="t('tarot.tryAgain')"
          @click="newReading"
        />
      </div>
    </UCard>

    <!-- Question input (initial state) -->
    <UCard
      v-else
      variant="outline"
      :ui="{
        root: 'card-mystical glow-border',
        header: 'border-b border-violet-500/20 pb-4',
        body: 'pt-6',
      }"
    >
      <template #header>
        <div class="text-center">
          <div class="w-14 h-14 rounded-full bg-linear-to-br from-amber-500/15 to-violet-500/15 border border-amber-500/25 flex items-center justify-center mx-auto mb-3">
            <span class="text-2xl select-none">🔮</span>
          </div>
          <h1 class="text-xl font-bold text-white">
            {{ t('tarot.title') }}
          </h1>
          <p class="text-sm text-violet-300 mt-1">
            {{ t('tarot.subtitle') }}
          </p>
        </div>
      </template>

      <div class="space-y-4">
        <UTextarea
          v-model="userQuestion"
          :placeholder="t('tarot.placeholder')"
          :rows="3"
          autoresize
          :maxlength="500"
          :ui="{
            root: 'w-full',
            textarea: 'bg-violet-950/50 border-violet-500/20 text-violet-100 placeholder-violet-400/40 focus:border-amber-500/40',
          }"
        />

        <div class="flex justify-between items-center text-xs text-violet-400/50 px-1">
          <span>{{ t('tarot.hint') }}</span>
          <span>{{ userQuestion.length }}/500</span>
        </div>

        <UButton
          size="xl"
          color="primary"
          variant="solid"
          block
          :disabled="!questionValid"
          :label="t('tarot.cta')"
          icon="i-heroicons-sparkles"
          class="cursor-pointer shadow-lg shadow-violet-600/30"
          @click="onSubmit"
        />

        <p class="text-xs text-center text-violet-400/40">
          {{ t('tarot.priceHint') }}
        </p>
      </div>
    </UCard>

    <!-- Paywall modal -->
    <PaywallModal
      v-model:open="showPaywall"
      :is-paying="tarotStore.isPaying"
      i18n-prefix="tarot.paywall"
      @pay="handlePayment"
    />
  </div>
</template>

<style scoped>
.fade-slide-enter-active {
  transition: all 0.6s ease-out;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
</style>
