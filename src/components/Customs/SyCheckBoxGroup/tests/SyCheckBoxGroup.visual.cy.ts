import SyCheckBoxGroup from '../SyCheckBoxGroup.vue'

const defaultOptions = [
	{ label: 'Option A', value: 'a' },
	{ label: 'Option B', value: 'b' },
	{ label: 'Option C', value: 'c' },
]

describe('SyCheckBoxGroup - Visual regression tests', () => {
	it('displays the checkbox group by default', () => {
		cy.mountWithVuetify(SyCheckBoxGroup, {
			props: { options: defaultOptions },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('sy-checkbox-group-default', cy.get('.v-application'))
	})

	it('displays the checkbox group with some items selected', () => {
		cy.mountWithVuetify(SyCheckBoxGroup, {
			props: {
				options: defaultOptions,
				modelValue: ['a', 'c'],
				multiple: true,
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('sy-checkbox-group-selected', cy.get('.v-application'))
	})

	it('displays the checkbox group with a label', () => {
		cy.mountWithVuetify(SyCheckBoxGroup, {
			props: {
				options: defaultOptions,
				label: 'Choisissez vos options',
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('sy-checkbox-group-with-label', cy.get('.v-application'))
	})

	it('displays the checkbox group in disabled state', () => {
		cy.mountWithVuetify(SyCheckBoxGroup, {
			props: {
				options: defaultOptions,
				disabled: true,
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('sy-checkbox-group-disabled', cy.get('.v-application'))
	})
})
