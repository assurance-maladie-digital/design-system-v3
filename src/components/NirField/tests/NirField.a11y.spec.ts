// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import NirField from '../NirField.vue'

// Scénario d’accessibilité : champ NIR complet (numéro + clé) requis,
// avec gestion des messages d’erreur/succès mais sans forcer d’état d’erreur.

describe('NirField – accessibility (axe)', () => {
	it('has no obvious axe violations with required NIR and key fields', async () => {
		const wrapper = mount(NirField, {
			props: {
				modelValue: undefined,
				required: true,
				successDisplay: 'all',
				displayKey: true,
				nirType: 'simple',
			},
			attachTo: document.body,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'NirField – required NIR + key', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})
})
