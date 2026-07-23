import SyServerTable from '../SyServerTable.vue'

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
]

describe('SyServerTable - Visual regression tests', () => {
	it('displays the server table by default', () => {
		cy.mountWithVuetify(SyServerTable, {
			props: {
				headers: defaultHeaders,
				items: defaultItems,
				serverItemsLength: 50,
				caption: 'Tableau serveur',
			},
		})

		cy.get('.v-table').should('be.visible')
		cy.matchImageSnapshot('sy-server-table-default', cy.get('.v-application'))
	})

	it('displays the server table in loading state', () => {
		cy.mountWithVuetify(SyServerTable, {
			props: {
				headers: defaultHeaders,
				items: undefined,
				serverItemsLength: 0,
				caption: 'Tableau chargement',
				loading: true,
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('sy-server-table-loading', cy.get('.v-application'))
	})

	it('displays the server table with selection', () => {
		cy.mountWithVuetify(SyServerTable, {
			props: {
				headers: defaultHeaders,
				items: defaultItems,
				serverItemsLength: 2,
				caption: 'Tableau avec sélection',
				showSelect: true,
			},
		})

		cy.get('.v-table').should('be.visible')
		cy.matchImageSnapshot('sy-server-table-with-select', cy.get('.v-application'))
	})

	// Focus délégué à TableHeader : ring sur le bouton de tri.
	it('shows the DS ring on a focused sort button', () => {
		cy.mountWithVuetify(SyServerTable, {
			props: { headers: defaultHeaders, items: defaultItems, serverItemsLength: 50, caption: 'Table' },
		})

		focusVisible('.sort-button')
		cy.wait(150)
		cy.matchImageSnapshot('sy-server-table-sort-focus', cy.get('.v-application'))
	})

	// Ligne cliquable : focus clavier = anneau seul (pas de fond), via le mixin partagé.
	it('shows the ring (no background) on a focused clickable row', () => {
		cy.mountWithVuetify(SyServerTable, {
			props: {
				headers: defaultHeaders,
				items: defaultItems,
				serverItemsLength: 50,
				caption: 'Table',
				clickableRow: true,
			},
		})

		cy.get('.sy-table__clickable-row', { timeout: 8000 }).first().should('exist')
		focusVisible('.sy-table__clickable-row')
		cy.wait(150)
		cy.matchImageSnapshot('sy-server-table-row-focus', cy.get('.v-application'))
	})
})
