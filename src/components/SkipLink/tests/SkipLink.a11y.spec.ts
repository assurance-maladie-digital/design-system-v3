// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SkipLink from '../SkipLink.vue'

describe('SkipLink – accessibility (axe)', () => {
	it('has no obvious axe violations', async () => {
		const wrapper = mount(SkipLink, {
			props: {
				links: [
					{ label: 'Aller au contenu', href: '#main' },
					{ label: 'Aller à la navigation', href: '#nav' },
				],
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SkipLink – default state')
	})
})
