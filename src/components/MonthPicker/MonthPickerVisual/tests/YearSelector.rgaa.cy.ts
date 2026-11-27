import YearSelector from '../YearSelector.vue'
import { locales, localesKey } from '../../locales'
describe('YearSelector – RGAA browser contract – CNAM theme', () => {
	it('7.1 and 8.2 – exposes labelled year buttons', () => {
		cy.mountWithVuetify(YearSelector, { props: { min: 2025, max: 2027, order: 'asc', modelValue: 2026 }, global: { provide: { [localesKey as symbol]: locales } } })
		cy.get('[role="group"]').should('be.visible').and('have.attr', 'aria-label', locales.yearSelectorLabel)
		cy.get('button[tabindex="0"]').should('have.attr', 'aria-pressed', 'true')
	})
})
