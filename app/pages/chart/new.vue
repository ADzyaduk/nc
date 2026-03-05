<script setup lang="ts">
const { t } = useI18n()
const router = useRouter()
const telegram = useTelegram()
const { isProcessing, currentStep } = useNatalChart()

definePageMeta({
  layout: 'default',
})

// Show Telegram Back Button
onMounted(() => {
  telegram.showBackButton(() => {
    router.push('/')
  })
})

onUnmounted(() => {
  telegram.hideBackButton()
  // Only reset the step indicator — preserve store data so [id].vue doesn't refetch
  currentStep.value = 'idle'
})
</script>

<template>
  <div class="max-w-md mx-auto pt-4 relative">
    <BackButton />

    <ChartLoading 
      v-if="isProcessing" 
      :step="currentStep" 
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
