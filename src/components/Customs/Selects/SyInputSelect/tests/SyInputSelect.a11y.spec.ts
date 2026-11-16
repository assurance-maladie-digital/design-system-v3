// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SyInputSelect from '../SyInputSelect.vue'

// Scénario d’accessibilité : bouton déclencheur d’une liste d’options (pattern listbox).

const items = [
	{ text: 'Régime général', value: 'general' },
	{ text: 'Régime agricole', value: 'agricole' },
]

enableAutoUnmount(afterEach)

describe('SyInputSelect – accessibility (axe)', () => {
	it('has no axe violations when the list is closed', async () => {
		const wrapper = mount(SyInputSelect, {
			props: { label: 'Régime', items, required: true },
			attachTo: document.body,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyInputSelect – liste fermée', { ignoreRules: ['region'] })
	})

	it('has no axe violations when the list is open', async () => {
		const wrapper = mount(SyInputSelect, {
			props: { label: 'Régime', items, modelValue: items[0] },
			attachTo: document.body,
		})
		await wrapper.find('.sy-input-select').trigger('click')

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyInputSelect – liste ouverte', { ignoreRules: ['region'] })
	})

	it('has no axe violations with a clearable selected value', async () => {
		const wrapper = mount(SyInputSelect, {
			props: { label: 'Régime', items, modelValue: items[0], clearable: true },
			attachTo: document.body,
		})

		// Le bouton d'effacement est un vrai bouton, hors du déclencheur (pas de nested-interactive)
		const clearButton = wrapper.find('button[aria-label="Supprimer"]')
		expect(clearButton.exists()).toBe(true)
		expect(wrapper.find('.sy-input-select').find('button').exists()).toBe(false)

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyInputSelect – valeur effaçable', { ignoreRules: ['region'] })
	})

	it('names the trigger with the field label and the selected value', async () => {
		const wrapper = mount(SyInputSelect, {
			props: { label: 'Régime', items },
			attachTo: document.body,
		})
		const trigger = wrapper.find('.sy-input-select')

		expect(trigger.attributes('aria-label')).toBe('Régime')

		await wrapper.setProps({ modelValue: items[1] })

		expect(trigger.attributes('aria-label')).toBe('Régime : Régime agricole')
	})

	it('closes the list with Escape and gives the focus back to the trigger', async () => {
		const wrapper = mount(SyInputSelect, {
			props: { label: 'Régime', items },
			attachTo: document.body,
		})
		const trigger = wrapper.find('.sy-input-select')

		// Échap depuis le déclencheur
		await trigger.trigger('click')
		expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
		await trigger.trigger('keydown', { key: 'Escape' })
		expect(wrapper.find('[role="listbox"]').exists()).toBe(false)

		// Échap depuis une option : le focus revient au déclencheur
		await trigger.trigger('click')
		const option = wrapper.find('[role="option"]')
		;(option.element as HTMLElement).focus()
		await option.trigger('keydown', { key: 'Escape' })
		expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
		expect(document.activeElement).toBe(trigger.element)
	})

	it('gives the focus back to the trigger after choosing an option or clearing', async () => {
		const wrapper = mount(SyInputSelect, {
			props: { label: 'Régime', items, clearable: true },
			attachTo: document.body,
		})
		const trigger = wrapper.find('.sy-input-select')

		await trigger.trigger('click')
		await wrapper.find('[role="option"]').trigger('click')
		await flushPromises()
		expect(document.activeElement).toBe(trigger.element)

		await wrapper.find('button[aria-label="Supprimer"]').trigger('click')
		await flushPromises()
		expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null])
		expect(document.activeElement).toBe(trigger.element)
	})

	it('keeps a single tab stop for the list container', async () => {
		const wrapper = mount(SyInputSelect, {
			props: { label: 'Régime', items },
			attachTo: document.body,
		})
		await wrapper.find('.sy-input-select').trigger('click')

		expect(wrapper.find('[role="listbox"]').attributes('tabindex')).toBe('-1')
	})

	it('exposes the trigger as a button controlling a listbox', async () => {
		const wrapper = mount(SyInputSelect, {
			props: { label: 'Régime', items },
			attachTo: document.body,
		})
		const trigger = wrapper.find('.sy-input-select')

		expect(wrapper.find('[role="menu"]').exists()).toBe(false)
		expect(trigger.attributes('role')).toBe('button')
		expect(trigger.attributes('aria-haspopup')).toBe('listbox')
		expect(trigger.attributes('aria-expanded')).toBe('false')
		expect(trigger.attributes('aria-controls')).toBeUndefined()

		await trigger.trigger('click')

		const listbox = wrapper.find('[role="listbox"]')
		expect(listbox.exists()).toBe(true)
		expect(trigger.attributes('aria-expanded')).toBe('true')
		expect(trigger.attributes('aria-controls')).toBe(listbox.attributes('id'))
		expect(listbox.findAll('[role="option"]')).toHaveLength(items.length)
	})
})
