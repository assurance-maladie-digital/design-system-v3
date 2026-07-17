import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DiacriticPicker from '../DiacriticPicker.vue'

// jsdom ne calcule pas `:focus-visible` ni les styles d'`outline` : ces tests vérifient
// les prérequis structurels du ring de focus (éléments focusables + rôles), le rendu du
// ring étant couvert par les tests visuels Cypress.
describe('DiacriticPicker - Focus', () => {
	const factory = () =>
		mount(DiacriticPicker, {
			props: { modelValue: '' },
			slots: {
				default: '<input type="text" aria-label="Nom" />',
			},
		})

	it('keeps the input-slot wrapper out of the keyboard tab order', () => {
		const wrapper = factory()
		const textbox = wrapper.find('.sy-input-slot')

		expect(textbox.exists()).toBe(true)
		// Le wrapper enveloppe le vrai <input> du slot ; il ne doit PAS être un arrêt de Tab
		// supplémentaire (sinon ring conteneur en trop avant le champ). tabindex -1 => hors
		// séquence clavier, tout en gardant le `@keydown` d'insertion via bubbling.
		expect(textbox.attributes('tabindex')).toBe('-1')
	})

	it('renders the opening button as a real focusable v-btn (global ring)', () => {
		const wrapper = factory()
		const btn = wrapper.find('.sy-diacritic-btn')

		expect(btn.exists()).toBe(true)
		// Un vrai <button> (pas tabindex -1) => couvert par l'override global `_btns.scss`.
		expect(btn.element.tagName).toBe('BUTTON')
		expect(btn.attributes('tabindex')).not.toBe('-1')
	})
})
