import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NirField from '../NirField.vue'

// jsdom ne calcule pas `:focus-visible` : NirField ne porte AUCUN style de focus propre,
// tout est délégué à SyTextField (bordure primary de l'input, ring des icônes info,
// bouton clear = VBtn couvert par le global). On vérifie donc que les focusables exposés
// par NirField sont bien de vrais éléments atteignables au clavier ; le rendu du ring est
// couvert par les tests visuels Cypress.
describe('NirField - Focus', () => {
	it('exposes the number and key inputs as keyboard-focusable fields', () => {
		const wrapper = mount(NirField, {
			props: { modelValue: '', displayKey: true },
		})

		const numberInput = wrapper.find('.number-field input')
		const keyInput = wrapper.find('.key-field input')

		expect(numberInput.exists()).toBe(true)
		expect(keyInput.exists()).toBe(true)
		// Inputs standards => focus = bordure primary du champ (défaut Vuetify color="primary").
		expect(numberInput.attributes('tabindex')).not.toBe('-1')
		expect(keyInput.attributes('tabindex')).not.toBe('-1')
	})

	it('renders the info tooltip as a focusable button (ring handled by SyTextField)', () => {
		const wrapper = mount(NirField, {
			props: {
				modelValue: '',
				displayKey: true,
				nirTooltip: 'Numéro de sécurité sociale',
				nirTooltipPosition: 'append',
			},
		})

		// L'icône info interactive est rendue par SyTextField en role="button" ; c'est elle
		// qui reçoit le ring `.v-input__append .v-icon:focus-visible` défini dans SyTextField.
		const infoIcon = wrapper.find('.number-field .v-input__append [role="button"]')
		expect(infoIcon.exists()).toBe(true)
	})
})
