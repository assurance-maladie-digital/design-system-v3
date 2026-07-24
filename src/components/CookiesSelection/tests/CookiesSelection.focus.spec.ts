import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CookiesSelection from '../CookiesSelection.vue'

const items = {
	functional: [
		{ name: 'contrast', description: 'Affichage', conservation: '1 an' },
	],
	analytics: [
		{ name: 'user_id', description: 'Identifiant', conservation: '6 mois' },
	],
}

// CookiesSelection ne porte aucun style de focus propre : ses cibles sont des `.v-btn` standalone
// (Tout refuser / Tout accepter / Enregistrer) couvertes par le ring global `_btns.scss`. Les rings
// du `<summary>` et des radios sont ajoutés dans CookiesInformation (couverts par le visuel + leur
// propre focus spec). On valide ici que les boutons de CookiesSelection sont de vrais boutons.
describe('CookiesSelection - Focus', () => {
	it.each(['reject-all', 'accept-all', 'submit'])(
		'renders a real focusable "%s" button',
		(testId) => {
			const wrapper = mount(CookiesSelection, { props: { items } })
			const btn = wrapper.find(`[data-test-id="${testId}"]`)

			expect(btn.exists()).toBe(true)
			expect(btn.element.tagName).toBe('BUTTON')
			expect(btn.attributes('tabindex')).not.toBe('-1')
		},
	)
})
