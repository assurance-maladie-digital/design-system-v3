<script setup lang="ts">
	import { ref } from 'vue'
	import { SyTextField, NirField } from '@/components'
	const selectedValue = ref('')

	const rules = [
		(value: string) => !!value || 'Required.',
		(value: string) => value.length >= 3 || 'Min 3 characters',
	]

</script>

<template>
	<div class="ma-8">
		<h1 class="text-2xl font-bold mb-4">
			Playground
		</h1>
		<SyTextField
			v-model="selectedValue"
			use-vuetify-validation
			label="Test"
			:rules="rules"
		/>
	</div>
</template>
