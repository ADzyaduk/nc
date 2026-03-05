<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'

const { t, locale } = useI18n()

useHead({
  title: t('app.title'),
  htmlAttrs: {
    class: 'dark',
    lang: locale.value,
  },
})
</script>

<template>
  <UApp :locale="locales[locale as keyof typeof locales]">
    <div class="gradient-mystical min-h-screen">
      <NuxtLayout>
        <NuxtPage :transition="{ name: 'page', mode: 'out-in' }" />
      </NuxtLayout>
    </div>
  </UApp>
</template>
