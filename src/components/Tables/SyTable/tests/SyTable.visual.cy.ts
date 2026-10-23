import SyTable from '../SyTable.vue'

// Déclenche `:focus-visible` via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

const defaultHeaders = [
	{ title: 'Nom', key: 'nom', sortable: true },
	{ title: 'Prénom', key: 'prenom', sortable: true },
	{ title: 'Ville', key: 'ville' },
]

const defaultItems = [
	{ nom: 'Dupont', prenom: 'Jean', ville: 'Paris' },
	{ nom: 'Martin', prenom: 'Marie', ville: 'Lyon' },
	{ nom: 'Bernard', prenom: 'Pierre', ville: 'Marseille' },
]

describe('SyTable - Visual regression tests', () => {
	it('displays the table by default', () => {
		cy.mountWithVuetify(SyTable, {
			props: {
				headers: defaultHeaders,
				items: defaultItems,
				caption: 'Tableau de données',
			},
		})

		cy.get('.v-table').should('be.visible')
		cy.matchImageSnapshot('sy-table-default', cy.get('.v-application'))
	})

	it('displays the table with striped rows', () => {
		cy.mountWithVuetify(SyTable, {
			props: {
				headers: defaultHeaders,
				items: defaultItems,
				caption: 'Tableau rayé',
				striped: true,
			},
		})

		cy.get('.v-table').should('be.visible')
		cy.matchImageSnapshot('sy-table-striped', cy.get('.v-application'))
	})

	it('displays the table with selection checkboxes', () => {
		cy.mountWithVuetify(SyTable, {
			props: {
				headers: defaultHeaders,
				items: defaultItems,
				caption: 'Tableau avec sélection',
				showSelect: true,
			},
		})

		cy.get('.v-table').should('be.visible')
		cy.matchImageSnapshot('sy-table-with-select', cy.get('.v-application'))
	})

	it('displays the table with compact density', () => {
		cy.mountWithVuetify(SyTable, {
			props: {
				headers: defaultHeaders,
				items: defaultItems,
				caption: 'Tableau compact',
				density: 'compact',
			},
		})

		cy.get('.v-table').should('be.visible')
		cy.matchImageSnapshot('sy-table-compact', cy.get('.v-application'))
	})

	// Tri multiple (#2692) : le chiffre d'ordre est aligné à droite de la flèche, sur la
	// même ligne, et non plus sous la flèche.
	it('displays the sort order next to the arrow with multi-sort', () => {
		cy.mountWithVuetify(SyTable, {
			props: {
				headers: [
					{ title: 'Nom', key: 'nom', sortable: true },
					{ title: 'Prénom', key: 'prenom', sortable: true },
					{ title: 'Ville', key: 'ville', sortable: true },
				],
				items: defaultItems,
				caption: 'Tableau trié sur plusieurs colonnes',
				multiSort: true,
				options: {
					multiSort: true,
					sortBy: [
						{ key: 'nom', order: 'desc' },
						{ key: 'prenom', order: 'asc' },
					],
				},
			},
		})

		cy.get('.sort-order-indicator').should('have.length', 2)
		cy.matchImageSnapshot('sy-table-multi-sort', cy.get('.v-application'))
	})

	// Bouton de tri d'un en-tête (`.sort-button`) : ring DS primary (offset 2px).
	it('shows the DS ring on a focused sort button', () => {
		cy.mountWithVuetify(SyTable, {
			props: { headers: defaultHeaders, items: defaultItems, caption: 'Table' },
		})

		focusVisible('.sort-button')
		cy.wait(150)
		cy.matchImageSnapshot('sy-table-sort-focus', cy.get('.v-application'))
	})

	// Poignée de redimensionnement clavier (`.resizer`) : ring DS primary ajouté.
	it('shows the DS ring on a focused column resizer', () => {
		cy.mountWithVuetify(SyTable, {
			props: {
				headers: defaultHeaders,
				items: defaultItems,
				caption: 'Table',
				resizableColumns: true,
			},
		})

		cy.get('.resizer').first().should('have.attr', 'tabindex', '0')
		focusVisible('.resizer')
		cy.wait(150)
		cy.matchImageSnapshot('sy-table-resizer-focus', cy.get('.v-application'))
	})
})
