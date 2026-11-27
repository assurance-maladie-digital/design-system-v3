import CaptchaHelpdesk from '../CaptchaHelpdesk.vue'
describe('CaptchaHelpdesk – RGAA browser contract – CNAM theme', () => {
	it('exposes a telephone link', () => {
		cy.mountWithVuetify(CaptchaHelpdesk, { props: { phoneNumber: '3646', localizedMessage: phone => phone } })
		cy.get('a[href="tel:3646"]').should('be.visible')
	})
})
