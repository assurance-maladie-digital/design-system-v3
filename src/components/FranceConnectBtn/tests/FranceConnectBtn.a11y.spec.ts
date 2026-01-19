// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import FranceConnectBtn from '../FranceConnectBtn.vue'

// Scénario d’accessibilité : bouton FranceConnect simple avec lien principal
// et lien d’information secondaire.

describe('FranceConnectBtn – accessibility (axe)', () => {
	it('has no obvious axe violations with default props', async () => {
		const wrapper = mount(FranceConnectBtn, {
			props: {
				href: 'https://app.franceconnect.gouv.fr/',
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'FranceConnectBtn – default', {
			ignoreRules: ['region'],
		})
	})
})
