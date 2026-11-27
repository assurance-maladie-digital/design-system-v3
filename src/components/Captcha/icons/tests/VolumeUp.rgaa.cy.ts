import VolumeUp from '../VolumeUp.vue'
describe('VolumeUp – RGAA browser checks – CNAM theme', () => {
	it('1.2 – renders the decorative SVG asset', () => {
		cy.mountWithVuetify(VolumeUp)
		cy.get('svg').should('exist').and('not.have.attr', 'role', 'img')
	})
})
