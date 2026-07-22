<script setup lang="ts">
	import UploadItem from '@/components/FileList/UploadItem/UploadItem.vue'
	import { useWidthable, type Widthable } from '@/composables/widthable'
	import { locales as defaultLocales } from './UploadItem/locales'
	import { useLocales } from '@/composables/useLocales'
	import type { DeepPartial } from '@/utils/locales/mergeLocales'

	export type FileState = 'initial' | 'success' | 'error' | 'loading'
	export interface Item {
		id: string
		title: string
		state: string // 'initial' | 'success' | 'error' | 'loading'
		fileName?: string
		optional?: boolean
		progress?: number
		showUploadBtn?: boolean
		showPreviewBtn?: boolean
		showDeleteBtn?: boolean
	}

	const props = withDefaults(defineProps<{
		uploadList: Item[]
		locales?: DeepPartial<typeof defaultLocales>
		seeLabel?: string
		importLabel?: string
		deleteLabel?: string
	} & Widthable>(), {
		locales: () => ({}),
		seeLabel: undefined,
		importLabel: undefined,
		deleteLabel: undefined,
	})

	const locales = useLocales(defaultLocales, () => props.locales)

	const { widthStyles } = useWidthable(props)

	defineEmits<{
		(e: 'upload', item: Item): void
		(e: 'preview', item: Item): void
		(e: 'delete', item: Item): void
	}>()
</script>

<template>
	<ul
		class="upload-list"
		:style="widthStyles"
	>
		<UploadItem
			v-for="item in props.uploadList"
			:key="item.id"
			:item-id="item.id"
			:title="item.title"
			:file-name="item.fileName"
			:optional="item.optional"
			:state="(item.state as FileState)"
			:progress="item.progress"
			:show-upload-btn="item.showUploadBtn"
			:show-preview-btn="item.showPreviewBtn"
			:show-delete-btn="item.showDeleteBtn"
			tag="li"
			:locales="locales"
			:see-label="seeLabel"
			:import-label="importLabel"
			:delete-label="deleteLabel"
			@upload="() => $emit('upload', uploadList.find((i) => i.id === item.id) as Item)"
			@preview="() => $emit('preview', uploadList.find((i) => i.id === item.id) as Item)"
			@delete="() => $emit('delete', uploadList.find((i) => i.id === item.id) as Item)"
		>
			<template #file-icon="slotProps">
				<slot
					:name="`file-icon-${item.id}`"
					v-bind="slotProps"
				/>
			</template>
		</UploadItem>
	</ul>
</template>

<style lang="scss" scoped>
.upload-list {
	display: flex;
	flex-direction: column;
	margin: 0;
	padding: 0;
	list-style: none;
}

</style>
