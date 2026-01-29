// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SyPagination from '../SyPagination.vue'

// Scénario d’accessibilité : pagination avec libellé, aria-controls et page active.

describe('SyPagination – accessibility (axe)', () => {
	it('has no obvious axe violations with labelled navigation and active page', async () => {
		const wrapper = mount(SyPagination, {
			props: {
				modelValue: 3,
				pages: 10,
				label: 'Pagination des résultats',
				ariaControls: 'liste-resultats',
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyPagination – labelled navigation', {
			ignoreRules: ['region'],
		})
	})
})
