// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import SyInputSelect from '../SyInputSelect.vue'

const items = [
	{ text: 'Régime général', value: 'general' },
	{ text: 'Régime agricole', value: 'agricole' },
]

export const syInputSelectRgaaCriteria = ['7.1', '7.3', '8.2', '10.7', '11.10', '12.8', '12.9'] as const

describe('SyInputSelect – executable RGAA contracts', () => {
	it('8.2, 11.10 and 12.9 – exposes a named keyboard trigger', () => {
		const wrapper = mount(SyInputSelect, { props: { label: 'Régime', items, required: true } })
		const trigger = wrapper.get('.sy-input-select')
		expect(trigger.attributes('role')).toBe('button')
		expect(trigger.attributes('aria-label')).toBe('Régime')
		expect(trigger.attributes('aria-haspopup')).toBe('listbox')
		expect(trigger.attributes('tabindex')).toBe('0')
	})

	it('7.1, 7.3 and 12.9 – exposes labelled options and synchronizes expanded state', async () => {
		const wrapper = mount(SyInputSelect, { props: { label: 'Régime', items }, attachTo: document.body })
		const trigger = wrapper.get('.sy-input-select')
		await trigger.trigger('click')
		await flushPromises()
		const listbox = wrapper.get('[role="listbox"]')
		expect(trigger.attributes('aria-expanded')).toBe('true')
		expect(trigger.attributes('aria-controls')).toBe(listbox.attributes('id'))
		expect(listbox.attributes('aria-label')).toBe('Régime')
		expect(listbox.findAll('[role="option"]')).toHaveLength(2)
		listbox.findAll('[role="option"]').forEach(option => expect(option.attributes('aria-selected')).toMatch(/true|false/))
	})

	it('7.1 and 10.7 – names the optional clear button and keeps it focusable', () => {
		const wrapper = mount(SyInputSelect, { props: { label: 'Régime', items, modelValue: items[0], clearable: true } })
		const clear = wrapper.get('button[aria-label]')
		expect(clear.attributes('aria-label')).toBeTruthy()
		expect(clear.element.tagName).toBe('BUTTON')
		expect(clear.attributes('tabindex')).not.toBe('-1')
	})
})
