import { defineComponent, h } from 'vue'
import ContextualMenu from '../ContextualMenu.vue'

const defaultItems = [
	{ text: 'Accueil', hash: '#accueil', level: 1 },
	{ text: 'Mon compte', hash: '#mon-compte', level: 1 },
	{ text: 'Paramètres', hash: '#parametres', level: 2 },
	{ text: 'Déconnexion', hash: '#deconnexion', level: 1 },
]

// Déclenche :focus-visible via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('ContextualMenu - Visual regression tests', () => {
	it('displays the contextual menu', () => {
		cy.mountWithVuetify(ContextualMenu, {
			props: {
				ariaLabel: 'Menu de navigation',
				items: defaultItems,
			},
		})

		cy.get('.vd-contextual-menu').should('be.visible')
		cy.matchImageSnapshot('contextual-menu-default', cy.get('.vd-contextual-menu-container'))
	})

	it('displays the contextual menu with a selected item', () => {
		cy.mountWithVuetify(ContextualMenu, {
			props: {
				ariaLabel: 'Menu de navigation',
				items: defaultItems,
				modelValue: '#accueil',
			},
		})

		cy.get('.vd-contextual-menu').should('be.visible')
		cy.matchImageSnapshot('contextual-menu-selected', cy.get('.vd-contextual-menu-container'))
	})
})

describe('ContextualMenu - Focus visual regression tests', () => {
	// Ring 2px primary inset (offset -3px) sur le lien focalisé. Inset → capturé
	// entièrement dans le conteneur (pas de rognage possible).
	it('shows the focus ring on a menu link (light background)', () => {
		cy.mountWithVuetify(ContextualMenu, {
			props: {
				ariaLabel: 'Menu de navigation',
				items: defaultItems,
			},
		})

		focusVisible('.vd-contextual-menu a')
		cy.wait(100)
		cy.matchImageSnapshot('contextual-menu-focus-light', cy.get('.vd-contextual-menu-container'))
	})

	// Sur fond primary (marqueur .v-theme--dark) : texte + ring en onPrimary (blanc).
	it('shows the onPrimary ring and light text on a menu link (dark background)', () => {
		const DarkMenu = defineComponent({
			setup() {
				return () => h(
					'div',
					{ class: 'v-theme--dark', style: 'background: rgb(var(--v-theme-primary)); padding: 16px' },
					[h(ContextualMenu, { ariaLabel: 'Menu de navigation', items: defaultItems })],
				)
			},
		})

		cy.mountWithVuetify(DarkMenu)

		focusVisible('.vd-contextual-menu a')
		cy.wait(100)
		cy.matchImageSnapshot('contextual-menu-focus-dark', cy.get('.v-application'))
	})
})
