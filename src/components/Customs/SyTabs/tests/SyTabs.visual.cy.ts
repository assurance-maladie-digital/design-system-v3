import SyTabs from '../SyTabs.vue'

const defaultItems = [
	{ label: 'Onglet 1', value: 'tab1', content: 'Contenu de l\'onglet 1' },
	{ label: 'Onglet 2', value: 'tab2', content: 'Contenu de l\'onglet 2' },
	{ label: 'Onglet 3', value: 'tab3', content: 'Contenu de l\'onglet 3' },
]

describe('SyTabs - Visual regression tests', () => {
	it('displays the tabs with first tab active by default', () => {
		cy.mountWithVuetify(SyTabs, {
			props: { items: defaultItems },
		})

		cy.get('.sy-tabs').should('be.visible')
		cy.matchImageSnapshot('sy-tabs-default', cy.get('.sy-tabs'))
	})

	it('displays the tabs with second tab active', () => {
		cy.mountWithVuetify(SyTabs, {
			props: {
				items: defaultItems,
				modelValue: 'tab2',
			},
		})

		cy.get('.sy-tabs').should('be.visible')
		cy.matchImageSnapshot('sy-tabs-second-active', cy.get('.sy-tabs'))
	})
})
