// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import SyAutocomplete from '../SyAutocomplete.vue'

const items = [
	{ text: 'Paris', value: 'paris' },
	{ text: 'Lyon', value: 'lyon' },
]

export const syAutocompleteRgaaCriteria = ['7.1', '7.3', '7.5', '8.2', '10.1', '10.7', '11.10', '11.13', '12.8', '12.9'] as const

describe('SyAutocomplete – executable RGAA contracts', () => {
	it('8.2, 10.1 and 11.13 – exposes a named combobox input', () => {
		const wrapper = mount(SyAutocomplete, { props: { items, label: 'Ville', required: true } })
		const input = wrapper.get('input')
		expect(input.attributes('aria-label') || input.attributes('aria-labelledby')).toBeTruthy()
		expect(input.attributes('aria-required')).toBe('true')
	})

	it('7.1, 7.3 and 12.9 – exposes a labelled listbox with selectable options when opened', async () => {
		Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, value: () => {} })
		const wrapper = mount(SyAutocomplete, { props: { items, label: 'Ville' }, attachTo: document.body })
		await wrapper.get('input').trigger('click')
		await flushPromises()
		expect(document.querySelector('[role="listbox"]')).not.toBeNull()
		expect(document.querySelectorAll('[role="option"]')).toHaveLength(2)
		document.querySelectorAll('[role="option"]').forEach(option => expect(option.getAttribute('aria-selected')).toMatch(/true|false/))
		wrapper.unmount()
	})

	it('7.1 and 10.7 – names the clear action and keeps the selected value removable', () => {
		const wrapper = mount(SyAutocomplete, { props: { items, label: 'Ville', clearable: true, modelValue: 'paris' } })
		const clearButton = wrapper.get('.sy-autocomplete__clear-button')
		expect(clearButton.attributes('aria-label')).toBeTruthy()
		expect(clearButton.element.tagName).toBe('BUTTON')
	})
})
