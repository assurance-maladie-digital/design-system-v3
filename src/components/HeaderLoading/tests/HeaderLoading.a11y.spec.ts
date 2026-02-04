// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import HeaderLoading from '../HeaderLoading.vue'

// Scénario d’accessibilité : skeleton autonome qui s’annonce lui-même via aria-live.

describe('HeaderLoading – accessibility (axe)', () => {
	it('has no obvious axe violations for standalone loader with aria-live', async () => {
		const wrapper = mount(HeaderLoading, {
			props: {
				standalone: true,
				ariaLabel: 'Chargement du contenu de l’en-tête',
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'HeaderLoading – standalone loader', {
			ignoreRules: ['region'],
		})
	})
})
