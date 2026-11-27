import Notification from '../Notification.vue'
const notification = { id: 'notice-1', message: 'Votre demande a été enregistrée.', type: 'success' as const }
describe('Notification – RGAA browser checks – CNAM theme', () => {
	it('7.1 and 8.2 – exposes a visible named close action', () => {
		cy.mountWithVuetify(Notification, { props: { notification, options: {} } })
		cy.get('.notification__close').should('be.visible').and('have.attr', 'aria-label').and('contain', 'Fermer')
	})
})
