import StatusPage from '../StatusPage.vue'
import { h } from 'vue'

// Déclenche :focus-visible via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

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

describe('StatusPage - Focus visual regression tests', () => {
	// Bouton d'action (VBtn) : ring standard global (2px primary, offset 3px).
	it('shows the standard ring on the action button', () => {
		cy.mountWithVuetify(StatusPage, {
			props: { pageTitle: 'Erreur 404', btnText: 'Retour à l\'accueil', btnHref: '#' },
		})

		focusVisible('.v-btn')
		cy.wait(100)
		cy.matchImageSnapshot('status-page-focus', cy.get('.v-application'))
	})
})
