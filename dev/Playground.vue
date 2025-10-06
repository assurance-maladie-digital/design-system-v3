<script setup>
import { ref, computed } from 'vue'
    import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'

	const dateA = ref(null)
	const dateB = ref(null)

	const dateBRules = computed(() => {
		return [
			{ type: 'notAfterToday' },
			{
				type: 'notBeforeDate',
				options: {
					date: dateA.value,
					message: `La date ne peut pas être antérieure au ${dateA.value}`,
				},
			},
		]
	})
  </script>

<template>
	<DatePicker
		v-model="dateA"
		label="Date A"
		use-combined-mode
		display-append-icon
		outlined
		required
		date-format-return="DD/MM/YYYY"
		:show-success-messages="false"
	/>
	<DatePicker
		v-model="dateB"
		label="Date B"
		use-combined-mode
		display-append-icon
		outlined
		date-format-return="DD/MM/YYYY"
		:custom-rules="dateBRules"
		:show-success-messages="false"
	/>
</template>
