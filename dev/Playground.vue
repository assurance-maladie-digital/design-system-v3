<script lang="ts" setup>
	import { ref } from 'vue'
	import DatePicker from '@/components/DatePicker/DatePicker.vue'

	const modelValue = ref(['01/01/2025', '24/01/2025'])
	const modelValue2 = ref(['12/01/2025', '31/01/2025'])
	const modelValue3 = ref('24/01/2025')
	const modelValue4 = ref('18/01/2025')
	const modelValue5 = ref('23/01/2025')
	const modelValue6 = ref('23/01/2025')
	const dp = ref()
	const dp2 = ref()
	const dp3 = ref()
	const dp4 = ref()
	const dp5 = ref()
	const dp6 = ref()

	const handleSubmit = () => {
		const references = [dp, dp2, dp3, dp4, dp5, dp6]
		let allValid = true

		references.forEach((ref) => {
			const isValid = ref.value?.validateOnSubmit()
			if (!isValid) {
				allValid = false
			}
		})

		if (!allValid) {
			alert('Corrigez les erreurs avant de soumettre !')
		}
		else {
			alert('Formulaire soumis avec succès !')
		}
	}

	// Règles pour les dates avec erreurs
	const errorRules = [
		{
			type: 'notBeforeToday',
			options: {
				message: 'La date ne doit pas être avant aujourd\'hui.',
				successMessage: 'La date est après aujourd\'hui.',
			},
		},
		{
			type: 'notWeekend',
			options: {
				message: 'La date ne doit pas être un weekend.',
				successMessage: 'Le NIR a une longueur valide.',
			},
		},
	]

	// Règles pour les dates avec warnings
	const warningRules = [
		{
			type: 'notWeekend',
			options: {
				warningMessage: 'Attention : la date sélectionnée est un weekend.',
				successMessage: 'La date n\'est pas un weekend.',
				isWarning: true,
			},
		},
	]

	const warningRulesNotBeforeDate = [
		{
			type: 'notBeforeDate',
			options: {
				warningMessage: 'Attention : la date sélectionnée ne doit pas etre apres le 22/01/2025.',
				successMessage: 'la date sélectionnée est apres le 22/01/2025.',
				date: '22/01/2025',
				isWarning: true,
			},
		},
	]
</script>

<template>
	<main class="px-5 py-2">
		Erreur NotBeforeToday:
		{{ modelValue }}
		<DatePicker
			ref="dp2"
			v-model="modelValue"
			:custom-rules="errorRules"
			:display-append-icon="true"
			:display-icon="true"
			:is-birth-date="false"
			date-format-return="YYYY/MM"
			display-range
			format="DD/MM/YYYY"
			no-calendar
			placeholder="Sélectionner une date"
			required
		/>
		Warning NotWeekend:
		{{ modelValue2 }}
		<DatePicker
			ref="dp"
			v-model="modelValue2"
			:custom-rules="warningRules"
			:display-icon="true"
			:is-birth-date="false"
			:show-week-number="false"
			date-format-return="YYYY/MM/DD"
			display-range
			format="DD/MM/YYYY"
			placeholder="Sélectionner une date"
			required
		/>
		Erreur NotBeforeToday:
		{{ modelValue3 }}
		<DatePicker
			ref="dp3"
			v-model="modelValue3"
			:custom-rules="errorRules"
			:display-append-icon="true"
			:display-icon="true"
			:is-birth-date="false"
			:show-week-number="false"
			date-format-return="YYYY/MM/DD"
			format="DD/MM/YYYY"
			placeholder="Sélectionner une date"
			required
		/>
		Warning NotWeekend:
		{{ modelValue4 }}
		<DatePicker
			ref="dp4"
			v-model="modelValue4"
			:custom-rules="warningRules"
			:display-append-icon="true"
			:display-icon="true"
			:is-birth-date="false"
			:show-week-number="false"
			format="DD/MM/YYYY"
			placeholder="Sélectionner une date"
			required
		/>

		<DatePicker
			ref="dp5"
			v-model="modelValue5"
			:custom-rules="errorRules"
			:display-append-icon="true"
			:display-icon="true"
			:is-birth-date="false"
			date-format-return="YY/MM/DD"
			format="DD/MM/YYYY"
			no-calendar
			placeholder="Sélectionner une date"
			required
		/>

		NotBeforeDate : 22/01/2025 Warning

		<DatePicker
			ref="dp6"
			v-model="modelValue6"
			:custom-rules="warningRulesNotBeforeDate"
			:display-append-icon="true"
			:display-icon="true"
			:is-birth-date="false"
			:show-week-number="false"
			format="DD/MM/YYYY"
			placeholder="Sélectionner une date"
			required
		/>
		<button @click="handleSubmit">
			Submit
		</button>
	</main>
</template>
