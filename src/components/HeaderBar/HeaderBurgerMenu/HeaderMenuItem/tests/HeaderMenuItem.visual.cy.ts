import { h } from 'vue'
import HeaderMenuItem from '../HeaderMenuItem.vue'

// Déclenche :focus-visible via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('HeaderMenuItem - Focus visual regression tests', () => {
	// Item de menu pleine largeur : au focus, ring inset 2px en currentColor (mixin
	// item-focused), visible sur les 4 côtés, non rogné, et contrasté quel que soit le fond.
	it('shows the inset focus ring', () => {
		cy.mountWithVuetify(HeaderMenuItem, {
			slots: { default: () => h('a', { href: '#' }, 'Mon lien') },
		})

		focusVisible('.header-menu-item a')
		cy.wait(100)
		cy.matchImageSnapshot('header-menu-item-focus', cy.get('.v-application'))
	})
})
