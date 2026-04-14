// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SyTabs from '../SyTabs.vue'

// Mock RouterLink component since SyTabs uses it
const RouterLink = {
	name: 'RouterLink',
	props: ['to'],
	template: '<a :href="to"><slot /></a>',
}

const testItems = [
	{ label: 'Tab 1', value: 'tab1', content: 'Contenu du Tab 1' },
	{ label: 'Tab 2', value: 'tab2', content: 'Contenu du Tab 2' },
	{ label: 'Tab 3', value: 'tab3', content: 'Contenu du Tab 3', disabled: true },
]

describe('SyTabs – accessibility (axe)', () => {
	it('has no obvious axe violations in default state', async () => {
		const wrapper = mount(SyTabs, {
			props: {
				items: testItems,
			},
			global: {
				components: { RouterLink },
				mocks: {
					$router: {},
				},
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyTabs – default state', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations after switching tabs', async () => {
		const wrapper = mount(SyTabs, {
			props: {
				items: testItems,
			},
			global: {
				components: { RouterLink },
				mocks: {
					$router: {},
				},
			},
		})

		const tabs = wrapper.findAll('[role="tab"]')
		if (tabs.length > 1) {
			await tabs[1]?.trigger('click')
		}

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyTabs – after switching tabs', {
			ignoreRules: ['region'],
		})
	})
})
