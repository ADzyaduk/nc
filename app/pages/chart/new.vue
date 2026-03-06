<script setup lang="ts">
const { t } = useI18n()
const router = useRouter()
const telegram = useTelegram()
const { isProcessing, currentStep } = useNatalChart()

definePageMeta({
  layout: 'default',
})

onMounted(() => {
  currentStep.value = 'idle'

  telegram.showBackButton(() => {
    router.push('/')
  })
})

onUnmounted(() => {
  telegram.hideBackButton()
})
</script>

<template>
  <div class="max-w-md mx-auto pt-4 relative">
    <BackButton />

    <LoadingOverlay
      v-if="isProcessing"
      variant="card"
      :title="t('loading.titleChart')"
      :subtitle="t('loading.subtitleChart')"
      icon="i-heroicons-sparkles"
    />

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
          <h1 class="text-xl font-bold text-white">{{ t('form.title') }}</h1>
          <p class="text-sm text-violet-300 mt-1">{{ t('form.subtitle') }}</p>
        </div>
      </template>

      <BirthDataForm />
    </UCard>
  </div>
</template>
