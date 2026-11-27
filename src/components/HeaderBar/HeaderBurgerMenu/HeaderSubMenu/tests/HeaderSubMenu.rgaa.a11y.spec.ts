// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import HeaderSubMenu from '../HeaderSubMenu.vue'
import { registerSubMenuKey } from '../../conts'
describe('HeaderSubMenu – RGAA contract', () => {
	it('7.1 and 8.2 – exposes an expanded button associated with a labelled group', () => {
		const wrapper = mount(HeaderSubMenu, { slots: { title: 'Menu' }, global: { provide: { [registerSubMenuKey as symbol]: () => {} } } })
		const button = wrapper.get('button')
		expect(button.attributes('aria-expanded')).toBe('false')
		expect(wrapper.get('[role="group"]').attributes('aria-labelledby')).toBe(button.attributes('id'))
	})
})
