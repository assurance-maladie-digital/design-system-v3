<script setup lang="ts">
	import { ref } from 'vue'
	import DatePicker from '@/components/DatePicker/ComplexDatePicker/ComplexDatePicker.vue'
	import CalendarDatePicker from '@/components/DatePicker/CalendarDatePicker/CalendarDatePicker.vue'

	const dateRange = ref<[string, string] | null>(null)
	const dateRange2 = ref<[string, string] | null>(null)
</script>

<template>
	<DatePicker
		v-model="dateRange"
		placeholder="Sélectionner une période (combined)"
		format="DD/MM/YYYY"
		display-range
		use-combined-mode
	/>
  {{ dateRange }}
	<DatePicker
		v-model="dateRange2"
		placeholder="Sélectionner une période (calendar)"
		format="DD/MM/YYYY"
		display-range
	/>
  {{ dateRange2 }}
</template>
