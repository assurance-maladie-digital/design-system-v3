// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest'
import { enableAutoUnmount, mount } from '@vue/test-utils'
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
