<script setup lang="ts">
const { t } = useI18n()

definePageMeta({
  layout: 'default',
})
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
    <WelcomeHero />
  </div>
</template>
