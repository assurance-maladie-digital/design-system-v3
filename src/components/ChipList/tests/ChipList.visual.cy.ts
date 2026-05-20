import ChipList from '../ChipList.vue'

const defaultItems = [
	{ value: 'option1', label: 'Option 1' },
	{ value: 'option2', label: 'Option 2' },
	{ value: 'option3', label: 'Option 3' },
]

describe('ChipList - Visual regression tests', () => {
	it('displays chips by default', () => {
		cy.mountWithVuetify(ChipList, {
			props: { items: defaultItems },
		})

		cy.get('.v-chip').should('be.visible')
		cy.matchImageSnapshot('chip-list-default', cy.get('.v-application'))
	})

	it('displays chips in readonly mode', () => {
		cy.mountWithVuetify(ChipList, {
			props: {
				items: defaultItems,
				readonly: true,
			},
		})

		cy.get('.v-chip').should('be.visible')
		cy.matchImageSnapshot('chip-list-readonly', cy.get('.v-application'))
	})

	it('displays chips with state icons', () => {
		cy.mountWithVuetify(ChipList, {
			props: {
				items: [
					{ value: 'ok', label: 'Succès', state: 'success' },
					{ value: 'warn', label: 'Attention', state: 'warning' },
					{ value: 'err', label: 'Erreur', state: 'error' },
				],
				displayPrependStateIcon: true,
			},
		})

		cy.get('.v-chip').should('be.visible')
		cy.matchImageSnapshot('chip-list-state-icons', cy.get('.v-application'))
	})
})
