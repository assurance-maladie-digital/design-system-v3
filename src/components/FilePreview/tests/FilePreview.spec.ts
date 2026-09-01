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

	it('revokes the previous object URL when the file changes (no memory leak)', async () => {
		// Mocks locaux avec restauration manuelle pour ne pas polluer les autres tests.
		const origCreate = URL.createObjectURL
		const origRevoke = URL.revokeObjectURL
		const revokeSpy = vi.fn()
		URL.createObjectURL = vi.fn()
			.mockReturnValueOnce('blob:first')
			.mockReturnValueOnce('blob:second')
		URL.revokeObjectURL = revokeSpy

		const localWrapper = mount(FilePreview, { props: { file: testFileImg } })
		await localWrapper.vm.$nextTick()

		// Première URL créée : rien à révoquer encore (garde sur URL vide)
		expect(revokeSpy).not.toHaveBeenCalled()

		// Changement de fichier : l'ancienne URL doit être révoquée AVANT d'en créer une nouvelle
		await localWrapper.setProps({ file: testFilePdf })

		expect(revokeSpy).toHaveBeenCalledWith('blob:first')

		localWrapper.unmount()
		URL.createObjectURL = origCreate
		URL.revokeObjectURL = origRevoke
	})

	it('keeps the object URL alive after the preview has loaded', async () => {
		// Régression : révoquer l'URL sur @load cassait les actions du viewer natif
		// (téléchargement, impression, rechargement) qui re-sollicitent l'URL.
		const origCreate = URL.createObjectURL
		const origRevoke = URL.revokeObjectURL
		const revokeSpy = vi.fn()
		URL.createObjectURL = vi.fn().mockReturnValue('blob:alive')
		URL.revokeObjectURL = revokeSpy

		const localWrapper = mount(FilePreview, { props: { file: testFilePdf } })
		await localWrapper.vm.$nextTick()

		await localWrapper.find('object').trigger('load')

		expect(revokeSpy).not.toHaveBeenCalled()
		expect(localWrapper.find('object').attributes('data')).toBe('blob:alive')

		await localWrapper.setProps({ file: testFileImg })
		await localWrapper.find('img').trigger('load')

		expect(revokeSpy).toHaveBeenCalledTimes(1)
		expect(revokeSpy).toHaveBeenCalledWith('blob:alive')
		expect(localWrapper.find('img').attributes('src')).toBe('blob:alive')

		localWrapper.unmount()
		URL.createObjectURL = origCreate
		URL.revokeObjectURL = origRevoke
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
