<script setup lang="ts">
const { t } = useI18n()
const router = useRouter()
const telegram = useTelegram()
const { isProcessing, currentStep } = useCompatibility()

definePageMeta({
  layout: 'default',
})

onMounted(() => {
  telegram.showBackButton(() => {
    router.push('/')
  })
})

onUnmounted(() => {
  telegram.hideBackButton()
  currentStep.value = 'idle'
})
</script>

<template>
  <div class="max-w-md mx-auto pt-4 relative">
    <BackButton />

    <CompatibilityLoading 
      v-if="isProcessing" 
      :step="currentStep" 
    />

    <UCard
      v-else
      variant="outline"
      :ui="{
        root: 'card-mystical glow-border',
        header: 'border-b border-pink-500/20 pb-4',
        body: 'pt-6',
      }"
    >
      <template #header>
        <div class="text-center">
          <h1 class="text-xl font-bold text-white">{{ t('compatibility.form.title') }}</h1>
          <p class="text-sm text-pink-300 mt-1">{{ t('compatibility.form.subtitle') }}</p>
        </div>
      </template>

      <CompatibilityForm />
    </UCard>
  </div>
</template>
