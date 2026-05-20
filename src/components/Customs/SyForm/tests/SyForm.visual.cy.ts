import SyForm from '../SyForm.vue'

describe('SyForm - Visual regression tests', () => {
	it('displays a basic form', () => {
		cy.mountWithVuetify(SyForm, {
			slots: {
				default: '<div class="pa-4"><label>Champ<input type="text" /></label></div>',
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('sy-form-default', cy.get('.v-application'))
	})

	it('displays a form with validate on submit', () => {
		cy.mountWithVuetify(SyForm, {
			props: { validateOnSubmit: true },
			slots: {
				default: '<div class="pa-4"><label>Champ<input type="text" /></label></div>',
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('sy-form-validate-on-submit', cy.get('.v-application'))
	})
})
