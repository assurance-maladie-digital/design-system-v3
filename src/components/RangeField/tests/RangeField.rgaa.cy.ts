import RangeField from '../RangeField.vue'

describe('RangeField – RGAA browser checks – CNAM theme', () => {
	it('8.2 and 10.1 – exposes a fieldset and labelled range inputs', () => {
		cy.mountWithVuetify(RangeField, { props: { modelValue: [20, 80], min: 0, max: 100, fieldsetLabel: 'Plage de valeurs', textFieldMinLabel: 'Minimum', textFieldMaxLabel: 'Maximum' } })
		cy.get('fieldset').should('be.visible').find('input').should('have.length.greaterThan', 1)
		cy.get('legend').should('contain', 'Plage de valeurs')
	})
})
