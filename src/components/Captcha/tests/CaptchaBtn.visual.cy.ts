import { mdiRefresh } from '@mdi/js'
import CaptchaBtn from '../CaptchaBtn.vue'

// Déclenche `:focus-visible` via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('CaptchaBtn - Focus visual regression tests', () => {
	// `<button>` natif (pas un `.v-btn`) : il reçoit un ring DS scopé (2px primary,
	// offset 2px) au lieu du focus navigateur par défaut.
	it('shows the DS ring on a focused CaptchaBtn', () => {
		cy.mountWithVuetify(CaptchaBtn, {
			props: { prependIcon: mdiRefresh },
			slots: { default: () => 'Rafraîchir' },
		})

		focusVisible('.captcha-btn')
		cy.wait(150)
		cy.matchImageSnapshot('captcha-btn-focus', cy.get('.v-application'))
	})
})
