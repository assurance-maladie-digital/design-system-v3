<script setup lang="ts">
	import { calcHumanFileSize } from '@/utils/calcHumanFileSize'
	import { locales as defaultLocales } from './locales'
	import { mdiCloudUpload } from '@mdi/js'
	import { computed } from 'vue'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'

	const props = defineProps<{
		allowedExtensions: string[]
		fileSizeUnits: Array<string>
		fileSizeMax: number
		multiple: boolean
		locales: typeof defaultLocales
	}>()

	export interface FileUploadContentSlots {
		'icon'(): void
		'action-text'(): void
		'or'(): void
		'button-text'(): void
		'info-text'(): void
	}

	defineSlots<FileUploadContentSlots>()

	const maxSizeReadable = computed(() => {
		return calcHumanFileSize(props.fileSizeMax, props.fileSizeUnits)
	})
</script>

<template>
	<span class="sy-file-upload-placeholder">
		<slot
			name="icon"
		>
			<SyIcon
				size="40"
				color="primary"
				:icon="mdiCloudUpload"
				decorative
			/>
		</slot>

		<span
			class="mt-1 font-weight-medium text-black"
		>
			<slot
				name="action-text"
				:multiple="multiple"
			>
				<span>{{ locales.dropFilesHere(multiple) }}</span>
			</slot>
		</span>

		<span
			class="mb-2 sy-file-upload-caption"
		>
			<slot name="or">
				{{ locales.or }}
			</slot>
		</span>

		<span
			class="sy-file-upload-btn bg-primary text-white"
		>
			<slot name="button-text">
				{{ locales.chooseFile(multiple) }}
			</slot>
		</span>

		<span
			class="mt-4 sy-file-upload-caption"
		>
			<slot
				name="info-text"
				:max-size="maxSizeReadable"
				:extensions="allowedExtensions"
			>
				{{
					locales.infoText(
						maxSizeReadable,
						allowedExtensions,
					)
				}}
			</slot>
		</span>
	</span>
</template>

<style lang="scss" scoped>

.sy-file-upload-placeholder {
	display: flex;
	align-items: center;
	flex-direction: column;
}

.sy-file-upload-caption {
	font-size: 0.875rem;
	color: rgb(var(--v-theme-textSubdued));
}

.sy-file-upload-btn {
	border-radius: var(--v-theme-radius-rounded);
	transition: background 0.25s;
	font-weight: 700 !important;
	font-size: 16px;
	padding: 10px 16px;
}
</style>
