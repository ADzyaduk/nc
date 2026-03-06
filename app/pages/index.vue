<script setup lang="ts">
const { t } = useI18n()

definePageMeta({
  layout: 'default',
})
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[min(80vh,80dvh)] py-6">
    <WelcomeHero />
  </div>
</template>
