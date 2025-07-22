<script lang="ts" setup>
	import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'
	import { ref } from 'vue'

	const options = [
		{ label: 'Option 1', value: 'option1' },
		{ label: 'Option 2', value: 'option2' },
		{ label: 'Option 3', value: 'option3' },
		{ label: 'Option 4', value: 'option4' },
		{ label: 'Option 5', value: 'option5' },
	]
	const selected = ref<string | string[]>([])
	const label = 'Select an option'
	const placeholder = 'Choose an option'
	const multiple = false
	const clearable = true
</script>

<template>
	<div class="d-flex flex-row flex-grow-1 ga-4">
		<SySelect
			v-model="selected"
			:options="options"
			:label="label"
			:placeholder="placeholder"
			:multiple="multiple"
			:clearable="clearable"
			class="flex-1"
		/>
		<SySelect
			v-model="selected"
			:options="options"
			:label="label"
			:placeholder="placeholder"
			:multiple="multiple"
			:clearable="clearable"
			class="flex-1"
		/>
		<SySelect
			v-model="selected"
			:options="options"
			:label="label"
			:placeholder="placeholder"
			:multiple="multiple"
			:clearable="clearable"
			class="flex-1"
		/>
	</div>
</template>
