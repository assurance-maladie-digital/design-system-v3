<script lang="ts" setup>
	import { ref } from 'vue'
	import MonthPicker from '@/components/MonthPicker/MonthPicker.vue'
	import type { RuleValidation } from '@/composables/validation/useValidation'

	const customValidation: RuleValidation[] = [
		{
			type: 'custom',
			options: {
				validate: (value: string) => {
					const [month, year] = value.split('/').map(Number)
					console.log('Validation du mois :', value, '=>', { month, year })
					if (
						!value
						|| !month
						|| !/^\d{2}\/\d{4}$/.test(value)
						|| month < 1
						|| month > 12
					) {
						return false
					}
					return true
				},
				message: 'Veuillez entrer une date au format MM/AAAA avec un mois valide. (ex : 05/2024)',
			},
		},
		{
			type: 'custom',
			options: {
				validate: (value: string) => {
					const [month, year] = value.split('/').map(Number)
					const currentDate = new Date()
					const currentYear = currentDate.getFullYear()
					const currentMonth = currentDate.getMonth() + 1
					if (year < currentYear || (year === currentYear && month < currentMonth)) {
						return false
					}
					return true
				},
				message: 'La date doit être supérieure ou égale à la date actuelle.',
			},
		},
	]

	const warningValidation: RuleValidation[] = [
		{
			type: 'custom',
			options: {
				validate: (value: string) => {
					const [month, year] = value.split('/').map(Number)
					const currentDate = new Date()
					const currentYear = currentDate.getFullYear()
					const currentMonth = currentDate.getMonth() + 1
					if (year > currentYear + 5 || (year === currentYear + 5 && month > currentMonth)) {
						return false
					}
					return true
				},
				warningMessage: 'La date est plus de 5 ans dans le futur.',
			},
		},
	]

	const month = ref<string | undefined>(undefined)
</script>

<template>
	<div class="playground ma-8">
		<MonthPicker
			:model-value="month"
			label="Début"
			:custom-rules="customValidation"
			:custom-warning-rules="warningValidation"
		/>
	</div>
</template>
