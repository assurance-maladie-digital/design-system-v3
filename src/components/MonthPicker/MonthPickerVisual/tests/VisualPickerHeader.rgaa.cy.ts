import { computed } from 'vue'
import VisualPickerHeader from '../VisualPickerHeader.vue'
import { locales, localesKey } from '../../locales'
describe('VisualPickerHeader – RGAA browser contract – CNAM theme', () => {
	it('8.2 – exposes a labelled view switch', () => {
		cy.mountWithVuetify(VisualPickerHeader, { props: { modelValue: '03/2026', view: 'months', title: 'Sélectionner un mois', minYear: 1900, maxYear: 2100, id: 'picker' }, global: { provide: { [localesKey as symbol]: computed(() => locales) } } })
		cy.get('button.visual-picker-year-btn').should('be.visible').and('have.attr', 'aria-label').and('contain', 'année')
	})
})
