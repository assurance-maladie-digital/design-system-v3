import SyTabs from '../SyTabs.vue'

describe('SyTabs – RGAA browser checks – CNAM theme', () => {
	it('7.1, 8.9 and 12.6 – supports labelled tab navigation and panel activation', () => {
		cy.mountWithVuetify(SyTabs, { props: { items: [{ label: 'Un', value: 'one', content: 'Premier' }, { label: 'Deux', value: 'two', content: 'Second' }] } })
		cy.get('[role="tablist"]').should('be.visible')
		cy.get('[role="tab"]').should('have.length', 2)
		cy.get('[role="tab"]').first().should('have.attr', 'aria-selected', 'true')
		cy.get('[role="tab"]').eq(1).click().should('have.attr', 'aria-selected', 'true')
		cy.get('[role="tabpanel"]').not('[hidden]').should('contain', 'Second')
	})
})
