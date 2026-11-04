import SyTable from '../../SyTable/SyTable.vue'
import SyServerTable from '../../SyServerTable/SyServerTable.vue'

// Issue #2706 : une ombre au bord de la zone qui défile signale le contenu masqué horizontalement,
// dès le chargement, quand aucune colonne n'est épinglée de ce côté.

const headers = [
	{ title: 'Nom', key: 'nom', width: 120 },
	{ title: 'Ville', key: 'ville' },
	{ title: 'Email', key: 'email' },
	{ title: 'Téléphone', key: 'telephone' },
	{ title: 'Âge', key: 'age', width: 80 },
]

const items = [
	{ id: 1, nom: 'Dupont', ville: 'Paris', email: 'jean.dupont@exemple.fr', telephone: '01 23 45 67 89', age: 30 },
	{ id: 2, nom: 'Martin', ville: 'Lyon', email: 'marie.martin@exemple.fr', telephone: '01 98 76 54 32', age: 41 },
]

// Largeur qui force le défilement horizontal
const narrow = { style: 'width: 360px' }

// Assertion rejouée par Cypress : l'état est mis à jour à la frame suivante
const expectIndicator = (side: 'left' | 'right', visible: boolean) => cy.get('.v-table').should(($table) => {
	const pseudo = getComputedStyle($table[0]!, side === 'left' ? '::before' : '::after')
	expect(pseudo.content !== 'none' && pseudo.boxShadow !== 'none', `${side} indicator`).to.equal(visible)
})

const scrollTo = (position: 'middle' | 'end') => cy.get('.v-table__wrapper').then(($wrapper) => {
	const wrapper = $wrapper[0]!
	wrapper.scrollLeft = position === 'end' ? wrapper.scrollWidth : 60
	wrapper.dispatchEvent(new Event('scroll'))
})

const tables = [
	{ name: 'SyTable', component: SyTable, extraProps: {} },
	{ name: 'SyServerTable', component: SyServerTable, extraProps: { serverItemsLength: items.length } },
]

tables.forEach(({ name, component, extraProps }) => {
	describe(`${name} - horizontal scroll indicator (issue #2706)`, () => {
		it('shows the right indicator on load, then the left one while scrolling', () => {
			cy.mountWithVuetify(component, {
				props: { headers, items, itemValue: 'id', ...extraProps, ...narrow },
			})

			expectIndicator('right', true)
			expectIndicator('left', false)

			scrollTo('middle')
			expectIndicator('left', true)
			expectIndicator('right', true)

			scrollTo('end')
			expectIndicator('left', true)
			expectIndicator('right', false)
		})

		it('leaves the pinned column shadow signal the hidden content on its side', () => {
			cy.mountWithVuetify(component, {
				props: {
					headers,
					items,
					itemValue: 'id',
					pinnedColumns: [{ key: 'nom', side: 'left' }, { key: 'age', side: 'right' }],
					...extraProps,
					...narrow,
				},
			})

			scrollTo('middle')
			expectIndicator('left', false)
			expectIndicator('right', false)
			cy.get('tbody .sy-table__pinned--left').first().should('not.have.css', 'box-shadow', 'none')
			cy.get('tbody .sy-table__pinned--right').first().should('not.have.css', 'box-shadow', 'none')
		})

		it('shows no indicator when the table fits', () => {
			cy.mountWithVuetify(component, {
				props: { headers, items, itemValue: 'id', ...extraProps, style: 'width: 1200px' },
			})

			expectIndicator('left', false)
			expectIndicator('right', false)
		})

		it('updates the indicator when the table is resized', () => {
			cy.mountWithVuetify(component, {
				props: { headers, items, itemValue: 'id', ...extraProps, style: 'width: 1200px' },
			})

			expectIndicator('right', false)
			cy.get('.sy-table, .sy-server-table').first().invoke('css', 'width', '360px')
			expectIndicator('right', true)
		})
	})
})
