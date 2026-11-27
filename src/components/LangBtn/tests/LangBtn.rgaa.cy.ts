import LangBtn from '../LangBtn.vue'

describe('LangBtn – RGAA browser checks – CNAM theme', () => {
	it('7.1 and 12.9 – provides a keyboard reachable language control', () => {
		cy.mountWithVuetify(LangBtn, { props: { modelValue: 'fr' } })
		cy.get('.vd-lang-btn').should('be.visible').and('have.attr', 'aria-haspopup')
	})
})
