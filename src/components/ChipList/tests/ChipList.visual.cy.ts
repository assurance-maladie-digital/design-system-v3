import ChipList from '../ChipList.vue'

// Déclenche `:focus-visible` via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

const defaultItems = [
	{ value: 'option1', text: 'Option 1' },
	{ value: 'option2', text: 'Option 2' },
	{ value: 'option3', text: 'Option 3' },
]

describe('ChipList - Visual regression tests', () => {
	it('displays chips by default', () => {
		cy.mountWithVuetify(ChipList, {
			props: { items: defaultItems },
		})

		cy.get('.v-chip').should('be.visible')
		cy.matchImageSnapshot('chip-list-default', cy.get('.sy-chip-list'))
	})

	it('displays chips in readonly mode', () => {
		cy.mountWithVuetify(ChipList, {
			props: {
				items: defaultItems,
				readonly: true,
			},
		})

		cy.get('.v-chip').should('be.visible')
		cy.matchImageSnapshot('chip-list-readonly', cy.get('.sy-chip-list'))
	})

	it('displays chips with state icons', () => {
		cy.mountWithVuetify(ChipList, {
			props: {
				items: [
					{ value: 'ok', text: 'Succès', state: 'success' },
					{ value: 'warn', text: 'Attention', state: 'warning' },
					{ value: 'err', text: 'Erreur', state: 'error' },
				],
				displayPrependStateIcon: true,
			},
		})

		cy.get('.v-chip').should('be.visible')
		cy.matchImageSnapshot('chip-list-state-icons', cy.get('.sy-chip-list'))
	})

	// Ring DS de la croix : inset (offset -2px) contrasté sur le fond du chip (onPrimary sur
	// chip primary), pour rester dans le chip sans déborder sur les voisins.
	it('shows the DS ring on a focused remove button', () => {
		cy.mountWithVuetify(ChipList, {
			props: { items: defaultItems },
		})

		focusVisible('.sy-chip-list .remove-chip')
		cy.wait(150)
		cy.matchImageSnapshot('chip-list-remove-focus', cy.get('.sy-chip-list'))
	})

	// Ring DS du chip d'overflow "+N" (role=button) : outline primary, offset 2px (sur fond de page).
	it('shows the DS ring on a focused overflow chip', () => {
		cy.mountWithVuetify(ChipList, {
			props: {
				items: [
					{ value: '1', text: 'Option 1' },
					{ value: '2', text: 'Option 2' },
					{ value: '3', text: 'Option 3' },
					{ value: '4', text: 'Option 4' },
					{ value: '5', text: 'Option 5' },
				],
			},
		})

		focusVisible('.sy-chip-list .overflow-chip')
		cy.wait(150)
		cy.matchImageSnapshot('chip-list-overflow-focus', cy.get('.sy-chip-list'))
	})
})
