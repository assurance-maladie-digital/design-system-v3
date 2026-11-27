import { useNotificationService } from '@/services/NotificationService'
import NotificationBar from '../NotificationBar.vue'

describe('NotificationBar – RGAA browser checks – CNAM theme', () => {
	beforeEach(() => useNotificationService().clearQueue())

	it('7.5 – exposes informative notifications as a status', () => {
		useNotificationService().addNotification({ id: 'rgaa', message: 'Information disponible', type: 'info' })
		cy.mountWithVuetify(NotificationBar, { props: { showAll: true } })
		cy.get('.notification-bar').should('have.attr', 'role', 'status')
	})
})
