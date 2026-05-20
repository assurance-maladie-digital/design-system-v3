import LangBtn from '../LangBtn.vue'

describe('LangBtn - Visual regression tests', () => {
	it('displays the language button by default', () => {
		cy.mountWithVuetify(LangBtn, {
			props: { modelValue: 'fr' },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('lang-btn-default', cy.get('.v-application'))
	})

	it('displays the language button with English selected', () => {
		cy.mountWithVuetify(LangBtn, {
			props: { modelValue: 'en' },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('lang-btn-english', cy.get('.v-application'))
	})

	it('displays the language button without down arrow', () => {
		cy.mountWithVuetify(LangBtn, {
			props: {
				modelValue: 'fr',
				hideDownArrow: true,
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('lang-btn-no-arrow', cy.get('.v-application'))
	})
})
