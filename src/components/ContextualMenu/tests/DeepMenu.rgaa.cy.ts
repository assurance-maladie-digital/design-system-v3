import DeepMenu from '../DeepMenu.vue'
describe('DeepMenu – RGAA browser checks – CNAM theme', () => {
	it('8.2 and 10.7 – exposes a visible navigable anchor', () => {
		cy.mountWithVuetify(DeepMenu, { props: { currentDeepth: 1, items: [{ text: 'Accéder aux soins', hash: '#soins' }] } })
		cy.get('a[href="#soins"]').should('be.visible').and('contain.text', 'Accéder aux soins')
	})
})
