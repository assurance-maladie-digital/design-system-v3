import SyRadioGroup from '../SyRadioGroup.vue'

describe('SyRadioGroup – RGAA browser checks – CNAM theme', () => {
	it('7.1, 8.2 and 11.1 – exposes labelled radios reachable by keyboard', () => {
		cy.mountWithVuetify(SyRadioGroup, {
			props: { label: 'Choix', options: [{ label: 'Oui', value: 'yes' }, { label: 'Non', value: 'no' }] },
		})
		cy.get('[role="radiogroup"]').should('be.visible')
		cy.get('input[type="radio"]').should('have.length', 2)
		cy.contains('label', 'Oui').should('be.visible')
		cy.get('input[type="radio"]').first().focus().should('have.focus')
	})
})
