import Usages from '../Usages.vue'

describe('Usages – RGAA browser checks – CNAM theme', () => {
	it('8.2 and 9.1 – renders both recommendation lists as native lists', () => {
		cy.mountWithVuetify(Usages, {
			props: { items1: ['Utiliser un bouton'], items2: ['Ne pas supprimer le libellé'] },
		})

		cy.get('ul').should('have.length', 2)
		cy.get('li').should('have.length', 2)
		cy.contains('p', 'À faire').should('be.visible')
	})
})
