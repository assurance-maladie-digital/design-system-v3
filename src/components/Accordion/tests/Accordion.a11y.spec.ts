// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import Accordion from '../Accordion.vue'

const defaultItems = [
	{ id: 'item1', title: 'Section 1', content: 'Contenu de la section 1' },
	{
		id: 'item2',
		title: 'Section 2',
		content: {
			title: 'Sous-titre de la section 2',
			content: 'Contenu détaillé de la section 2',
		},
	},
]

// Test d'accessibilité dédié à Accordion, basé sur un scénario réaliste :
// - plusieurs items
// - ouvertures successives pour vérifier l'état ouvert/fermé et les attributs ARIA

describe('Accordion – accessibility (axe)', () => {
	it('has no obvious axe violations when sections are opened', async () => {
		const wrapper = mount(Accordion, {
			props: {
				items: defaultItems,
				headingLevel: 2,
			},
		})

		// Ouvrir les deux sections pour inclure le contenu dans l’audit axe
		const buttons = wrapper.findAll('.sy-accordion-button')
		if (buttons.length > 0) {
			await buttons[0]?.trigger('click')
		}
		if (buttons.length > 1) {
			await buttons[1]?.trigger('click')
		}

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'Accordion – sections opened')
	})
})
