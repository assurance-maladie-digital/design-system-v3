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
</template>
