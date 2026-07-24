import FooterBar from '../FooterBar.vue'
import { h } from 'vue'

describe('FooterBar - Visual regression tests', () => {
	it('displays the footer bar by default', () => {
		cy.mountWithVuetify(FooterBar)

		cy.get('.v-footer').should('be.visible')
		cy.matchImageSnapshot('footer-bar-default', cy.get('.v-footer'))
	})

	it('displays the footer bar without logo', () => {
		cy.mountWithVuetify(FooterBar, {
			props: { hideLogo: true },
		})

		cy.get('.v-footer').should('be.visible')
		cy.matchImageSnapshot('footer-bar-no-logo', cy.get('.v-footer'))
	})

	it('displays the footer bar with logo', () => {
		cy.mountWithVuetify(FooterBar, {
			slots: {
				default: () => h('div', { class: 'text-white' }, 'Extended mode content'),
			},
		})

		cy.get('.v-footer').should('be.visible')
		cy.get('.logo-picture img').should('be.visible')
		cy.matchImageSnapshot('footer-bar-with-logo', cy.get('.v-footer'))
	})

	it('displays the footer bar with logo in light mode', () => {
		cy.mountWithVuetify(FooterBar, {
			slots: {
				default: () => h('div', 'Extended mode content'),
			},
			props: { light: true },
		})

		cy.get('.v-footer').should('be.visible')
		cy.get('.logo-picture img').should('be.visible')
		cy.matchImageSnapshot('footer-bar-with-logo-dark', cy.get('.v-footer'))
	})

	it('displays the footer bar without social media links', () => {
		cy.mountWithVuetify(FooterBar, {
			props: { hideSocialMediaLinks: true },
		})

		cy.get('.v-footer').should('be.visible')
		cy.matchImageSnapshot('footer-bar-no-social', cy.get('.v-footer'))
	})

	it('displays the footer bar with a version', () => {
		cy.mountWithVuetify(FooterBar, {
			props: { version: '1.2.3' },
		})

		cy.get('.v-footer').should('be.visible')
		cy.matchImageSnapshot('footer-bar-version', cy.get('.v-footer'))
	})
})

// Déclenche :focus-visible via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('FooterBar - Focus visual regression tests', () => {
	// Le back-to-top (#scroll-btn) n'apparaît qu'en mode étendu (slot par défaut).
	it('shows the onPrimary focus ring on the back-to-top (dark)', () => {
		cy.mountWithVuetify(FooterBar, {
			slots: { default: () => 'Contenu du footer' },
		})

		focusVisible('#scroll-btn')
		cy.wait(100)
		cy.matchImageSnapshot('footer-bar-focus-scroll-dark', cy.get('.v-footer'))
	})

	it('shows the primary focus ring on the back-to-top (light)', () => {
		cy.mountWithVuetify(FooterBar, {
			props: { light: true },
			slots: { default: () => 'Contenu du footer' },
		})

		focusVisible('#scroll-btn')
		cy.wait(100)
		cy.matchImageSnapshot('footer-bar-focus-scroll-light', cy.get('.v-footer'))
	})
})
