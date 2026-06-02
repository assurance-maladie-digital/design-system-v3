import Accordion from '../Accordion.vue'

const defaultItems = [
	{ id: '1', title: 'Premier élément', content: 'Contenu du premier élément' },
	{ id: '2', title: 'Deuxième élément', content: 'Contenu du deuxième élément' },
	{ id: '3', title: 'Troisième élément', content: 'Contenu du troisième élément' },
]

describe('Accordion - Visual regression tests', () => {
	it('displays the accordion collapsed by default', () => {
		cy.mountWithVuetify(Accordion, {
			props: { items: defaultItems },
		})

		cy.get('.sy-accordion').should('be.visible')
		cy.matchImageSnapshot('accordion-default', cy.get('.sy-accordion'))
	})

	it('displays the accordion with one item open', () => {
		cy.mountWithVuetify(Accordion, {
			props: {
				items: defaultItems,
				modelValue: ['1'],
			},
		})

		cy.get('.sy-accordion').should('be.visible')
		cy.matchImageSnapshot('accordion-open-first', cy.get('.sy-accordion'))
	})

	it('displays the accordion with a disabled item', () => {
		cy.mountWithVuetify(Accordion, {
			props: {
				items: [
					{ id: '1', title: 'Actif', content: 'Contenu actif' },
					{ id: '2', title: 'Désactivé', content: 'Contenu désactivé', disabled: true },
				],
			},
		})

		cy.get('.sy-accordion').should('be.visible')
		cy.matchImageSnapshot('accordion-disabled-item', cy.get('.sy-accordion'))
	})
})
