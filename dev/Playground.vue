<script setup lang="ts">
  import {onMounted, ref} from 'vue'
  import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
  const date = ref('2022-10-18')

  onMounted(() => {
    console.log(date.value)
  })
</script>

<template>
  <DatePicker
      v-model="date"
      placeholder="Sélectionner une date"
      format="DD/MM/YYYY"
      date-format-return="YYYY-MM-DD"
      label="Sélectionner une date"
  />
  {{ date }}
</template>