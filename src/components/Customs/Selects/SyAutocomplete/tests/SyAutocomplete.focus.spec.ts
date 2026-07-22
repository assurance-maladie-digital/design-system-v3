import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import SyAutocomplete from '../SyAutocomplete.vue'

const items = [
	{ text: 'Paris', value: 'paris' },
	{ text: 'Lyon', value: 'lyon' },
]

// jsdom ne calcule pas `:focus-visible` : SyAutocomplete est un combobox. Le focus reste sur
// l'input (SyTextField, bordure primary) ; les options sont mises en avant via
// `aria-activedescendant` (ring `.v-list-item:focus-visible/.keyboard-focused` déjà défini,
// aligné sur SySelect). Le seul focusable propre non couvert est le bouton clear (`<button>`
// natif). On vérifie ici ses prérequis structurels ; le rendu du ring est couvert par le visuel.
describe('SyAutocomplete - Focus', () => {
	it('renders the clear button as a focusable native button when clearable with a selection', () => {
		const wrapper = mount(SyAutocomplete, {
			props: { items, clearable: true, modelValue: 'paris', label: 'Ville' },
		})
		const clear = wrapper.find('.sy-autocomplete__clear-button')

		expect(clear.exists()).toBe(true)
		expect(clear.element.tagName).toBe('BUTTON')
		expect(clear.attributes('tabindex')).not.toBe('-1')
	})

	it('exposes a focusable combobox input (primary field border)', () => {
		const wrapper = mount(SyAutocomplete, {
			props: { items, label: 'Ville' },
		})
		const input = wrapper.find('input')

		expect(input.exists()).toBe(true)
		expect(input.attributes('tabindex')).not.toBe('-1')
	})

	// Régression : dans le pattern combobox (aria-activedescendant), l'option active au
	// clavier reçoit la classe qui porte le ring DS visible (le fond gris seul ne suffisait
	// pas, et l'ancien token `borderAccentPrimary` était invalide → aucun anneau).
	it('marks the keyboard-active option with the DS focus-ring class on ArrowDown', async () => {
		const menuId = 'sy-autocomplete-focus-menu'
		const wrapper = mount(SyAutocomplete, {
			props: { items, label: 'Ville', menuId },
			attachTo: document.body,
		})

		const host = document.getElementById(`${menuId}-input`)
		const input = host instanceof HTMLInputElement ? host : host?.querySelector('input')
		input?.focus()
		await flushPromises()
		await nextTick()

		// ArrowDown ouvre le menu et active la première option.
		input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
		await flushPromises()
		await nextTick()
		await flushPromises()

		const focusedOption = document.body.querySelector(`#${menuId} .sy-autocomplete__option--focused`)
		expect(focusedOption).not.toBeNull()

		wrapper.unmount()
	})
})
