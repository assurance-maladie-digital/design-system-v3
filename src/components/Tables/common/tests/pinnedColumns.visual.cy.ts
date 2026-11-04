import SyTable from '../../SyTable/SyTable.vue'
import SyServerTable from '../../SyServerTable/SyServerTable.vue'

// Régression #2610 : les cellules épinglées et la colonne de sélection suivent la couleur de leur ligne,
// et le projet peut surcharger leur style via des variables CSS posées sur un ancêtre du tableau.
// Les couleurs sont vérifiées directement : l'écart reste sous le seuil des snapshots.

const headers = [
	{ title: 'Nom', key: 'nom' },
	{ title: 'Ville', key: 'ville' },
	{ title: 'Âge', key: 'age' },
]

const items = [
	{ id: 1, nom: 'Dupont', ville: 'Paris', age: 30 },
	{ id: 2, nom: 'Martin', ville: 'Lyon', age: 41 },
	{ id: 3, nom: 'Bernard', ville: 'Marseille', age: 25 },
]

const pinnedProps = {
	headers,
	items,
	itemValue: 'id',
	showSelect: true,
	stickySelect: true,
	pinnedColumns: [{ key: 'nom', side: 'left' }, { key: 'age', side: 'right' }],
}

const PINNED_CELLS = ['.v-data-table__td--select-row', '.sy-table__pinned--left', '.sy-table__pinned--right']

const tables = [
	{ name: 'SyTable', component: SyTable, extraProps: {} },
	{ name: 'SyServerTable', component: SyServerTable, extraProps: { serverItemsLength: items.length } },
]

tables.forEach(({ name, component, extraProps }) => {
	describe(`${name} - pinned columns styles (issue #2610)`, () => {
		it('paints the striped row color on pinned and selection cells', () => {
			cy.mountWithVuetify(component, {
				props: { ...pinnedProps, ...extraProps, striped: true },
			})

			cy.get('.v-table tbody tr').eq(1).then(($row) => {
				const rowColor = getComputedStyle($row[0]!).backgroundColor
				expect(rowColor, 'even row color').not.to.equal('rgba(0, 0, 0, 0)')

				PINNED_CELLS.forEach((selector) => {
					const cell = $row[0]!.querySelector(selector)!
					expect(getComputedStyle(cell).backgroundImage, selector).to.contain(rowColor)
				})
			})
		})

		it('paints a row color set with row-props on pinned and selection cells', () => {
			cy.mountWithVuetify(component, {
				props: {
					...pinnedProps,
					...extraProps,
					rowProps: ({ index }: { index: number }) => (index === 0 ? { style: '--sy-table-row-bg: rgb(255, 0, 0)' } : {}),
				},
			})

			PINNED_CELLS.forEach((selector) => {
				cy.get('.v-table tbody tr').eq(0).find(selector)
					.should('have.css', 'background-image')
					.and('contain', 'rgb(255, 0, 0)')
			})
		})

		it('applies the CSS variables set on an ancestor of the table', () => {
			cy.mountWithVuetify(component, {
				props: {
					...pinnedProps,
					...extraProps,
					style: '--sy-table-pinned-cell-bg: rgb(0, 255, 0); --sy-table-checkbox-color: rgb(0, 128, 0)',
				},
			})

			PINNED_CELLS.forEach((selector) => {
				cy.get('.v-table tbody tr').eq(0).find(selector)
					.should('have.css', 'background-color', 'rgb(0, 255, 0)')
			})
			cy.get('.v-table tbody tr').eq(0).find('.v-selection-control')
				.should('have.css', 'color', 'rgb(0, 128, 0)')
		})

		it('keeps the empty selection header transparent in single selection mode', () => {
			cy.mountWithVuetify(component, {
				props: {
					...pinnedProps,
					...extraProps,
					showSelect: false,
					showSelectSingle: true,
					headers: [{ title: 'Nom', key: 'nom', width: 120 }, ...headers.slice(1)],
				},
			})

			// Fait défiler le tableau pour afficher l'ombre des colonnes épinglées à gauche
			cy.get('.v-table__wrapper').then(($wrapper) => {
				$wrapper[0]!.style.maxWidth = '200px'
				$wrapper[0]!.scrollLeft = 80
				$wrapper[0]!.dispatchEvent(new Event('scroll'))
			})
			cy.get('[class*="--pinned-left-shadow"]').should('exist')

			cy.get('thead th.checkbox-column')
				.should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
				.and('have.css', 'box-shadow', 'none')
		})
	})
})
