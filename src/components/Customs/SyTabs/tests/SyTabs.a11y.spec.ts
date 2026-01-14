// @vitest-environment jsdom

import { describe, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SyTabs from '../SyTabs.vue'

// Stub RouterLink pour éviter de dépendre du routeur réel
const RouterLink = {
	name: 'RouterLink',
	props: ['to'],
	template: '<a :href="to"><slot /></a>',
}

const testItems = [
	{ label: 'Tab 1', value: 'tab1', content: 'Contenu du Tab 1' },
	{ label: 'Tab 2', value: 'tab2', content: 'Contenu du Tab 2' },
	{ label: 'Tab 3', value: 'tab3', content: 'Contenu du Tab 3' },
]

// Scénario d’accessibilité : groupe d’onglets avec trois panneaux.

describe('SyTabs – accessibility (axe)', () => {
	it('has no obvious axe violations with three tabs and panels', async () => {
		const wrapper = mount(SyTabs, {
			props: {
				items: testItems,
			},
			global: {
				components: {
					RouterLink,
				},
				mocks: {
					$router: {
						push: vi.fn(),
						replace: vi.fn(),
					},
				},
			},
			attachTo: document.body,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyTabs – default configuration', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})
})
