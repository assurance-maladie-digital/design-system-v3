// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import FilterInline from '../FilterInline.vue'

// Scénario d’accessibilité : filtres en ligne avec plusieurs filtres actifs
// (boutons avec badges et liste de chips), menu fermé.

describe('FilterInline – accessibility (axe)', () => {
	it('has no obvious axe violations with multiple active filters', async () => {
		const wrapper = mount(FilterInline, {
			props: {
				modelValue: [
					{
						name: 'name',
						label: 'Nom',
						value: 'John Doe',
					},
					{
						name: 'profession',
						label: 'Profession',
						value: ['Infirmier', 'Pharmacien'],
					},
				],
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'FilterInline – multiple active filters', {
			ignoreRules: ['region'],
		})
	})
})
