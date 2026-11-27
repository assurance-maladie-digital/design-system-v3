import CaptchaBtn from '../CaptchaBtn.vue'
describe('CaptchaBtn – RGAA browser contract – CNAM theme', () => {
	it('is focusable', () => {
		cy.mountWithVuetify(CaptchaBtn)
		cy.get('button.captcha-btn').should('be.visible').and('have.attr', 'type', 'button')
	})
})
