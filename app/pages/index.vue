<script setup lang="ts">
const { t } = useI18n()

definePageMeta({
  layout: 'default',
})
</script>

<template>
  <div class="flex-1 flex flex-col items-center justify-center overflow-hidden py-2">
    <WelcomeHero />
  </div>
</template>
