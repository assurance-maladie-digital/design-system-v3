<script lang="ts" setup>
	import { defineProps } from 'vue'
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
	<div class="vd-data-list-group d-flex flex-wrap max-width-none ma-n4">
		<DataList
			v-for="(dataList, index) in props.items"
			:key="`vd-data-list-${index}`"
			:loading="props.loading"
			:render-html-value="props.renderHtmlValue"
			:list-title="dataList.title"
			:items="dataList.items"
			:items-number-loading="dataList.itemsNumberLoading"
			:heading-loading="dataList.headingLoading"
			:width="props.itemWidth"
			:icons="props.icons"
			class="ma-4"
			@click:item-action="emitItemAction(index, $event)"
		/>
	</div>
</template>
