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
