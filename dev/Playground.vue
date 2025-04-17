<script setup lang="ts">
	import { ref } from 'vue'
	import PhoneField from '@/components/PhoneField/PhoneField.vue'
	import { indicatifs } from '@/components/PhoneField/indicatifs'

	// Modèle pour le numéro de téléphone
	const phone = ref('')

	// Recherche de l'indicatif France dans les indicatifs standards
	const franceIndicatif = indicatifs.find(ind => ind.country === 'France')

	// Pré-remplissage avec l'indicatif France
	const dialCodeModel = ref(franceIndicatif)

	// Référence au composant PhoneField pour débuggage si nécessaire
	const phoneFieldRef = ref(null)
</script>

<template>
	<div style="max-width: 340px;">
		<h3>PhoneField avec indicatif standard pré-rempli</h3>
		<p>Cette démo montre comment pré-remplir l'indicatif téléphonique avec les indicatifs standards.</p>

		<PhoneField
			ref="phoneFieldRef"
			v-model="phone"
			:dial-code-model="dialCodeModel"
			:with-country-code="true"
			:country-code-required="true"
			display-format="code-country"
		/>

		<div style="margin-top: 16px; font-size: 0.9em;">
			<strong>Numéro saisi :</strong> {{ phone }}<br>
			<strong>Indicatif sélectionné :</strong>
			<pre>{{ dialCodeModel }}</pre>
		</div>
	</div>
</template>
