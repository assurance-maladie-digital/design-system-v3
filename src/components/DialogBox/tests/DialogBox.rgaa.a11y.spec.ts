// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import DialogBox from '../DialogBox.vue'

export const dialogBoxRgaaCriteria = ['1.2', '3.3', '7.1', '7.3', '8.2', '9.1', '10.7', '10.12', '12.8'] as const

describe('DialogBox – executable RGAA contracts', () => {
	it('7.1, 7.3 and 9.1 – exposes a modal dialog linked to its heading', async () => {
		const wrapper = mount(DialogBox, {
			props: { modelValue: true, title: 'Confirmation' },
			slots: { default: 'Confirmez-vous cette action ?' },
			attachTo: document.body,
		})
		await flushPromises()
		const dialog = document.querySelector('.sy-dialog-box')
		expect(dialog?.getAttribute('aria-modal')).toBe('true')
		const titleId = dialog?.getAttribute('aria-labelledby')
		expect(titleId).toBeTruthy()
		expect(document.getElementById(titleId!)?.textContent).toContain('Confirmation')
		wrapper.unmount()
	})

	it('7.1 – names the close control when the dialog is not persistent', async () => {
		const wrapper = mount(DialogBox, { props: { modelValue: true, title: 'Fenêtre' }, attachTo: document.body })
		await flushPromises()
		expect(document.querySelector('.sy-dialog-box-close-btn')?.getAttribute('aria-label')).toBe('Fermer la boîte de dialogue')
		wrapper.unmount()
	})
})
