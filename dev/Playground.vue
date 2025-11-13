<script lang='ts' setup>
	import { ref } from 'vue'

	import SyForm from '@/components/Customs/SyForm/SyForm.vue'
	import NirField from '@/components/NirField/NirField.vue'
	import DatePicker from '@/components/DatePicker/ComplexDatePicker/ComplexDatePicker.vue'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import PhoneField from '@/components/PhoneField/PhoneField.vue'

	const nir = ref()
	const date = ref()
	const textField = ref()
	const phone = ref()
	const form = ref()

	const submitForm = () => {
		console.warn('Submitted NIR:', nir.value)
	}

	function clearAll() {
		form.value?.reset() // content
		form.value?.clearValidation() // messages
	}
</script>
<template>
	<SyForm
		ref="form"
		@submit="submitForm"
	>
		<NirField
			v-model="nir"
			:display-key="false"
			required
		/>
		<br>
		<DatePicker
			v-model="date"
			placeholder="Sélectionner une date"
			use-combined-mode
			format="DD/MM/YYYY"
			required
		/>
		<br>
		<SyTextField
			v-model="textField"
			label="SyTextField"
			required
		/>
		<br>
		<PhoneField
			v-model="phone"
			label="Numéro de téléphone"
			with-country-code
			country-code-required
			is-validated-on-blur
			required
		/>
		<br>
		<VBtn @click="clearAll">
			Effacer
		</VBtn>
	</SyForm>
</template>
