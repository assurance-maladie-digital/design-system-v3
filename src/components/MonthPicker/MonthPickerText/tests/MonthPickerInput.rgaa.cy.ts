import MonthPickerInput from '../MonthPickerInput.vue'
import { locales, localesKey } from '../../locales'
describe('MonthPickerInput – RGAA browser contract – CNAM theme', () => {
	it('7.1 and 8.2 – exposes a labelled calendar toggle', () => {
		cy.mountWithVuetify(MonthPickerInput, { props: { modelValue: undefined, label: 'Mois' }, global: { provide: { [localesKey as symbol]: locales } } })
		cy.get('button.month-picker-input__toggle-btn').should('be.visible').and('have.attr', 'aria-label', locales.btnLabel)
	})
})
