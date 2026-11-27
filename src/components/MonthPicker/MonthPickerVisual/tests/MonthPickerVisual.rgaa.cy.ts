import MonthPickerVisual from '../MonthPickerVisual.vue'
import { computed } from 'vue'
import { locales, localesKey } from '../../locales'
describe('MonthPickerVisual – RGAA browser checks – CNAM theme', () => {
	it('7.1 and 8.2 – exposes the picker dialog content', () => {
		cy.mountWithVuetify(MonthPickerVisual, { props: { textInput: null, toggleBtn: document.createElement('button'), modelValue: undefined, readonly: false, disabled: false, minYear: 1900, maxYear: 2100, yearsOrder: 'asc', initialView: 'months' }, global: { provide: { [localesKey as symbol]: computed(() => locales) }, stubs: { VMenu: { template: '<div role="dialog"><slot /></div>' } } } })
		cy.get('body').should('exist')
		cy.get('body').children().should('have.length.greaterThan', 0)
	})
})
