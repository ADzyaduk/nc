<script setup lang="ts">
import type { TarotCard } from '~~/server/utils/tarot'

const { t, locale } = useI18n()

const props = defineProps<{
  card: TarotCard
  position: string
  revealed: boolean
  delay?: number
}>()

const localName = computed(() => locale.value === 'ru' ? props.card.nameRu : props.card.name)
const localKeywords = computed(() => locale.value === 'ru' ? props.card.keywordsRu : props.card.keywords)

const imgError = ref(false)

function onImgError() {
  imgError.value = true
}
</script>

<template>
  <div class="tarot-card-wrapper flex flex-col items-center gap-2">
    <span class="text-xs font-medium text-amber-400/90 uppercase tracking-wider">
      {{ position }}
    </span>

    <div
      class="tarot-card-container"
      :class="{ 'is-revealed': revealed }"
      :style="{ transitionDelay: `${delay || 0}ms` }"
    >
      <div class="tarot-card-inner">
        <!-- Card Back -->
        <div class="tarot-card-face tarot-card-back">
          <div class="w-full h-full rounded-xl bg-linear-to-br from-violet-900 via-indigo-900 to-violet-950 border border-violet-500/30 flex items-center justify-center overflow-hidden">
            <div class="absolute inset-2 rounded-lg border border-amber-500/20" />
            <div class="absolute inset-4 rounded-md border border-violet-400/15" />
            <span class="text-3xl select-none opacity-80" style="filter: drop-shadow(0 0 6px rgba(167, 139, 250, 0.5));">
              🔮
            </span>
          </div>
        </div>

        <!-- Card Front -->
        <div class="tarot-card-face tarot-card-front">
          <div class="w-full h-full rounded-xl bg-linear-to-br from-violet-950 via-indigo-950 to-violet-950 border border-amber-500/30 flex flex-col items-center overflow-hidden">
            <div v-if="!imgError" class="flex-1 w-full p-1.5">
              <img
                :src="card.image"
                :alt="localName"
                class="w-full h-full object-cover rounded-lg"
                @error="onImgError"
              >
            </div>
            <div v-else class="flex-1 w-full flex items-center justify-center">
              <span class="text-4xl select-none">🃏</span>
            </div>
            <div class="w-full px-2 py-1.5 text-center">
              <span class="text-[10px] font-semibold text-amber-300 leading-tight block truncate">
                {{ localName }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="revealed" class="text-center max-w-[110px]">
      <p class="text-[10px] text-violet-300/60 leading-tight">
        {{ localKeywords.slice(0, 2).join(', ') }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.tarot-card-container {
  width: 100px;
  height: 150px;
  perspective: 800px;
}

@media (min-width: 400px) {
  .tarot-card-container {
    width: 110px;
    height: 165px;
  }
}

.tarot-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.tarot-card-container.is-revealed .tarot-card-inner {
  transform: rotateY(180deg);
}

.tarot-card-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: 0.75rem;
}

.tarot-card-back {
  transform: rotateY(0deg);
}

.tarot-card-front {
  transform: rotateY(180deg);
}
</style>
