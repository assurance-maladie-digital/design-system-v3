import ContextualMenu from '../ContextualMenu.vue'

const defaultItems = [
	{ text: 'Accueil', hash: '#accueil', level: 1 },
	{ text: 'Mon compte', hash: '#mon-compte', level: 1 },
	{ text: 'Paramètres', hash: '#parametres', level: 2 },
	{ text: 'Déconnexion', hash: '#deconnexion', level: 1 },
]

describe('ContextualMenu - Visual regression tests', () => {
	it('displays the contextual menu', () => {
		cy.mountWithVuetify(ContextualMenu, {
			props: {
				ariaLabel: 'Menu de navigation',
				items: defaultItems,
			},
		})

		cy.get('.vd-contextual-menu-container').should('be.visible')
		cy.matchImageSnapshot('contextual-menu-default', cy.get('.v-application'))
	})

	it('displays the contextual menu with a selected item', () => {
		cy.mountWithVuetify(ContextualMenu, {
			props: {
				ariaLabel: 'Menu de navigation',
				items: defaultItems,
				modelValue: '#accueil',
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('contextual-menu-selected', cy.get('.v-application'))
	})
})
