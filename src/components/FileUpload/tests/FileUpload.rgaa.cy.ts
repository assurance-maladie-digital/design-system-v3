import FileUpload from '../FileUpload.vue'
describe('FileUpload – RGAA browser checks – CNAM theme', () => {
	it('7.1 and 10.7 – exposes a visible keyboard-operable drop zone', () => {
		cy.mountWithVuetify(FileUpload, { props: { modelValue: [] } })
		cy.get('[role="button"]').should('be.visible').and('have.attr', 'tabindex', '0').focus()
		cy.focused().should('have.attr', 'role', 'button')
	})
})
