<script lang='ts' setup>
	import { ref } from 'vue'
	import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'
	const selectValues = ref([])
	const values = [
		{ text: 'Option 1', value: '1' },
		{ text: 'Option 2', value: '2' },
		{ text: 'Option 3', value: '3' },
		{ text: 'Option 4', value: '4' },
	]
</script>

<template>
	<div
		class="pa-4"
		style="width: 50%"
	>
		<SySelect
			v-model="selectValues"
			:items="values"
			label="Sélectionner une valeur"
			clearable
			multiple
			chips
		/>
	</div>
</template>
