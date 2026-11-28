import { h } from 'vue'
import CollapsibleList from '../CollapsibleList.vue'

const defaultItems = [
	{ text: 'Lien 1', href: '#lien1' },
	{ text: 'Lien 2', href: '#lien2' },
	{ text: 'Lien 3', href: '#lien3' },
]

describe('CollapsibleList - Visual regression tests', () => {
	it('displays the list with title', () => {
		// Conteneur de 300px : la liste desktop suit la largeur du conteneur.
		cy.viewport(960, 300)
		const InContainer = {
			setup: () => () => h(
				'div',
				{ style: 'width: 300px' },
				[h(CollapsibleList, { listTitle: 'Mon titre', items: defaultItems })],
			),
		}
		cy.mountWithVuetify(InContainer)

		cy.get('.vd-collapse-list').should('be.visible')
		cy.matchImageSnapshot('collapsible-list-default', cy.get('.vd-collapse-list'))
	})

	it('displays the list without title', () => {
		// Conteneur de 300px : la liste desktop suit la largeur du conteneur.
		const InContainer = {
			setup: () => () => h(
				'div',
				{ style: 'width: 300px' },
				[h(CollapsibleList, { listTitle: null, items: defaultItems })],
			),
		}
		cy.mountWithVuetify(InContainer)

		cy.get('.vd-collapse-list').should('be.visible')
		cy.matchImageSnapshot('collapsible-list-no-title', cy.get('.vd-collapse-list'))
	})
})

// Déclenche :focus-visible via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('CollapsibleList - Focus visual regression tests', () => {
	it('shows the focus ring on a link (desktop)', () => {
		// Viewport >= 960px (smAndDown) mais conteneur de 300px : la liste desktop
		// suit la largeur du conteneur, la capture reste serrée.
		cy.viewport(960, 300)
		const InContainer = {
			setup: () => () => h(
				'div',
				{ style: 'width: 300px' },
				[h(CollapsibleList, { listTitle: 'Mon titre', items: defaultItems })],
			),
		}
		cy.mountWithVuetify(InContainer)

		focusVisible('.vd-collapse-list a')
		cy.matchImageSnapshot('collapsible-list-focus-link', cy.get('.vd-collapse-list'), { padding: 10 })
	})

	it('shows the focus ring on the panel title (mobile)', () => {
		cy.viewport(375, 667)
		cy.mountWithVuetify(CollapsibleList, {
			props: { listTitle: 'Mon titre', items: defaultItems },
		})

		focusVisible('.v-expansion-panel-title')
		cy.matchImageSnapshot('collapsible-list-focus-title', cy.get('.vd-collapse-list-mobile'), { padding: 10 })
	})
})
