<script setup>
	import DiacritiquePicker from '@/components/DiacriticPicker/DiacriticPicker.vue'
	import { ref } from 'vue'

	const nom = ref('')
	const adresse = ref('')
</script>

<template>
	<div class="pa-4">
		<DiacritiquePicker>
			<v-text-field
				id="diacritique-input"
				v-model="nom"
				label="Nom avec accents"
				color="primary"
				variant="outlined"
			/>
		</DiacritiquePicker>
    {{ nom }}

    <br/><br/>

		<DiacritiquePicker>
			<v-textarea
				id="diacritique-input"
				v-model="adresse"
				label="Adresse"
				color="primary"
				variant="outlined"
				auto-grow
			/>
		</DiacritiquePicker>
    {{ adresse }}
	</div>
</template>
