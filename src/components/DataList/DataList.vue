<script lang="ts" setup>
	import type { PropType } from 'vue'

	import DataListItem from '@/components/DataListItem/DataListItem.vue'
	import DataListLoading from './DataListLoading/DataListLoading.vue'

	import type { DataListIcons, DataListItem as DataListItemInterface, ItemClass } from './types'
	import { useWidthable } from '@/composables/widthable'

	const props = defineProps({
		items: {
			type: Array as PropType<DataListItemInterface[]>,
			required: true,
		},
		icons: {
			type: Object as PropType<DataListIcons | undefined>,
			default: undefined,
		},
		listTitle: {
			type: String,
			default: undefined,
		},
		titleClass: {
			type: String,
			default: 'text-subtitle-1 font-weight-bold mb-3',
		},
		titleTag: {
			type: String,
			default: 'h4',
		},
		row: {
			type: Boolean,
			default: false,
		},
		placeholder: {
			type: String,
			default: undefined,
		},
		loading: {
			type: Boolean,
			default: false,
		},
		itemsNumberLoading: {
			type: Number,
			default: 1,
		},
		headingLoading: {
			type: Boolean,
			default: false,
		},
		renderHtmlValue: {
			type: Boolean,
			default: false,
		},
		maxWidth: {
			type: String,
			default: undefined,
		},
		minWidth: {
			type: String,
			default: undefined,
		},
		width: {
			type: String,
			default: undefined,
		},
	})

	const uniqueId = Math.random().toString(36).substr(2, 9)

	const sectionTitleId = `data-list-section-title-${uniqueId}`

	const { widthStyles } = useWidthable(props)

	const emit = defineEmits(['click:item-action'])

	const getIcon = (iconName?: string): string | undefined => {
		if (!iconName || !props.icons) {
			return
		}
		return props.icons?.[iconName]
	}

	const getItemClass = (index: number, itemClass?: string): ItemClass => {
		const margin = {
			'mb-2': index !== props.items.length - 1,
		}
		return [margin, itemClass]
	}
</script>

<template>
	<VFadeTransition mode="out-in">
		<DataListLoading
			v-if="loading"
			:items-number="itemsNumberLoading"
			:heading="headingLoading"
			:row="row"
		/>

		<component
			:is="listTitle ? 'section' : 'div'"
			v-else
			:aria-labelledby="listTitle ? sectionTitleId : undefined"
			:style="widthStyles"
		>
			<slot name="title">
				<component
					:is="titleTag"
					v-if="listTitle"
					:id="sectionTitleId"
					:class="titleClass"
				>
					{{ listTitle }}
				</component>
			</slot>

			<dl v-if="items.length">
				<DataListItem
					v-for="(item, index) in items"
					:key="index"
					:label="item.key"
					:value="item.value"
					:action="item.action"
					:chip="item.chip"
					:row="row"
					:render-html-value="renderHtmlValue"
					:icon="getIcon(item.icon)"
					:placeholder="placeholder"
					:vuetify-options="item.options"
					:class="getItemClass(index, item.class)"
					class="sy-data-list-item text-body-1"
					@click:action="emit('click:item-action', index)"
				/>
			</dl>
		</component>
	</VFadeTransition>
</template>

<style lang="scss" scoped>
:deep(ul) {
	list-style: none;
}
</style>
