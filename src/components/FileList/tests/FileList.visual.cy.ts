import FileList from '../FileList.vue'

// Déclenche `:focus-visible` via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

const defaultUploadList = [
	{ id: '1', title: 'Carte vitale', state: 'initial', showUploadBtn: true },
	{ id: '2', title: 'Justificatif de domicile', state: 'success', fileName: 'justificatif.pdf' },
	{ id: '3', title: 'Ordonnance', state: 'error' },
]

describe('FileList - Visual regression tests', () => {
	it('displays the file list with mixed states', () => {
		cy.mountWithVuetify(FileList, {
			props: { uploadList: defaultUploadList },
		})

		cy.get('.upload-list').should('be.visible')
		cy.matchImageSnapshot('file-list-default', cy.get('.upload-list'))
	})

	it('displays the file list with delete buttons', () => {
		cy.mountWithVuetify(FileList, {
			props: {
				uploadList: [
					{ id: '1', title: 'Document', state: 'success', fileName: 'doc.pdf', showDeleteBtn: true },
				],
			},
		})

		cy.get('.upload-list').should('be.visible')
		cy.matchImageSnapshot('file-list-with-delete', cy.get('.upload-list'))
	})

	// Les actions de ligne sont des `.v-btn` : ring primary via l'override global `_btns.scss`
	// (pas de style scopé dans FileList/UploadItem).
	it('shows the global ring on a focused item action button', () => {
		cy.mountWithVuetify(FileList, {
			props: {
				uploadList: [
					{ id: '1', title: 'Carte vitale', state: 'initial', showUploadBtn: true },
				],
			},
		})

		focusVisible('.file-item .v-btn')
		cy.wait(150)
		cy.matchImageSnapshot('file-list-action-focus', cy.get('.upload-list'))
	})
})
