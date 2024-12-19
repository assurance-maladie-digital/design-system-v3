<script lang="ts" setup>
	import Nirfield from '@/components/NirField/NirField.vue'
	import { ref } from 'vue'

	const model = ref('2940375120005')
	const nirFieldRef = ref() // Référence Vue pour accéder au composant enfant

	const handleSubmit = () => {
		// Appeler la méthode exposée `validateOnSubmit` via la référence
		const isValid = nirFieldRef.value?.validateOnSubmit()
		if (!isValid) {
			alert('Corrigez les erreurs avant de soumettre !')
		}
		else {
			alert('Formulaire soumis avec succès !')
		}
	}

	// Exemple de règles personnalisées
	const customNumberRules = [
		{
			type: 'minLength',
			options: {
				length: 10, message: 'Le NIR doit avoir au moins 10 caractères.', successMessage: 'Le NIR a une longueur valide.',
			},
		},
	]
</script>

<template>
	<main>
		<nav class="d-flex flex-column mx-4 my-4">
			<span>Nir Valide: 2 94 03 75 120 005 clef: 91</span>
			<span>Nir Valide Reunion: 1 75 06 97 411 585 clef:43</span>
			<span>Nir Invalide: 1854345012345 56</span>
		</nav>
		<form
			class="mx-16 my-6"
			@submit.prevent="handleSubmit"
		>
			{{ model }}
			<Nirfield
				ref="nirFieldRef"
				v-model="model"
				:display-key="true"
				outlined
				required
			/>
			<button type="submit">
				Soumettre
			</button>
		</form>
	</main>
</template>
