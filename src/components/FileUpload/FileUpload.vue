<script setup lang="ts">
	import { useWidthable, type Widthable } from '@/composables/widthable'
	import { ref, useId, watch } from 'vue'
	import { useTheme } from 'vuetify'
	import FileUploadContent, { type FileUploadContentSlots } from './FileUploadContent.vue'
	import { locales as defaultLocales } from './locales'
	import useFileDrop from './useFileDrop'
	import validateFiles from './validateFiles'

	const props = withDefaults(defineProps<{
		modelValue: File[]
		disabled?: boolean
		multiple?: boolean
		fileSizeMax?: number
		fileSizeUnits?: Array<string>
		allowedExtensions?: Array<string>
		locales?: typeof defaultLocales
	} & Widthable>(), {
		disabled: false,
		multiple: false,
		fileSizeMax: 10_485_760,
		fileSizeUnits: () => defaultLocales.fileSizeUnits,
		allowedExtensions: () => ['pdf', 'jpg', 'jpeg', 'png'],
		locales: () => defaultLocales,
	})

	const emits = defineEmits<{
		(e: 'update:modelValue', value: File[]): void
		(e: 'error', value: string[]): void
	}>()

	defineSlots<{
		default(): void
	} & FileUploadContentSlots>()

	const dragover = ref(false)
	const id = 'file-upload-' + useId()
	const dropZone = ref<HTMLElement | null>(null)
	const fileInput = ref<HTMLInputElement | null>(null)
	const fileList = ref<File[]>([])
	const isDarkMode = useTheme().current.value.dark

	defineExpose({
		fileInput,
	})

	watch(() => props.modelValue, (value) => {
		fileList.value = value
	}, {
		immediate: true,
	})

	watch(fileList, (value: File[]) => {
		emits('update:modelValue', value)
	})

	const { widthStyles } = useWidthable(props)

	function newFiles(files: File[]) {
		if (props.disabled) {
			return
		}
		if (!props.multiple) {
			files = files.slice(0, 1)
		}
		const { errors, validFiles } = validateFiles(
			files, props.fileSizeMax, props.allowedExtensions, props.fileSizeUnits,
		)

		if (errors.length) {
			emits('error', errors)
			return
		}
		if (props.multiple) {
			fileList.value = [...fileList.value, ...validFiles]
		}
		else {
			fileList.value = validFiles
		}
	}

	useFileDrop(
		dropZone,
		newFiles,
	)

	function onFileChange(e: Event) {
		const files = (e.target as HTMLInputElement).files
		if (!files) {
			return
		}
		newFiles(Array.from(files))
		;(e.target as HTMLInputElement).value = ''
	}
</script>
<!-- eslint-disable vuejs-accessibility/no-static-element-interactions -->
<template>
	<label
		ref="dropZone"
		:for="id"
		:class="[
			{
				dragover: dragover,
				'sy-file-upload--disabled': disabled,
				'dark-mode': isDarkMode,
			},
		]"
		:style="widthStyles"
		class="sy-file-upload d-block pa-4"
		@dragover.prevent="dragover = true"
		@dragleave="dragover = false"
	>
		<input
			:id="id"
			ref="fileInput"
			type="file"
			:disabled="disabled"
			:multiple="multiple"
			:accept="allowedExtensions.map(el=>`.${el}`).join(', ')"
			class="sy-file-upload-input"
			@change="onFileChange"
		>
		<slot>
			<FileUploadContent
				:allowed-extensions="allowedExtensions"
				:multiple="multiple"
				:file-size-max="fileSizeMax"
				:file-size-units="fileSizeUnits"
			>
				<template
					v-for="(_, slotName) in $slots"
					#[slotName]="slotProps"
				>
					<slot
						:name="slotName"
						v-bind="slotProps || {}"
					/>
				</template>
			</FileUploadContent>
		</slot>
	</label>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

.sy-file-upload {
	cursor: pointer;
	position: relative;
	border: 1px dashed tokens.$colors-border-accent;
	border-radius: tokens.$radius-rounded-lg;
	transition: background 0.25s;

	&:hover,
	&:focus-within,
	&.dragover {
		background: tokens.$colors-background-surface-alt;
	}

	&.dark-mode {
		&:hover,
		&:focus-within,
		&.dragover {
			background: #303030;
		}
	}

	&.sy-file-upload--disabled {
		opacity: 0.5;
		cursor: default;

		&:hover,
		&:focus-within,
		&.dragover {
			background: inherit;
		}
	}

	&.sy-file-upload--disabled.dark-mode {
		&:hover,
		&:focus-within,
		&.dragover {
			background: #303030;
		}
	}
}

.sy-file-upload-input {
	position: absolute;
	width: 1px;
	height: 1px;
	white-space: nowrap;
	overflow: hidden;
	clip: rect(1px, 1px, 1px, 1px);
}
</style>
