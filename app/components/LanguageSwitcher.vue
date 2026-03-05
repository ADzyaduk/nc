<script setup lang="ts">
const { locale, setLocale } = useI18n()

const languages = [
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
] as const

async function switchLocale(code: string) {
  await setLocale(code)
  if (import.meta.client) {
    localStorage.setItem('natal-chart-locale', code)
  }
}
</script>

<template>
  <div class="flex gap-1">
    <UButton
      v-for="lang in languages"
      :key="lang.code"
      size="xs"
      :variant="locale === lang.code ? 'solid' : 'ghost'"
      :color="locale === lang.code ? 'primary' : 'neutral'"
      :label="lang.label"
      class="cursor-pointer min-w-[36px] text-xs"
      @click="switchLocale(lang.code)"
    />
  </div>
</template>
