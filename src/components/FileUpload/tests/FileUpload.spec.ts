import { vuetify } from '@tests/unit/setup'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import FileUpload from '../FileUpload.vue'

const file: File = new File([''], 'filename', { type: 'text/html' })

describe('FileUpload', () => {
	const consoleMock = vi
		.spyOn(console, 'warn')
		.mockImplementation(() => undefined)

	afterEach(() => {
		consoleMock.mockReset()
	})

	it('renders correctly', () => {
		const wrapper = mount(FileUpload, {
			global: {
				plugins: [vuetify],
			},
		})

		expect(wrapper.text()).toMatchSnapshot()
	})

	it('renders correctly in multiple mode', () => {
		const wrapper = mount(FileUpload, {
			global: {
				plugins: [vuetify],
			},
			propsData: {
				multiple: true,
				modelValue: [file, file],
			},
		})

		expect(wrapper.text()).toMatchSnapshot()
	})

	it('renders correctly with only one extension allowed', () => {
		const wrapper = mount(FileUpload, {
			global: {
				plugins: [vuetify],
			},
			propsData: {
				allowedExtensions: ['pdf'],
				modelValue: [file],
			},
		})

		expect(wrapper.text()).toMatchSnapshot()
	})

	it('change the style when dragging', async () => {
		const wrapper = mount(FileUpload, {
			global: {
				plugins: [vuetify],
			},
		})

		const label = wrapper.find('label')
		const labelClasses = label.classes()

		await wrapper.find('input').trigger('dragover')
		expect(label.classes()).not.toEqual(labelClasses)

		await wrapper.find('input').trigger('dragleave')
		expect(label.classes()).toEqual(labelClasses)
	})

	it('accepts the drop of a file with the correct extension', async () => {
		const wrapper = mount(FileUpload, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: [],
				allowedExtensions: ['pdf'],
			},
		})

		const file: File = new File([''], 'filename.pdf', { type: 'application/pdf' })

		await wrapper.find('input').trigger('drop', {
			dataTransfer: {
				files: [file],
			},
		})

		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
		expect(wrapper.emitted('error')).toBeFalsy()
	})

	it('accepts the drop of many files', async () => {
		const wrapper = mount(FileUpload, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: [],
				multiple: true,
				allowedExtensions: ['pdf'],
			},
		})

		const file: File = new File([''], 'filename.pdf', { type: 'application/pdf' })

		await wrapper.find('label').trigger('drop', {
			dataTransfer: {
				files: [file],
			},
		})

		await wrapper.find('label').trigger('drop', {
			dataTransfer: {
				files: [file, file],
			},
		})

		expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[file, file, file]])
		expect(wrapper.emitted('error')).toBeFalsy()
	})

	it('rejects the drop of a file with the wrong extension', async () => {
		const wrapper = mount(FileUpload, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: [],
				allowedExtensions: ['pdf'],
			},
		})

		const file: File = new File([''], 'filename.jpg', { type: 'image/jpeg' })

		await wrapper.find('input').trigger('drop', {
			dataTransfer: {
				files: [file],
			},
		})

		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(undefined)
		expect(wrapper.emitted('error')?.[0]).toEqual([['Le fichier filename.jpg a une extension invalide. Extensions acceptées : pdf']])
	})

	it('rejects the drop of a file with the wrong extension in multiple mode', async () => {
		const pdfFile: File = new File([''], 'filename.pdf', { type: 'application/pdf' })
		const jpgFile: File = new File([''], 'filename.jpg', { type: 'image/jpeg' })

		const wrapper = mount(FileUpload, {
			global: {
				plugins: [vuetify],
			},
			props: {
				multiple: true,
				modelValue: [pdfFile],
				allowedExtensions: ['pdf'],
			},
		})

		await wrapper.find('label').trigger('drop', {
			dataTransfer: {
				files: [jpgFile],
			},
		})

		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(undefined)
		expect(wrapper.emitted('error')?.[0]).toEqual([['Le fichier filename.jpg a une extension invalide. Extensions acceptées : pdf']])

		await wrapper.find('label').trigger('drop', {
			dataTransfer: {
				files: [pdfFile],
			},
		})

		expect(wrapper.emitted('error')?.[1]).toBeFalsy()
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[pdfFile, pdfFile]])
	})

	it('rejects the drop of a file that is too big', async () => {
		const wrapper = mount(FileUpload, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: [],
				fileSizeMax: 1,
			},
		})

		const file: File = new File(['42'], 'filename.jpg', { type: 'image/jpeg' })

		await wrapper.find('label').trigger('drop', {
			dataTransfer: {
				files: [file],
			},
		})

		expect(wrapper.emitted('update:modelValue')).toBe(undefined)
		expect(wrapper.emitted('error')?.[0]).toEqual([['Le fichier filename.jpg est trop volumineux. Taille max. : 1 o']])
	})

	it('do nothing if no file is dropped', async () => {
		const wrapper = mount(FileUpload, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: [],
			},
		})

		await wrapper.find('label').trigger('drop', {
			dataTransfer: {
				files: [],
			},
		})

		expect(wrapper.emitted('update:modelValue')).toBeFalsy()
		expect(wrapper.emitted('error')).toBeFalsy()
	})

	it('allow any extension if allowedExtensions is empty', async () => {
		const wrapper = mount(FileUpload, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: [],
				allowedExtensions: [],
			},
		})

		const file: File = new File([''], 'filename.xyz', { type: 'unknown' })

		await wrapper.find('label').trigger('drop', {
			dataTransfer: {
				files: [file],
			},
		})

		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[file]])
		expect(wrapper.emitted('error')).toBeFalsy()
	})

	it('do nothing if the field is disabled', async () => {
		const wrapper = mount(FileUpload, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: [],
				disabled: true,
			},
		})

		await wrapper.find('label').trigger('drop', {
			dataTransfer: {
				files: [file],
			},
		})

		expect(wrapper.emitted('update:modelValue')).toBeFalsy()
		expect(wrapper.emitted('error')).toBeFalsy()
	})

	it('if many files are dropped in single mode, only the first one is kept', async () => {
		const wrapper = mount(FileUpload, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: [],
			},
		})

		const file1: File = new File([''], 'filename1.jpg', { type: 'image/jpeg' })
		const file2: File = new File([''], 'filename2.jpg', { type: 'image/jpeg' })

		await wrapper.find('label').trigger('drop', {
			dataTransfer: {
				files: [file1, file2],
			},
		})

		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[file1]])
		expect(wrapper.emitted('error')).toBeFalsy()
	})

	it('update the field when the input changes', async () => {
		const file1 = new File([''], 'filename1.jpg', { type: 'image/jpeg' })
		const file2 = new File([''], 'filename2.jpg', { type: 'image/jpeg' })
		const wrapper = mount(FileUpload, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: [file1],
			},
		})

		const input = wrapper.find('input')
		input.element.files = [file2] as unknown as FileList
		await input.trigger('change')

		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[file2]])
		expect(wrapper.emitted('error')).toBeFalsy()
	})

	it('add the new files to the existing ones when the input changes in multiple mode', async () => {
		const file1 = new File([''], 'filename1.jpg', { type: 'image/jpeg' })
		const file2 = new File([''], 'filename2.jpg', { type: 'image/jpeg' })
		const wrapper = mount(FileUpload, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: [file1],
				multiple: true,
			},
		})

		const input = wrapper.find('input')
		input.element.files = [file2] as unknown as FileList
		await input.trigger('change')

		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[file1, file2]])
		expect(wrapper.emitted('error')).toBeFalsy()
	})
})
