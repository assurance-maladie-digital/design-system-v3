import Captcha from '../Captcha.vue'

describe('Captcha - Visual regression tests', () => {
	it('displays the captcha with image type', () => {
		cy.mountWithVuetify(Captcha, {
			props: {
				urlCreate: '/api/captcha/create',
				urlGetImage: '/api/captcha/image',
				urlGetAudio: '/api/captcha/audio',
				type: 'image',
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('captcha-image-type', cy.get('.v-application'))
	})

	it('displays the captcha with audio type', () => {
		cy.mountWithVuetify(Captcha, {
			props: {
				urlCreate: '/api/captcha/create',
				urlGetImage: '/api/captcha/image',
				urlGetAudio: '/api/captcha/audio',
				type: 'audio',
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('captcha-audio-type', cy.get('.v-application'))
	})

	it('displays the captcha without helpdesk', () => {
		cy.mountWithVuetify(Captcha, {
			props: {
				urlCreate: '/api/captcha/create',
				urlGetImage: '/api/captcha/image',
				urlGetAudio: '/api/captcha/audio',
				helpDesk: false,
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('captcha-no-helpdesk', cy.get('.v-application'))
	})
})
