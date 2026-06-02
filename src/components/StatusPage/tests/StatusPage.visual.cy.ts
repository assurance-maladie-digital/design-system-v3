import StatusPage from '../StatusPage.vue'
import { h } from 'vue'

const illustrationSlot = {
	illustration: () => h('div', {
		style: 'width:120px;height:120px;background:#e0e7ff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:48px;',
	}, '404'),
}

describe('StatusPage - Visual regression tests', () => {
	it('displays the status page with a title', () => {
		cy.mountWithVuetify(StatusPage, {
			props: { pageTitle: 'Erreur 404' },
			slots: illustrationSlot,
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('status-page-default', cy.get('.v-application'))
	})

	it('displays the status page with all content', () => {
		cy.mountWithVuetify(StatusPage, {
			props: {
				pageTitle: 'Page introuvable',
				message: 'La page que vous recherchez n\'existe pas.',
				btnText: 'Retour à l\'accueil',
				btnHref: '/',
			},
			slots: illustrationSlot,
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('status-page-full', cy.get('.v-application'))
	})

	it('displays the status page without button', () => {
		cy.mountWithVuetify(StatusPage, {
			props: {
				pageTitle: 'Erreur',
				hideBtn: true,
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('status-page-no-btn', cy.get('.v-application'))
	})
})
