<script setup lang="ts">
	import { ref } from 'vue'
	import { useValidatable } from '@/composables/validatable/useValidatable'

	// Références des données
	const inputValue = ref('')

	// Définition des règles de validation
	const rules = [
		(v: string) => !!v || 'Field is required',
		(v: string) => /.+@.+\..+/.test(v) || 'Must be a valid email',
	]

	// Messages de succès personnalisés
	const successHint = 'Looks good!'

	// Utilisation du composable pour gérer la validation
	const {
		errorBucket,
		hasError,
		hasSuccess,
		validate,
		isFocused,
	} = useValidatable({
		value: inputValue.value,
		rules: rules,
		errorMessages: [],
		successMessages: [],
		validateOnBlur: true,
	})

	// Gérer les événements
	const onFocus = () => (isFocused.value = true)
	const onBlur = () => {
		isFocused.value = false
		validate()
	}
</script>

<template>
	<v-container>
		<v-text-field
			v-model="inputValue"
			label="Enter your email"
			:error="hasError"
			:error-messages="errorBucket"
			:success="hasSuccess"
			:hint="successHint"
			persistent-hint
			@focus="onFocus"
			@blur="onBlur"
		/>
	</v-container>
</template>
