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

	describe('Slot append accessibility', () => {
		it('has no obvious axe violations with append slot containing icon', async () => {
			const items = [
				{ text: 'Option 1', value: '1' },
				{ text: 'Option 2', value: '2' },
			]

			const wrapper = mount(SySelect, {
				props: {
					items,
					label: 'Sélectionnez une option',
					required: true,
				},
				slots: {
					append: '<span aria-label="Information supplémentaire" role="img">ℹ️</span>',
				},
				attachTo: document.body,
			})

			const activator = wrapper.find('.sy-select')
			if (activator.exists()) {
				await activator.trigger('click')
			}

			const results = await axe(document.body)
			assertNoA11yViolations(results, 'SySelect – append slot with icon', {
				ignoreRules: ['region'],
			})

			wrapper.unmount()
		})

		it('has no obvious axe violations with append slot containing button', async () => {
			const items = [
				{ text: 'Option 1', value: '1' },
				{ text: 'Option 2', value: '2' },
			]

			const wrapper = mount(SySelect, {
				props: {
					items,
					label: 'Sélectionnez une option',
				},
				slots: {
					append: '<button aria-label="Ouvrir la documentation">?</button>',
				},
				attachTo: document.body,
			})

			const activator = wrapper.find('.sy-select')
			if (activator.exists()) {
				await activator.trigger('click')
			}

			const results = await axe(document.body)
			assertNoA11yViolations(results, 'SySelect – append slot with button', {
				ignoreRules: ['region'],
			})

			wrapper.unmount()
		})

		it('has no obvious axe violations with append slot and clearable option', async () => {
			const items = [
				{ text: 'Option 1', value: '1' },
				{ text: 'Option 2', value: '2' },
			]

			const wrapper = mount(SySelect, {
				props: {
					items,
					label: 'Sélectionnez une option',
					clearable: true,
					modelValue: '1',
				},
				slots: {
					append: '<span aria-label="Aide" role="img">🔍</span>',
				},
				attachTo: document.body,
			})

			const activator = wrapper.find('.sy-select')
			if (activator.exists()) {
				await activator.trigger('click')
			}

			const results = await axe(document.body)
			assertNoA11yViolations(results, 'SySelect – append slot with clearable', {
				ignoreRules: ['region'],
			})

			wrapper.unmount()
		})
	})

	describe('Slot prepend accessibility', () => {
		it('has no obvious axe violations with prepend slot containing icon', async () => {
			const items = [
				{ text: 'Option 1', value: '1' },
				{ text: 'Option 2', value: '2' },
			]

			const wrapper = mount(SySelect, {
				props: {
					items,
					label: 'Sélectionnez une option',
					required: true,
				},
				slots: {
					prepend: '<span aria-label="Champ obligatoire" role="img">*</span>',
				},
				attachTo: document.body,
			})

			const activator = wrapper.find('.sy-select')
			if (activator.exists()) {
				await activator.trigger('click')
			}

			const results = await axe(document.body)
			assertNoA11yViolations(results, 'SySelect – prepend slot with icon', {
				ignoreRules: ['region'],
			})

			wrapper.unmount()
		})

		it('has no obvious axe violations with prepend slot containing button', async () => {
			const items = [
				{ text: 'Option 1', value: '1' },
				{ text: 'Option 2', value: '2' },
			]

			const wrapper = mount(SySelect, {
				props: {
					items,
					label: 'Sélectionnez une option',
				},
				slots: {
					prepend: '<button aria-label="Réinitialiser le champ">⟲</button>',
				},
				attachTo: document.body,
			})

			const activator = wrapper.find('.sy-select')
			if (activator.exists()) {
				await activator.trigger('click')
			}

			const results = await axe(document.body)
			assertNoA11yViolations(results, 'SySelect – prepend slot with button', {
				ignoreRules: ['region'],
			})

			wrapper.unmount()
		})

		it('has no obvious axe violations with prepend slot and clearable option', async () => {
			const items = [
				{ text: 'Option 1', value: '1' },
				{ text: 'Option 2', value: '2' },
			]

			const wrapper = mount(SySelect, {
				props: {
					items,
					label: 'Sélectionnez une option',
					clearable: true,
					modelValue: '1',
				},
				slots: {
					prepend: '<span aria-label="Catégorie" role="img">📁</span>',
				},
				attachTo: document.body,
			})

			const activator = wrapper.find('.sy-select')
			if (activator.exists()) {
				await activator.trigger('click')
			}

			const results = await axe(document.body)
			assertNoA11yViolations(results, 'SySelect – prepend slot with clearable', {
				ignoreRules: ['region'],
			})

			wrapper.unmount()
		})
	})

	describe('Both slots accessibility', () => {
		it('has no obvious axe violations with both prepend and append slots', async () => {
			const items = [
				{ text: 'Option 1', value: '1' },
				{ text: 'Option 2', value: '2' },
			]

			const wrapper = mount(SySelect, {
				props: {
					items,
					label: 'Sélectionnez une option',
					required: true,
				},
				slots: {
					prepend: '<span aria-label="Catégorie" role="img">📁</span>',
					append: '<span aria-label="Information" role="img">ℹ️</span>',
				},
				attachTo: document.body,
			})

			const activator = wrapper.find('.sy-select')
			if (activator.exists()) {
				await activator.trigger('click')
			}

			const results = await axe(document.body)
			assertNoA11yViolations(results, 'SySelect – both prepend and append slots', {
				ignoreRules: ['region'],
			})

			wrapper.unmount()
		})
	})
})
