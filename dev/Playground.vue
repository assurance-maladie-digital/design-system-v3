<script setup lang="ts">
	import NirField from '@/components/NirField/NirField.vue'
	import { ref } from 'vue'

	const value = ref('')
</script>

<template>
	<NirField
		v-model="value"
		number-label="Matricule"
		key-label="Clé"
		:display-key="true"
		:custom-rules-precedence="true"
    :custom-locale="{ erreurInvalidNumber:  'Le matricule est invalide.', erreurInvalidKey: 'La clé est invalide.' }"
		:custom-number-rules="[
			{ type: 'required', options: { message: 'Le champ matricule est requis.', successMessage: 'Le matricule est valide.' } },
		]"
		:custom-key-rules="[
			{ type: 'required', options: { message: 'La clé est requise.', successMessage: 'La clé est valide.' } }
		]"
	/>

	<br>

	<NirField
		v-model="value"
		number-label="Matricule"
		key-label="Clé"
		:display-key="false"
		:custom-rules-precedence="true"
    :custom-locale="{ erreurInvalidNumber:  'Le matricule est invalide.', erreurInvalidKey: 'La clé est invalide.' }"
		:custom-number-rules="[{ type: 'required', options: { message: 'Le champ matricule est requis.', successMessage: 'Le matricule est valide.' } }]"
	/>
</template>
