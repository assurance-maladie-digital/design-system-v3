import { mdiClose } from '@mdi/js'
import SyIconButton from '../SyIconButton.vue'

describe('SyIconButton – RGAA browser checks – CNAM theme', () => {
	it('7.1, 8.9 and 11.9 – has an accessible name and a visible focusable button', () => {
		cy.mountWithVuetify(SyIconButton, { props: { icon: mdiClose, label: 'Fermer' } })
		cy.get('button.v-btn').should('be.visible').and('have.attr', 'aria-label', 'Fermer').and('not.be.disabled')
		cy.get('button.v-btn').focus().should('have.focus')
		cy.get('.v-icon').should('have.attr', 'aria-hidden', 'true')
	})
})
