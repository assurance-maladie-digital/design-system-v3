import FilePreview from '../FilePreview.vue'

describe('FilePreview - Visual regression tests', () => {
	it('displays the file preview without file', () => {
		cy.mountWithVuetify(FilePreview, {
			props: { file: undefined },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('file-preview-empty', cy.get('.v-application'))
	})

	it('displays the file preview with an image file', () => {
		const imageBlob = new Blob(['fake-image'], { type: 'image/png' })
		const imageFile = new File([imageBlob], 'test.png', { type: 'image/png' })

		cy.mountWithVuetify(FilePreview, {
			props: { file: imageFile },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('file-preview-image', cy.get('.v-application'))
	})
})
