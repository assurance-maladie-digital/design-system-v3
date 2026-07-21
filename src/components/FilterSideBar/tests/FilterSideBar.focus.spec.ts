import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { VApp } from 'vuetify/components'
import FilterSideBar from '../FilterSideBar.vue'

const filters = [
	{ name: 'statut', title: 'Statut', value: ['actif'] },
	{ name: 'type', title: 'Type', value: null },
]

// FilterSideBar (VNavigationDrawer) doit être monté dans un <VApp> (layout Vuetify).
const mountSidebar = () => {
	const Host = defineComponent({
		components: { VApp, FilterSideBar },
		data: () => ({ filters }),
		template: '<VApp><FilterSideBar v-model="filters" /></VApp>',
	})
	return mount(Host, {
		attachTo: document.body,
		global: { stubs: { Teleport: true } },
	})
}

// FilterSideBar porte déjà ses rings DS (boutons offset 2px + titres d'accordéon inset,
// keyboard-only, primary). On vérifie ici que la surface focusable est bien de vrais éléments
// atteignables au clavier ; le rendu des anneaux est couvert par le visuel.
describe('FilterSideBar - Focus', () => {
	it('renders the toggle as a real focusable button (scoped DS ring)', () => {
		const wrapper = mountSidebar()
		const btn = wrapper.find('.sy-filters-side-bar__open-btn')

		expect(btn.exists()).toBe(true)
		expect(btn.element.tagName).toBe('BUTTON')
		expect(btn.attributes('tabindex')).not.toBe('-1')

		wrapper.unmount()
	})

	it('exposes focusable accordion titles and action buttons once the drawer is open', async () => {
		const wrapper = mountSidebar()
		await wrapper.find('.sy-filters-side-bar__open-btn').trigger('click')
		await nextTick()

		// Titres d'accordéon (un par filtre) : focusables, portent le ring inset scopé.
		const titles = wrapper.findAll('.v-expansion-panel-title')
		expect(titles.length).toBe(filters.length)

		// Boutons d'action bas de panneau : de vrais `.v-btn` avec le ring scopé (offset 2px).
		expect(wrapper.find('.sy-filters-side-bar__apply-btn').exists()).toBe(true)
		expect(wrapper.find('.sy-filters-side-bar__reset-btn').exists()).toBe(true)

		wrapper.unmount()
	})
})
