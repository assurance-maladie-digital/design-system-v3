<script setup lang="ts">
	import deepmerge from 'deepmerge'
	import { computed, onUnmounted, ref, watch } from 'vue'
	import { config } from './config'
	import { locales as defaultLocales } from './locales'
	import SyPdfViewer from './SyPdfViewer.vue'

	const props = withDefaults(defineProps<{
		file?: File | Blob
		readOnly?: boolean
		options?: {
			pdf?: Record<string, string>
			image?: Record<string, string>
		}
		locales?: typeof defaultLocales
	}>(), {
		file: undefined,
		readOnly: false,
		options: undefined,
		locales: () => defaultLocales,
	})

	const fileURL = ref('')
	const isPdf = computed(() => props.file?.type === 'application/pdf')
	const isImage = computed(() => props.file ? /^image\//.test(props.file.type) : false)
	const filePreviewOptions = computed(() => deepmerge(config, props.options || {}))

	const getFileURL = () => {
		if (!props.file || !(isPdf.value || isImage.value)) return
		fileURL.value = URL.createObjectURL(props.file)
	}

	const revokeFileURL = () => {
		URL.revokeObjectURL(fileURL.value)
	}

	watch(() => props.file, getFileURL, { immediate: true })

	onUnmounted(revokeFileURL)
</script>

<template>
	<div
		v-if="file"
		class="sy-file-preview"
	>
		<template v-if="isPdf">
			<SyPdfViewer
				v-if="readOnly"
				:file-u-r-l="fileURL"
				:height="filePreviewOptions.pdf.height"
				:toolbar-color="filePreviewOptions.pdf.toolbarColor"
				:canvas-background="filePreviewOptions.pdf.canvasBackground"
				:locales="locales"
			/>
			<object
				v-else
				:data="fileURL"
				v-bind="filePreviewOptions.pdf"
				type="application/pdf"
				@load="revokeFileURL"
			>
				<p class="mb-0">{{ locales.previewNotAvailable }}</p>
			</object>
		</template>

		<img
			v-else-if="isImage"
			:src="fileURL"
			:alt="filePreviewOptions.image.alt || ''"
			v-bind="filePreviewOptions.image"
			@load="revokeFileURL"
		>

		<slot v-else>
			<p class="mb-0">
				{{ locales.previewTypeNotAvailable }}
			</p>
		</slot>
	</div>
</template>
