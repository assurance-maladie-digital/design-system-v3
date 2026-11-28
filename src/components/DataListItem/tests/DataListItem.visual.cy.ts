import DataListItem from '../DataListItem.vue'

describe('DataListItem - Visual regression tests', () => {
	// Viewport réduit : l'item prend toute la largeur, un viewport plein
	// grandeur diluerait le diff (aucun breakpoint mobile dans le composant).
	beforeEach(() => {
		cy.viewport(400, 150)
	})

	it('displays the item with label and value', () => {
		cy.mountWithVuetify(DataListItem, {
			props: {
				label: 'Nom',
				value: 'Dupont',
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('data-list-item-default', cy.get('.sy-data-list-item'))
	})

	it('displays the item as a chip', () => {
		cy.mountWithVuetify(DataListItem, {
			props: {
				label: 'Statut',
				value: 'Actif',
				chip: true,
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('data-list-item-chip', cy.get('.sy-data-list-item'))
	})

	it('displays the item in row layout', () => {
		cy.mountWithVuetify(DataListItem, {
			props: {
				label: 'Date',
				value: '01/01/2025',
				row: true,
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('data-list-item-row', cy.get('.sy-data-list-item'))
	})

	it('displays the item with placeholder when value is empty', () => {
		cy.mountWithVuetify(DataListItem, {
			props: {
				label: 'Remarque',
				value: undefined,
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('data-list-item-placeholder', cy.get('.sy-data-list-item'))
	})
})
