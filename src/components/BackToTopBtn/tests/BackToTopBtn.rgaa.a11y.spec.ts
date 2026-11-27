// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import BackToTopBtn from '../BackToTopBtn.vue'

export const backToTopBtnRgaaCriteria = ['1.2', '3.2', '3.3', '8.2', '10.7'] as const

describe('BackToTopBtn – executable RGAA contracts', () => {
	it('1.2 – exposes the arrow as decorative and keeps the action named', () => {
		const wrapper = mount(BackToTopBtn)
		const button = wrapper.get('.vd-back-to-top-btn')
		expect(button.text()).toContain('Retour en haut')
		expect(button.find('[aria-hidden="true"]').exists()).toBe(true)
	})

	it('7.1 and 7.3 – renders a native button with a keyboard-compatible type', () => {
		const wrapper = mount(BackToTopBtn)
		const button = wrapper.get('.vd-back-to-top-btn')
		expect(button.element.tagName).toBe('BUTTON')
		expect(button.attributes('type')).toBe('button')
	})

	it('8.2 – does not duplicate ids in the default instance', () => {
		const wrapper = mount(BackToTopBtn)
		const ids = wrapper.findAll('[id]').map(element => element.attributes('id'))
		expect(new Set(ids).size).toBe(ids.length)
	})
})
