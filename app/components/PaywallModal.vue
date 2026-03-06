<script setup lang="ts">
const { t } = useI18n()

const open = defineModel<boolean>('open', { default: false })

const props = withDefaults(defineProps<{
  isPaying: boolean
  i18nPrefix?: string
}>(), {
  i18nPrefix: 'paywall',
})

const emit = defineEmits<{
  pay: []
}>()

const p = computed(() => props.i18nPrefix)

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
        <div class="w-16 h-16 rounded-full bg-linear-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
          <UIcon name="i-heroicons-star" class="size-8 text-amber-400" />
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

        <!-- Price -->
        <div class="mb-6">
          <span class="text-3xl font-bold text-white glow-gold">{{ t(`${p}.price`) }}</span>
        </div>

        <!-- Buttons -->
        <div class="space-y-3">
          <UButton
            size="xl"
            color="primary"
            variant="solid"
            block
            :loading="isPaying"
            :label="t(`${p}.cta`)"
            icon="i-heroicons-lock-open"
            class="cursor-pointer shadow-lg shadow-violet-600/30"
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
