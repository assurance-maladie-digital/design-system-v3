<script lang="ts" setup>
	import PhoneField from '@/components/PhoneField/PhoneField.vue'
	import { ref } from 'vue'

	const value = ref('0987654321')
	const selectedDialCode = ref('')

	const handleChange = (newValue) => {
		console.log('Value changed:', newValue)
	}
	const customIndicatifs = ref([
		{ code: '+99', country: 'Utopia', abbreviation: 'UT', mask: '## ## ## ##', phoneLength: 8 },
		{ code: '+98', country: 'Paradise', abbreviation: 'PA', mask: '### #### ## ## ## ## ### ###', phoneLength: 18 },
	])
</script>

<template>
	<main class="ma-12">
		{{ value }}
		{{ selectedDialCode }}
		<h3>Custom country code only (Affichage indicatif + abbreviation)</h3>
		<PhoneField
			v-model="value"
			v-model:selected-dial-code="selectedDialCode"
			:custom-indicatifs="customIndicatifs"
			:use-custom-indicatifs-only="true"
			country-code-required
			display-format="code-abbreviation"
			outlined-indicatif
			required
			with-country-code
			@change="handleChange"
		/>
	</main>
</template>
