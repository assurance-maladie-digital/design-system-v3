// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import UserMenuBtn from '../UserMenuBtn.vue'

export const userMenuBtnRgaaCriteria = ['7.1', '8.2', '10.7'] as const
describe('UserMenuBtn – executable RGAA contracts', () => {
	it('8.2 – passes identity and menu items to the menu control', () => {
		const wrapper = mount(UserMenuBtn, {
			props: { fullName: 'Jeanne Dupont', additionalInformation: 'Agent', menuItems: [{ text: 'Profil', value: 'profile' }] },
			global: { stubs: { SyBtnMenu: { template: '<button :aria-label="primaryInfo"><slot name="footer-list-item"></slot></button>', props: ['primaryInfo'] } } },
		})
		expect(wrapper.get('button').attributes('aria-label')).toBe('Jeanne Dupont')
	})

	it('7.1 and 10.7 – exposes a keyboard-focusable logout item', () => {
		const wrapper = mount(UserMenuBtn, { props: { fullName: 'Jeanne Dupont' }, global: { stubs: { SyBtnMenu: { template: '<div><slot name="footer-list-item"></slot></div>' } } } })
		expect(wrapper.get('.logout').attributes('tabindex')).toBe('0')
		expect(wrapper.get('.logout').attributes('role')).toBe('menuitem')
	})
})
