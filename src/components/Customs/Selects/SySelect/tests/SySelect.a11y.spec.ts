// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SySelect from '../SySelect.vue'

// Scénario d’accessibilité : select simple requis avec ouverture du menu.

describe('SySelect – accessibility (axe)', () => {
	it('has no obvious axe violations for required select with opened menu', async () => {
		const items = [
			{ text: 'Option 1', value: '1' },
			{ text: 'Option 2', value: '2' },
		]

		const wrapper = mount(SySelect, {
			props: {
				items,
				label: 'Choisissez une option',
				required: true,
			},
			attachTo: document.body,
		})

		// Ouvrir le menu pour inclure la liste déroulante dans l’analyse axe
		const activator = wrapper.find('.sy-select')
		if (activator.exists()) {
			await activator.trigger('click')
		}

		const results = await axe(document.body)
		assertNoA11yViolations(results, 'SySelect – required select with menu open', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})
})
