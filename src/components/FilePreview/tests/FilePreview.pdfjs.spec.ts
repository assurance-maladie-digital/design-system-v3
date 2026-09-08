import { describe, it, expect, vi, beforeEach } from 'vitest'
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

describe('FilePreview — pdf.js rendering (consultation tracking & readonly)', () => {
	beforeEach(() => {
		getDocumentMock.mockClear()
	})

	it('renders the pdf.js viewer (and not the <object>) when trackConsultation is enabled', async () => {
		const wrapper = mount(FilePreview, {
			props: { file: pdfFile(), trackConsultation: true, pdfWorkerSrc: 'worker' },
		})
		await flushPromises()

		expect(wrapper.find('.sy-file-preview__pdf-viewer').exists()).toBe(true)
		expect(wrapper.find('object').exists()).toBe(false)
		expect(getDocumentMock).toHaveBeenCalled()
	})

	it('names the viewer after the document, not after an error message', async () => {
		const wrapper = mount(FilePreview, {
			props: { file: pdfFile(), readonly: true, pdfWorkerSrc: 'worker' },
		})
		await flushPromises()

		const viewer = wrapper.find('.sy-file-preview__pdf-viewer')
		expect(viewer.attributes('aria-label')).toBe(locales.documentLabel)
		expect(viewer.attributes('aria-label')).not.toBe(locales.previewNotAvailable)

		wrapper.unmount()
	})

	it('emits @loaded with the page count', async () => {
		const wrapper = mount(FilePreview, {
			props: { file: pdfFile(), trackConsultation: true, pdfWorkerSrc: 'worker' },
		})
		await flushPromises()

		expect(wrapper.emitted('loaded')?.[0]).toEqual([2])
	})

	it('emits update:complete=true once when the end is reached (v-model:complete)', async () => {
		const wrapper = mount(FilePreview, {
			props: { file: pdfFile(), trackConsultation: true, pdfWorkerSrc: 'worker' },
		})
		await flushPromises()

		const viewerEl = wrapper.find('.sy-file-preview__pdf-viewer').element
		Object.defineProperty(viewerEl, 'scrollHeight', { value: 1000, configurable: true })
		Object.defineProperty(viewerEl, 'clientHeight', { value: 400, configurable: true })
		Object.defineProperty(viewerEl, 'scrollTop', { value: 600, configurable: true })

		await wrapper.find('.sy-file-preview__pdf-viewer').trigger('scroll')
		await wrapper.find('.sy-file-preview__pdf-viewer').trigger('scroll')

		expect(wrapper.emitted('update:complete')).toHaveLength(1)
		expect(wrapper.emitted('update:complete')?.[0]).toEqual([true])
	})

	it('readonly: renders the pdf.js viewer (no <object>) without tracking consultation', async () => {
		const wrapper = mount(FilePreview, {
			props: { file: pdfFile(), readonly: true, pdfWorkerSrc: 'worker' },
		})
		await flushPromises()

		expect(wrapper.find('.sy-file-preview__pdf-viewer').exists()).toBe(true)
		expect(wrapper.find('object').exists()).toBe(false)
		expect(getDocumentMock).toHaveBeenCalled()

		// @loaded est un signal de rendu : émis même en readonly seul (sans trackConsultation)
		expect(wrapper.emitted('loaded')?.[0]).toEqual([2])

		// Le scroll ne déclenche aucun suivi de consultation en lecture seule
		const viewerEl = wrapper.find('.sy-file-preview__pdf-viewer').element
		Object.defineProperty(viewerEl, 'scrollHeight', { value: 1000, configurable: true })
		Object.defineProperty(viewerEl, 'clientHeight', { value: 400, configurable: true })
		Object.defineProperty(viewerEl, 'scrollTop', { value: 600, configurable: true })
		await wrapper.find('.sy-file-preview__pdf-viewer').trigger('scroll')

		expect(wrapper.emitted('update:complete')).toBeUndefined()
	})

	it('creates no object URL in embedded pdf.js rendering (fileURL is not needed)', async () => {
		const orig = URL.createObjectURL
		const createSpy = vi.fn(() => 'blob:x')
		URL.createObjectURL = createSpy

		const wrapper = mount(FilePreview, {
			props: { file: pdfFile(), readonly: true, pdfWorkerSrc: 'worker' },
		})
		await flushPromises()

		// Le viewer pdf.js affiche le PDF via arrayBuffer() : aucune URL objet créée
		expect(createSpy).not.toHaveBeenCalled()

		wrapper.unmount()
		URL.createObjectURL = orig
	})

	it('keeps the <object> and does not load pdf.js by default (trackConsultation=false)', async () => {
		const wrapper = mount(FilePreview, {
			props: { file: pdfFile() },
		})
		await flushPromises()

		expect(wrapper.find('object').exists()).toBe(true)
		expect(wrapper.find('.sy-file-preview__pdf-viewer').exists()).toBe(false)
		expect(getDocumentMock).not.toHaveBeenCalled()
		// @loaded n'est pas émis en mode natif (<object>) : pas de nombre de pages sans pdf.js
		expect(wrapper.emitted('loaded')).toBeUndefined()
	})

	it('does not enable tracking for a non-PDF file', async () => {
		const image = new File(['img'], 'photo.png', { type: 'image/png' })
		const wrapper = mount(FilePreview, {
			props: { file: image, trackConsultation: true, pdfWorkerSrc: 'worker' },
		})
		await flushPromises()

		expect(wrapper.find('.sy-file-preview__pdf-viewer').exists()).toBe(false)
		expect(wrapper.find('img').exists()).toBe(true)
		expect(getDocumentMock).not.toHaveBeenCalled()
	})

	it('v-model:complete goes back to false when the document changes', async () => {
		const wrapper = mount(FilePreview, {
			props: { file: pdfFile(), trackConsultation: true, pdfWorkerSrc: 'worker' },
		})
		await flushPromises()

		// Atteinte de la fin sur le premier document
		const viewerEl = wrapper.find('.sy-file-preview__pdf-viewer').element
		Object.defineProperty(viewerEl, 'scrollHeight', { value: 1000, configurable: true })
		Object.defineProperty(viewerEl, 'clientHeight', { value: 400, configurable: true })
		Object.defineProperty(viewerEl, 'scrollTop', { value: 600, configurable: true })
		await wrapper.find('.sy-file-preview__pdf-viewer').trigger('scroll')
		expect(wrapper.emitted('update:complete')?.at(-1)).toEqual([true])

		// Chargement d'un nouveau document → l'état de consultation est réinitialisé
		await wrapper.setProps({ file: pdfFile() })
		await flushPromises()

		expect(wrapper.emitted('update:complete')).toContainEqual([false])
	})

	it('readonly + trackConsultation: embedded rendering AND consultation tracking enabled', async () => {
		const wrapper = mount(FilePreview, {
			props: { file: pdfFile(), readonly: true, trackConsultation: true, pdfWorkerSrc: 'worker' },
		})
		await flushPromises()

		expect(wrapper.find('.sy-file-preview__pdf-viewer').exists()).toBe(true)
		expect(wrapper.find('object').exists()).toBe(false)

		const viewerEl = wrapper.find('.sy-file-preview__pdf-viewer').element
		Object.defineProperty(viewerEl, 'scrollHeight', { value: 1000, configurable: true })
		Object.defineProperty(viewerEl, 'clientHeight', { value: 400, configurable: true })
		Object.defineProperty(viewerEl, 'scrollTop', { value: 600, configurable: true })
		await wrapper.find('.sy-file-preview__pdf-viewer').trigger('scroll')

		expect(wrapper.emitted('update:complete')?.at(-1)).toEqual([true])
	})

	it('readonly: blocks the context menu (right click)', async () => {
		const wrapper = mount(FilePreview, {
			props: { file: pdfFile(), readonly: true, pdfWorkerSrc: 'worker' },
		})
		await flushPromises()

		const viewer = wrapper.find('.sy-file-preview__pdf-viewer').element
		const event = new Event('contextmenu', { cancelable: true })
		viewer.dispatchEvent(event)

		expect(event.defaultPrevented).toBe(true)
	})

	it('does not block the context menu in tracking-only mode (without readonly)', async () => {
		const wrapper = mount(FilePreview, {
			props: { file: pdfFile(), trackConsultation: true, pdfWorkerSrc: 'worker' },
		})
		await flushPromises()

		const viewer = wrapper.find('.sy-file-preview__pdf-viewer').element
		const event = new Event('contextmenu', { cancelable: true })
		viewer.dispatchEvent(event)

		expect(event.defaultPrevented).toBe(false)
	})

	it('adds then removes the context-menu blocking when readonly changes', async () => {
		// trackConsultation garde le viewer monté quel que soit readonly : on teste donc
		// bien le toggle de readonly sur un même élément DOM
		const wrapper = mount(FilePreview, {
			props: { file: pdfFile(), trackConsultation: true, readonly: false, pdfWorkerSrc: 'worker' },
		})
		await flushPromises()

		const viewer = wrapper.find('.sy-file-preview__pdf-viewer').element

		const dispatch = () => {
			const event = new Event('contextmenu', { cancelable: true })
			viewer.dispatchEvent(event)
			return event.defaultPrevented
		}

		// readonly = false : pas de listener → non bloqué
		expect(dispatch()).toBe(false)

		// readonly = true : listener attaché → bloqué
		await wrapper.setProps({ readonly: true })
		await flushPromises()
		expect(dispatch()).toBe(true)

		// readonly = false : listener retiré → de nouveau non bloqué
		await wrapper.setProps({ readonly: false })
		await flushPromises()
		expect(dispatch()).toBe(false)
	})
})
