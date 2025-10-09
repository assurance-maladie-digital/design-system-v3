<script lang="ts" setup>
	import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
	import { ref, computed } from 'vue'
	const dateA = ref()
	const dateB = ref()
	const dateBRules = computed(() => {
		return [
			{ type: 'notAfterToday',
				options: {
					message: 'toto',

				},
			},
			{
				type: 'notBeforeDate',
				options: {
					date: dateA.value,
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
		:show-success-messages="false"
	/>
	<DatePicker
		v-model="dateB"
		label="Date B"
		use-combined-mode
		display-append-icon
		outlined
		:custom-rules="dateBRules"
		:show-success-messages="false"
	/>
</template>
