<script setup lang="ts">
	import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'
	import useCustomizableOptions, {
		type CustomizableOptions,
	} from '@/composables/useCustomizableOptions'
	import { useWidthable, type Widthable } from '@/composables/widthable'
	import { isRequired } from '@/utils/rules/isRequired'
	import { computed, ref, toRef } from 'vue'
	import DialogBox from '../DialogBox/DialogBox.vue'
	import FileList from '../FileList/FileList.vue'
	import FilePreview from '../FilePreview/FilePreview.vue'
	import FileUpload from '../FileUpload/FileUpload.vue'
	import { config } from './config'
	import { locales as defaultLocales } from './locales'
	import type { FileItem, SelectedFile, UploadItem } from './types'
	import useFileUploadJourney from './useFileUploadJourney'
	import useFileList from './useFileList'
	import SyHeading from '../SyHeading/SyHeading.vue'
	import { useLocales } from '@/composables/useLocales'
	import type { DeepPartial } from '@/utils/locales/mergeLocales'

	const props = withDefaults(
		defineProps<
			Widthable &
			CustomizableOptions & {
				uploadList: UploadItem[]
				sectionTitle?: string
				showFilePreview?: boolean
				infoText?: string
				headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
				locales?: DeepPartial<typeof defaultLocales>
			}
		>(),
		{
			uploadList: () => [],
			sectionTitle: undefined,
			showFilePreview: false,
			infoText: '',
			headingLevel: 4,
			locales: () => ({}),
		},
	)

	const emits = defineEmits<{
		(e: 'error', value: string[]): void
		(e: 'preview', value: FileItem): void
		(e: 'update:modelValue', value: SelectedFile[]): void
	}>()

	defineSlots<{
		'title'?: () => undefined
		'modal-title'?: (props: { id: string }) => undefined
		'modal-description'?: () => undefined
		'preview-description'?: () => undefined
	}>()

	const selectedFiles = defineModel<SelectedFile[]>({
		type: Array,
		default: () => [],
	})

	const { widthStyles } = useWidthable(props)
	const options = useCustomizableOptions(config, props)

	const fileUpload = ref<InstanceType<typeof FileUpload>>()
	const { selectItems, selectedItem } = useFileUploadJourney(
		toRef(props, 'uploadList'),
	)

	const locales = useLocales(defaultLocales, () => props.locales)

	const title = computed(
		() => props.sectionTitle ?? locales.value.title(!!props.uploadList.length),
	)

	const { addOrReplaceFile, resetFile, setItemOnError, filledUploadList }
		= useFileList(selectedFiles, toRef(props, 'uploadList'))

	// handle FileList
	const inlineSelectedItemId = ref<string | undefined>(undefined)
	function uploadInline(item: FileItem) {
		inlineSelectedItemId.value = item.id

		fileUpload.value?.openFileDialog()
	}
	function previewFile(file: FileItem & { file?: File }) {
		emits('preview', file)
		showPreviewDialog.value = true
		fileToPreview.value = file.file
	}

	// handle FileUpload
	const uploadedFiles = ref<File[]>([])
	const uploadedFile = computed(() => uploadedFiles.value[0])

	const showFileUpload = computed(
		() => (
			selectedFiles.value.length < props.uploadList.length
			|| props.uploadList.find(uploadItem => uploadItem.state === 'error') !== undefined
		),
	)

	function fileSelected(files: File[]) {
		const fileId
			= inlineSelectedItemId.value ?? (props.uploadList.length === 1
				? props.uploadList[0]!.id
				: undefined)
		inlineSelectedItemId.value = undefined

		if (props.showFilePreview || fileId === undefined) {
			showSelectDialog.value = true
			selectedItem.value = fileId

			return
		}

		addOrReplaceFile(files[0]!, fileId)
	}

	function uploadError(errors: string[]) {
		emits('error', errors)
		if (!inlineSelectedItemId.value) {
			return
		}
		setItemOnError(inlineSelectedItemId.value)
		inlineSelectedItemId.value = undefined
	}

	// handle DialogBox
	const showSelectDialog = ref(false)

	function dialogConfirm() {
		if (!selectedItem.value || !uploadedFile.value) {
			return
		}

		addOrReplaceFile(uploadedFile.value, selectedItem.value)

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
			<SyHeading
				:level="props.headingLevel"
				:class="headingLevel === 4 ? 'text-h6 mb-2' : 'mb-2'"
			>
				{{ title }}
			</SyHeading>
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
			>
				<template
					v-if="props.infoText"
					#info-text
				>
					{{ props.infoText }}
				</template>
			</FileUpload>
		</Transition>

		<DialogBox
			v-model="showSelectDialog"
			:heading-level="props.headingLevel"
			v-bind="options.dialog"
			@cancel="showSelectDialog = false"
			@confirm="dialogConfirm"
		>
			<template #title="titleSlotProps">
				<slot
					:id="titleSlotProps.id"
					name="modal-title"
				>
					<div
						:id="titleSlotProps.id"
						class="text-h4 font-weight-medium"
					>
						{{ locales.modalTitle }}
					</div>
				</slot>
			</template>
			<slot name="modal-description" />

			<div
				ref="form"
				v-bind="options.form"
				class="mb-2"
			>
				<SySelect
					v-model="selectedItem"
					v-bind="options.select"
					:items="selectItems"
					item-title="text"
					item-value="value"
					:rules="[isRequired]"
					color="primary"
				/>
			</div>

			<FilePreview
				v-if="showFilePreview"
				:options="options.filePreview"
				:file="uploadedFile"
			/>
		</DialogBox>

		<DialogBox
			v-model="showPreviewDialog"
			:heading-level="props.headingLevel"
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
