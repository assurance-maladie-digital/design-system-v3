import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TableToolbar from '../TableToolbar.vue'

// TableToolbar ne porte aucun style de focus propre : le champ de recherche est un VTextField
// `color="primary"` (bordure primary au focus) et le bouton « ajouter » est un `.v-btn`
// (couvert par l'override global `_btns.scss`). On vérifie ici que la surface focusable est
// bien de vrais éléments atteignables au clavier ; le rendu est couvert par le visuel.
describe('TableToolbar - Focus', () => {
	it('exposes a keyboard-focusable search input', () => {
		const wrapper = mount(TableToolbar, {
			props: { nbTotal: 42 },
		})
		const input = wrapper.find('[data-test-id="search-input"] input')

		expect(input.exists()).toBe(true)
		expect(input.attributes('tabindex')).not.toBe('-1')
	})

	it('renders the add button as a real focusable v-btn (global ring)', () => {
		const wrapper = mount(TableToolbar, {
			props: { nbTotal: 42, showAddButton: true },
		})
		const btn = wrapper.find('[data-test-id="add-btn"]')

		expect(btn.exists()).toBe(true)
		expect(btn.element.tagName).toBe('BUTTON')
		expect(btn.attributes('tabindex')).not.toBe('-1')
	})
})
