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
