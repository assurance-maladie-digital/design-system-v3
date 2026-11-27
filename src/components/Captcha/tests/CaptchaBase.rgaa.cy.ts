import CaptchaBase from '../CaptchaBase.vue'
import { locales } from '../locales'

describe('CaptchaBase – RGAA browser checks – CNAM theme', () => {
	it('7.1 and 8.2 – renders the selected mode slot in the component landmark', () => {
		cy.mountWithVuetify(CaptchaBase, {
			props: {
				modelValue: 'choice',
				urlCreate: '/captcha/create',
				urlGetImage: '/captcha/image',
				urlGetAudio: '/captcha/audio',
				locale: 'fr',
				locales,
			},
			slots: { default: '<p data-test="captcha-choice">Choisissez un captcha</p>' },
		})

		cy.get('.captcha').should('contain.text', 'Choisissez un captcha')
	})
})
