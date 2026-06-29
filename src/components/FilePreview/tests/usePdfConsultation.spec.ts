import { describe, it, expect, vi } from 'vitest'
import { usePdfConsultation } from '../usePdfConsultation'

const { getDocumentMock } = vi.hoisted(() => {
	const mockPage = {
		getViewport: ({ scale }: { scale: number }) => ({ width: 600 * scale, height: 800 * scale }),
		render: () => ({ promise: Promise.resolve() }),
	}
	const mockPdf = {
		numPages: 3,
		getPage: () => Promise.resolve(mockPage),
	}
	return { getDocumentMock: vi.fn(() => ({ promise: Promise.resolve(mockPdf) })) }
})

vi.mock('pdfjs-dist', () => ({
	GlobalWorkerOptions: {},
	getDocument: getDocumentMock,
}))
vi.mock('pdfjs-dist/build/pdf.worker.min.mjs?url', () => ({ default: 'worker-url' }))

describe('usePdfConsultation', () => {
	it('render : rend toutes les pages et renvoie le nombre de pages (source binaire)', async () => {
		const { render, isLoading, hasError } = usePdfConsultation()
		const host = document.createElement('div')

		const count = await render(new ArrayBuffer(8), host, { workerSrc: 'worker' })

		expect(count).toBe(3)
		expect(host.querySelectorAll('canvas.sy-file-preview__page')).toHaveLength(3)
		expect(isLoading.value).toBe(false)
		expect(hasError.value).toBe(false)
	})

	it('render : accepte aussi une URL (string)', async () => {
		const { render } = usePdfConsultation()
		const host = document.createElement('div')

		await render('document.pdf', host, { workerSrc: 'worker' })

		expect(getDocumentMock).toHaveBeenCalledWith({ url: 'document.pdf' })
	})

	it('render : passe hasError à true si pdf.js échoue', async () => {
		getDocumentMock.mockReturnValueOnce({ promise: Promise.reject(new Error('boom')) } as never)

		const { render, hasError } = usePdfConsultation()
		const host = document.createElement('div')

		const count = await render(new ArrayBuffer(8), host, { workerSrc: 'worker' })

		expect(count).toBeNull()
		expect(hasError.value).toBe(true)
	})

	it('checkScrollComplete : passe isComplete à true uniquement quand le bas est atteint', () => {
		const { isComplete, checkScrollComplete } = usePdfConsultation()
		const viewport = { scrollTop: 0, clientHeight: 100, scrollHeight: 500 } as HTMLElement

		checkScrollComplete(viewport)
		expect(isComplete.value).toBe(false)

		viewport.scrollTop = 400
		checkScrollComplete(viewport)
		expect(isComplete.value).toBe(true)
	})
})
