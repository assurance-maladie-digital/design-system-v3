import RangeSlider from '../RangeSlider.vue'
describe('RangeSlider – RGAA browser checks – CNAM theme', () => {
	it('7.1 and 11.1 – exposes two keyboard sliders', () => {
		cy.mountWithVuetify(RangeSlider, { props: { modelValue: [20, 80], min: 0, max: 100, minLabel: 'Minimum', maxLabel: 'Maximum' } })
		cy.get('[role="slider"]').should('have.length', 2)
		cy.get('[role="slider"]').first().should('have.attr', 'aria-label', 'Minimum')
		cy.rgaaAssertAccessibleName('[role="slider"]')
		cy.rgaaFocusVisible('[role="slider"]')
	})
})
