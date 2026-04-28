import { describe, it, expect, vi, beforeEach } from 'vitest'
import { VueWrapper, mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

import FilePreview from '../FilePreview.vue'
import { locales } from '../locales'

vi.mock('../SyPdfViewer.vue', () => ({
	default: defineComponent({
		name: 'SyPdfViewer',
		props: {
			fileURL: String,
			height: String,
			toolbarColor: String,
			canvasBackground: String,
			locales: Object,
		},
		template: '<div class="sy-pdf-viewer-mock" />',
	}),
}))

const testFileImg = {
	name: 'avatar.png',
	size: 1000,
	type: 'image/png',
} as File

const testFilePdf = {
	name: 'document.pdf',
	size: 1000,
	type: 'application/pdf',
} as File

describe('FilePreview', async () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let wrapper: VueWrapper<any>
	global.URL.createObjectURL = vi.fn()

	beforeEach(() => {
		wrapper = mount(FilePreview)
	})

	it('renders correctly with an image', async () => {
		await wrapper.setProps({ file: testFileImg })

		expect(wrapper.html()).toMatchSnapshot()

		wrapper.unmount()
	})

	it('renders correctly with a pdf', async () => {
		await wrapper.setProps({ file: testFilePdf })

		expect(wrapper.html()).toMatchSnapshot()

		wrapper.unmount()
	})

	it('render correctly with a file that is not an image or pdf', async () => {
		await wrapper.setProps({
			file: {
				name: 'document.txt',
				size: 1000,
				type: 'text/plain',
			} as File,
		})

		expect(wrapper.text()).toContain(locales.previewTypeNotAvailable)

		wrapper.unmount()
	})

	it('updates the preview when the file changes', async () => {
		await wrapper.setProps({ file: testFileImg })

		expect(wrapper.find('img').exists()).toBe(true)

		await wrapper.setProps({
			file: testFilePdf,
		})

		expect(wrapper.find('img').exists()).toBe(false)
		expect(wrapper.find('object').exists()).toBe(true)

		await wrapper.setProps({
			file: null,
		})

		expect(wrapper.find('img').exists()).toBe(false)
		expect(wrapper.find('object').exists()).toBe(false)
		expect(wrapper.text()).toBe('')

		wrapper.unmount()
	})

	it('renders SyPdfViewer instead of object when readOnly is true', async () => {
		await wrapper.setProps({ file: testFilePdf, readOnly: true })

		expect(wrapper.find('object').exists()).toBe(false)
		expect(wrapper.findComponent({ name: 'SyPdfViewer' }).exists()).toBe(true)

		wrapper.unmount()
	})

	it('renders object when readOnly is false (default)', async () => {
		await wrapper.setProps({ file: testFilePdf, readOnly: false })

		expect(wrapper.find('object').exists()).toBe(true)
		expect(wrapper.findComponent({ name: 'SyPdfViewer' }).exists()).toBe(false)

		wrapper.unmount()
	})

	it('does not render SyPdfViewer for an image even when readOnly is true', async () => {
		await wrapper.setProps({ file: testFileImg, readOnly: true })

		expect(wrapper.findComponent({ name: 'SyPdfViewer' }).exists()).toBe(false)
		expect(wrapper.find('img').exists()).toBe(true)

		wrapper.unmount()
	})

	it('switches from SyPdfViewer to img when file changes from pdf to image in readOnly mode', async () => {
		await wrapper.setProps({ file: testFilePdf, readOnly: true })
		expect(wrapper.findComponent({ name: 'SyPdfViewer' }).exists()).toBe(true)

		await wrapper.setProps({ file: testFileImg })
		expect(wrapper.findComponent({ name: 'SyPdfViewer' }).exists()).toBe(false)
		expect(wrapper.find('img').exists()).toBe(true)

		wrapper.unmount()
	})

	it('passes height option to SyPdfViewer', async () => {
		await wrapper.setProps({
			file: testFilePdf,
			readOnly: true,
			options: { pdf: { height: '800px' } },
		})

		const viewer = wrapper.findComponent({ name: 'SyPdfViewer' })
		expect(viewer.props('height')).toBe('800px')

		wrapper.unmount()
	})

	it('passes toolbarColor and canvasBackground options to SyPdfViewer', async () => {
		await wrapper.setProps({
			file: testFilePdf,
			readOnly: true,
			options: { pdf: { toolbarColor: '#ff0000', canvasBackground: '#000000' } },
		})

		const viewer = wrapper.findComponent({ name: 'SyPdfViewer' })
		expect(viewer.props('toolbarColor')).toBe('#ff0000')
		expect(viewer.props('canvasBackground')).toBe('#000000')

		wrapper.unmount()
	})

	it('passes custom locales to SyPdfViewer', async () => {
		const customLocales = {
			...locales,
			pdfLoading: 'Chargement personnalisé...',
		}

		await wrapper.setProps({ file: testFilePdf, readOnly: true, locales: customLocales })

		const viewer = wrapper.findComponent({ name: 'SyPdfViewer' })
		expect(viewer.props('locales')).toMatchObject({ pdfLoading: 'Chargement personnalisé...' })

		wrapper.unmount()
	})

	it('calls revokeObjectURL on unmount', async () => {
		const revokeSpy = vi.spyOn(URL, 'revokeObjectURL')
		await wrapper.setProps({ file: testFileImg })

		wrapper.unmount()

		expect(revokeSpy).toHaveBeenCalled()
	})

	it('renders default slot content for unsupported file type', async () => {
		const slotWrapper = mount(FilePreview, {
			props: {
				file: { name: 'doc.txt', size: 100, type: 'text/plain' } as File,
			},
			slots: {
				default: '<span class="custom-slot">Aperçu non disponible</span>',
			},
		})

		expect(slotWrapper.find('.custom-slot').exists()).toBe(true)
		expect(slotWrapper.text()).toContain('Aperçu non disponible')

		slotWrapper.unmount()
	})

	it('with options', async () => {
		await wrapper.setProps({
			file: testFileImg,
			options: {
				image: {
					alt: 'Photo de paysage montagneux.',
				},
			},
		})

		expect(wrapper.html()).toMatchSnapshot()

		wrapper.unmount()
	})

	it('show an error when the type is not supported', async () => {
		await wrapper.setProps({
			file: {
				name: 'document.txt',
				size: 1000,
				type: 'text/plain',
			} as File,
		})

		expect(wrapper.text()).toContain(locales.previewTypeNotAvailable)

		wrapper.unmount()
	})

	it('show nothing when the file is null', async () => {
		await wrapper.setProps({
			file: null,
		})

		expect(wrapper.html()).toMatchInlineSnapshot(`<!-- v-if -->`)

		wrapper.unmount()
	})
})
