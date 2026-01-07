// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import PasswordField from '../PasswordField.vue'

// Scénario d’accessibilité : champ de mot de passe requis avec libellé.

describe('PasswordField – accessibility (axe)', () => {
	it('has no obvious axe violations for required password field', async () => {
		const wrapper = mount(PasswordField, {
			props: {
				label: 'Mot de passe',
				required: true,
				autocompleteType: 'new-password',
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'PasswordField – required field', {
			ignoreRules: ['region'],
		})
	})
})
