// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SyTabs from '../SyTabs.vue'

export const syTabsRgaaCriteria = ['7.1', '8.9', '10.7', '12.6'] as const

describe('SyTabs – executable RGAA contracts', () => {
	it('7.1, 8.9 and 12.6 – links each tab to its panel and exposes selection state', () => {
		const wrapper = mount(SyTabs, { props: { items: [{ label: 'Un', value: 'one', content: 'Premier' }, { label: 'Deux', value: 'two', content: 'Second' }] } })
		const tab = wrapper.get('[role="tab"]')
		expect(wrapper.get('[role="tablist"]').exists()).toBe(true)
		expect(tab.attributes('aria-controls')).toBeTruthy()
		expect(tab.attributes('aria-selected')).toBe('true')
		expect(wrapper.get('[role="tabpanel"]').attributes('aria-labelledby')).toBe(tab.attributes('id'))
	})
})
