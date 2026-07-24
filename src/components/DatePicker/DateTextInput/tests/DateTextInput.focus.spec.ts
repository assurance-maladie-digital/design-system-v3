import { mount, type VueWrapper } from '@vue/test-utils'
import { describe, it, expect, afterEach } from 'vitest'
import DateTextInput from '../DateTextInput.vue'

// Champ pur : focus = bordure primary du field Vuetify (convention DS), aucun ring
// outline bespoke. On vérifie le prérequis : l'input est focusable.
describe('DateTextInput - focus', () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let wrapper: VueWrapper<any> | null = null

	afterEach(() => {
		wrapper?.unmount()
		wrapper = null
	})

	it('renders a focusable input', () => {
		wrapper = mount(DateTextInput, {
			props: { modelValue: '', label: 'Date', format: 'DD/MM/YYYY' },
			attachTo: document.body,
		})
		const input = wrapper.find('input')
		expect(input.exists()).toBe(true)
		input.element.focus()
		expect(document.activeElement).toBe(input.element)
	})
})
