import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import FilePreview from '../FilePreview.vue'

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

describe('FilePreview — rendu pdf.js (suivi de consultation & lecture seule)', () => {
	beforeEach(() => {
		getDocumentMock.mockClear()
	})

	it('rend le viewer pdf.js (et pas l\'<object>) quand trackConsultation est activé', async () => {
		const wrapper = mount(FilePreview, {
			props: { file: pdfFile(), trackConsultation: true, pdfWorkerSrc: 'worker' },
		})
		await flushPromises()

		expect(wrapper.find('.sy-file-preview__pdf-viewer').exists()).toBe(true)
		expect(wrapper.find('object').exists()).toBe(false)
		expect(getDocumentMock).toHaveBeenCalled()
	})

	it('émet @loaded avec le nombre de pages', async () => {
		const wrapper = mount(FilePreview, {
			props: { file: pdfFile(), trackConsultation: true, pdfWorkerSrc: 'worker' },
		})
		await flushPromises()

		expect(wrapper.emitted('loaded')?.[0]).toEqual([2])
	})

	it('émet update:complete=true une seule fois quand la fin est atteinte (v-model:complete)', async () => {
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

	it('readonly : rend le viewer pdf.js (pas d\'<object>) sans suivre la consultation', async () => {
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

	it('par défaut (trackConsultation=false) garde l\'<object> et ne charge pas pdf.js', async () => {
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

	it('n\'active pas le suivi pour un fichier non-PDF', async () => {
		const image = new File(['img'], 'photo.png', { type: 'image/png' })
		const wrapper = mount(FilePreview, {
			props: { file: image, trackConsultation: true, pdfWorkerSrc: 'worker' },
		})
		await flushPromises()

		expect(wrapper.find('.sy-file-preview__pdf-viewer').exists()).toBe(false)
		expect(wrapper.find('img').exists()).toBe(true)
		expect(getDocumentMock).not.toHaveBeenCalled()
	})

	it('v-model:complete revient à false au changement de document', async () => {
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

	it('readonly + trackConsultation : rendu embarqué ET suivi de consultation actif', async () => {
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

	it('readonly : bloque le menu contextuel (clic droit)', async () => {
		const wrapper = mount(FilePreview, {
			props: { file: pdfFile(), readonly: true, pdfWorkerSrc: 'worker' },
		})
		await flushPromises()

		const viewer = wrapper.find('.sy-file-preview__pdf-viewer').element
		const event = new Event('contextmenu', { cancelable: true })
		viewer.dispatchEvent(event)

		expect(event.defaultPrevented).toBe(true)
	})

	it('ne bloque pas le menu contextuel en mode suivi seul (sans readonly)', async () => {
		const wrapper = mount(FilePreview, {
			props: { file: pdfFile(), trackConsultation: true, pdfWorkerSrc: 'worker' },
		})
		await flushPromises()

		const viewer = wrapper.find('.sy-file-preview__pdf-viewer').element
		const event = new Event('contextmenu', { cancelable: true })
		viewer.dispatchEvent(event)

		expect(event.defaultPrevented).toBe(false)
	})

	it('active puis retire le blocage du menu contextuel quand readonly change', async () => {
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
