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

/** Délais de la sonde de rendu natif, côté `useNativePdfFallback`. */
const PROBE_DELAY = 400
const PROBE_CONFIRM_DELAY = 800

/**
 * Attend le verdict complet de la sonde : mesure initiale, puis confirmation — un repli
 * encore mesurable n'entraîne la bascule qu'après cette seconde mesure. Marge incluse
 * sur l'ordonnancement des timers.
 */
function waitForProbe(): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, PROBE_DELAY + PROBE_CONFIRM_DELAY + 100))
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

describe('FilePreview — pdf.js fallback when no native PDF viewer (Chrome on Android)', () => {
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

	it('switches to the pdf.js renderer when the browser does not display PDFs natively', async () => {
		setNativePdfViewer(false)

		const wrapper = mount(FilePreview, { props: { file: pdfFile(), pdfWorkerSrc: 'worker' } })
		await flushPromises()

		expect(wrapper.find('.sy-file-preview__pdf-viewer').exists()).toBe(true)
		expect(wrapper.find('object').exists()).toBe(false)
		expect(getDocumentMock).toHaveBeenCalled()
		expect(wrapper.emitted('loaded')?.[0]).toEqual([2])

		wrapper.unmount()
	})

	it('keeps the native <object> when the browser can display PDFs', async () => {
		setNativePdfViewer(true)

		const wrapper = mount(FilePreview, { props: { file: pdfFile() } })
		await flushPromises()

		expect(wrapper.find('object').exists()).toBe(true)
		expect(wrapper.find('.sy-file-preview__pdf-viewer').exists()).toBe(false)
		expect(getDocumentMock).not.toHaveBeenCalled()

		wrapper.unmount()
	})

	it('keeps the native <object> when `pdfViewerEnabled` is missing (backward compatibility)', async () => {
		setNativePdfViewer(undefined)

		const wrapper = mount(FilePreview, { props: { file: pdfFile() } })
		await flushPromises()

		expect(wrapper.find('object').exists()).toBe(true)
		expect(getDocumentMock).not.toHaveBeenCalled()

		wrapper.unmount()
	})

	it('keeps the native <object> on Firefox Android, which does display PDFs', async () => {
		setNativePdfViewer(true)
		setUserAgent(ANDROID_FIREFOX_UA)

		const wrapper = mount(FilePreview, { props: { file: pdfFile() } })
		await flushPromises()

		expect(wrapper.find('object').exists()).toBe(true)
		expect(getDocumentMock).not.toHaveBeenCalled()

		wrapper.unmount()
	})

	it('switches to pdf.js on Chrome Android, which wrongly claims a native viewer', async () => {
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

	it('honours the probe delays passed through `options.pdfProbe`', async () => {
		setNativePdfViewer(true)
		setUserAgent(DESKTOP_UA)

		const wrapper = mount(FilePreview, {
			props: {
				file: pdfFile(),
				pdfWorkerSrc: 'worker',
				options: { pdfProbe: { delay: 20, confirmDelay: 20 } },
			},
		})
		await flushPromises()

		const object = wrapper.find('object')
		// Les délais ne doivent pas finir en attributs de l'<object>, contrairement à
		// `options.pdf` qui, lui, est bindé sur l'élément.
		expect(object.attributes('delay')).toBeUndefined()
		expect(object.attributes('confirmdelay')).toBeUndefined()

		const fallback = object.find('p').element
		fallback.getBoundingClientRect = () => ({ height: 18 } as DOMRect)

		// Verdict rendu bien avant les délais par défaut (400 + 800 ms).
		await new Promise(resolve => setTimeout(resolve, 120))
		await flushPromises()

		expect(wrapper.find('.sy-file-preview__pdf-viewer').exists()).toBe(true)
		expect(wrapper.find('object').exists()).toBe(false)

		wrapper.unmount()
	})

	it('switches to pdf.js when the <object> renders its fallback content (render probe)', async () => {
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

	it('keeps the <object> when the fallback content is not rendered', async () => {
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

	it('does not affect images', async () => {
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

	it('offers a download link when the pdf.js rendering fails', async () => {
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

	it('keeps the object URL alive after the native <object> has loaded', async () => {
		// Régression : révoquer l'URL sur @load cassait les actions du lecteur natif
		// (téléchargement, impression, rechargement), qui la re-sollicitent.
		const revokeSpy = vi.fn()
		const originalRevoke = URL.revokeObjectURL
		URL.revokeObjectURL = revokeSpy
		setNativePdfViewer(true)
		setUserAgent(DESKTOP_UA)

		const wrapper = mount(FilePreview, { props: { file: pdfFile() } })
		await flushPromises()

		const object = wrapper.find('object')
		await object.trigger('load')

		expect(revokeSpy).not.toHaveBeenCalled()
		expect(object.attributes('data')).toBe('blob:fallback')

		wrapper.unmount()
		URL.revokeObjectURL = originalRevoke
	})

	it('offers a download link on automatic fallback, without waiting for an error', async () => {
		// Le repli n'a pas été demandé : l'utilisateur perd la barre d'outils native
		// (téléchargement, impression) et un canvas non restitué la remplace.
		setNativePdfViewer(false)

		const wrapper = mount(FilePreview, { props: { file: pdfFile(), pdfWorkerSrc: 'worker' } })
		await flushPromises()

		expect(wrapper.find('.sy-file-preview__pdf-viewer').exists()).toBe(true)

		const link = wrapper.find('.sy-file-preview__download')
		expect(link.exists()).toBe(true)
		expect(link.text()).toBe(locales.downloadDocument)
		expect(link.attributes('href')).toBe('blob:fallback')
		expect(link.attributes('download')).toBe('contrat.pdf')

		wrapper.unmount()
	})

	it('does not offer that link when the pdf.js rendering was requested', async () => {
		setNativePdfViewer(true)

		const wrapper = mount(FilePreview, {
			props: { file: pdfFile(), readonly: true, pdfWorkerSrc: 'worker' },
		})
		await flushPromises()

		expect(wrapper.find('.sy-file-preview__download').exists()).toBe(false)

		await wrapper.setProps({ readonly: false, trackConsultation: true })
		await flushPromises()

		expect(wrapper.find('.sy-file-preview__download').exists()).toBe(false)

		wrapper.unmount()
	})

	it('exposes the `alternative` slot in pdf.js rendering, available to screen readers', async () => {
		setNativePdfViewer(false)

		const wrapper = mount(FilePreview, {
			props: { file: pdfFile(), pdfWorkerSrc: 'worker' },
			slots: { alternative: '<p>Équivalent texte du contrat.</p>' },
		})
		await flushPromises()

		const alternative = wrapper.find('.sy-file-preview__alternative')
		expect(alternative.exists()).toBe(true)
		expect(alternative.text()).toBe('Équivalent texte du contrat.')
		expect(alternative.attributes('aria-hidden')).toBeUndefined()

		wrapper.unmount()
	})

	it('does not expose the `alternative` slot in native rendering', async () => {
		setNativePdfViewer(true)

		const wrapper = mount(FilePreview, {
			props: { file: pdfFile() },
			slots: { alternative: '<p>Équivalent texte du contrat.</p>' },
		})
		await flushPromises()

		expect(wrapper.find('object').exists()).toBe(true)
		expect(wrapper.find('.sy-file-preview__alternative').exists()).toBe(false)

		wrapper.unmount()
	})

	it('shows the error and the fallback link when the file is no longer readable', async () => {
		// `Blob.arrayBuffer()` rejette quand la source a disparu depuis sa sélection
		// (fichier déplacé, support retiré) : cet échec doit être traité comme les autres.
		setNativePdfViewer(false)
		const file = pdfFile()
		file.arrayBuffer = () => Promise.reject(new Error('NotReadableError'))

		const wrapper = mount(FilePreview, { props: { file, pdfWorkerSrc: 'worker' } })
		await flushPromises()

		expect(wrapper.text()).toContain(locales.documentError)
		expect(wrapper.text()).not.toContain(locales.loadingDocument)
		expect(wrapper.find('.sy-file-preview__download').exists()).toBe(true)

		wrapper.unmount()
	})

	it('offers no download in readonly mode, even on failure', async () => {
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
