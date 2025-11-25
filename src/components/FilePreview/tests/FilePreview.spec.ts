import { describe, it, expect, vi, beforeEach } from 'vitest'
import { VueWrapper, mount } from '@vue/test-utils'

import FilePreview from '../FilePreview.vue'
import { locales } from '../locales'

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
