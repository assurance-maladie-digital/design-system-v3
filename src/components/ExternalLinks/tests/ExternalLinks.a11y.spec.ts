// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import ExternalLinks from '../ExternalLinks.vue'

describe('ExternalLinks – accessibility (axe)', () => {
	it('has no obvious axe violations', async () => {
		const wrapper = mount(ExternalLinks, {
			props: {
				items: [
					{ text: 'ameli.fr', href: 'https://ameli.fr' },
					{ text: 'Legifrance', href: 'https://legifrance.gouv.fr' },
				],
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'ExternalLinks – default state')
	})
})
