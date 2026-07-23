import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LunarCalendar from '../LunarCalendar.vue'

// LunarCalendar est un simple wrapper autour d'un unique SyTextField (champ masqué) : il ne
// porte aucun style ni élément de focus propre. Tout le focus (bordure primary de l'input,
// icône calendrier décorative, bouton clear = VBtn global) est géré par SyTextField. On
// vérifie ici que la surface focusable est bien déléguée ; le rendu est couvert par le visuel.
describe('LunarCalendar - Focus', () => {
	it('delegates to a SyTextField with a keyboard-focusable input', () => {
		const wrapper = mount(LunarCalendar, {
			props: { label: 'Date lunaire', modelValue: '15/08/1990' },
		})

		expect(wrapper.find('.v-text-field').exists()).toBe(true)
		const input = wrapper.find('input')
		expect(input.exists()).toBe(true)
		// Input standard => focus = bordure primary du champ (défaut Vuetify color="primary").
		expect(input.attributes('tabindex')).not.toBe('-1')
	})
})
