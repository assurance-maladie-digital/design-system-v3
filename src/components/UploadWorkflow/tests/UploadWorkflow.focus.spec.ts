import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UploadWorkflow from '../UploadWorkflow.vue'

// UploadWorkflow ne porte AUCUN style de focus propre : c'est une composition (FileUpload,
// FileList, SySelect, DialogBox). On vérifie ici que sa surface focusable directe est bien
// exposée et déléguée — le rendu des rings est couvert par les tests visuels des enfants.
describe('UploadWorkflow - Focus', () => {
	const uploadList = [
		{ id: 'id', title: 'Carte d\'identité', state: 'initial', showUploadBtn: true },
		{ id: 'bill', title: 'Facture de soin', state: 'initial', showUploadBtn: true },
	]

	it('exposes the FileUpload dropzone as a keyboard-focusable button (scoped DS ring)', () => {
		const wrapper = mount(UploadWorkflow, { props: { uploadList } })
		const dropzone = wrapper.find('.sy-file-upload')

		expect(dropzone.exists()).toBe(true)
		expect(dropzone.attributes('role')).toBe('button')
		expect(dropzone.attributes('tabindex')).toBe('0')
	})

	it('renders the FileList item actions as real v-btn buttons (global ring)', () => {
		const wrapper = mount(UploadWorkflow, { props: { uploadList } })
		const actionButtons = wrapper.findAll('.file-item .v-btn')

		// Les actions (envoyer / supprimer / prévisualiser) sont des `.v-btn` => couvertes
		// par l'override global `_btns.scss`, pas de ring scopé à ajouter.
		expect(actionButtons.length).toBeGreaterThan(0)
		expect(actionButtons[0]!.element.tagName).toBe('BUTTON')
	})
})
