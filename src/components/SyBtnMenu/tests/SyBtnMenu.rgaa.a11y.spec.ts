// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SyBtnMenu from '../SyBtnMenu.vue'

const menuItems = [{ text: 'Profil', value: 'profile' }, { text: 'Déconnexion', value: 'logout' }]

export const syBtnMenuRgaaCriteria = ['1.2', '3.3', '7.1', '8.2', '9.3', '10.7', '10.11'] as const

describe('SyBtnMenu – executable RGAA contracts', () => {
	it('7.1 and 9.3 – exposes a named menu button and a labelled menu', () => {
		const wrapper = mount(SyBtnMenu, { props: { menuItems, label: 'Menu du compte', primaryInfo: 'Vivvi' } })
		const button = wrapper.get('.sy-user-menu-btn')
		expect(button.element.tagName).toBe('BUTTON')
		expect(button.text()).toContain('Menu du compte')
		expect(button.text()).toContain('Vivvi')
	})

	it('8.2 – generates an id for the activator', () => {
		const wrapper = mount(SyBtnMenu, { props: { menuItems } })
		const button = wrapper.get('.sy-user-menu-btn')
		expect(button.attributes('id')).toBeTruthy()
	})
})
