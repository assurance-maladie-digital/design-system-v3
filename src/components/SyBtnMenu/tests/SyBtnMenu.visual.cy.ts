import SyBtnMenu from '../SyBtnMenu.vue'

const menuItems = [
	{ text: 'Mon profil', value: 'profile' },
	{ text: 'Paramètres', value: 'settings' },
]

// Déclenche :focus-visible via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('SyBtnMenu - Mobile visual regression tests', () => {
	it('displays primary and secondary info in mobile view', () => {
		cy.mountWithVuetify(SyBtnMenu, {
			props: {
				primaryInfo: 'Jean Dupont',
				secondaryInfo: 'Administrateur',
				isMobileView: true,
			},
		})

		cy.get('.sy-user-menu-btn').should('be.visible')
		cy.matchImageSnapshot('sy-btn-menu-mobile-with-info', cy.get('.sy-user-menu-btn'))
	})
})

describe('SyBtnMenu - Focus visual regression tests', () => {
	it('shows the focus ring on the activator button', () => {
		cy.mountWithVuetify(SyBtnMenu, {
			props: {
				primaryInfo: 'Jean Dupont',
				secondaryInfo: 'Administrateur',
			},
		})

		focusVisible('.sy-user-menu-btn')
		cy.wait(100)
		cy.matchImageSnapshot('sy-btn-menu-focus-activator', cy.get('.v-application'))
	})

	it('shows the focus ring on the activator with the menu open', () => {
		cy.mountWithVuetify(SyBtnMenu, {
			props: {
				primaryInfo: 'Jean Dupont',
				menuItems,
			},
		})

		cy.get('.sy-user-menu-btn').click()
		cy.get('.v-overlay__content').should('be.visible')

		focusVisible('.sy-user-menu-btn')
		cy.wait(100)
		cy.matchImageSnapshot('sy-btn-menu-focus-open')
	})
})
