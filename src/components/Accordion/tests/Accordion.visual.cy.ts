import Accordion from '../Accordion.vue'

// Déclenche `:focus-visible` via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

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

	// Ring DS au clavier : outline 2px primary inset (offset -2px, pour ne pas être rogné par
	// l'`overflow: hidden` de l'item). Pas de background ni de bordure qui décalerait la mise en page.
	it('shows the DS ring on a focused accordion button', () => {
		cy.mountWithVuetify(Accordion, {
			props: { items: defaultItems },
		})

		focusVisible('#accordion-button-1')
		cy.wait(150)
		cy.matchImageSnapshot('accordion-button-focus', cy.get('.sy-accordion'))
	})
})
