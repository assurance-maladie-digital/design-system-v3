import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { mdiRefresh } from '@mdi/js'
import CaptchaBtn from '../CaptchaBtn.vue'

// jsdom ne calcule pas `:focus-visible` ni l'`outline` : on vérifie ici les prérequis
// structurels du ring DS scopé (vrai <button> focusable), le rendu étant couvert par le
// test visuel Cypress.
describe('CaptchaBtn', () => {
	it('renders a real, focusable native button (eligible for the scoped DS ring)', () => {
		const wrapper = mount(CaptchaBtn, {
			slots: { default: 'Changer le type' },
		})
		const btn = wrapper.find('button.captcha-btn')

		expect(btn.exists()).toBe(true)
		expect(btn.element.tagName).toBe('BUTTON')
		expect(btn.attributes('type')).toBe('button')
		// Pas de tabindex -1 => atteignable au clavier, donc éligible au `:focus-visible`.
		expect(btn.attributes('tabindex')).not.toBe('-1')
		expect(btn.text()).toContain('Changer le type')
	})

	it('renders the optional prepend icon', () => {
		const wrapper = mount(CaptchaBtn, {
			props: { prependIcon: mdiRefresh },
			slots: { default: 'Rafraîchir' },
		})

		expect(wrapper.findComponent({ name: 'SyIcon' }).exists()).toBe(true)
	})
})
