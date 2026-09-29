// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SyTextField from '../SyTextField.vue'

// Scénario d’accessibilité : champ texte requis avec label explicite.

describe('SyTextField – accessibility (axe)', () => {
	it('has no obvious axe violations for required labelled text field', async () => {
		const wrapper = mount(SyTextField, {
			props: {
				label: 'Nom',
				modelValue: '',
				required: true,
				showSuccessMessages: true,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyTextField – required labelled field', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations when loading is true', async () => {
		const wrapper = mount(SyTextField, {
			props: {
				label: 'Nom',
				modelValue: '',
				loading: true,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyTextField – loading state', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations for number input', async () => {
		const wrapper = mount(SyTextField, {
			props: {
				label: 'Montant',
				modelValue: '12.5',
				type: 'number',
				helpText: 'Saisissez un montant numerique',
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyTextField – number input', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations for number input with spin buttons', async () => {
		const wrapper = mount(SyTextField, {
			props: {
				label: 'Quantité',
				modelValue: '5',
				type: 'number',
				areSpinButtonsHidden: false,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyTextField – number input with spin buttons', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations for number input in error state', async () => {
		const wrapper = mount(SyTextField, {
			props: {
				label: 'Prix',
				modelValue: '',
				type: 'number',
				customRules: [{
					type: 'custom',
					options: { validate: () => false, message: 'Ce champ est obligatoire' },
				}],
				isValidateOnBlur: true,
			},
		})

		await wrapper.find('input').trigger('blur')
		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyTextField – number input error state', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations for tel input', async () => {
		const wrapper = mount(SyTextField, {
			props: {
				label: 'Telephone',
				modelValue: '+33 1 23 45 67 89',
				type: 'tel',
				helpText: 'Saisissez un numero de telephone',
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyTextField – tel input', {
			ignoreRules: ['region'],
		})
	})
})
