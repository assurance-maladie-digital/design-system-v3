<script setup lang="ts">

import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
import {ref} from "vue";

const date = ref(null)
</script>

<template>
  <DatePicker
      v-model="date"
      placeholder="Sélectionner une date"
      format="DD/MM/YYYY"
  />
</template>