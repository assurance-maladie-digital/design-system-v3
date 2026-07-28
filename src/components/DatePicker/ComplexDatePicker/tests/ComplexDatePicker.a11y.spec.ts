// @vitest-environment jsdom

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import { nextTick } from 'vue'
import ComplexDatePicker from '../ComplexDatePicker.vue'

// Scénario d’accessibilité : sélecteur de date combiné (champ + calendrier),
// en mode simple, avec label et format jour/mois/année.

describe('ComplexDatePicker – accessibility (axe)', () => {
	it('has no obvious axe violations in default calendar mode', async () => {
		const wrapper = mount(ComplexDatePicker, {
			props: {
				label: 'Date',
				format: 'DD/MM/YYYY',
			},
		})

		const ignoredRules = ['region'] // Ignoring 'region' rule as per test configuration

		const results = await axe(wrapper.element as HTMLElement)
		// Debug aid: log violations details when present
		if (results.violations.filter(
			v => !ignoredRules.includes(v.id), // Ignoring specified rules as per test configuration
		).length > 0) {
			console.log(JSON.stringify(results.violations, null, 2))
		}
		assertNoA11yViolations(results, 'ComplexDatePicker – default calendar mode', {
			ignoreRules: ignoredRules,
		})
	})

	it('has no obvious axe violations when the calendar dialog is open and keeps the current combobox contract', async () => {
		const wrapper = mount(ComplexDatePicker, {
			props: {
				label: 'Date',
				format: 'DD/MM/YYYY',
			},
			attachTo: document.body,
		})

		wrapper.vm.isDatePickerVisible = true
		await nextTick()

		const input = wrapper.find('input')
		expect(input.attributes('role')).toBe('combobox')
		expect(input.attributes('aria-haspopup')).toBe('dialog')
		expect(input.attributes('aria-expanded')).toBe('true')
		expect(input.attributes('aria-controls')).toBe(wrapper.vm.datePickerDialogId)

		const dialog = document.body.querySelector<HTMLElement>(`#${wrapper.vm.datePickerDialogId}`)
		expect(dialog).not.toBeNull()
		expect(dialog?.getAttribute('role')).toBe('dialog')
		expect(dialog?.getAttribute('aria-labelledby')).toBe(wrapper.vm.datePickerHeadingId)
		expect(dialog?.getAttribute('aria-modal')).toBeNull()

		const ignoredRules = ['region']
		const results = await axe(document.body)
		assertNoA11yViolations(results, 'ComplexDatePicker – opened calendar dialog', {
			ignoreRules: ignoredRules,
		})

		wrapper.unmount()
	})
})
