import SyAlert from '../SyAlert.vue'

describe('SyAlert - Visual regression tests', () => {
	const types = ['info', 'success', 'warning', 'error'] as const
	const variants = ['tonal', 'outlined'] as const

	types.forEach((type) => {
		it(`displays the "${type}" type correctly`, () => {
			cy.mountWithVuetify(SyAlert, {
				props: { type },
				slots: {
					default: `Ceci est une alerte de type ${type}`,
				},
			})

			cy.get('.v-alert').should('be.visible')
			cy.matchImageSnapshot(`sy-alert-${type}`, cy.get('.v-alert'))
		})
	})

	variants.forEach((variant) => {
		it(`displays the "${variant}" variant correctly`, () => {
			cy.mountWithVuetify(SyAlert, {
				props: { type: 'info', variant },
				slots: {
					default: `Alerte en variante ${variant}`,
				},
			})

			cy.get('.v-alert').should('be.visible')
			cy.matchImageSnapshot(`sy-alert-variant-${variant}`, cy.get('.v-alert'))
		})
	})

	it('displays the close button when closable', () => {
		cy.mountWithVuetify(SyAlert, {
			props: { type: 'info', closable: true },
			slots: {
				default: 'Alerte avec bouton de fermeture',
			},
		})

		cy.get('.v-alert').should('be.visible')
		cy.matchImageSnapshot('sy-alert-closable', cy.get('.v-alert'))
	})
})
