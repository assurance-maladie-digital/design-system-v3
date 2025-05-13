<script setup>
	import DiacriticPicker from '@/components/DiacriticPicker/DiacriticPicker.vue'
	import { ref } from 'vue'

	const nom = ref('')
	const adresse = ref('')
</script>

<template>
	<div class="pa-4">
		<DiacriticPicker v-model="nom">
			<v-text-field
				id="diacritique-input"
				v-model="nom"
				label="Nom avec accents"
				color="primary"
				variant="outlined"
			/>
		</DiacriticPicker>
		{{ nom }}

		<br><br>

		<DiacriticPicker v-model="adresse">
			<v-textarea
				id="diacritique-input"
				v-model="adresse"
				label="Adresse"
				color="primary"
				variant="outlined"
				auto-grow
			/>
		</DiacriticPicker>
		{{ adresse }}
	</div>
</template>
