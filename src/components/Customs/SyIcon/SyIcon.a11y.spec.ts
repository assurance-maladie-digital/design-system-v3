// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SyIcon from './SyIcon.vue'

// Scénario d’accessibilité : icône informative avec label.

describe('SyIcon – accessibility (axe)', () => {
	it('has no obvious axe violations for informative icon with label', async () => {
		const wrapper = mount(SyIcon, {
			props: {
				icon: 'mdi-alert',
				decorative: false,
				label: 'Alerte importante',
			},
			global: {
				stubs: {
					'v-icon': {
						template: '<span class="v-icon" role="img" :aria-label="ariaLabel"><slot></slot></span>',
						props: ['color', 'size', 'role', 'aria-hidden', 'aria-label'],
					},
				},
				directives: {
					'rgaa-svg-fix': () => {},
				},
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyIcon – informative icon with label', {
			ignoreRules: ['region'],
		})
	})
})
