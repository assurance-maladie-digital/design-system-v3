import { mdiAlert, mdiHome } from '@mdi/js'
import SyIcon from '../SyIcon.vue'

describe('SyIcon – RGAA browser checks – CNAM theme', () => {
	it('1.2 – decorative icon is hidden from assistive technologies', () => {
		cy.mountWithVuetify(SyIcon, { props: { icon: mdiHome, decorative: true } })
		cy.get('.v-icon').should('have.attr', 'aria-hidden', 'true')
	})

	it('1.3 – informative icon has a text alternative', () => {
		cy.mountWithVuetify(SyIcon, { props: { icon: mdiAlert, decorative: false, role: 'img', label: 'Alerte' } })
		cy.get('.v-icon').should('have.attr', 'role', 'img').and('have.attr', 'aria-label', 'Alerte')
	})
})
