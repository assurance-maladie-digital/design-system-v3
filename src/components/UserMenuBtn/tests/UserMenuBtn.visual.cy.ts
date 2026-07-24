import UserMenuBtn from '../UserMenuBtn.vue'

const defaultMenuItems = [
	{ text: 'Mon compte', value: 'account' },
	{ text: 'Paramètres', value: 'settings' },
]

// Déclenche :focus-visible via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

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

describe('UserMenuBtn - Focus visual regression tests', () => {
	// Activateur (SyBtnMenu) : ring standard global (2px primary, offset 3px). Capture
	// `.v-application` pour ne pas rogner le ring outset.
	it('shows the standard ring on the activator button', () => {
		cy.mountWithVuetify(UserMenuBtn, {
			props: { menuItems: defaultMenuItems, fullName: 'Jean Dupont' },
		})

		focusVisible('.sy-user-menu-btn')
		cy.wait(100)
		cy.matchImageSnapshot('user-menu-btn-focus', cy.get('.v-application'))
	})
})
