import SyCheckBoxGroup from '../SyCheckBoxGroup.vue'

const options = [
	{ label: 'Option A', value: 'a', id: 'option-a' },
	{ label: 'Option B', value: 'b', id: 'option-b' },
]

describe('SyCheckBoxGroup – RGAA browser checks – CNAM theme', () => {
	it('8.2 and 9.1 – exposes a labelled fieldset with checkbox controls', () => {
		cy.mountWithVuetify(SyCheckBoxGroup, { props: { label: 'Choisissez vos options', options } })
		cy.get('fieldset').should('be.visible').find('legend').should('contain.text', 'Choisissez vos options')
		cy.get('input[type="checkbox"]').should('have.length', 2)
	})

	it('7.1, 7.3 and 10.7 – keeps checkbox controls keyboard reachable', () => {
		cy.mountWithVuetify(SyCheckBoxGroup, { props: { label: 'Préférences', options } })
		cy.get('input[type="checkbox"]').first().focus().should('be.focused')
		cy.get('label').should('have.length', 2)
	})

	it('11.10 and 7.5 – exposes the required hint and help text', () => {
		cy.mountWithVuetify(SyCheckBoxGroup, { props: { label: 'Préférences', options, required: true, helpText: 'Choix modifiables à tout moment.' } })
		cy.get('fieldset legend').should('contain.text', 'Préférences')
		cy.get('.help-text-below').should('contain.text', 'Choix modifiables')
	})
})
