import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import FilePreview from '../FilePreview.vue'
import { locales } from '../locales'

const { getDocumentMock } = vi.hoisted(() => {
	const mockPage = {
		getViewport: ({ scale }: { scale: number }) => ({ width: 600 * scale, height: 800 * scale }),
		render: () => ({ promise: Promise.resolve() }),
	}
	const mockPdf = {
		numPages: 2,
		getPage: () => Promise.resolve(mockPage),
	}
	return { getDocumentMock: vi.fn(() => ({ promise: Promise.resolve(mockPdf) })) }
})

vi.mock('pdfjs-dist', () => ({
	GlobalWorkerOptions: {},
	getDocument: getDocumentMock,
}))
vi.mock('pdfjs-dist/build/pdf.worker.min.mjs?url', () => ({ default: 'worker-url' }))

function pdfFile(): File {
	return new File(['%PDF-1.4 dummy'], 'contrat.pdf', { type: 'application/pdf' })
}

/** Simule la présence (ou non) d'un lecteur PDF natif dans le navigateur. */
function setNativePdfViewer(value: boolean | undefined): void {
	if (value === undefined) {
		Reflect.deleteProperty(navigator, 'pdfViewerEnabled')
		return
	}
	Object.defineProperty(navigator, 'pdfViewerEnabled', { value, configurable: true })
}

describe('FilePreview — repli pdf.js sans lecteur PDF natif (Chrome Android)', () => {
	const originalCreateObjectURL = URL.createObjectURL

	beforeEach(() => {
		getDocumentMock.mockClear()
		URL.createObjectURL = vi.fn(() => 'blob:fallback')
	})

	afterEach(() => {
		setNativePdfViewer(undefined)
		URL.createObjectURL = originalCreateObjectURL
	})

	it('bascule sur le rendu pdf.js quand le navigateur n\'affiche pas les PDF nativement', async () => {
		setNativePdfViewer(false)

		const wrapper = mount(FilePreview, { props: { file: pdfFile(), pdfWorkerSrc: 'worker' } })
		await flushPromises()

		expect(wrapper.find('.sy-file-preview__pdf-viewer').exists()).toBe(true)
		expect(wrapper.find('object').exists()).toBe(false)
		expect(getDocumentMock).toHaveBeenCalled()
		expect(wrapper.emitted('loaded')?.[0]).toEqual([2])

		wrapper.unmount()
	})

	it('conserve l\'<object> natif quand le navigateur sait afficher les PDF', async () => {
		setNativePdfViewer(true)

		const wrapper = mount(FilePreview, { props: { file: pdfFile() } })
		await flushPromises()

		expect(wrapper.find('object').exists()).toBe(true)
		expect(wrapper.find('.sy-file-preview__pdf-viewer').exists()).toBe(false)
		expect(getDocumentMock).not.toHaveBeenCalled()

		wrapper.unmount()
	})

	it('conserve l\'<object> natif quand `pdfViewerEnabled` n\'existe pas (rétrocompatibilité)', async () => {
		setNativePdfViewer(undefined)

		const wrapper = mount(FilePreview, { props: { file: pdfFile() } })
		await flushPromises()

		expect(wrapper.find('object').exists()).toBe(true)
		expect(getDocumentMock).not.toHaveBeenCalled()

		wrapper.unmount()
	})

	it('n\'affecte pas les images', async () => {
		setNativePdfViewer(false)

		const image = new File(['img'], 'photo.png', { type: 'image/png' })
		const wrapper = mount(FilePreview, { props: { file: image } })
		await flushPromises()

		expect(wrapper.find('img').exists()).toBe(true)
		expect(wrapper.find('.sy-file-preview__pdf-viewer').exists()).toBe(false)
		expect(getDocumentMock).not.toHaveBeenCalled()

		wrapper.unmount()
	})

	it('propose un lien de téléchargement si le rendu pdf.js échoue', async () => {
		setNativePdfViewer(false)
		getDocumentMock.mockReturnValueOnce({ promise: Promise.reject(new Error('rendu impossible')) })

		const wrapper = mount(FilePreview, { props: { file: pdfFile(), pdfWorkerSrc: 'worker' } })
		await flushPromises()

		expect(wrapper.text()).toContain(locales.documentError)

		const link = wrapper.find('.sy-file-preview__download')
		expect(link.exists()).toBe(true)
		expect(link.attributes('href')).toBe('blob:fallback')
		expect(link.attributes('download')).toBe('contrat.pdf')

		wrapper.unmount()
	})

	it('ne propose pas de téléchargement en lecture seule, même en cas d\'échec', async () => {
		getDocumentMock.mockReturnValueOnce({ promise: Promise.reject(new Error('rendu impossible')) })

		const wrapper = mount(FilePreview, {
			props: { file: pdfFile(), readonly: true, pdfWorkerSrc: 'worker' },
		})
		await flushPromises()

		expect(wrapper.text()).toContain(locales.documentError)
		expect(wrapper.find('.sy-file-preview__download').exists()).toBe(false)
		expect(URL.createObjectURL).not.toHaveBeenCalled()

		wrapper.unmount()
	})
})
