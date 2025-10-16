<script lang="ts" setup>
	import { ref } from 'vue'
	import SearchListField from '@/components/SearchListField/SearchListField.vue'

	const items = ref([
		{ label: 'Item 1', value: 'item1' },
		{ label: 'Item 2', value: 'item2' },
		{ label: 'Item 3', value: 'item3' },
		{ label: 'Item 4', value: 'item4' },
		{ label: 'Item 5', value: 'item5' },
	])

	const selectedItems = ref([])

</script>

<template>
	<div class="playground">
		<h1>SearchListField Component Playground</h1>
		<SearchListField
            label="Select Items"
			v-model="selectedItems"
			:items="items"
            tag-title="h5"
			:return-object="true"
			placeholder="Search items..."
		/>
		<div class="selected-items">
			<h2>Selected Items:</h2>
			<ul>
				<li
					v-for="item in selectedItems"
					:key="item.value"
				>
					{{ item.label }} ({{ item.value }})
				</li>
			</ul>
		</div>
	</div>
</template>
