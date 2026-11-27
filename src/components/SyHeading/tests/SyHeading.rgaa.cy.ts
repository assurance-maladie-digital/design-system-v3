import SyHeading from '../SyHeading.vue'

describe('SyHeading – RGAA browser checks – CNAM theme', () => {
	it('9.1 – exposes a native heading in the requested hierarchy', () => {
		cy.mountWithVuetify(SyHeading, { props: { level: 2 }, slots: { default: 'Titre de section' } })
		cy.get('h2').should('be.visible').and('contain', 'Titre de section')
	})
})
