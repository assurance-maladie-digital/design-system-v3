// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SyAlert from '../SyAlert.vue'

export const syAlertRgaaCriteria = ['1.2', '3.2', '3.3', '7.1', '7.5', '8.7', '10.7'] as const

describe('SyAlert – executable RGAA contracts', () => {
	it('7.1 and 7.5 – exposes the alert role and its message', () => {
		const wrapper = mount(SyAlert, { slots: { default: 'Une information importante' } })
		const alert = wrapper.get('.sy-alert')
		expect(alert.attributes('role')).toBe('alert')
		expect(alert.text()).toContain('Une information importante')
	})

	it('1.2 and 7.1 – keeps the status icon decorative and names the close action', () => {
		const wrapper = mount(SyAlert, { props: { closable: true }, slots: { default: 'Message' } })
		expect(wrapper.get('.alert-icon').attributes('aria-hidden')).toBe('true')
		expect(wrapper.get('.alert-close-btn').text()).toContain('Fermer')
	})
})
