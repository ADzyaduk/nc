<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="layout-root">
    <!-- Animated stars background -->
    <div class="stars-bg">
      <div
        v-for="i in 50"
        :key="i"
        class="star"
        :style="{
          left: `${(i * 17 + 3) % 100}%`,
          top: `${(i * 23 + 7) % 100}%`,
          '--duration': `${2 + (i % 5)}s`,
          '--max-opacity': `${0.3 + (i % 4) * 0.2}`,
          animationDelay: `${(i * 0.3) % 5}s`,
          width: `${1 + (i % 3)}px`,
          height: `${1 + (i % 3)}px`,
        }"
      />
    </div>

    <!-- Top bar -->
    <header class="layout-header">
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-sparkles" class="text-violet-400 size-5" />
        <span class="text-sm font-semibold text-violet-300">{{ t('app.title') }}</span>
      </div>
      <LanguageSwitcher />
    </header>

    <!-- Main content: scrollable so everything fits on mobile -->
    <main class="layout-main safe-area-bottom flex flex-col">
      <slot />
    </main>
  </div>
</template>
