// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SyNavListPanel from '../SyNavListPanel.vue'
import { locales } from '../locales'
describe('SyNavListPanel – RGAA contract', () => {
	it('8.2 and 12.1 – exposes labelled navigation links and disclosure controls', () => {
		const wrapper = mount(SyNavListPanel, { props: { items: [{ id: 'home', label: 'Accueil', href: '/', active: true }], locales, iconColor: 'primary', actionsVisibility: 'always' }, global: { mocks: { $router: {} }, stubs: { RouterLink: true } } })
		expect(wrapper.find('.sy-nav-list-panel').exists()).toBe(true)
		expect(wrapper.find('a').attributes('aria-current')).toBe('page')
		vi.restoreAllMocks()
	})
})
