import FileList from '../FileList.vue'

describe('FileList – RGAA browser checks – CNAM theme', () => {
	it('7.1 and 8.2 – exposes a visible list of uploaded files', () => {
		cy.mountWithVuetify(FileList, { props: { uploadList: [{ id: 'identity', title: 'Carte d’identité', state: 'success', fileName: 'identite.pdf' }] } })
		cy.get('ul.upload-list').should('be.visible')
		cy.contains('Carte d’identité').should('be.visible')
	})
})
