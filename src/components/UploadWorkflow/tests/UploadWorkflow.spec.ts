import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { vuetify } from '@tests/unit/setup'

import UploadWorkflow from '../UploadWorkflow.vue'
import { locales as fileListLocales } from '@/components/FileList/UploadItem/locales'
import { locales as FileUploadLocales } from '@/components/FileUpload/locales'
import { afterEach } from 'node:test'
import { VSelect } from 'vuetify/components'

describe('UploadWorkflow', () => {
	afterEach(() => {
		vi.clearAllMocks()
		document.body.innerHTML = ''
	})

	it('render the upload list', async () => {
		const wrapper = mount(UploadWorkflow, {
			props: {
				uploadList: [
					{
						id: 'ID',
						title: 'Carte d\'identité',
					},
					{
						id: 'bill',
						title: 'Facture de soin',
					},
				],
			},
			global: {
				plugins: [vuetify],
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
		expect(wrapper.findAll('.file-item')).toHaveLength(2)
		expect(wrapper.find('.sy-file-upload').isVisible()).toBeTruthy()
	})

	it('shows the file in the list when set with the list button', async () => {
		const wrapper = mount(UploadWorkflow, {
			props: {
				uploadList: [
					{
						id: 'ID',
						title: 'Carte d\'identité',
					},
					{
						id: 'bill',
						title: 'Facture de soin',
					},
				],
			},
			global: {
				plugins: [vuetify],
			},
		})

		await wrapper.find('.file-item button').trigger('click')

		const file: File = new File([''], 'theFilename.pdf', {
			type: 'application/pdf',
		})

		await wrapper.find('input').trigger('drop', {
			dataTransfer: {
				files: [file],
			},
		})

		expect(wrapper.find('.file-item').text()).toContain('theFilename.pdf')
		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
	})

	it('shows the item as error in the list when set with the list button', async () => {
		const wrapper = mount(UploadWorkflow, {
			props: {
				uploadList: [
					{
						id: 'ID',
						title: 'Carte d\'identité',
					},
					{
						id: 'bill',
						title: 'Facture de soin',
					},
				],
			},
			global: {
				plugins: [vuetify],
			},
		})

		await wrapper.findAll('.file-item button')[1].trigger('click')

		const file: File = new File([''], 'theFilename.invalid', {
			type: 'application/invalid',
		})

		const input = wrapper.find('input')
		input.element.files = [file] as unknown as FileList
		await input.trigger('change')

		expect(wrapper.emitted('error')).toEqual([
			[
				[
					FileUploadLocales.errorExtension('theFilename.invalid', [
						'pdf',
						'jpg',
						'jpeg',
						'png',
					]),
				],
			],
		])
		expect(wrapper.findAll('.file-item')[1].text()).toContain(
			fileListLocales.error,
		)
	})

	it('accept the file when we use the FileUpload component with many items in the uploadList', async () => {
		const wrapper = mount(UploadWorkflow, {
			props: {
				uploadList: [
					{
						id: 'ID',
						title: 'Carte d\'identité',
					},
					{
						id: 'bill',
						title: 'Facture de soin',
					},
				],
			},
			global: {
				plugins: [vuetify],
				stubs: {
					VDialog: {
						template: '<div><slot /></div>',
					},
				},
			},
		})

		const file: File = new File([''], 'uploadInField.pdf', {
			type: 'application/pdf',
		})

		await wrapper.find('input').trigger('drop', {
			dataTransfer: {
				files: [file],
			},
		})

		wrapper.find('.v-select input').setValue('bill')
		wrapper.findComponent(VSelect).vm.$emit('update:modelValue', 'bill')

		await wrapper.find('[data-test-id="confirm-btn"]').trigger('click')

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		expect((wrapper.emitted('update:modelValue')?.[0][0] as any[]).find(item => item.fileName === 'uploadInField.pdf')).toBeTruthy()

		expect(wrapper.findAll('.file-item')[1].text()).toContain('uploadInField.pdf')
	})

	it('replace the selected file', async () => {
		const wrapper = mount(UploadWorkflow, {
			props: {
				uploadList: [
					{
						id: 'ID',
						title: 'Carte d\'identité',
					},
					{
						id: 'bill',
						title: 'Facture de soin',
					},
				],
				modelValue: [
					{
						fileName: 'file1.pdf',
						file: new File([''], 'file1.pdf', {
							type: 'application/pdf',
						}),
						id: 'ID',
						title: 'Carte d\'identité',
					},
				],
			},
			global: {
				plugins: [vuetify],
			},
		})

		await wrapper.find('.file-item button').trigger('click')

		const file: File = new File([''], 'file2.pdf', {
			type: 'application/pdf',
		})

		await wrapper.find('input').trigger('drop', {
			dataTransfer: {
				files: [file],
			},
		})

		expect(wrapper.find('.file-item').text()).toContain('file2.pdf')
	})

	it('show the preview of an image', async () => {
		const wrapper = mount(UploadWorkflow, {
			props: {
				modelValue: [],
				uploadList: [
					{
						id: 'CERFA1',
						title: 'CERFA 1',
						showPreviewBtn: true,
					},
					{
						id: 'CERFA2',
						title: 'CERFA 2',
						showPreviewBtn: true,
					},
				],
				showFilePreview: false,
			},
			global: {
				plugins: [vuetify],
				stubs: {
					VDialog: {
						template: '<div><slot /></div>',
					},
				},
			},
		})

		const image = new File(
			[Buffer.from([100, 97, 116, 97, 58, 14, 79, 8, 113, 97, 65, 43, 57, 55, 89, 69, 88, 51, 66, 101, 70, 86, 112, 121, 112, 121, 121, 121, 80, 81, 104])],
			'image.png',
			{ type: 'image/png' },
		)

		await wrapper.find('.file-item button').trigger('click')

		await wrapper.find('input').trigger('drop', {
			dataTransfer: {
				files: [image],
			},
		})

		await wrapper.find('.file-item__action-preview').trigger('click')

		expect(wrapper.find('.sy-file-preview img').exists()).toBeTruthy()
	})
})
