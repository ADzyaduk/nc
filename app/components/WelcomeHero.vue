<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="text-center px-4">
    <!-- Cosmic orb with animation -->
    <div class="relative mx-auto mb-8 w-40 h-40 flex items-center justify-center">
      <div class="cosmic-orb flex items-center justify-center">
        <span class="text-4xl select-none" style="filter: drop-shadow(0 0 8px rgba(167, 139, 250, 0.6));">✨</span>
      </div>
      <!-- Orbiting particles -->
      <div class="absolute inset-0 animate-spin" style="animation-duration: 20s;">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-400/80 shadow-lg shadow-amber-400/50" />
      </div>
      <div class="absolute inset-0 animate-spin" style="animation-duration: 15s; animation-direction: reverse;">
        <div class="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-violet-400/80 shadow-lg shadow-violet-400/50" />
      </div>
      <div class="absolute inset-0 animate-spin" style="animation-duration: 25s;">
        <div class="absolute top-4 right-0 w-1 h-1 rounded-full bg-blue-300/60" />
      </div>
    </div>

    <!-- Heading -->
    <h1 class="text-3xl font-bold text-white glow-text mb-3 stagger-enter">
      {{ t('welcome.heading') }}
    </h1>
    <p class="text-violet-300/80 text-base leading-relaxed mb-8 max-w-xs mx-auto stagger-enter">
      {{ t('welcome.description') }}
    </p>

    <!-- Features with stagger entrance -->
    <div class="flex justify-center gap-6 mb-10">
      <div class="text-center stagger-enter">
        <div class="w-12 h-12 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center mx-auto mb-2 zodiac-pulse">
          <span class="text-xl">🔭</span>
        </div>
        <span class="text-xs text-violet-300">{{ t('welcome.features.chart') }}</span>
      </div>
      <div class="text-center stagger-enter">
        <div class="w-12 h-12 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center mx-auto mb-2 zodiac-pulse">
          <span class="text-xl">🤖</span>
        </div>
        <span class="text-xs text-violet-300">{{ t('welcome.features.ai') }}</span>
      </div>
      <div class="text-center stagger-enter">
        <div class="w-12 h-12 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center mx-auto mb-2 zodiac-pulse">
          <span class="text-xl">⚡</span>
        </div>
        <span class="text-xs text-violet-300">{{ t('welcome.features.instant') }}</span>
      </div>
      <div class="text-center stagger-enter">
        <div class="w-12 h-12 rounded-xl bg-pink-500/15 border border-pink-500/25 flex items-center justify-center mx-auto mb-2 zodiac-pulse">
          <UIcon name="i-heroicons-heart" class="size-5 text-pink-400" />
        </div>
        <span class="text-xs text-pink-300">{{ t('welcome.features.compatibility') }}</span>
      </div>
    </div>

    <!-- CTA Buttons -->
    <div class="space-y-3 stagger-enter">
      <UButton
        size="xl"
        color="primary"
        variant="solid"
        :label="t('welcome.cta')"
        to="/chart/new"
        icon="i-heroicons-arrow-right"
        trailing
        block
        class="cursor-pointer shadow-lg shadow-violet-600/30"
      />
      <UButton
        size="xl"
        color="neutral"
        variant="outline"
        :label="t('welcome.ctaCompatibility')"
        to="/compatibility/new"
        icon="i-heroicons-heart"
        trailing
        block
        class="cursor-pointer border-pink-500/30 text-pink-300 hover:bg-pink-500/10"
      />
      <UButton
        size="lg"
        color="neutral"
        variant="ghost"
        :label="t('history.myCharts')"
        to="/history"
        icon="i-heroicons-clock"
        trailing
        block
        class="cursor-pointer text-violet-400 hover:text-violet-300"
      />
    </div>
  </div>
</template>
