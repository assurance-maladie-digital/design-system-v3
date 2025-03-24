<script setup lang="ts">
	import useCustomizableOptions, {
		type CustomizableOptions,
	} from '@/composables/useCustomizableOptions'
	import { useWidthable, type Widthable } from '@/composables/widthable'
	import { required } from '@/utils/rules/isRequired'
	import { computed, reactive, ref, toRef, watch } from 'vue'
	import DialogBox from '../DialogBox/DialogBox.vue'
	import FileList from '../FileList/FileList.vue'
	import FilePreview from '../FilePreview/FilePreview.vue'
	import FileUpload from '../FileUpload/FileUpload.vue'
	import { config } from './config'
	import { locales as defaultLocales } from './locales'
	import type { FileItem, SelectedFile, UploadItem } from './types'
	import useFileUploadJourney from './useFileUploadJourney'
	import useFileList from './useFileList'

	const props = withDefaults(
		defineProps<
			Widthable &
			CustomizableOptions & {
				uploadList: UploadItem[]
				sectionTitle?: string
				showFilePreview?: boolean
				locales?: typeof defaultLocales
			}
		>(),
		{
			sectionTitle: undefined,
			showFilePreview: false,
			locales: () => defaultLocales,
		},
	)

	const emits = defineEmits<{
		(e: 'error', value: string[]): void
		(e: 'update:modelValue', value: SelectedFile[]): void
	}>()

	const selectedFiles = defineModel<SelectedFile[]>({
		type: Array,
		default: reactive([]),
	})
	watch(
		selectedFiles,
		(value) => {
			emits('update:modelValue', value)
		},
		{ deep: true },
	)

	const { widthStyles } = useWidthable(props)
	const options = useCustomizableOptions(config, props)

	const fileUpload = ref<typeof FileUpload>()
	const { selectItems, selectedItem } = useFileUploadJourney(
		toRef(props, 'uploadList'),
	)

	const title = computed(
		() => props.sectionTitle ?? props.locales.title(!!props.uploadList.length),
	)

	const { addOrReplaceFile, resetFile, setItemOnError, filledUploadList }
		= useFileList(selectedFiles, toRef(props, 'uploadList'))

	// handle FileList
	let inlineSelectedItemId: string | undefined = undefined
	function uploadInline(item: FileItem) {
		inlineSelectedItemId = item.id

		fileUpload.value!.fileInput!.click()
	}
	function previewFile(file: FileItem & { file?: File }) {
		showPreviewDialog.value = true
		fileToPreview.value = file.file
	}

	// handle FileUpload
	const uploadedFiles = ref<File[]>([])

	const showFileUpload = computed(
		() => (
			selectedFiles.value.length < props.uploadList.length
			|| props.uploadList.find(uploadItem => uploadItem.state === 'error') !== undefined
		),
	)

	function fileSelected(files: File[]) {
		const fileId
			= inlineSelectedItemId ?? (props.uploadList.length === 1
				? props.uploadList[0].id
				: undefined)
		inlineSelectedItemId = undefined

		if (props.showFilePreview || fileId === undefined) {
			showSelectDialog.value = true
			selectedItem.value = fileId

			return
		}

		addOrReplaceFile(files[0], fileId)
	}

	function uploadError(errors: string[]) {
		emits('error', errors)
		if (!inlineSelectedItemId) {
			return
		}
		setItemOnError(inlineSelectedItemId)
		inlineSelectedItemId = undefined
	}

	// handle DialogBox
	const showSelectDialog = ref(false)

	function dialogConfirm() {
		if (!selectedItem.value) {
			return
		}

		addOrReplaceFile(uploadedFiles.value[0], selectedItem.value)

		showSelectDialog.value = false
		selectedItem.value = undefined
	}

	// handle preview
	const fileToPreview = ref<File>()
	const showPreviewDialog = ref(false)
</script>

<template>
	<div
		:style="widthStyles"
		class="sy-upload-workflow white"
	>
		<slot name="title">
			<h4 class="text-h6 mb-2">
				{{ title }}
			</h4>
		</slot>

		<FileList
			v-bind="options.fileList"
			:upload-list="filledUploadList"
			@upload="uploadInline"
			@retry="uploadInline"
			@delete="resetFile"
			@preview="previewFile"
		/>

		<Transition>
			<FileUpload
				v-if="showFileUpload"
				ref="fileUpload"
				v-bind="options.fileUpload"
				v-model="uploadedFiles"
				@error="uploadError"
				@update:model-value="fileSelected"
			/>
		</Transition>

		<DialogBox
			v-model="showSelectDialog"
			v-bind="options.dialog"
			@cancel="showSelectDialog = false"
			@confirm="dialogConfirm"
		>
			<template #title>
				<slot name="modal-title">
					{{ locales.modalTitle }}
				</slot>
			</template>
			<slot name="modal-description" />

			<VForm
				v-if="true"
				ref="form"
				v-bind="options.form"
				class="mb-2"
			>
				<VSelect
					v-model="selectedItem"
					v-bind="options.select"
					:items="selectItems"
					item-title="text"
					item-value="value"
					:rules="[required]"
					color="primary"
				/>
			</VForm>

			<FilePreview
				v-if="showFilePreview"
				:options="options.filePreview"
				:file="uploadedFiles[0]"
			/>
		</DialogBox>

		<DialogBox
			v-model="showPreviewDialog"
			v-bind="options.previewDialog"
			hide-actions
		>
			<slot name="preview-description" />

			<FilePreview
				:options="options.filePreview"
				:file="fileToPreview"
			/>
		</DialogBox>
	</div>
</template>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
	interpolate-size: allow-keywords;
	transition: height 0.2s ease, opacity 0.2s ease;
	overflow: hidden;
}

.v-enter-from,
.v-leave-to {
	height: 0;
	opacity: 0;
}
</style>
