import CaptchaForm from '../CaptchaForm.vue'
import { locales } from '../locales'
describe('CaptchaForm – RGAA browser contract – CNAM theme', () => {
	it('renders a labelled field', () => {
		cy.mountWithVuetify(CaptchaForm, { props: { label: 'Code de sécurité', locales } })
		cy.get('input').should('be.visible').and('have.attr', 'aria-label', 'Code de sécurité')
	})
})
