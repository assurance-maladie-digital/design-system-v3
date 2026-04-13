// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
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
})
