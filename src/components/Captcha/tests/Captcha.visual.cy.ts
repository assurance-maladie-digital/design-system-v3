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

	it('keeps the captcha image inside a 256px wide container', () => {
		// 256px = 320px card minus 2 × 32px padding (MobileAccessibilityGuideline story)
		cy.viewport(256, 800)
		cy.intercept('POST', '/api/captcha/create', { body: { id: 'captcha-id' } })
		cy.intercept('GET', '/api/captcha/image', {
			headers: { 'content-type': 'image/svg+xml' },
			body: '<svg xmlns="http://www.w3.org/2000/svg" width="311" height="64"><rect width="311" height="64"/></svg>',
		})
		cy.mountWithVuetify(Captcha, {
			props: {
				urlCreate: '/api/captcha/create',
				urlGetImage: '/api/captcha/image',
				urlGetAudio: '/api/captcha/audio',
				type: 'image',
			},
		})

		cy.get('.captcha').then(($container) => {
			const containerRight = $container[0]!.getBoundingClientRect().right

			cy.get('.captcha img').should(($img) => {
				expect($img[0]!.getBoundingClientRect().right).to.be.at.most(containerRight)
			})
		})
	})
})
