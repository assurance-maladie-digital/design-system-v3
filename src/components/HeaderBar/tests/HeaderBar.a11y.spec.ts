// @vitest-environment jsdom

import { describe, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import HeaderBar from '../HeaderBar.vue'

// Scénario d’accessibilité : en-tête sticky avec logo et slots principaux.

vi.mock('@/utils/functions/throttleDisplayFn/throttleDisplayFn.ts', () => ({
	default: (fn: (...args: unknown[]) => void) => fn,
}))

describe('HeaderBar – accessibility (axe)', () => {
	it('has no obvious axe violations with sticky header and logo', async () => {
		const wrapper = mount(HeaderBar, {
			props: {
				headingLevelTitle: 1,
				sticky: true,
				serviceTitle: 'Synapse',
				serviceSubtitle: 'Design System',
			},
			attachTo: document.body,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'HeaderBar – sticky with logo', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})
})
