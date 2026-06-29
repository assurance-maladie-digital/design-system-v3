<script setup lang="ts">
	import deepmerge from 'deepmerge'
	import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
	import { config } from './config'
	import { locales as defaultLocales } from './locales'
	import { usePdfConsultation } from './usePdfConsultation'

	const props = withDefaults(defineProps<{
		file?: File | Blob
		options?: {
			pdf?: Record<string, string>
			image?: Record<string, string>
		}
		locales?: typeof defaultLocales
		/** Active le suivi de consultation du PDF (rendu via pdf.js, chargé à la demande). */
		trackConsultation?: boolean
		/** URL du worker pdf.js (optionnel, sinon worker bundlé). */
		pdfWorkerSrc?: string
	}>(), {
		file: undefined,
		options: undefined,
		locales: () => defaultLocales,
		trackConsultation: false,
		pdfWorkerSrc: undefined,
	})

	const emit = defineEmits<{
		/** Émis quand le PDF est entièrement chargé et rendu. Reçoit le nombre de pages. */
		loaded: [pageCount: number]
	}>()

	/**
	 * État de consultation complète du document (`v-model:complete`).
	 * Passe à `true` quand l'utilisateur atteint la fin, et revient à `false`
	 * lors du chargement d'un nouveau document.
	 */
	const complete = defineModel<boolean>('complete', { default: false })

	const fileURL = ref('')
	const isPdf = computed(() => props.file?.type === 'application/pdf')
	const isImage = computed(() => props.file ? /^image\//.test(props.file.type) : false)
	const filePreviewOptions = computed(() => deepmerge(config, props.options || {}))

	// Suivi de consultation uniquement pour les PDF
	const isTracking = computed(() => props.trackConsultation && isPdf.value)

	const getFileURL = () => {
		if (!props.file || !(isPdf.value || isImage.value)) return
		fileURL.value = URL.createObjectURL(props.file)
	}

	const revokeFileURL = () => {
		URL.revokeObjectURL(fileURL.value)
	}

	watch(() => props.file, getFileURL, { immediate: true })

	onUnmounted(revokeFileURL)

	// --- Suivi de consultation (pdf.js) --------------------------------------
	const viewerRef = ref<HTMLElement>()
	const pagesHostRef = ref<HTMLElement>()

	const {
		isLoading,
		hasError,
		isComplete,
		render,
		checkScrollComplete,
	} = usePdfConsultation()

	const viewerStyle = computed(() => ({
		height: filePreviewOptions.value.pdf?.height ?? '556px',
	}))

	async function loadPdf(): Promise<void> {
		await nextTick()
		if (!isTracking.value || !props.file || !pagesHostRef.value) {
			return
		}
		const data = await props.file.arrayBuffer()
		const pageCount = await render(data, pagesHostRef.value, {
			workerSrc: props.pdfWorkerSrc,
		})
		if (pageCount !== null) {
			emit('loaded', pageCount)
			// Document plus court que le conteneur : consultation déjà complète
			await nextTick()
			if (viewerRef.value) {
				checkScrollComplete(viewerRef.value)
			}
		}
	}

	function onViewerScroll(): void {
		if (viewerRef.value) {
			checkScrollComplete(viewerRef.value)
		}
	}

	// Synchronise l'état de consultation (true à la fin, false au rechargement)
	watch(isComplete, (value) => {
		complete.value = value
	})

	watch([() => props.file, isTracking], loadPdf, { immediate: true })
</script>

<template>
	<div
		v-if="file"
		class="sy-file-preview"
	>
		<div
			v-if="isTracking"
			ref="viewerRef"
			class="sy-file-preview__pdf-viewer"
			:style="viewerStyle"
			role="document"
			:aria-label="locales.previewNotAvailable"
			tabindex="0"
			@scroll="onViewerScroll"
		>
			<div
				ref="pagesHostRef"
				class="sy-file-preview__pages"
				aria-hidden="true"
			/>
			<p
				v-if="isLoading"
				class="sy-file-preview__status pa-4 text-center mb-0"
			>
				{{ locales.loadingDocument }}
			</p>
			<p
				v-else-if="hasError"
				class="sy-file-preview__status pa-4 text-center mb-0"
			>
				{{ locales.documentError }}
			</p>
		</div>

		<object
			v-else-if="isPdf"
			:data="fileURL"
			v-bind="filePreviewOptions.pdf"
			type="application/pdf"
			@load="revokeFileURL"
		>
			<p class="mb-0">{{ locales.previewNotAvailable }}</p>
		</object>

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

<style lang="scss" scoped>
.sy-file-preview__pdf-viewer {
	overflow: hidden auto;
	background-color: #f4f4f4;

	&:focus-visible {
		outline: 2px solid rgb(var(--v-theme-primary));
		outline-offset: -2px;
	}
}

.sy-file-preview__pages {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
	padding: 8px;
}

.sy-file-preview__page {
	display: block;
	max-width: 100%;
	box-shadow: 0 1px 4px rgb(0 0 0 / 15%);
}

.sy-file-preview__status {
	color: rgb(var(--v-theme-primary));
}
</style>
