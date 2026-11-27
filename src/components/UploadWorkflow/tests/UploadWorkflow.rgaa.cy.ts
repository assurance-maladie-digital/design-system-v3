import UploadWorkflow from '../UploadWorkflow.vue'

describe('UploadWorkflow – RGAA browser checks – CNAM theme', () => {
	it('8.2 and 11.1 – exposes the upload section heading', () => {
		cy.mountWithVuetify(UploadWorkflow, {
			props: { sectionTitle: 'Ajouter des justificatifs' },
		})

		cy.get('.sy-upload-workflow h4').should('be.visible').and('contain.text', 'Ajouter des justificatifs')
	})
})
