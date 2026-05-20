import NotificationBar from '../NotificationBar.vue'
import { useNotificationService } from '@/services/NotificationService'

describe('NotificationBar - Visual regression tests', () => {
	beforeEach(() => {
		const { clearQueue } = useNotificationService()
		clearQueue()
	})

	it('displays the notification bar with an info notification', () => {
		const { addNotification } = useNotificationService()
		addNotification({ id: '1', message: 'Ceci est une notification informative', type: 'info' })

		cy.mountWithVuetify(NotificationBar, {
			props: { showAll: true },
		})

		cy.get('.notification-bar').should('be.visible')
		cy.matchImageSnapshot('notification-bar-info', cy.get('.v-application'))
	})

	it('displays the notification bar with multiple types', () => {
		const { addNotification } = useNotificationService()
		addNotification({ id: '1', message: 'Succès de l\'opération', type: 'success' })
		addNotification({ id: '2', message: 'Une erreur est survenue', type: 'error' })

		cy.mountWithVuetify(NotificationBar, {
			props: { showAll: true },
		})

		cy.get('.notification-bar').should('be.visible')
		cy.matchImageSnapshot('notification-bar-multiple', cy.get('.v-application'))
	})
})
