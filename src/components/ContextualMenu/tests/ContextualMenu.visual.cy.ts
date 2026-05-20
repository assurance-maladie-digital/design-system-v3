import ContextualMenu from '../ContextualMenu.vue'

const defaultItems = [
	{ label: 'Accueil', level: 1 },
	{ label: 'Mon compte', level: 1 },
	{ label: 'Paramètres', level: 2 },
	{ label: 'Déconnexion', level: 1 },
]

describe('ContextualMenu - Visual regression tests', () => {
	it('displays the contextual menu', () => {
		cy.mountWithVuetify(ContextualMenu, {
			props: {
				ariaLabel: 'Menu de navigation',
				items: defaultItems,
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('contextual-menu-default', cy.get('.v-application'))
	})

	it('displays the contextual menu with a selected item', () => {
		cy.mountWithVuetify(ContextualMenu, {
			props: {
				ariaLabel: 'Menu de navigation',
				items: defaultItems,
				modelValue: 'Accueil',
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('contextual-menu-selected', cy.get('.v-application'))
	})
})
