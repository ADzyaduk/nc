<script setup lang="ts">
const { t } = useI18n()
const router = useRouter()

function goBack() {
  router.push('/')
}
</script>

<template>
  <div class="mb-3">
    <UButton
      color="neutral"
      variant="ghost"
      size="sm"
      icon="i-heroicons-arrow-left"
      :label="t('nav.back')"
      class="cursor-pointer text-violet-400 hover:text-violet-300"
      @click="goBack"
    />
  </div>
</template>
