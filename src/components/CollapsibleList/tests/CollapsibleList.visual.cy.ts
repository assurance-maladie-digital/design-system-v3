import CollapsibleList from '../CollapsibleList.vue'

const defaultItems = [
	{ text: 'Lien 1', href: '#lien1' },
	{ text: 'Lien 2', href: '#lien2' },
	{ text: 'Lien 3', href: '#lien3' },
]

describe('CollapsibleList - Visual regression tests', () => {
	it('displays the list with title', () => {
		cy.mountWithVuetify(CollapsibleList, {
			props: {
				listTitle: 'Mon titre',
				items: defaultItems,
			},
		})

		cy.get('.vd-collapse-list').should('be.visible')
		cy.matchImageSnapshot('collapsible-list-default', cy.get('.vd-collapse-list'))
	})

	it('displays the list without title', () => {
		cy.mountWithVuetify(CollapsibleList, {
			props: {
				listTitle: null,
				items: defaultItems,
			},
		})

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
		cy.mountWithVuetify(CollapsibleList, {
			props: { listTitle: 'Mon titre', items: defaultItems },
		})

		focusVisible('.vd-collapse-list a')
		cy.wait(100)
		cy.matchImageSnapshot('collapsible-list-focus-link', cy.get('.v-application'))
	})

	it('shows the focus ring on the panel title (mobile)', () => {
		cy.viewport(375, 667)
		cy.mountWithVuetify(CollapsibleList, {
			props: { listTitle: 'Mon titre', items: defaultItems },
		})

		focusVisible('.v-expansion-panel-title')
		cy.wait(100)
		cy.matchImageSnapshot('collapsible-list-focus-title', cy.get('.v-application'))
	})
})
