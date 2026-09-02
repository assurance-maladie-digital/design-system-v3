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

/** Attend le déclenchement de la sonde de rendu natif (délai de 400 ms côté composant). */
function waitForProbe(): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, 450))
}

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

/** Simule l'UA du navigateur. */
function setUserAgent(value: string): void {
	Object.defineProperty(navigator, 'userAgent', { value, configurable: true })
}

const DESKTOP_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
const ANDROID_CHROME_UA = 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36'
const ANDROID_FIREFOX_UA = 'Mozilla/5.0 (Android 14; Mobile; rv:140.0) Gecko/140.0 Firefox/140.0'

describe('FilePreview — repli pdf.js sans lecteur PDF natif (Chrome Android)', () => {
	const originalCreateObjectURL = URL.createObjectURL

	const originalUserAgent = navigator.userAgent

	beforeEach(() => {
		getDocumentMock.mockClear()
		URL.createObjectURL = vi.fn(() => 'blob:fallback')
		setUserAgent(DESKTOP_UA)
	})

	afterEach(() => {
		setNativePdfViewer(undefined)
		setUserAgent(originalUserAgent)
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

	it('conserve l\'<object> natif sur Firefox Android, qui affiche bien les PDF', async () => {
		setNativePdfViewer(true)
		setUserAgent(ANDROID_FIREFOX_UA)

		const wrapper = mount(FilePreview, { props: { file: pdfFile() } })
		await flushPromises()

		expect(wrapper.find('object').exists()).toBe(true)
		expect(getDocumentMock).not.toHaveBeenCalled()

		wrapper.unmount()
	})

	it('bascule sur pdf.js sur Chrome Android, qui annonce à tort un lecteur natif', async () => {
		// Cas réel de #2508 : Chrome sur Android annonce pdfViewerEnabled === true
		// alors qu'il n'affiche aucun PDF embarqué.
		setNativePdfViewer(true)
		setUserAgent(ANDROID_CHROME_UA)

		const wrapper = mount(FilePreview, { props: { file: pdfFile(), pdfWorkerSrc: 'worker' } })
		await flushPromises()

		expect(wrapper.find('.sy-file-preview__pdf-viewer').exists()).toBe(true)
		expect(wrapper.find('object').exists()).toBe(false)
		expect(getDocumentMock).toHaveBeenCalled()

		wrapper.unmount()
	})

	it('bascule sur pdf.js quand l\'<object> affiche son contenu de repli (sonde de rendu)', async () => {
		// Aucun signal déclaratif ne trahit ce navigateur : seul le résultat réel le fait.
		setNativePdfViewer(true)
		setUserAgent(DESKTOP_UA)

		const wrapper = mount(FilePreview, { props: { file: pdfFile(), pdfWorkerSrc: 'worker' } })
		await flushPromises()

		expect(wrapper.find('object').exists()).toBe(true)
		expect(getDocumentMock).not.toHaveBeenCalled()

		// Le paragraphe de repli occupe une boîte : le PDF n'est pas affiché.
		const fallback = wrapper.find('object p').element
		fallback.getBoundingClientRect = () => ({ height: 18 } as DOMRect)

		await waitForProbe()
		await flushPromises()

		expect(wrapper.find('.sy-file-preview__pdf-viewer').exists()).toBe(true)
		expect(wrapper.find('object').exists()).toBe(false)
		expect(getDocumentMock).toHaveBeenCalled()

		wrapper.unmount()
	})

	it('conserve l\'<object> quand le contenu de repli n\'est pas rendu', async () => {
		setNativePdfViewer(true)
		setUserAgent(DESKTOP_UA)

		// jsdom renvoie une hauteur nulle : le lecteur natif a pris la main.
		const wrapper = mount(FilePreview, { props: { file: pdfFile() } })
		await flushPromises()

		await waitForProbe()
		await flushPromises()

		expect(wrapper.find('object').exists()).toBe(true)
		expect(wrapper.find('.sy-file-preview__pdf-viewer').exists()).toBe(false)
		expect(getDocumentMock).not.toHaveBeenCalled()

		wrapper.unmount()
	})

	it('n\'affecte pas les images', async () => {
		setNativePdfViewer(true)
		setUserAgent(ANDROID_CHROME_UA)

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
