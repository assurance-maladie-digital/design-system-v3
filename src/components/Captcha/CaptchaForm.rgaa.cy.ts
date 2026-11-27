import CaptchaForm from './CaptchaForm.vue'
import { locales } from './locales'
describe('CaptchaForm – RGAA browser checks – CNAM theme', () => {
	it('8.2 and 11.1 – renders a visible labelled CAPTCHA field', () => {
		cy.mountWithVuetify(CaptchaForm, { props: { label: 'Code de sécurité', locales, required: true } })
		cy.get('input').should('be.visible').and('have.attr', 'aria-label', 'Code de sécurité')
	})
})
