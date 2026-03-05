<script setup lang="ts">
defineProps<{
  visible: boolean
  title?: string
  subtitle?: string
}>()
</script>

<template>
  <Transition name="fade">
    <div v-if="visible" class="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/85 backdrop-blur-md">
      <div class="text-center px-6 max-w-sm flex flex-col items-center">
        <!-- Astrological Spinner Animation -->
        <div class="relative w-28 h-28 mb-8">
          <div class="absolute inset-0 rounded-full border-t-2 border-l-2 border-violet-500/60 animate-[spin_3s_linear_infinite]"></div>
          <div class="absolute inset-3 rounded-full border-r-2 border-b-2 border-indigo-400/70 animate-[spin_2s_linear_infinite_reverse]"></div>
          <div class="absolute inset-6 rounded-full border-t-2 border-fuchsia-400/50 animate-[spin_4s_linear_infinite]"></div>
          <!-- Center Star Element -->
          <UIcon name="i-heroicons-sparkles" class="w-10 h-10 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
        </div>
        
        <!-- Text Content -->
        <h3 class="text-xl sm:text-2xl font-bold tracking-wide text-white mb-3 animate-pulse">
          {{ title }}
        </h3>
        <p class="text-sm sm:text-base text-violet-300/80 leading-relaxed font-medium">
          {{ subtitle }}
        </p>
      </div>
    </div>
  </Transition>
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
