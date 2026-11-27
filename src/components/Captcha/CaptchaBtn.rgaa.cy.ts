import CaptchaBtn from './CaptchaBtn.vue'
describe('CaptchaBtn – RGAA browser checks – CNAM theme', () => {
	it('7.1 and 10.7 – exposes a visible native button', () => {
		cy.mountWithVuetify(CaptchaBtn, { slots: { default: () => 'Écouter le code' } })
		cy.get('button.captcha-btn').should('be.visible').and('have.attr', 'type', 'button').and('contain.text', 'Écouter le code')
	})
})
