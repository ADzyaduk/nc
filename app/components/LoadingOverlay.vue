<script setup lang="ts">
interface LoadingStep {
  label: string
  status: 'done' | 'active' | 'pending'
}

withDefaults(defineProps<{
  visible?: boolean
  variant?: 'overlay' | 'card'
  title?: string
  subtitle?: string
  icon?: string
  steps?: LoadingStep[]
}>(), {
  visible: true,
  variant: 'card',
  icon: 'i-heroicons-sparkles',
})
</script>

<template>
  <!-- Overlay variant: full-screen with backdrop -->
  <Transition v-if="variant === 'overlay'" name="fade">
    <div v-if="visible" class="fixed inset-0 z-100 flex items-center justify-center bg-gray-950/85 backdrop-blur-md">
      <div class="text-center px-6 max-w-sm flex flex-col items-center">
        <div class="relative w-28 h-28 mb-8">
          <div class="absolute inset-0 rounded-full border-t-2 border-l-2 border-violet-500/60 animate-[spin_3s_linear_infinite]" />
          <div class="absolute inset-3 rounded-full border-r-2 border-b-2 border-indigo-400/70 animate-[spin_2s_linear_infinite_reverse]" />
          <div class="absolute inset-6 rounded-full border-t-2 border-fuchsia-400/50 animate-[spin_4s_linear_infinite]" />
          <UIcon :name="icon" class="w-10 h-10 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
        </div>

        <h3 class="text-xl font-bold tracking-wide text-white mb-3 animate-pulse">
          {{ title }}
        </h3>
        <p v-if="subtitle" class="text-sm text-violet-300/80 leading-relaxed font-medium mb-6">
          {{ subtitle }}
        </p>

        <div v-if="steps?.length" class="space-y-3 max-w-xs w-full">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="flex items-center gap-3 transition-all duration-500"
            :class="step.status === 'pending' ? 'opacity-30' : 'opacity-100'"
          >
            <div
              class="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-500"
              :class="step.status === 'done'
                ? 'bg-green-500/20 border border-green-500/30'
                : step.status === 'active'
                  ? 'bg-violet-500/20 border border-violet-500/30'
                  : 'bg-zinc-700/30 border border-zinc-700/30'"
            >
              <UIcon v-if="step.status === 'done'" name="i-heroicons-check" class="size-3.5 text-green-400" />
              <div v-else-if="step.status === 'active'" class="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            </div>
            <span
              class="text-sm text-left transition-colors duration-300"
              :class="step.status === 'active' ? 'text-violet-200 font-medium' : step.status === 'done' ? 'text-green-300/70' : 'text-violet-400/50'"
            >
              {{ step.label }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Card variant: in-page UCard -->
  <UCard
    v-else
    variant="outline"
    :ui="{ root: 'card-mystical glow-border' }"
  >
    <div class="py-8 text-center flex flex-col items-center">
      <div class="relative w-24 h-24 mb-6">
        <div class="absolute inset-0 rounded-full border-t-2 border-l-2 border-violet-500/60 animate-[spin_3s_linear_infinite]" />
        <div class="absolute inset-3 rounded-full border-r-2 border-b-2 border-indigo-400/70 animate-[spin_2s_linear_infinite_reverse]" />
        <div class="absolute inset-5 rounded-full border-t-2 border-fuchsia-400/50 animate-[spin_4s_linear_infinite]" />
        <UIcon :name="icon" class="w-8 h-8 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
      </div>

      <h2 class="text-lg font-semibold text-white mb-2">
        {{ title }}
      </h2>
      <p v-if="subtitle" class="text-sm text-violet-300/80 leading-relaxed mb-6">
        {{ subtitle }}
      </p>

      <div v-if="steps?.length" class="space-y-3 max-w-xs w-full">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="flex items-center gap-3 transition-all duration-500"
          :class="step.status === 'pending' ? 'opacity-30' : 'opacity-100'"
        >
          <div
            class="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-500"
            :class="step.status === 'done'
              ? 'bg-green-500/20 border border-green-500/30'
              : step.status === 'active'
                ? 'bg-violet-500/20 border border-violet-500/30'
                : 'bg-zinc-700/30 border border-zinc-700/30'"
          >
            <UIcon v-if="step.status === 'done'" name="i-heroicons-check" class="size-3.5 text-green-400" />
            <div v-else-if="step.status === 'active'" class="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
          </div>
          <span
            class="text-sm text-left transition-colors duration-300"
            :class="step.status === 'active' ? 'text-violet-200 font-medium' : step.status === 'done' ? 'text-green-300/70' : 'text-violet-400/50'"
          >
            {{ step.label }}
          </span>
        </div>
      </div>
    </div>
  </UCard>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
