<script setup lang="ts">
	import PhoneField from '@/components/PhoneField/PhoneField.vue'
	import SyForm from '@/components/Customs/SyForm/SyForm.vue'
	import { ref } from 'vue'
	import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'

	const modelValue = ref('')
	const dialCode = ref<string | { code: string }>('+44')
	const required = ref(true)
	const withCountryCode = ref(true)
	const countryCodeRequired = ref(true)
	const displayFormat = ref('')
	const customIndicatifs = ref([])
	const useCustomIndicatifsOnly = ref(false)
	const isValidatedOnBlur = ref(true)

	function onSubmit(e: { isValid: boolean }) {
		window.alert(e.isValid ? 'Formulaire valide' : 'Formulaire invalide')
	}
</script>
<template>
	<SyForm
		class="ma-5"
		@submit="onSubmit"
	>
		<SySelect
			v-model="displayFormat"
			:items="[
				{ text: 'Code', value: 'code' },
				{ text: 'Code-abbreviation', value: 'code-abbreviation' },
				{ text: 'code-country', value: 'code-country' },
				{ text: 'country', value: 'country' },
				{ text: 'abbreviation', value: 'abbreviation' },
				{ text: 'None', value: '' },
			]"
			label="Display format"
			:outlined="true"
			:clearable="true"
		/>
		<PhoneField
			v-model="modelValue"
			v-model:dial-code-model="dialCode"
			:required="required"
			:with-country-code="withCountryCode"
			:country-code-required="countryCodeRequired"
			:display-format="displayFormat"
			:custom-indicatifs="customIndicatifs"
			:use-custom-indicatifs-only="useCustomIndicatifsOnly"
			:is-validated-on-blur="isValidatedOnBlur"
		/>
		<VBtn
			class="mt-2"
			type="submit"
			color="primary"
		>
			submit
		</VBtn>
	</SyForm>
	<div
		class="ma-5"
	>
		{{ modelValue }}<br>
		{{ dialCode }}
	</div>
</template>
