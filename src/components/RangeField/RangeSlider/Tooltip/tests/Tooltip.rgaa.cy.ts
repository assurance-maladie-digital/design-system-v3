import Tooltip from '../Tooltip.vue'
describe('RangeSlider Tooltip – RGAA browser contract – CNAM theme', () => {
	it('1.2 – renders the contextual value', () => {
		cy.mountWithVuetify(Tooltip, { slots: { default: () => '50' } })
		cy.get('.tooltip').should('contain.text', '50')
	})
})
