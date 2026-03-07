<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="text-center w-full max-w-full min-w-0 overflow-hidden px-1">
    <!-- Cosmic orb with animation -->
    <div class="relative mx-auto mb-2 w-24 h-24 flex items-center justify-center">
      <div class="cosmic-orb flex items-center justify-center">
        <span class="text-3xl select-none" style="filter: drop-shadow(0 0 8px rgba(167, 139, 250, 0.6));">✨</span>
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
    <h1 class="text-2xl font-bold text-white glow-text mb-1 stagger-enter">
      {{ t('welcome.heading') }}
    </h1>
    <p class="text-violet-300/80 text-sm leading-relaxed mb-3 max-w-xs mx-auto stagger-enter">
      {{ t('welcome.description') }}
    </p>

    <!-- Features: 4 иконки, чтобы помещались на узком экране -->
    <div class="flex justify-center gap-3 sm:gap-4 mb-3">
      <div class="text-center stagger-enter">
        <div class="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center mx-auto mb-1 zodiac-pulse">
          <span class="text-base">🔭</span>
        </div>
        <span class="text-xs text-violet-300">{{ t('welcome.features.chart') }}</span>
      </div>
      <div class="text-center stagger-enter">
        <div class="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center mx-auto mb-1 zodiac-pulse">
          <span class="text-base">⚡</span>
        </div>
        <span class="text-xs text-violet-300">{{ t('welcome.features.instant') }}</span>
      </div>
      <div class="text-center stagger-enter">
        <div class="w-9 h-9 rounded-xl bg-pink-500/15 border border-pink-500/25 flex items-center justify-center mx-auto mb-1 zodiac-pulse">
          <UIcon name="i-heroicons-heart" class="size-4 text-pink-400" />
        </div>
        <span class="text-xs text-pink-300">{{ t('welcome.features.compatibility') }}</span>
      </div>
      <div class="text-center stagger-enter">
        <div class="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center mx-auto mb-1 zodiac-pulse">
          <span class="text-base">🔮</span>
        </div>
        <span class="text-xs text-amber-300">{{ t('welcome.features.tarot') }}</span>
      </div>
    </div>

    <!-- CTA Buttons: строго по ширине контейнера -->
    <div class="space-y-3 stagger-enter w-full max-w-full min-w-0">
      <UButton
        size="xl"
        color="primary"
        variant="solid"
        :label="t('welcome.cta')"
        to="/chart/new"
        icon="i-heroicons-arrow-right"
        trailing
        block
        class="cursor-pointer shadow-lg shadow-violet-600/30 w-full max-w-full min-w-0"
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
        class="cursor-pointer border-pink-500/30 text-pink-300 hover:bg-pink-500/10 w-full max-w-full min-w-0"
      />
      <UButton
        size="xl"
        color="neutral"
        variant="outline"
        :label="t('welcome.ctaTarot')"
        to="/tarot"
        icon="i-heroicons-sparkles"
        trailing
        block
        class="cursor-pointer border-amber-500/30 text-amber-300 hover:bg-amber-500/10 w-full max-w-full min-w-0"
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
        class="cursor-pointer text-violet-400 hover:text-violet-300 w-full max-w-full min-w-0"
      />
    </div>
  </div>
</template>
