<script lang="ts" setup>
	import { ref, reactive } from 'vue'
	import ValidatedField from '@/components/Customs/ValidateField.vue' // Custom component

	// Form data
	const formData = reactive({
		name: '',
		email: '',
	})

	// Form validity state
	const isFormValid = ref(false)

	// Validation rules
	const rules = {
		required: (value: string | number) => !!value || 'Ce champ est requis.',
		email: (value: string | number) =>
			typeof value === 'string' && /.+@.+\..+/.test(value) || 'Veuillez entrer un email valide.',
		minLength: (value: string | number) =>
			typeof value === 'string' && value.length >= 3 || 'Minimum 3 caractères requis.',
	}

	// Submit form
	const submitForm = () => {
		if (isFormValid.value) {
			console.log('Formulaire valide :', formData) // eslint-disable-line no-console
		}
		else {
			console.log('Formulaire invalide') // eslint-disable-line no-console
		}
	}
</script>

<template>
	<v-container>
		<v-form
			ref="form"
			v-model="isFormValid"
		>
			<!-- Custom fields -->
			<ValidatedField
				v-model="formData.name"
				:rules="[rules.required, rules.minLength]"
				label="Nom"
			/>
			<ValidatedField
				v-model="formData.email"
				:rules="[rules.required, rules.email]"
				label="Email"
			/>

			<!-- Submit button -->
			<v-btn
				:disabled="!isFormValid"
				@click="submitForm"
			>
				Soumettre
			</v-btn>
		</v-form>
	</v-container>
</template>
