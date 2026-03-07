<script setup lang="ts">
const { t } = useI18n()

definePageMeta({
  layout: 'default',
})
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full py-2 overflow-hidden">
    <WelcomeHero />
  </div>
</template>
