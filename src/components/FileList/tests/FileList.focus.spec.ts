import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FileList from '../FileList.vue'

// FileList / UploadItem ne portent AUCUN style de focus propre : les actions de ligne
// (envoyer / prévisualiser / supprimer) sont des `.v-btn` couverts par l'override global
// `_btns.scss`. On vérifie ici que ce sont bien de vrais boutons focusables ; le rendu du
// ring est couvert par le test visuel.
describe('FileList - Focus', () => {
	it('renders the item actions as real, focusable v-btn buttons (global ring)', () => {
		const wrapper = mount(FileList, {
			props: {
				uploadList: [
					{ id: '1', title: 'Carte vitale', state: 'initial', showUploadBtn: true },
					{ id: '2', title: 'Justificatif', state: 'success', fileName: 'justif.pdf', showDeleteBtn: true },
				],
			},
		})

		const buttons = wrapper.findAll('.file-item .v-btn')
		expect(buttons.length).toBeGreaterThan(0)
		buttons.forEach((btn) => {
			expect(btn.element.tagName).toBe('BUTTON')
			// Vrai bouton dans le flux clavier => couvert par `_btns.scss`, pas de ring scopé.
			expect(btn.attributes('tabindex')).not.toBe('-1')
		})
	})
})
