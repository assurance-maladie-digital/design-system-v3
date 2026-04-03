import SyAlert from '../SyAlert.vue'

describe('SyAlert - Tests de non-régression visuelle', () => {
	const types = ['info', 'success', 'warning', 'error'] as const
	const variants = ['tonal', 'outlined'] as const

	types.forEach((type) => {
		it(`affiche correctement le type "${type}"`, () => {
			cy.mountWithVuetify(SyAlert, {
				props: { type },
				slots: {
					default: `Ceci est une alerte de type ${type}`,
				},
			})

			cy.get('.v-alert').should('be.visible')
			cy.matchImageSnapshot(`sy-alert-${type}`)
		})
	})

	variants.forEach((variant) => {
		it(`affiche correctement la variante "${variant}"`, () => {
			cy.mountWithVuetify(SyAlert, {
				props: { type: 'info', variant },
				slots: {
					default: `Alerte en variante ${variant}`,
				},
			})

			cy.get('.v-alert').should('be.visible')
			cy.matchImageSnapshot(`sy-alert-variant-${variant}`)
		})
	})

	it('affiche le bouton de fermeture quand closable', () => {
		cy.mountWithVuetify(SyAlert, {
			props: { type: 'info', closable: true },
			slots: {
				default: 'Alerte avec bouton de fermeture',
			},
		})

		cy.get('.v-alert').should('be.visible')
		cy.matchImageSnapshot('sy-alert-closable')
	})
})
