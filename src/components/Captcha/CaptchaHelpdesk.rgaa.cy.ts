import CaptchaHelpdesk from './CaptchaHelpdesk.vue'
describe('CaptchaHelpdesk – RGAA browser checks – CNAM theme', () => {
	it('8.2 and 13.3 – exposes a visible telephone link', () => {
		cy.mountWithVuetify(CaptchaHelpdesk, { props: { phoneNumber: '3646', localizedMessage: phone => `Besoin d’aide ? Appelez le ${phone}` } })
		cy.get('a[href="tel:3646"]').should('be.visible').and('contain.text', '3646')
	})
})
