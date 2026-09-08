import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SkipLink from '../SkipLink.vue'

describe('SkipLink - accessibility', () => {
	it('has no obvious axe violations with multiple links', async () => {
		const wrapper = mount(SkipLink, {
			props: {
				skipLinks: [
					{ label: 'Aller au contenu', target: '#main' },
					{ label: 'Aller au pied de page', target: '#footer' },
				],
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		expect(wrapper.findAll('a.sy-skip-link')).toHaveLength(2)
		assertNoA11yViolations(results, 'SkipLink - multiple links')
	})
})
