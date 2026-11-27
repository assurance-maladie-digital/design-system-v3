import FileUploadContent from '../FileUploadContent.vue'
import { locales } from '../locales'
describe('FileUploadContent – RGAA browser checks – CNAM theme', () => {
	it('8.9 – exposes readable upload instructions', () => {
		cy.mountWithVuetify(FileUploadContent, { props: { allowedExtensions: ['pdf'], fileSizeUnits: ['o', 'Ko', 'Mo'], fileSizeMax: 1000, multiple: false, locales } })
		cy.get('.sy-file-upload-placeholder').should('be.visible').and('contain.text', 'pdf')
	})
})
