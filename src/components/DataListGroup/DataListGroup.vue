<script lang="ts" setup>
	import type { PropType } from 'vue'
	import type { DataListIcons } from '../DataList/types'
	import type { DataListGroupItems, DataListActionEvent } from './types'
	import DataList from '../DataList/DataList.vue'

	const props = defineProps({
		items: {
			type: Array as PropType<DataListGroupItems>,
			required: true,
		},
		icons: {
			type: Object as PropType<DataListIcons | undefined>,
			default: undefined,
		},
		itemWidth: {
			type: String,
			default: '200px',
		},
		titlesTag: {
			type: String,
			default: 'h4',
		},
		loading: {
			type: Boolean,
			default: false,
		},
		renderHtmlValue: {
			type: Boolean,
			default: false,
		},
	})

	const emit = defineEmits(['click:list-item'])

	const emitItemAction = (dataListIndex: number, itemIndex: number): void => {
		const eventValue: DataListActionEvent = {
			dataListIndex,
			itemIndex,
		}

		emit('click:list-item', eventValue)
	}
</script>

<template>
	<ul class="sy-data-list-group d-flex flex-wrap max-width-none ma-n4">
		<li
			v-for="(dataList, index) in props.items"
			:key="`sy-data-list-${index}`"
			class="sy-data-list-group-item"
		>
			<DataList
				:loading="props.loading"
				:render-html-value="props.renderHtmlValue"
				:list-title="dataList.title"
				:items="dataList.items"
				:items-number-loading="dataList.itemsNumberLoading"
				:heading-loading="dataList.headingLoading"
				:title-tag="props.titlesTag"
				:width="props.itemWidth"
				:icons="props.icons"
				class="ma-4"
				@click:item-action="emitItemAction(index, $event)"
			/>
		</li>
	</ul>
</template>

<style lang="scss" scoped>
	.sy-data-list-group {
		list-style: none;
		padding: 0;
		margin: 0;
	}
</style>
