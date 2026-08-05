import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { DOMWrapper, mount } from '@vue/test-utils'

import {
	filePromise,
	filePromiseError,
} from './data/filePromise'
import DownloadBtn from '../DownloadBtn.vue'
import { downloadFile } from '@/utils/functions/downloadFile'

vi.mock('@/utils/functions/downloadFile', () => ({ downloadFile: vi.fn() }))

describe('DownloadBtn', () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let wrapper: any
	let element: DOMWrapper<Element>
	beforeEach(() => {
		wrapper = mount(DownloadBtn, {
			props: {
				filePromise,
			},
		})

		vi.spyOn(wrapper.vm, 'getFileInfo')
		vi.spyOn(wrapper.vm, 'download')

		element = wrapper.find('[data-testid="download-btn"]')
		global.URL.createObjectURL = vi.fn()
		global.URL.revokeObjectURL = vi.fn()
	})
	afterEach(() => {
		wrapper.unmount()
		vi.restoreAllMocks()
	})

	it('renders correctly', async () => {
		expect(DownloadBtn).toBeTruthy()

		expect(element.exists()).toBe(true)
	})

	it('works correctly', async () => {
		await element.trigger('click')

		expect(downloadFile).toHaveBeenCalledTimes(1)
	})

	it('emit error event', async () => {
		await wrapper.setProps({
			filePromise: filePromiseError,
		})

		expect(wrapper.emitted('error')).toBeFalsy()
		expect(wrapper.vm.state).toBe('idle')
		await element.trigger('click')
		expect(wrapper.vm.state).toBe('error')
		expect(wrapper.emitted('error')).toBeTruthy()
	})

	it('with slots', async () => {
		const slot = 'Download'
		wrapper = mount(DownloadBtn, {
			props: {
				filePromise,
			},
			slots: {
				default: slot,
			},
		})

		element = wrapper.find('[data-testid="download-btn"]')
		expect(element.text()).toBe(slot)
	})
})

// Le ring de focus est scopé (jsdom ne calcule pas :focus-visible) : on vérifie les
// prérequis structurels — <button> natif focusable + classe dark pour le ring onPrimary.
describe('DownloadBtn - focus', () => {
	it('renders a native <button> so the focus ring applies', () => {
		const wrapper = mount(DownloadBtn, { props: { filePromise } })
		expect(wrapper.get('.sy-download-btn').element.tagName).toBe('BUTTON')
		wrapper.unmount()
	})

	it('uses dark theme in dark mode (onPrimary focus ring)', () => {
		const wrapper = mount(DownloadBtn, { props: { filePromise, dark: true } })
        expect(wrapper.get('.sy-download-btn').attributes('theme'))
            .toBeUndefined()

        expect(wrapper.html())
            .toContain('v-theme--dark')

        wrapper.unmount()
	})

	it('is focusable', () => {
		const wrapper = mount(DownloadBtn, { props: { filePromise }, attachTo: document.body })
		const button = wrapper.get('.sy-download-btn').element as HTMLButtonElement
		button.focus()
		expect(document.activeElement).toBe(button)
		wrapper.unmount()
	})
})
