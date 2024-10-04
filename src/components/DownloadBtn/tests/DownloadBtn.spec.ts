import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { DOMWrapper, mount, type VueWrapper } from '@vue/test-utils'
import { vuetify } from '@tests/unit/setup'

import {
	filePromise,
	filePromiseError,
	filePromiseNoHeaders,
} from './data/filePromise'
import DownloadBtn from '../DownloadBtn.vue'

describe('DownloadBtn', () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let wrapper: VueWrapper<any>
	let element: DOMWrapper<Element>
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let spyGetFileInfo: any
	beforeEach(() => {
		spyGetFileInfo = vi.spyOn(DownloadBtn.vm, 'getFileInfo')
		vi.spyOn(DownloadBtn.vm, 'download')
		wrapper = mount(DownloadBtn, {
			props: {
				filePromise,
			},
			global: {
				plugins: [vuetify],
			},
		})
		element = wrapper.find('[data-testid="download-btn"]')
		global.URL.createObjectURL = vi.fn()
		global.URL.revokeObjectURL = vi.fn()
	})
	afterEach(() => {
		wrapper?.unmount()
		vi.restoreAllMocks()
	})

	it('renders correctly', async () => {
		expect(DownloadBtn).toBeTruthy()

		expect(element.exists()).toBe(true)

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('works correctly', async () => {
		expect(wrapper.vm).toBeTruthy()
		expect(wrapper.vm.download).toBeTruthy()

		expect(wrapper.vm.state).toBe('idle')
		element.trigger('click')
		expect(wrapper.vm.state).toBe('loading')
		await wrapper.vm.$nextTick()

		expect(spyGetFileInfo).toHaveBeenCalledTimes(1)
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
			global: {
				plugins: [vuetify],
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('with fallbackFilename', async () => {
		const filename = 'test'
		await wrapper.setProps({ fallbackFilename: filename })
		await wrapper.setProps({ filePromise: filePromiseNoHeaders })

		await element.trigger('click')
		expect(wrapper.vm.download).toHaveBeenCalledTimes(1)
	})

	it('without header', async () => {
		await wrapper.setProps({ filePromise: filePromiseNoHeaders })

		await element.trigger('click')
		expect(wrapper.vm.download).toHaveBeenCalledTimes(1)
	})
})
