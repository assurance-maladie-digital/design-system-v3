<script setup lang="ts">
	import { ref } from 'vue'
	import { useFormErrors } from '@/composables/useFormErrors'

	const formData = ref({
		email: '',
		password: '',
	})

	const { errors, validateField, resetErrors, required, minLength } = useFormErrors()

	// Custom rules for email
	const emailRules = [
		required,
		{
			message: 'Format d\'email invalide.',
			validate: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
		},
	]

	// Custom rules for password
	const passwordRules = [
		required,
		minLength(6),
		{
			message: 'Le mot de passe doit contenir au moins une lettre majuscule.',
			validate: (value: string) => /[A-Z]/.test(value),
		},
	]

	const validateEmail = (value: string) => {
		validateField('email', value, emailRules)
	}

	const validatePassword = (value: string) => {
		validateField('password', value, passwordRules)
	}

	const handleEmail = (value: string) => {
		resetErrors()
		validateEmail(value)
	}

	const handlePassword = (value: string) => {
		resetErrors()
		validatePassword(value)
	}

	const handleSubmit = () => {
		resetErrors()

		// Validate all fields
		validateEmail(formData.value.email)
		validatePassword(formData.value.password)

		// Check for errors
		if (Object.keys(errors.value).length === 0) {
			// Form is valid
			console.log('Form submitted:', formData.value)
		}
	}

	const resetForm = () => {
		formData.value = {
			email: '',
			password: '',
		}
		resetErrors()
	}
</script>

<template>
	<v-form @submit.prevent="handleSubmit">
		<v-text-field
			v-model="formData.email"
			label="Email"
			:error-messages="errors.email"
			@input="handleEmail(formData.email)"
			@blur="handleEmail(formData.email)"
		/>
		<v-text-field
			v-model="formData.password"
			label="Password"
			type="password"
			:error-messages="errors.password"
			@input="handlePassword(formData.password)"
			@blur="handlePassword(formData.password)"
		/>
		<v-btn type="submit">
			Submit
		</v-btn>
		<v-btn @click="resetForm">
			Reset Form
		</v-btn>
	</v-form>
</template>
