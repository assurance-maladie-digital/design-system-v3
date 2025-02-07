<script setup lang="ts">
	import { SyAlert } from '@/components'
	import { ref } from 'vue'

	const showAlert = ref(true)
</script>

<template>
	<SyAlert
		v-model="showAlert"
		type="success"
		variant="tonal"
		closable
		@click:close="console.log('close')"
	>
		<template #default>
			This is a success alert
		</template>
	</SyAlert>

	<VBtn
		v-if="!showAlert"
		color="primary"
		@click="showAlert = true"
	>
		Réinitialiser
	</VBtn>
</template>
