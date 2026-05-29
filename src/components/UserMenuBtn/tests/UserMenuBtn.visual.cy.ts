import UserMenuBtn from '../UserMenuBtn.vue'

const defaultMenuItems = [
	{ text: 'Mon compte', value: 'account' },
	{ text: 'Paramètres', value: 'settings' },
]

describe('UserMenuBtn - Visual regression tests', () => {
	it('displays the user menu button by default', () => {
		cy.mountWithVuetify(UserMenuBtn, {
			props: { menuItems: defaultMenuItems },
		})

		cy.get('.user-menu-btn').should('be.visible')
		cy.matchImageSnapshot('user-menu-btn-default', cy.get('.user-menu-btn'))
	})

	it('displays the user menu button with full name', () => {
		cy.mountWithVuetify(UserMenuBtn, {
			props: {
				menuItems: defaultMenuItems,
				fullName: 'Jean Dupont',
				additionalInformation: 'N° 123456789',
			},
		})

		cy.get('.user-menu-btn').should('be.visible')
		cy.matchImageSnapshot('user-menu-btn-with-name', cy.get('.user-menu-btn'))
	})

	it('displays the user menu button without logout', () => {
		cy.mountWithVuetify(UserMenuBtn, {
			props: {
				menuItems: defaultMenuItems,
				hideLogoutBtn: true,
			},
		})

		cy.get('.user-menu-btn').should('be.visible')
		cy.matchImageSnapshot('user-menu-btn-no-logout', cy.get('.user-menu-btn'))
	})
})
