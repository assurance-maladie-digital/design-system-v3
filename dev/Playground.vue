<script setup lang='ts'>
	import PhoneField from '@/components/PhoneField/PhoneField.vue'
	import { ref } from 'vue'

	const value = ref('')
	const handleChange = (newValue) => {
		console.log('Value changed:', newValue)
	}
	const customIndicatifs = ref([
		{ code: '+99', country: 'Utopia', abbreviation: 'UT', mask: '## ## ## ##', phoneLength: 8 },
		{ code: '+98', country: 'Paradise', abbreviation: 'PA', mask: '## ## ## ##', phoneLength: 18 },
	])
</script>

<template>
	<main class="ma-12">
		<h3>Custom country code only (Affichage indicatif + abbreviation)</h3>
		<PhoneField
			v-model="value"
			required
			with-country-code
			country-code-required
			display-format="code-abbreviation"
			:custom-indicatifs="customIndicatifs"
			:use-custom-indicatifs-only="true"
			outlined-indicatif
			@change="handleChange"
		/>
		<h3>All indicatifs (Affichage nom du pays)</h3>
		<PhoneField
			v-model="value"
			required
			with-country-code
			country-code-required
			display-format="country"
			outlined-indicatif
			@change="handleChange"
		/>
		<h3>All + Customs indicatifs (Affichage indicatif + nom du pays)</h3>
		<PhoneField
			v-model="value"
			required
			with-country-code
			country-code-required
			display-format="code-country"
			:custom-indicatifs="customIndicatifs"
			outlined-indicatif
			@change="handleChange"
		/>
	</main>
</template>
