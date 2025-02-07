<script lang="ts" setup>
	import { ref } from 'vue'
	import PeriodField from '@/components/PeriodField/PeriodField.vue'

	const selectedPeriod = ref({ from: null, to: null })
	const ref1 = ref()
	const handleSubmit = () => {
		// Mettre les références dans l'ordre d'apparition dans le template
		const references = [ref1]
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
</script>

<template>
	<div class="mt-4">
		<PeriodField
			ref="ref1"
			v-model="selectedPeriod"
		/>
		<p>Selected Period: {{ selectedPeriod }}</p>
	</div>
	<button
		class="mt-4"
		@click="handleSubmit"
	>
		Submit
	</button>
</template>
