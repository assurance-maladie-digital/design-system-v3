import UploadItem from '../UploadItem.vue'
describe('UploadItem – RGAA browser checks – CNAM theme', () => {
	it('7.1 and 8.2 – exposes named file actions', () => {
		cy.mountWithVuetify(UploadItem, { props: { itemId: 'id', title: 'Justificatif', fileName: 'piece.pdf', state: 'success', showPreviewBtn: true } })
		cy.get('.file-item__action-preview').should('be.visible').and('have.attr', 'aria-label').and('contain', 'piece.pdf')
		cy.get('.file-item__action-delete').should('be.visible').and('have.attr', 'aria-label').and('contain', 'piece.pdf')
	})
})
