import LunarCalendar from '../LunarCalendar.vue'

describe('LunarCalendar - Visual regression tests', () => {
	it('displays the lunar calendar field by default', () => {
		cy.mountWithVuetify(LunarCalendar, {
			props: { label: 'Date de naissance (calendrier lunaire)' },
		})

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('lunar-calendar-default', cy.get('.v-text-field'))
	})

	it('displays the lunar calendar field as required', () => {
		cy.mountWithVuetify(LunarCalendar, {
			props: {
				label: 'Date de naissance',
				required: true,
			},
		})

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('lunar-calendar-required', cy.get('.v-text-field'))
	})

	it('displays the lunar calendar with a value', () => {
		cy.mountWithVuetify(LunarCalendar, {
			props: {
				label: 'Date de naissance',
				modelValue: '15/08/1990',
			},
		})

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('lunar-calendar-with-value', cy.get('.v-text-field'))
	})
})
