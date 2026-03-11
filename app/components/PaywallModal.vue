<script setup lang="ts">
const { t } = useI18n()

const open = defineModel<boolean>('open', { default: false })

const props = withDefaults(defineProps<{
  isPaying: boolean
  i18nPrefix?: string
  freeCredits?: number
}>(), {
  i18nPrefix: 'paywall',
  freeCredits: 0,
})

const emit = defineEmits<{
  pay: []
}>()

const p = computed(() => props.i18nPrefix)

const isFree = computed(() => props.freeCredits > 0)

const features = computed(() => [
  t(`${p.value}.feature1`),
  t(`${p.value}.feature2`),
  t(`${p.value}.feature3`),
  t(`${p.value}.feature4`),
  t(`${p.value}.feature5`),
])
</script>

<template>
  <UModal
    v-model:open="open"
    :title="t(`${p}.title`)"
    :description="t(`${p}.description`)"
    :ui="{
      content: 'card-mystical border border-violet-500/30',
      title: 'sr-only',
      description: 'sr-only',
    }"
  >
    <template #content>
      <div class="p-6 text-center">
        <!-- Icon -->
        <div
          class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          :class="isFree
            ? 'bg-linear-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30'
            : 'bg-linear-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30'"
        >
          <UIcon
            :name="isFree ? 'i-heroicons-gift' : 'i-heroicons-star'"
            class="size-8"
            :class="isFree ? 'text-emerald-400' : 'text-amber-400'"
          />
        </div>

        <!-- Title -->
        <h2 class="text-xl font-bold text-white mb-2">
          {{ t(`${p}.title`) }}
        </h2>
        <p class="text-sm text-violet-300/80 mb-6">
          {{ t(`${p}.description`) }}
        </p>

        <!-- Features list -->
        <div class="space-y-2.5 mb-6 text-left max-w-xs mx-auto">
          <div
            v-for="(feature, idx) in features"
            :key="idx"
            class="flex items-center gap-2.5"
          >
            <div class="w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0">
              <UIcon name="i-heroicons-check" class="size-3 text-violet-400" />
            </div>
            <span class="text-sm text-violet-100">{{ feature }}</span>
          </div>
        </div>

        <!-- Price / Free badge -->
        <div class="mb-6">
          <template v-if="isFree">
            <div class="inline-flex flex-col items-center gap-1">
              <span class="text-3xl font-bold text-emerald-400">{{ t('freeCredits.free') }}</span>
              <span class="text-xs text-emerald-400/70">{{ t('freeCredits.remaining', { n: freeCredits }) }}</span>
            </div>
          </template>
          <template v-else>
            <span class="text-3xl font-bold text-white glow-gold">{{ t(`${p}.price`) }}</span>
          </template>
        </div>

        <!-- Buttons -->
        <div class="space-y-3">
          <UButton
            size="xl"
            :color="isFree ? 'success' : 'primary'"
            variant="solid"
            block
            :loading="isPaying"
            :label="isFree ? t('freeCredits.cta') : t(`${p}.cta`)"
            :icon="isFree ? 'i-heroicons-gift' : 'i-heroicons-lock-open'"
            class="cursor-pointer shadow-lg"
            :class="isFree ? 'shadow-emerald-600/30' : 'shadow-violet-600/30'"
            @click="emit('pay')"
          />
          <UButton
            size="lg"
            color="neutral"
            variant="ghost"
            block
            :label="t(`${p}.cancel`)"
            class="cursor-pointer"
            @click="open = false"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>
