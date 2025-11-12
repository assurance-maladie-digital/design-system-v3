<script lang='ts' setup>
	import { ref } from 'vue'

	import SyForm from '@/components/customs/SyForm/SyForm.vue'
	import NirField from '@/components/NirField/NirField.vue'

	const nir = ref()
	const nirField = ref()
	const form = ref()

	const submitForm = () => {
		console.log('Submitted NIR:', nir.value)
	}
	const resetForm = () => {
		form.value?.reset()
	}

	const onFormReset = () => {
		// Clear the external model
		nir.value = undefined

		nir.value?.numberValidation?.clearValidation?.()
		nir.value?.keyValidation?.clearValidation?.()
	}
</script>
<template>
	<SyForm
		ref="form"
		@submit="submitForm"
		@reset="onFormReset"
	>
		<NirField
			ref="nirField"
			v-model="nir"
			:display-key="false"
			required
			hide-details
		/>
		<VBtn @click="resetForm">
			Effacer
		</VBtn>
	</SyForm>
	{{ nir }}
</template>
