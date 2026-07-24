// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import DateTextInput from '../DateTextInput.vue'

// Scénario d’accessibilité : champ texte de date seul, requis,
// avec format jour/mois/année.

describe('DateTextInput – accessibility (axe)', () => {
	it('has no obvious axe violations for a required single date field', async () => {
		const wrapper = mount(DateTextInput, {
			props: {
				label: 'Date',
				format: 'DD/MM/YYYY',
				required: true,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'DateTextInput – required single date', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations for a readonly single date field', async () => {
		const wrapper = mount(DateTextInput, {
			props: {
				label: 'Date de création',
				format: 'DD/MM/YYYY',
				modelValue: '01/01/2025',
				readonly: true,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'DateTextInput – readonly single date', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations for a date range field with hint text', async () => {
		const wrapper = mount(DateTextInput, {
			props: {
				label: 'Période',
				format: 'DD/MM/YYYY',
				displayRange: true,
				modelValue: ['01/01/2025', '10/01/2025'],
				hint: 'Saisissez une date de début puis une date de fin',
				persistentHint: true,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'DateTextInput – range with hint', {
			ignoreRules: ['region'],
		})
	})
})
