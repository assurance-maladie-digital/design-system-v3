import IconSlot from '../IconSlot.vue'
describe('IconSlot – RGAA browser checks – CNAM theme', () => {
	it('7.1 and 8.2 – exposes an actionable labelled icon', () => {
		cy.mountWithVuetify(IconSlot, { props: { icon: 'save', label: 'Enregistrer', iconColor: 'primary', icons: { info: 'info-icon', save: 'save-icon' }, disableClickButton: false, tooltipLocation: 'top' } })
		cy.get('[role="button"]').should('be.visible').and('have.attr', 'tabindex', '0').and('have.attr', 'aria-label').and('contain', 'Enregistrer')
	})
})
