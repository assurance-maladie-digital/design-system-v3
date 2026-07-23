import UploadWorkflow from '../UploadWorkflow.vue'

// Déclenche `:focus-visible` via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

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

	// La dropzone FileUpload composée dans le workflow reçoit son ring DS au clavier
	// (ring défini dans FileUpload, non modifié ici — juste vérifié dans le contexte).
	it('shows the DS ring on the focused dropzone within the workflow', () => {
		cy.mountWithVuetify(UploadWorkflow, {
			props: { uploadList: defaultUploadList },
		})

		focusVisible('.sy-file-upload')
		cy.wait(150)
		cy.matchImageSnapshot('upload-workflow-dropzone-focus', cy.get('.v-application'))
	})
})
