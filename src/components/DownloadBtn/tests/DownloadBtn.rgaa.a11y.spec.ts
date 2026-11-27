// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import DownloadBtn from '../DownloadBtn.vue'

const filePromise = async () => ({ data: new Blob(['file']), headers: {} })

export const downloadBtnRgaaCriteria = ['3.2', '3.3', '7.1'] as const

describe('DownloadBtn – executable RGAA contracts', () => {
	it('1.2 – exposes the download icon as decorative', () => {
		const wrapper = mount(DownloadBtn, { props: { filePromise } })
		expect(wrapper.get('button [aria-hidden="true"]').exists()).toBe(true)
	})

	it('7.1 and 7.3 – renders a named native button', () => {
		const wrapper = mount(DownloadBtn, { props: { filePromise }, slots: { default: 'Télécharger le document' } })
		const button = wrapper.get('button')
		expect(button.element.tagName).toBe('BUTTON')
		expect(button.attributes('type')).toBe('button')
		expect(button.text()).toContain('Télécharger le document')
	})

	it('7.5 – exposes a polite loading announcement', () => {
		let resolveDownload: (() => void) | undefined
		const pendingDownload = new Promise<void>((resolve) => {
			resolveDownload = resolve
		})
		const wrapper = mount(DownloadBtn, { props: { filePromise: () => pendingDownload.then(() => filePromise()) } })
		void wrapper.get('button').trigger('click')
		return nextTick().then(() => {
			expect(wrapper.get('[aria-live="polite"]').text()).toContain('Téléchargement en cours')
			resolveDownload?.()
		})
	})
})
