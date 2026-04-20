// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SyCheckbox from '../SyCheckbox.vue'

// Scénarios d'accessibilité : cases à cocher avec différents états et configurations.

describe('SyCheckbox – accessibility (axe)', () => {
	it('has no obvious axe violations for required checkbox with label', async () => {
		const wrapper = mount(SyCheckbox, {
			props: {
				label: 'J\'accepte les conditions générales',
				modelValue: false,
				required: true,
			},
		})

		// Attendre que removeAriaAttributes soit exécuté
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyCheckbox – required labelled checkbox', {
			ignoreRules: ['region'],
		})
	})

	it('has no axe violations for indeterminate checkbox (aria-checked="mixed")', async () => {
		const wrapper = mount(SyCheckbox, {
			props: {
				label: 'Sélection partielle',
				modelValue: false,
				indeterminate: true,
				controlsIds: ['child-1', 'child-2', 'child-3'],
			},
		})

		// Attendre que removeAriaAttributes soit exécuté
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyCheckbox – indeterminate checkbox', {
			ignoreRules: ['region'],
		})
	})

	it('has no axe violations for checked checkbox with aria-checked="true"', async () => {
		const wrapper = mount(SyCheckbox, {
			props: {
				label: 'Option activée',
				modelValue: true,
				required: false,
			},
		})

		// Attendre que removeAriaAttributes soit exécuté
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyCheckbox – checked checkbox', {
			ignoreRules: ['region'],
		})
	})

	it('has no axe violations for unchecked checkbox with aria-checked="false"', async () => {
		const wrapper = mount(SyCheckbox, {
			props: {
				label: 'Option désactivée',
				modelValue: false,
				required: false,
			},
		})

		// Attendre que removeAriaAttributes soit exécuté
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyCheckbox – unchecked checkbox', {
			ignoreRules: ['region'],
		})
	})

	it('has no axe violations for disabled checkbox', async () => {
		const wrapper = mount(SyCheckbox, {
			props: {
				label: 'Option désactivée',
				modelValue: true,
				disabled: true,
			},
		})

		// Attendre que removeAriaAttributes soit exécuté
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyCheckbox – disabled checkbox', {
			ignoreRules: ['region'],
		})
	})

	it('has no axe violations for checkbox with custom aria-label', async () => {
		const wrapper = mount(SyCheckbox, {
			props: {
				ariaLabel: 'Case à cocher personnalisée',
				modelValue: false,
			},
		})

		// Attendre que removeAriaAttributes soit exécuté
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyCheckbox – checkbox with aria-label', {
			ignoreRules: ['region'],
		})
	})

	it('has no axe violations for checkbox with aria-labelledby', async () => {
		// Créer un conteneur pour le test
		const container = document.createElement('div')
		document.body.appendChild(container)

		// Créer un élément avec l'ID référencé
		const labelElement = document.createElement('div')
		labelElement.id = 'custom-label-id'
		labelElement.textContent = 'Libellé personnalisé'
		container.appendChild(labelElement)

		const wrapper = mount(SyCheckbox, {
			props: {
				ariaLabelledby: 'custom-label-id',
				modelValue: false,
			},
			attachTo: container,
		})

		// Attendre que removeAriaAttributes soit exécuté
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		const results = await axe(container as HTMLElement)
		assertNoA11yViolations(results, 'SyCheckbox – checkbox with aria-labelledby', {
			ignoreRules: ['region'],
		})

		// Nettoyer
		wrapper.unmount()
		document.body.removeChild(container)
	})
})
