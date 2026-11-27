// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import BackBtn from '../BackBtn.vue'

export const backBtnRgaaCriteria = [
	'1.2',
	'7.1',
	'7.3',
	'8.2',
	'10.1',
	'12.9',
] as const

describe('BackBtn – executable RGAA contracts', () => {
	it('1.2 – exposes the back icon as decorative', () => {
		const wrapper = mount(BackBtn)
		const icon = wrapper.find('.sy-back-btn [aria-hidden="true"]')

		expect(icon.exists()).toBe(true)
		expect(icon.attributes('role')).not.toBe('img')
	})

	it('7.1 and 7.3 – renders a native named button', () => {
		const wrapper = mount(BackBtn, { props: { locales: { label: 'Retour à la page précédente' } } })
		const button = wrapper.get('.sy-back-btn')

		expect(button.element.tagName).toBe('BUTTON')
		expect(button.attributes('type')).toBe('button')
		expect(button.text()).toContain('Retour à la page précédente')
	})

	it('8.2 – does not emit the historical invalid outlined attribute', () => {
		const wrapper = mount(BackBtn)

		expect(wrapper.get('.sy-back-btn').attributes('outlined')).toBeUndefined()
	})

	it('10.1 – keeps presentation in CSS rather than HTML presentation attributes', () => {
		const wrapper = mount(BackBtn)
		const button = wrapper.get('.sy-back-btn')

		expect(button.attributes('align')).toBeUndefined()
		expect(button.attributes('bgcolor')).toBeUndefined()
		expect(button.attributes('border')).toBeUndefined()
		expect(button.attributes('color')).toBeUndefined()
	})

	it('12.9 – does not introduce a positive tabindex or a keyboard trap', () => {
		const wrapper = mount(BackBtn)
		const button = wrapper.get('.sy-back-btn')

		expect(button.attributes('tabindex') ?? '').not.toMatch(/^[1-9]/)
		expect(wrapper.findAll('[tabindex^="1"], [tabindex^="2"], [tabindex^="3"], [tabindex^="4"], [tabindex^="5"], [tabindex^="6"], [tabindex^="7"], [tabindex^="8"], [tabindex^="9"]')).toHaveLength(0)
	})
})
