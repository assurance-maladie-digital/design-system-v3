// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SyRadioGroup from '../SyRadioGroup.vue'

// Scénarios d'accessibilité pour le groupe de boutons radio

describe('SyRadioGroup – accessibility (axe)', () => {
	it('has no obvious axe violations for required radio group', async () => {
		const wrapper = mount(SyRadioGroup, {
			props: {
				label: 'Choisissez une option',
				modelValue: null,
				required: true,
				options: [
					{ label: 'Option A', value: 'A' },
					{ label: 'Option B', value: 'B' },
				],
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyRadioGroup – required group', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations with error state', async () => {
		const wrapper = mount(SyRadioGroup, {
			props: {
				label: 'Choisissez une option',
				modelValue: null,
				required: true,
				errorMessages: ['Veuillez sélectionner une option'],
				options: [
					{ label: 'Option A', value: 'A' },
					{ label: 'Option B', value: 'B' },
				],
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyRadioGroup – error state', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations when disabled', async () => {
		const wrapper = mount(SyRadioGroup, {
			props: {
				label: 'Choisissez une option',
				modelValue: 'A',
				disabled: true,
				options: [
					{ label: 'Option A', value: 'A' },
					{ label: 'Option B', value: 'B' },
				],
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyRadioGroup – disabled state', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations with aria-label', async () => {
		const wrapper = mount(SyRadioGroup, {
			props: {
				ariaLabel: 'Groupe de boutons radio personnalisé',
				label: 'Radio avec aria-label',
				modelValue: null,
				options: [
					{ label: 'Option A', value: 'A' },
					{ label: 'Option B', value: 'B' },
				],
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyRadioGroup – avec aria-label', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations with aria-labelledby', async () => {
		const wrapper = mount(SyRadioGroup, {
			props: {
				ariaLabelledby: 'custom-heading',
				label: 'Radio avec aria-labelledby',
				modelValue: null,
				options: [
					{ label: 'Option A', value: 'A' },
					{ label: 'Option B', value: 'B' },
				],
			},
		})

		// Ajouter un élément avec l'id référencé
		const heading = document.createElement('h2')
		heading.id = 'custom-heading'
		heading.textContent = 'Titre du groupe'
		document.body.appendChild(heading)

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyRadioGroup – avec aria-labelledby', {
			ignoreRules: ['region'],
		})

		document.body.removeChild(heading)
	})
})
