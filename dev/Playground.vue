<script setup lang="ts">
	import DatePicker from '@/components/DatePicker/ComplexDatePicker/ComplexDatePicker.vue'
	import { ref } from 'vue'

	const date = ref('')
	const date2 = ref('')

	const customRules = [
		{
			type: 'notBeforeToday',
			options: {
				message: 'La date ne peut pas être antérieure à aujourd\'hui',
			},
		},
	]
</script>

<template>
	<div class="pa-12 d-flex flex-row">
		<DatePicker
			v-model="date"
			placeholder="Date de début"
			format="DD/MM/YYYY"
			required
			class="mr-4"
			use-combined-mode
      hint="Format : DD/MM/AAAA"
      persistent-hint
			:custom-rules="customRules"
		/>
		<DatePicker
			v-model="date2"
			placeholder="Date de fin"
			format="DD/MM/YYYY"
			class="ml-4"
			use-combined-mode
      hint="Format : DD/MM/AAAA"
			:custom-rules="customRules"
		/>
	</div>
</template>
