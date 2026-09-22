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

// Version mobile : l'activateur devient une icône seule et l'identité, masquée dans le bouton,
// est reportée en tête du menu. Rien de tout ça n'est vérifiable en test unitaire — jsdom
// n'applique pas les feuilles de style et `getComputedStyle` est neutralisé par le setup — d'où
// cette capture, qui fige d'un coup le bouton circulaire, le disque de l'avatar, l'encart teinté
// avec son arrondi et ses marges, et le décalage du menu sous l'activateur.
describe('UserMenuBtn - Mobile visual regression tests', () => {
	it('displays the icon-only activator with the identity block in the open menu', () => {
		// Largeur mobile : `smAndDown` bascule le composant en icône seule, comme en usage réel.
		cy.viewport(390, 700)

		cy.mountWithVuetify(UserMenuBtn, {
			props: {
				menuItems: defaultMenuItems,
				fullName: 'Jean Dupont',
				additionalInformation: 'N° 123456789',
			},
		})

		cy.get('.sy-user-menu-btn').click()
		cy.get('.v-overlay__content').should('be.visible')
		cy.get('.sy-user-menu-identity').should('be.visible')

		// Le focus part sur le premier item à l'ouverture : on le retire pour que la capture ne
		// dépende pas du ring, déjà couvert par les tests de focus.
		cy.document().then((doc) => {
			if (doc.activeElement instanceof HTMLElement) {
				doc.activeElement.blur()
			}
		})

		cy.wait(150)
		cy.matchImageSnapshot('user-menu-btn-mobile-menu-open')
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
