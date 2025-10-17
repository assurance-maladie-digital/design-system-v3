import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FileList from '../FileList.vue'import { locales } from '../UploadItem/locales'

describe('FileList', () => {
	it('renders many file items', () => {
		const wrapper = mount(FileList, {
			props: {
				uploadList: [
					{
						id: 'residenceCertificate',
						title: 'Attestation de domicile',
						state: 'initial',
					},
					{
						id: 'identityCard',
						title: 'Carte d\'identité',
						state: 'initial',
					},
				],
			},
		})
		expect(wrapper.findAll('.file-item').length).toBe(2)
		const item1 = wrapper.findAll('.file-item').at(0)
		expect(item1!.text()).toContain('Attestation de domicile')
		const item2 = wrapper.findAll('.file-item').at(1)
		expect(item2!.text()).toContain('Carte d\'identité')
	})

	it('shows the right action for each state and item preference', async () => {
		const wrapper = mount(FileList, {
			props: {
				uploadList: [
					{
						id: 'file1',
						title: 'file1',
						state: 'initial',
					},
					{
						id: 'file2',
						title: 'file2',
						state: 'initial',
						showUploadBtn: false,
					},
					{
						id: 'file3',
						title: 'file3',
						state: 'success',
						showDeleteBtn: true,
						showPreviewBtn: true,
					},
					{
						id: 'file4',
						title: 'file4',
						state: 'success',
						showDeleteBtn: false,
						showPreviewBtn: false,
					},
					{
						id: 'file5',
						title: 'file5',
						state: 'error',
					},
					{
						id: 'file6',
						title: 'file6',
						state: 'error',
						showUploadBtn: false,
					},
				],
			},
		})

		const item1 = wrapper.findAll('.file-item').at(0)
		expect(item1!.findAll('button').length).toBe(1)
		const item1UploadBtn = item1!.find('.file-item__action-upload')
		expect(item1UploadBtn.exists()).toBe(true)

		const item2 = wrapper.findAll('.file-item').at(1)
		expect(item2!.findAll('button').length).toBe(0)

		const item3 = wrapper.findAll('.file-item').at(2)
		expect(item3!.findAll('button').length).toBe(2)
		const item3DeleteBtn = item3!.find('.file-item__action-delete')
		expect(item3DeleteBtn.exists()).toBe(true)
		const item3PreviewBtn = item3!.find('.file-item__action-preview')
		expect(item3PreviewBtn.exists()).toBe(true)

		const item4 = wrapper.findAll('.file-item').at(3)
		expect(item4!.findAll('button').length).toBe(0)

		const item5 = wrapper.findAll('.file-item').at(4)
		expect(item5!.findAll('button').length).toBe(1)
		const item5UploadBtn = item5!.find('.file-item__action-upload')
		expect(item5UploadBtn.exists()).toBe(true)

		const item6 = wrapper.findAll('.file-item').at(5)
		expect(item6!.findAll('button').length).toBe(0)
	})

	it('emits the right event when clicking on an action button', async () => {
		const fileItem1 = {
			id: 'file1',
			title: 'file1',
			state: 'initial',
		}

		const fileItem2 = {
			id: 'file2',
			title: 'file2',
			state: 'success',
			showDeleteBtn: true,
			showPreviewBtn: true,
		}

		const wrapper = mount(FileList, {
			props: {
				uploadList: [fileItem1, fileItem2],
			},
		})

		const item1 = wrapper.findAll('.file-item').at(0)
		const item1UploadBtn = item1!.find('.file-item__action-upload')
		await item1UploadBtn!.trigger('click')
		expect(wrapper.emitted('upload')?.[0][0]).toEqual(fileItem1)

		const item2 = wrapper.findAll('.file-item').at(1)
		const item2DeleteBtn = item2!.find('.file-item__action-delete')
		await item2DeleteBtn!.trigger('click')
		expect(wrapper.emitted('delete')?.[0][0]).toEqual(fileItem2)

		const item2PreviewBtn = item2!.find('.file-item__action-preview')
		await item2PreviewBtn!.trigger('click')
		expect(wrapper.emitted('preview')?.[0][0]).toEqual(fileItem2)
	})

	it('shows when a file is optional', () => {
		const wrapper = mount(FileList, {
			props: {
				uploadList: [
					{
						id: 'file1',
						title: 'file1',
						state: 'initial',
						optional: true,
					},
					{
						id: 'file2',
						title: 'file2',
						state: 'initial',
					},
				],
			},
		})

		const item1 = wrapper.findAll('.file-item').at(0)
		expect(item1!.text()).toContain(locales.optionalDocument)

		const item2 = wrapper.findAll('.file-item').at(1)
		expect(item2!.text()).not.toContain(locales.optionalDocument)
	})
})
