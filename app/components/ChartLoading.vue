<script setup lang="ts">
const { t } = useI18n()

const ZODIAC_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']

const props = defineProps<{
  step: 'idle' | 'chart' | 'report' | 'done'
}>()

const steps = [
  { key: 'planets', icon: '🪐' },
  { key: 'houses', icon: '🏛️' },
  { key: 'aspects', icon: '🔗' },
  { key: 'ai', icon: '✨' },
]

// When step is 'report' we are on the report page: show continuation (last step only), no restart
const isReportPhase = computed(() => props.step === 'report')
const activeIndex = ref(props.step === 'report' ? steps.length - 1 : 0)
let interval: ReturnType<typeof setInterval> | undefined

const progress = computed(() => ((activeIndex.value + 1) / steps.length) * 100)
const loadingTitle = computed(() =>
  isReportPhase.value ? t('loading.titleReport') : t('loading.title'),
)

onMounted(() => {
  if (isReportPhase.value) {
    activeIndex.value = steps.length - 1
    return
  }
  interval = setInterval(() => {
    if (activeIndex.value < steps.length - 1) {
      activeIndex.value++
    }
    else {
      clearInterval(interval)
    }
  }, 2500)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

<template>
  <UCard
    variant="outline"
    :ui="{ root: 'card-mystical glow-border' }"
  >
    <div class="py-8 text-center">
      <!-- Zodiac wheel spinner -->
      <div class="relative mx-auto mb-6 w-24 h-24">
        <!-- Outer ring with zodiac symbols -->
        <div class="absolute inset-0 zodiac-spin">
          <div
            v-for="(symbol, i) in ZODIAC_SYMBOLS"
            :key="i"
            class="absolute"
            :style="{
              left: `${50 + 42 * Math.cos((i * 30 - 90) * Math.PI / 180)}%`,
              top: `${50 + 42 * Math.sin((i * 30 - 90) * Math.PI / 180)}%`,
              transform: 'translate(-50%, -50%)',
            }"
          >
            <span class="text-xs opacity-60 text-violet-300">{{ symbol }}</span>
          </div>
        </div>
        <!-- Inner spinning accent -->
        <div
          class="absolute inset-3 rounded-full border-2 border-t-violet-400 border-r-violet-400/20 border-b-transparent border-l-transparent animate-spin"
          style="animation-duration: 1.5s;"
        />
        <!-- Center icon -->
        <div class="absolute inset-6 rounded-full bg-violet-500/15 flex items-center justify-center">
          <span class="text-xl">{{ steps[activeIndex]?.icon }}</span>
        </div>
      </div>

      <h2 class="text-lg font-semibold text-white mb-2">
        {{ loadingTitle }}
      </h2>

      <!-- Progress bar -->
      <div class="w-48 h-1.5 bg-zinc-800 rounded-full mx-auto mb-6 overflow-hidden">
        <div
          class="h-full bg-linear-to-r from-violet-500 to-violet-400 rounded-full transition-all duration-700 ease-out progress-glow"
          :style="{ width: `${progress}%` }"
        />
      </div>

      <!-- Steps -->
      <div class="space-y-3 max-w-xs mx-auto">
        <div
          v-for="(msg, index) in steps"
          :key="msg.key"
          class="flex items-center gap-3 transition-all duration-500"
          :class="index <= activeIndex ? 'opacity-100' : 'opacity-30'"
        >
          <div
            class="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-500"
            :class="index < activeIndex
              ? 'bg-green-500/20 border border-green-500/30'
              : index === activeIndex
                ? 'bg-violet-500/20 border border-violet-500/30'
                : 'bg-zinc-700/30 border border-zinc-700/30'"
          >
            <UIcon
              v-if="index < activeIndex"
              name="i-heroicons-check"
              class="size-3.5 text-green-400"
            />
            <div
              v-else-if="index === activeIndex"
              class="w-2 h-2 rounded-full bg-violet-400 animate-pulse"
            />
          </div>
          <span
            class="text-sm text-left transition-colors duration-300"
            :class="index === activeIndex ? 'text-violet-200 font-medium' : index < activeIndex ? 'text-green-300/70' : 'text-violet-400/50'"
          >
            {{ t(`loading.steps.${msg.key}`) }}
          </span>
        </div>
      </div>
    </div>
  </UCard>
</template>
