import MonthSelector from '../MonthSelector.vue'
import { locales, localesKey } from '../../locales'
describe('MonthSelector – RGAA browser contract – CNAM theme', () => {
	it('7.1 and 8.2 – exposes labelled month buttons', () => {
		cy.mountWithVuetify(MonthSelector, { props: { modelValue: 3 }, global: { provide: { [localesKey as symbol]: locales } } })
		cy.get('[role="group"]').should('be.visible').and('have.attr', 'aria-label', locales.monthSelectorLabel)
		cy.get('button[tabindex="0"]').should('have.attr', 'aria-label')
	})
})
