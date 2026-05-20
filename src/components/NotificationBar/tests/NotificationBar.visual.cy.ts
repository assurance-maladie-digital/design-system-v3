import NotificationBar from '../NotificationBar.vue'

describe('NotificationBar - Visual regression tests', () => {
	it('displays the notification bar (empty state)', () => {
		cy.mountWithVuetify(NotificationBar)

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('notification-bar-empty', cy.get('.v-application'))
	})

	it('displays the notification bar at bottom position', () => {
		cy.mountWithVuetify(NotificationBar, {
			props: { bottom: true },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('notification-bar-bottom', cy.get('.v-application'))
	})
})
