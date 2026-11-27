import Captcha from '../Captcha.vue'

const captchaProps = {
	urlCreate: '/captcha/create',
	urlGetImage: '/captcha/image',
	urlGetAudio: '/captcha/audio',
}

describe('Captcha – RGAA browser checks – CNAM theme', () => {
	beforeEach(() => {
		cy.intercept('POST', '**/captcha/create', { statusCode: 200, body: { id: 'captcha-id' } }).as('createCaptcha')
	})

	it('1.4, 8.2 and 11.10 – exposes the image CAPTCHA and its named input', () => {
		cy.mountWithVuetify(Captcha, { props: captchaProps })
		cy.wait('@createCaptcha')
		cy.get('img.captcha-img').should('be.visible').and('have.attr', 'alt').and('contain', 'captcha')
		cy.get('input').should('have.attr', 'aria-label').and('contain', 'Caractères')
	})

	it('1.5, 7.3 and 10.7 – exposes the image/audio alternatives and focusable controls', () => {
		cy.mountWithVuetify(Captcha, { props: { ...captchaProps, type: 'choice' } })
		cy.get('button').should('have.length.greaterThan', 1).each(($button) => {
			expect($button.attr('type')).to.equal('button')
		})
	})

	it('3.3 and 7.1 – keeps the refresh, audio switch and support link operable', () => {
		cy.mountWithVuetify(Captcha, { props: captchaProps })
		cy.wait('@createCaptcha')
		cy.get('[data-test-id="captcha-image-new"]').focus().should('be.focused')
		cy.get('[data-test-id="captcha-image-change"]').should('be.visible')
		cy.get('a[href^="tel:"]').should('have.attr', 'href', 'tel:3648')
	})
})
