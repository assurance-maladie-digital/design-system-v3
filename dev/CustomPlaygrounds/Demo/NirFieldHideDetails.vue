<script setup lang="ts">
	import NirField from '@/components/NirField/NirField.vue'
	import { ref } from 'vue'

	const value = ref('')
</script>

<template>
	<NirField
		v-model="value"
		number-label="Numéro de sécurité sociale"
		key-label="Clé"
		:hide-details="true"
	/>

  <a href="https://github.com/assurance-maladie-digital/design-system-v3/issues/1175" target="_blank">
    Voir le ticket lié à cette démo
  </a>
</template>