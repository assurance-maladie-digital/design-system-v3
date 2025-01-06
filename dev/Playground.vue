<script lang="ts" setup>
	import { ref } from 'vue'
	import PasswordField from '@/components/PasswordField/PasswordField.vue'

	const password = ref<string | null>(null)
	const passwordFieldRef = ref()

	const customRule = [
		{
			type: 'minLength',
			options: {
				length: 10,
				message: 'Le mot de passe doit contenir au moins 10 caractères.',
				successMessage: 'Le mot de passe a une longueur valide.',
			},
		},
	]
	const handleSubmit = () => {
		// Appeler la méthode exposée `validateOnSubmit` via la référence
		const isValid = passwordFieldRef.value?.validateOnSubmit()
		if (!isValid) {
			alert('Corrigez les erreurs avant de soumettre !')
		}
		else {
			alert('Formulaire soumis avec succès !')
		}
	}
</script>

<template>
	<main>
		<v-form
			class="mx-16 my-6"
			@submit.prevent="handleSubmit"
		>
			<PasswordField
				ref="passwordFieldRef"
				v-model="password"
				:custom-rules="customRule"
				is-validate-on-blur
				outlined
				required
			/>
			<button type="submit">
				Soumettre
			</button>
		</v-form>
	</main>
</template>

<style scoped>
/* Add any styles you need for the playground here */
</style>
