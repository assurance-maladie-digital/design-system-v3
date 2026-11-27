// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import HorizontalNavbar from '../HorizontalNavbar.vue'

const SyTabsStub = defineComponent({
	props: { items: { type: Array, default: () => [] } },
	template: '<nav aria-label="Navigation principale"><a v-for="item in items" :key="item.label" :href="item.href">{{ item.label }}</a></nav>',
})

describe('HorizontalNavbar – RGAA contract', () => {
	it('8.2 and 12.1 – exposes labelled navigation links', () => {
		const wrapper = mount(HorizontalNavbar, {
			props: { items: [{ label: 'Accueil', href: '/' }, { label: 'Contact', href: '/contact' }] },
			global: { stubs: { SyTabs: SyTabsStub } },
		})

		expect(wrapper.get('nav').attributes('aria-label')).toBe('Navigation principale')
		expect(wrapper.findAll('a')).toHaveLength(2)
		expect(wrapper.get('a').attributes('href')).toBe('/')
	})
})
