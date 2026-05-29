import UploadWorkflow from '../UploadWorkflow.vue'

const defaultUploadList = [
	{
		id: '1',
		title: 'Carte vitale',
		state: 'initial',
		showUploadBtn: true,
	},
	{
		id: '2',
		title: 'Justificatif',
		state: 'success',
		fileName: 'justificatif.pdf',
	},
]

describe('UploadWorkflow - Visual regression tests', () => {
	it('displays the upload workflow by default', () => {
		cy.mountWithVuetify(UploadWorkflow, {
			props: { uploadList: defaultUploadList },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('upload-workflow-default', cy.get('.v-application'))
	})

	it('displays the upload workflow with a section title', () => {
		cy.mountWithVuetify(UploadWorkflow, {
			props: {
				uploadList: defaultUploadList,
				sectionTitle: 'Documents à fournir',
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('upload-workflow-with-title', cy.get('.v-application'))
	})
})
