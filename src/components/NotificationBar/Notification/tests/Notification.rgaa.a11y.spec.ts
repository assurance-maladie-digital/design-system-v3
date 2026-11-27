// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Notification from '../Notification.vue'

const notification = { id: 'notice-1', message: 'Votre demande a été enregistrée.', type: 'success' as const }
export const notificationRgaaCriteria = ['7.1', '7.5', '8.2', '10.7'] as const
describe('Notification – executable RGAA contracts', () => {
	it('7.1 and 8.2 – names the close action', () => {
		const wrapper = mount(Notification, { props: { notification, options: {} } })
		expect(wrapper.get('button.notification__close').attributes('aria-label')).toContain('Fermer')
	})

	it('7.5 – exposes the notification message as readable text', () => {
		expect(mount(Notification, { props: { notification, options: {} } }).get('.notification__message').text()).toContain(notification.message)
	})
})
