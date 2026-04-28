<script setup lang="ts">
	import { mdiChevronLeft, mdiChevronRight, mdiMagnifyMinusOutline, mdiMagnifyPlusOutline } from '@mdi/js'
	import * as PDFJS from 'pdfjs-dist'
	import type { PDFDocumentProxy, PDFPageProxy, RenderTask } from 'pdfjs-dist'
	import workerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url'
	import { onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'
	import SyIconButton from '@/components/Customs/SyIconButton/SyIconButton.vue'
	import { locales as defaultLocales } from './locales'

	PDFJS.GlobalWorkerOptions.workerSrc = workerSrc

	const props = withDefaults(defineProps<{
		fileURL: string
		height?: string
		toolbarColor?: string
		canvasBackground?: string
		locales?: typeof defaultLocales
	}>(), {
		height: '556px',
		toolbarColor: undefined,
		canvasBackground: undefined,
		locales: () => defaultLocales,
	})

	const canvasRef = ref<HTMLCanvasElement | null>(null)
	const pdfDoc = shallowRef<PDFDocumentProxy | null>(null)
	const currentPage = ref(1)
	const totalPages = ref(0)
	const scale = ref(1.2)
	const isLoading = ref(true)
	const renderTask = shallowRef<RenderTask | null>(null)

	const SCALE_MIN = 0.5
	const SCALE_MAX = 3
	const SCALE_STEP = 0.25

	async function loadPdf(url: string) {
		if (pdfDoc.value) {
			await pdfDoc.value.destroy()
			pdfDoc.value = null
		}
		isLoading.value = true
		const loadingTask = PDFJS.getDocument(url)
		pdfDoc.value = await loadingTask.promise
		totalPages.value = pdfDoc.value.numPages
		currentPage.value = 1
		await renderPage(currentPage.value)
		isLoading.value = false
	}

	async function renderPage(pageNum: number) {
		if (!pdfDoc.value || !canvasRef.value) return

		if (renderTask.value) {
			renderTask.value.cancel()
			renderTask.value = null
		}

		const page: PDFPageProxy = await pdfDoc.value.getPage(pageNum)
		const viewport = page.getViewport({ scale: scale.value })
		const canvas = canvasRef.value

		canvas.height = viewport.height
		canvas.width = viewport.width

		renderTask.value = page.render({ canvas, viewport })
		await renderTask.value.promise
	}

	async function prevPage() {
		if (currentPage.value <= 1) return
		currentPage.value--
		await renderPage(currentPage.value)
	}

	async function nextPage() {
		if (currentPage.value >= totalPages.value) return
		currentPage.value++
		await renderPage(currentPage.value)
	}

	async function zoomIn() {
		if (scale.value >= SCALE_MAX) return
		scale.value = Math.min(SCALE_MAX, Math.round((scale.value + SCALE_STEP) * 100) / 100)
		await renderPage(currentPage.value)
	}

	async function zoomOut() {
		if (scale.value <= SCALE_MIN) return
		scale.value = Math.max(SCALE_MIN, Math.round((scale.value - SCALE_STEP) * 100) / 100)
		await renderPage(currentPage.value)
	}

	watch(() => props.fileURL, (url) => {
		if (url) loadPdf(url)
	})

	onMounted(() => {
		if (props.fileURL) loadPdf(props.fileURL)
	})

	onUnmounted(async () => {
		if (renderTask.value) renderTask.value.cancel()
		if (pdfDoc.value) await pdfDoc.value.destroy()
	})
</script>

<template>
	<div
		class="sy-pdf-viewer"
		:style="{
			height,
			'--sy-pdf-toolbar-bg': toolbarColor,
			'--sy-pdf-canvas-bg': canvasBackground,
		}"
	>
		<div
			role="toolbar"
			:aria-label="locales.pdfToolbarLabel"
			class="sy-pdf-viewer__toolbar"
		>
			<div class="sy-pdf-viewer__toolbar-nav">
				<SyIconButton
					:icon="mdiChevronLeft"
					:label="locales.previousPage"
					:disabled="currentPage <= 1"
					size="small"
					@click-icon-button="prevPage"
				/>
				<span
					aria-live="polite"
					aria-atomic="true"
					class="sy-pdf-viewer__page-info"
				>
					<span class="sr-only">{{ locales.pageOf(currentPage, totalPages) }}</span>
					<span aria-hidden="true">{{ currentPage }} / {{ totalPages }}</span>
				</span>
				<SyIconButton
					:icon="mdiChevronRight"
					:label="locales.nextPage"
					:disabled="currentPage >= totalPages"
					size="small"
					@click-icon-button="nextPage"
				/>
			</div>

			<div class="sy-pdf-viewer__toolbar-zoom">
				<SyIconButton
					:icon="mdiMagnifyMinusOutline"
					:label="locales.zoomOut"
					:disabled="scale <= 0.5"
					size="small"
					@click-icon-button="zoomOut"
				/>
				<span
					aria-live="polite"
					class="sy-pdf-viewer__zoom-info"
				>
					{{ Math.round(scale * 100) }}%
				</span>
				<SyIconButton
					:icon="mdiMagnifyPlusOutline"
					:label="locales.zoomIn"
					:disabled="scale >= 3"
					size="small"
					@click-icon-button="zoomIn"
				/>
			</div>
		</div>

		<div
			class="sy-pdf-viewer__canvas-wrapper"
			:aria-label="locales.pdfCanvasLabel"
			role="region"
			tabindex="0"
		>
			<div
				v-if="isLoading"
				class="sy-pdf-viewer__loading"
				aria-live="polite"
			>
				{{ locales.pdfLoading }}
			</div>
			<canvas
				ref="canvasRef"
				:aria-label="locales.pageOf(currentPage, totalPages)"
				class="sy-pdf-viewer__canvas"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.sy-pdf-viewer {
	display: flex;
	flex-direction: column;
	width: 100%;
	border: 1px solid rgb(var(--v-theme-borderDefault));
	border-radius: var(--v-radius-roundedSm, 4px);
	overflow: hidden;
	background: #fff;
}

.sy-pdf-viewer__toolbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 4px 8px;
	background: var(--sy-pdf-toolbar-bg, rgb(var(--v-theme-primary)));
	color: #fff !important;
	border-bottom: 1px solid rgb(var(--v-theme-borderDefault));
	flex-shrink: 0;

	button {
		background-color: #fff !important;
	}
}

.sy-pdf-viewer__toolbar-nav,
.sy-pdf-viewer__toolbar-zoom {
	display: flex;
	align-items: center;
	gap: 4px;
}

.sy-pdf-viewer__page-info,
.sy-pdf-viewer__zoom-info {
	font-size: 0.875rem;
	min-width: 3rem;
	text-align: center;
	user-select: none;
}

.sy-pdf-viewer__canvas-wrapper {
	flex: 1;
	overflow: auto;
	display: flex;
	justify-content: center;
	align-items: flex-start;
	padding: 8px;
	background: var(--sy-pdf-canvas-bg, #525659);
}

.sy-pdf-viewer__canvas {
	display: block;
	box-shadow: 0 2px 8px rgb(0 0 0 / 40%);
}

.sy-pdf-viewer__loading {
	color: #fff;
	padding: 16px;
}

.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
}
</style>
