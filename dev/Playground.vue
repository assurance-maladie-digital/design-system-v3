<script setup lang="ts">
	import NirField from '@/components/NirField/NirField.vue'
	import { ref } from 'vue'

	const value = ref('')
</script>

<template>
	<NirField
		v-model="value"
		:required="false"
		number-label="Numéro de sécurité sociale"
		key-label="Clé"
    persistent-hint
		:display-key="true"
	/>

  <NirField
      v-model="value"
      :required="false"
      number-label="Numéro de sécurité sociale"
      key-label="Clé"
      hint="Exemple : 123 45 678 901 234"
      persistent-hint
      :display-key="false"
  />
</template>
