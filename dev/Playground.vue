<script setup lang="ts">
	import { ref } from 'vue'
	import CustomSelect from '@/components/Customs/CustomSelect/CustomSelect.vue'

	const selectedValue = ref(undefined)

	const items = ref([
		{ text: 'Option 1', value: '1' },
		{ text: 'Option 2', value: '2' },
	])
</script>

<template>
	<main class="ma-12">
		SelectedValue: {{ selectedValue }}
		<div class="d-flex flex-wrap align-center">
			<custom-select
				v-model="selectedValue"
				:items="items"
				text-key="text"
				outlined
				required
			/>
		</div>
	</main>
</template>
