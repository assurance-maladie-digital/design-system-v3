import FilePreview from '../FilePreview.vue'

describe('FilePreview – RGAA browser checks – CNAM theme', () => {
	it('1.1 and 1.2 – exposes a non-empty alternative for an image preview', () => {
		const file = new File([''], 'photo.png', { type: 'image/png' })
		cy.mountWithVuetify(FilePreview, { props: { file, options: { image: { alt: 'Photo du document' } } } })
		cy.get('img').should('be.visible').and('have.attr', 'alt', 'Photo du document')
	})
})
