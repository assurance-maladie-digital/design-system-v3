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

describe('FilePreview — suivi de consultation', () => {
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

	it('par défaut (trackConsultation=false) garde l\'<object> et ne charge pas pdf.js', async () => {
		const wrapper = mount(FilePreview, {
			props: { file: pdfFile() },
		})
		await flushPromises()

		expect(wrapper.find('object').exists()).toBe(true)
		expect(wrapper.find('.sy-file-preview__pdf-viewer').exists()).toBe(false)
		expect(getDocumentMock).not.toHaveBeenCalled()
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
})
