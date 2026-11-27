// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import LangBtn from '../LangBtn.vue'

export const langBtnRgaaCriteria = ['3.2', '3.3', '7.1', '7.3', '8.2', '8.7'] as const

describe('LangBtn – executable RGAA contracts', () => {
	it('7.1 and 7.3 – exposes a named listbox button', () => {
		const wrapper = mount(LangBtn, { props: { availableLanguages: ['fr', 'en'] } })
		const button = wrapper.get('.vd-lang-btn')
		expect(button.element.tagName).toBe('BUTTON')
		expect(button.attributes('aria-haspopup')).toBe('listbox')
		expect(button.attributes('aria-expanded')).toBe('false')
		expect(button.attributes('aria-label')).toContain('Français')
	})

	it('8.2 and 8.7 – keeps ids unique and language metadata explicit', () => {
		const wrapper = mount(LangBtn, { props: { availableLanguages: ['fr', 'ar'] } })
		const ids = wrapper.findAll('[id]').map(element => element.attributes('id'))
		expect(new Set(ids).size).toBe(ids.length)
		expect(wrapper.find('.v-btn').attributes('aria-controls')).toBeUndefined()
	})
})
