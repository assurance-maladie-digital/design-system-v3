import NotificationBar from '../NotificationBar.vue'
import { useNotificationService } from '@/services/NotificationService'

describe('NotificationBar - Visual regression tests', () => {
	beforeEach(() => {
		const { clearQueue } = useNotificationService()
		clearQueue()
	})

	it('displays the notification bar at top (info)', () => {
		const { addNotification } = useNotificationService()
		addNotification({ id: '1', message: 'Ceci est une notification informative', type: 'info' })

		cy.mountWithVuetify(NotificationBar, {
			props: { showAll: true },
		})

		// Wait for notification to be visible
		cy.get('.notification-bar-transition').should('be.visible')
		cy.get('.notification').should('contain', 'Ceci est une notification informative')
		cy.matchImageSnapshot('notification-bar-info', cy.get('.notification-bar'))
	})

	it('displays the notification bar at bottom', () => {
		const { addNotification } = useNotificationService()
		addNotification({ id: '1', message: 'Notification en bas de page', type: 'warning' })

		cy.mountWithVuetify(NotificationBar, {
			props: { showAll: true, bottom: true },
		})

		// Wait for notification to be visible
		cy.get('.notification-bar-transition').should('be.visible')
		cy.get('.notification').should('contain', 'Notification en bas de page')
		cy.matchImageSnapshot('notification-bar-bottom', cy.get('.notification-bar'))
	})

	it('displays the notification bar with multiple types', () => {
		const { addNotification } = useNotificationService()
		addNotification({ id: '1', message: 'Succès de l\'opération', type: 'success' })
		addNotification({ id: '2', message: 'Une erreur est survenue', type: 'error' })

		cy.mountWithVuetify(NotificationBar, {
			props: { showAll: true },
		})

		// Wait for all notifications to be visible
		cy.get('.notification-bar-transition').should('be.visible')
		cy.get('.notification').should('have.length', 2)
		cy.get('.notification').should('contain', 'Succès de l\'opération')
		cy.get('.notification').should('contain', 'Une erreur est survenue')
		cy.matchImageSnapshot('notification-bar-multiple', cy.get('.notification-bar'))
	})
})
