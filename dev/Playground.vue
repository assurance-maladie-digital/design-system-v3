<script setup lang="ts">
	import { ref, onMounted } from 'vue'
	import PhoneField from '@/components/PhoneField/PhoneField.vue'

	// Modèle pour le numéro de téléphone
	const phone = ref('')

	// Modèle pour l'indicatif
	const indicatifs = [
		{ code: '+3034', country: 'Exemple', abbreviation: 'EX', phoneLength: 10 },
		{ code: '+32', country: 'Belgique', abbreviation: 'BE', phoneLength: 10 },
		{ code: '+41', country: 'Suisse', abbreviation: 'CH', phoneLength: 10 },
	]
	const defaultDialCode = indicatifs[0] // France
    // const defaultDialCode = indicatifs.find(ind => ind.country.toLowerCase().includes('exemple'))


	// Utiliser dialCodeModel (la prop attendue par PhoneField)
	const dialCodeModel = ref(defaultDialCode)

	// Référence au composant PhoneField
	const phoneFieldRef = ref(null)

	// Forcer la mise à jour de l'indicatif après le montage
	onMounted(() => {
		// Accès direct à la variable interne dialCode du PhoneField
		if (phoneFieldRef.value) {
			phoneFieldRef.value.dialCode = defaultDialCode
		}
	})
</script>

<template>
	<div style="max-width: 340px;">
		<h3>Playground PhoneField avec indicatif pré-rempli</h3>
		<PhoneField
			v-model="phone"
			:with-country-code="true"
			:dial-code-model="dialCodeModel"
			:custom-indicatifs="indicatifs"
		/>
		<div style="margin-top: 8px; font-size: 0.9em;">
			<strong>Numéro saisi :</strong> {{ phone }}<br>
			<strong>Indicatif sélectionné :</strong> {{ dialCodeModel }}
		</div>
	</div>
</template>
