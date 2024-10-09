import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { DOMWrapper, mount } from '@vue/test-utils'

import {
	filePromise,
	filePromiseError,
} from './data/filePromise'
import DownloadBtn from '../DownloadBtn.vue'
import { vuetify } from '@tests/unit/setup'
import { downloadFile } from '@/utils/functions/downloadFile'

describe('DownloadBtn', () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let wrapper: any
	let element: DOMWrapper<Element>
	beforeEach(() => {
		wrapper = mount(DownloadBtn, {
			props: {
				filePromise,
			},
			global: {
				plugins: [vuetify],
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

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('works correctly', async () => {
		vi.mock('@/utils/functions/downloadFile', () => ({ downloadFile: vi.fn() }))

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
			global: {
				plugins: [vuetify],
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
