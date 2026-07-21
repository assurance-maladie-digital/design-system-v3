import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FilterInline from '../FilterInline.vue'

const filters = [
	{ name: 'statut', title: 'Statut', value: ['actif'] },
	{ name: 'type', title: 'Type', value: null },
]

// FilterInline ne porte aucun style de focus propre : chaque filtre est déclenché par un
// `.v-btn` (activateur de VMenu) couvert par l'override global `_btns.scss`. Les chips (ChipList)
// et le contenu (slot) sont gérés par leurs composants. On vérifie ici que les déclencheurs
// sont de vrais boutons focusables ; le rendu du ring est couvert par le visuel.
describe('FilterInline - Focus', () => {
	it('renders one real focusable trigger button per filter (global ring)', () => {
		const wrapper = mount(FilterInline, { props: { modelValue: filters } })
		const triggers = wrapper.findAll('.sy-filters-inline > .v-btn, .sy-filters-inline .v-btn')

		expect(triggers.length).toBe(filters.length)
		triggers.forEach((btn) => {
			expect(btn.element.tagName).toBe('BUTTON')
			expect(btn.attributes('tabindex')).not.toBe('-1')
		})
	})

	it('exposes each trigger by its filter class', () => {
		const wrapper = mount(FilterInline, { props: { modelValue: filters } })

		expect(wrapper.find('.sy-filter-statut').exists()).toBe(true)
		expect(wrapper.find('.sy-filter-type').exists()).toBe(true)
	})
})
