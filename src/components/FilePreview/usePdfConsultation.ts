import { ref, type Ref } from 'vue'

type PdfSource = string | ArrayBuffer | Uint8Array

interface RenderOptions {
	/** URL du worker pdf.js (sinon worker bundlé par défaut). */
	workerSrc?: string
}

interface UsePdfConsultationReturn {
	/** Le document est en cours de rendu. */
	isLoading: Ref<boolean>
	/** Le rendu a échoué. */
	hasError: Ref<boolean>
	/** L'utilisateur a atteint la fin du document. */
	isComplete: Ref<boolean>
	/** Rend le PDF (URL ou données binaires) dans `host`. Renvoie le nombre de pages, ou `null` en cas d'erreur. */
	render: (source: PdfSource, host: HTMLElement, options?: RenderOptions) => Promise<number | null>
	/** Met à jour `isComplete` selon la position de scroll du conteneur. */
	checkScrollComplete: (viewport: HTMLElement, threshold?: number) => void
}

/**
 * Suivi de consultation d'un PDF via pdf.js (chargé en import dynamique).
 *
 * Rend chaque page dans un `<canvas>` au sein d'un conteneur scrollable, expose
 * l'état de chargement/erreur et détecte l'atteinte de la fin du document.
 */
export function usePdfConsultation(): UsePdfConsultationReturn {
	const isLoading = ref(false)
	const hasError = ref(false)
	const isComplete = ref(false)

	async function render(source: PdfSource, host: HTMLElement, options: RenderOptions = {}): Promise<number | null> {
		isLoading.value = true
		hasError.value = false
		isComplete.value = false

		try {
			// pdf.js n'est chargé que lorsque le suivi est activé (bundle par défaut préservé)
			const pdfjs = await import('pdfjs-dist')

			if (options.workerSrc) {
				pdfjs.GlobalWorkerOptions.workerSrc = options.workerSrc
			}
			else if (!pdfjs.GlobalWorkerOptions.workerSrc) {
				const workerModule = await import('pdfjs-dist/build/pdf.worker.min.mjs?url')
				pdfjs.GlobalWorkerOptions.workerSrc = workerModule.default
			}

			const documentParams = typeof source === 'string' ? { url: source } : { data: source }
			const pdf = await pdfjs.getDocument(documentParams).promise

			host.replaceChildren()

			// Échelle pour remplir la largeur du conteneur, densité écran pour la netteté
			const containerWidth = host.clientWidth || 800
			const pixelRatio = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1

			for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
				const page = await pdf.getPage(pageNumber)
				const baseViewport = page.getViewport({ scale: 1 })
				const scale = (containerWidth / baseViewport.width) * pixelRatio
				const viewport = page.getViewport({ scale })

				const canvas = document.createElement('canvas')
				canvas.className = 'sy-file-preview__page'
				canvas.width = viewport.width
				canvas.height = viewport.height
				canvas.style.width = '100%'
				canvas.style.height = 'auto'
				host.appendChild(canvas)

				await page.render({ canvas, viewport }).promise
			}

			isLoading.value = false
			return pdf.numPages
		}
		catch {
			hasError.value = true
			isLoading.value = false
			return null
		}
	}

	function checkScrollComplete(viewport: HTMLElement, threshold = 8): void {
		if (isComplete.value) {
			return
		}
		const reachedEnd = viewport.scrollTop + viewport.clientHeight >= viewport.scrollHeight - threshold
		if (reachedEnd) {
			isComplete.value = true
		}
	}

	return {
		isLoading,
		hasError,
		isComplete,
		render,
		checkScrollComplete,
	}
}
