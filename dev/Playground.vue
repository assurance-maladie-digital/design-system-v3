<script setup lang="ts">
	import { ref } from 'vue'
	import SearchListField from '@/components/SearchListField/SearchListField.vue'

	import type { SearchListItem } from '@/components/SearchListField/types'

	const items: SearchListItem[] = [
		{
			label: 'Chirurgien-dentiste',
			value: 'chirurgien-dentiste',
		},
		{
			label: 'Infirmier',
			value: 'infirmier',
		},
		{
			label: 'Orthophoniste',
			value: 'orthophoniste',
		},
		{
			label: 'Orthoptiste',
			value: 'orthoptiste',
		},
		{
			label: 'Pédicure-podologue',
			value: 'pedicure-podologue',
		},
		{
			label: 'Pharmacien',
			value: 'pharmacien',
		},
	]

	const value = ref<string | null>(null)

	const selectChoice = (choice: string) => {
		value.value = choice
	}
</script>

<template>
	<main>
		<SearchListField
			:items="items"
			@update:model-value="($event) => selectChoice($event)"
		/>
		<br>
		<pre>Selected: {{ value }}</pre>
	</main>
</template>
