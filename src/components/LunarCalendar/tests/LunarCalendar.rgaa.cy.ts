import LunarCalendar from '../LunarCalendar.vue'

describe('LunarCalendar – RGAA browser checks – CNAM theme', () => {
	it('11.1 and 13.3 – exposes a labelled date field and its format hint', () => {
		cy.mountWithVuetify(LunarCalendar, {
			props: { label: 'Date de naissance lunaire', placeholder: 'JJ/MM/AAAA' },
		})

		cy.get('input').should('have.attr', 'aria-label').and('contain', 'Date de naissance lunaire')
		cy.get('input').should('have.attr', 'placeholder', 'JJ/MM/AAAA')
	})

	it('11.10 – keeps the required state available to assistive technology', () => {
		cy.mountWithVuetify(LunarCalendar, {
			props: { label: 'Date de naissance lunaire', required: true },
		})

		cy.get('input').should('have.attr', 'aria-required', 'true')
	})
})
