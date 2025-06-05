<script setup lang="ts">
	import { ref } from 'vue'
	import SyTable from '../src/components/Tables/SyTable/SyTable.vue'

	const headers = [
		{ text: 'Column 1', value: 'col1' },
		{ text: 'Column 2', value: 'col2' },
	]

	const items = [
		{ name: 'col1', label: 'Column 1' },
		{ name: 'col2', label: 'Column 2' },
	]

</script>

<template>
	<div>
		<SyTable
			:headers
			:items
			:resizable-columns="true"
			:suffix="'.playground'"
		/>
	</div>
</template>

<style lang="scss" scoped></style>
