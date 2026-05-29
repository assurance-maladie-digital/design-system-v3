import FileList from '../FileList.vue'

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
})
