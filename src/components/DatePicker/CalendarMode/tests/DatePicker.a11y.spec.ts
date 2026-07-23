// @vitest-environment jsdom

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import { nextTick } from 'vue'
import DatePicker from '../DatePicker.vue'

// Scénario d'accessibilité : sélecteur de date en mode calendrier,
// avec label, format jour/mois/année et navigation clavier.

describe('DatePicker (CalendarMode) – accessibility (axe)', () => {
	it('has no obvious axe violations in default calendar mode', async () => {
		const wrapper = mount(DatePicker, {
			props: {
				label: 'Date de naissance',
				format: 'DD/MM/YYYY',
				modelValue: null,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'DatePicker – default calendar mode', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations with required date field', async () => {
		const wrapper = mount(DatePicker, {
			props: {
				label: 'Date de rendez-vous',
				format: 'DD/MM/YYYY',
				modelValue: null,
				required: true,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'DatePicker – required date field', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations with error messages', async () => {
		const wrapper = mount(DatePicker, {
			props: {
				label: 'Date de début',
				format: 'DD/MM/YYYY',
				modelValue: '32/13/2023', // Date invalide
				errorMessages: ['La date est invalide'],
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'DatePicker – with error messages', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations in no-calendar mode', async () => {
		const wrapper = mount(DatePicker, {
			props: {
				label: 'Date',
				format: 'DD/MM/YYYY',
				modelValue: null,
				noCalendar: true,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'DatePicker – no-calendar mode', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations in combined mode', async () => {
		const wrapper = mount(DatePicker, {
			props: {
				label: 'Période de séjour',
				format: 'DD/MM/YYYY',
				modelValue: null,
				useCombinedMode: true,
				displayRange: true,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'DatePicker – combined mode with range', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations with disabled state', async () => {
		const wrapper = mount(DatePicker, {
			props: {
				label: 'Date de consultation',
				format: 'DD/MM/YYYY',
				modelValue: '15/03/2023',
				disabled: true,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'DatePicker – disabled state', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations with readonly state', async () => {
		const wrapper = mount(DatePicker, {
			props: {
				label: 'Date de création',
				format: 'DD/MM/YYYY',
				modelValue: '01/01/2023',
				readonly: true,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'DatePicker – readonly state', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations with hint text', async () => {
		const wrapper = mount(DatePicker, {
			props: {
				label: 'Date d\'échéance',
				format: 'DD/MM/YYYY',
				modelValue: null,
				hint: 'Sélectionnez une date dans les 30 prochains jours',
				persistentHint: true,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'DatePicker – with hint text', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations when the calendar dialog is open and exposes the expected ARIA contract', async () => {
		const wrapper = mount(DatePicker, {
			props: {
				label: 'Date de départ',
				format: 'DD/MM/YYYY',
				modelValue: null,
			},
			attachTo: document.body,
		})

		wrapper.vm.isDatePickerVisible = true
		await nextTick()

		const dialog = document.body.querySelector<HTMLElement>(`#${wrapper.vm.datePickerDialogId}`)
		expect(dialog).not.toBeNull()
		expect(dialog?.getAttribute('role')).toBe('dialog')
		expect(dialog?.getAttribute('aria-modal')).toBe('true')
		expect(dialog?.getAttribute('aria-labelledby')).toBe(wrapper.vm.datePickerHeadingId)

		const activatorWrapper = wrapper.find(`[aria-controls="${wrapper.vm.datePickerDialogId}"]`)
		expect(activatorWrapper.exists()).toBe(true)

		const results = await axe(document.body)
		assertNoA11yViolations(results, 'DatePicker – opened calendar dialog', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})
})
