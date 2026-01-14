// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SyForm from '../SyForm.vue'

// Scénario d’accessibilité : formulaire contenant un champ et un bouton de soumission.

describe('SyForm – accessibility (axe)', () => {
	it('has no obvious axe violations for basic form structure', async () => {
		const wrapper = mount(SyForm, {
			slots: {
				default: `
					<div>
						<label for="name">Nom</label>
						<input id="name" name="name" type="text" />
						<button type="submit">Envoyer</button>
					</div>
				`,
			},
			attachTo: document.body,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyForm – basic form structure', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})
})
