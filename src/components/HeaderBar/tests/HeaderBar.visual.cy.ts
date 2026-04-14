import { h } from 'vue'
import HeaderBar from '../HeaderBar.vue'

describe('HeaderBar - Visual regression tests', () => {
	it('displays the header by default', () => {
		cy.mountWithVuetify(HeaderBar, {
			props: {
				serviceTitle: 'Mon Service',
			},
		})

		cy.get('.header').should('be.visible')
		cy.matchImageSnapshot('header-bar-default')
	})

	it('displays the header with title and subtitle', () => {
		cy.mountWithVuetify(HeaderBar, {
			props: {
				serviceTitle: 'Mon Service',
				serviceSubtitle: 'Description du service',
			},
		})

		cy.get('.header').should('be.visible')
		cy.matchImageSnapshot('header-bar-with-subtitle')
	})

	it('displays the header with custom width', () => {
		cy.mountWithVuetify(HeaderBar, {
			props: {
				serviceTitle: 'Mon Service',
				width: '900px',
			},
		})

		cy.get('.header').should('be.visible')
		cy.matchImageSnapshot('header-bar-custom-width')
	})

	it('displays the header with header-side slot', () => {
		cy.mountWithVuetify(HeaderBar, {
			props: {
				serviceTitle: 'Mon Service',
			},
			slots: {
				'header-side': () => h('button', 'Connexion'),
			},
		})

		cy.get('.header').should('be.visible')
		cy.get('.header-side').should('be.visible')
		cy.matchImageSnapshot('header-bar-with-side')
	})

	it('displays the header with prepend slot', () => {
		cy.mountWithVuetify(HeaderBar, {
			props: {
				serviceTitle: 'Mon Service',
			},
			slots: {
				prepend: () => h('div', { style: 'background:#005AA1;color:#fff;padding:4px 16px;font-size:14px;' }, 'Bandeau info'),
			},
		})

		cy.get('.header').should('be.visible')
		cy.get('.header-prepend').should('be.visible')
		cy.matchImageSnapshot('header-bar-with-prepend')
	})

	it('displays the non-sticky header', () => {
		cy.mountWithVuetify(HeaderBar, {
			props: {
				serviceTitle: 'Mon Service',
				sticky: false,
			},
		})

		cy.get('.header').should('be.visible')
		cy.matchImageSnapshot('header-bar-no-sticky')
	})
})
