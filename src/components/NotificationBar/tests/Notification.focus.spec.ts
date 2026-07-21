import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Notification from '../Notification/Notification.vue'
import type { Notification as NotificationType } from '../types'

function makeNotification(type: NotificationType['type']): NotificationType {
	return { id: '1', message: 'Message de notification', type, timeout: -1, icon: null }
}

// La seule cible focusable d'une notification est le bouton « Fermer » (`.notification__close`), un
// `.v-btn`. Son ring DS est contrasté selon le type (`.notification--<type>` → couleur « on »),
// couvert par le visuel. En jsdom on valide le contrat : bouton réel focusable + classe de type qui
// porte le ring.
describe('Notification - Focus', () => {
	it('renders a real focusable close button', () => {
		const wrapper = mount(Notification, {
			props: { notification: makeNotification('info'), options: {} },
		})

		const closeBtn = wrapper.find('.notification__close')
		expect(closeBtn.exists()).toBe(true)
		expect(closeBtn.element.tagName).toBe('BUTTON')
		expect(closeBtn.attributes('tabindex')).not.toBe('-1')
		expect(closeBtn.attributes('aria-label')).toBe('Fermer la notification')
	})

	it.each(['info', 'success', 'warning', 'error'] as const)(
		'applies the %s type class carrying the contrast ring',
		(type) => {
			const wrapper = mount(Notification, {
				props: { notification: makeNotification(type), options: {} },
			})

			expect(wrapper.find(`.notification--${type}`).exists()).toBe(true)
			expect(wrapper.find(`.notification--${type} .notification__close`).exists()).toBe(true)
		},
	)
})
