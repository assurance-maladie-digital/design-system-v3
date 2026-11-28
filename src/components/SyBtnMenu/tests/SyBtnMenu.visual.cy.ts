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

describe('SyBtnMenu - Focus visual regression tests', () => {
	// Viewport réduit (>= 960px : sous smAndDown le composant bascule en version
	// mobile) : la capture `.v-application` (focus-activator) et la vue globale
	// (focus-open, position du menu conservée) restent limitées autour du bouton
	// et du menu ouvert.
	beforeEach(() => {
		cy.viewport(960, 300)
	})

	it('shows the focus ring on the activator button', () => {
		cy.mountWithVuetify(SyBtnMenu, {
			props: {
				primaryInfo: 'Jean Dupont',
				secondaryInfo: 'Administrateur',
			},
		})

		focusVisible('.sy-user-menu-btn')
		cy.matchImageSnapshot('sy-btn-menu-focus-activator', cy.get('.sy-user-menu-btn'), { padding: 10 })
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
		cy.matchImageSnapshot('sy-btn-menu-focus-open')
	})
})
