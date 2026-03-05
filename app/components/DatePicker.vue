<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'

const props = defineProps<{
  modelValue?: CalendarDate
  placeholder?: string
  icon?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: CalendarDate | undefined]
}>()

const inputDate = useTemplateRef('inputDate')

const internalValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<template>
  <UInputDate 
    ref="inputDate" 
    v-model="internalValue" 
    size="lg"
    class="w-full"
  >
    <template #trailing>
      <UPopover>
        <UButton
          color="neutral"
          variant="link"
          size="sm"
          :icon="icon || 'i-lucide-calendar'"
          aria-label="Select a date"
          class="px-0"
        />

        <template #content>
          <div class="p-2 sm:p-4 bg-gray-900 border border-white/10 rounded-xl shadow-xl">
            <UCalendar v-model="internalValue" />
          </div>
        </template>
      </UPopover>
    </template>
  </UInputDate>
</template>
