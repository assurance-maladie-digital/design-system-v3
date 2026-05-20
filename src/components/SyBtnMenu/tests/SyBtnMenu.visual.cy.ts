import SyBtnMenu from '../SyBtnMenu.vue'

const defaultItems = [
	{ text: 'Profil', value: 'profil' },
	{ text: 'Paramètres', value: 'settings' },
	{ text: 'Déconnexion', value: 'logout' },
]

describe('SyBtnMenu - Visual regression tests', () => {
	it('displays the button menu by default', () => {
		cy.mountWithVuetify(SyBtnMenu, {
			props: { menuItems: defaultItems },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('sy-btn-menu-default', cy.get('.v-application'))
	})

	it('displays the button menu with custom label', () => {
		cy.mountWithVuetify(SyBtnMenu, {
			props: {
				menuItems: defaultItems,
				label: 'Mon compte',
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('sy-btn-menu-custom-label', cy.get('.v-application'))
	})

	it('displays the button menu as required', () => {
		cy.mountWithVuetify(SyBtnMenu, {
			props: {
				menuItems: defaultItems,
				required: true,
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('sy-btn-menu-required', cy.get('.v-application'))
	})
})
