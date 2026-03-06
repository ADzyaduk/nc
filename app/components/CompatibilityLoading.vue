<script setup lang="ts">
const { t } = useI18n()

defineProps<{
  step: 'idle' | 'calculating' | 'interpreting' | 'done'
}>()
</script>

<template>
  <UCard variant="outline" :ui="{ root: 'card-mystical glow-border' }">
    <div class="text-center py-8">
      <!-- Animated cosmic orbs merging -->
      <div class="relative mx-auto mb-8 w-32 h-32 flex items-center justify-center">
        <!-- Orb 1 -->
        <div
          class="absolute w-14 h-14 rounded-full bg-linear-to-br from-pink-500/40 to-pink-600/20 border border-pink-500/30 flex items-center justify-center transition-all duration-1000"
          :class="step === 'interpreting' ? 'translate-x-0' : '-translate-x-6'"
        >
          <UIcon name="i-heroicons-heart" class="size-6 text-pink-400" />
        </div>
        <!-- Orb 2 -->
        <div
          class="absolute w-14 h-14 rounded-full bg-linear-to-br from-violet-500/40 to-violet-600/20 border border-violet-500/30 flex items-center justify-center transition-all duration-1000"
          :class="step === 'interpreting' ? 'translate-x-0' : 'translate-x-6'"
        >
          <UIcon name="i-heroicons-heart" class="size-6 text-violet-400" />
        </div>
        <!-- Orbiting particle -->
        <div class="absolute inset-0 animate-spin" style="animation-duration: 3s;">
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-400/80 shadow-lg shadow-amber-400/50" />
        </div>
      </div>

      <h2 class="text-lg font-bold text-white mb-3">
        {{ t('compatibility.loading.title') }}
      </h2>

      <!-- Steps -->
      <div class="space-y-2 text-sm">
        <div class="flex items-center justify-center gap-2">
          <UIcon
            :name="step === 'calculating' ? 'i-heroicons-arrow-path' : 'i-heroicons-check-circle'"
            :class="[
              'size-4',
              step === 'calculating' ? 'text-violet-400 animate-spin' : 'text-green-400',
            ]"
          />
          <span :class="step === 'calculating' ? 'text-violet-300' : 'text-violet-400/60'">
            {{ t('compatibility.loading.steps.charts') }}
          </span>
        </div>

        <div class="flex items-center justify-center gap-2">
          <UIcon
            :name="step === 'interpreting' ? 'i-heroicons-arrow-path' : (step === 'done' ? 'i-heroicons-check-circle' : 'i-heroicons-ellipsis-horizontal')"
            :class="[
              'size-4',
              step === 'interpreting' ? 'text-violet-400 animate-spin' : (step === 'done' ? 'text-green-400' : 'text-violet-500/40'),
            ]"
          />
          <span :class="step === 'interpreting' ? 'text-violet-300' : (step === 'done' ? 'text-violet-400/60' : 'text-violet-500/40')">
            {{ t('compatibility.loading.steps.aspects') }}
          </span>
        </div>

        <div class="flex items-center justify-center gap-2">
          <UIcon
            :name="step === 'done' ? 'i-heroicons-check-circle' : 'i-heroicons-ellipsis-horizontal'"
            :class="[
              'size-4',
              step === 'done' ? 'text-green-400' : 'text-violet-500/40',
            ]"
          />
          <span :class="step === 'done' ? 'text-violet-300' : 'text-violet-500/40'">
            {{ t('compatibility.loading.steps.ai') }}
          </span>
        </div>
      </div>
    </div>
  </UCard>
</template>
