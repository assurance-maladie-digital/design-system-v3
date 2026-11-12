import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { VBtn } from 'vuetify/components'
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

	// RGAA 11.9 : le nom accessible du bouton de fermeture contient son intitulé visible
	it('builds the accessible name from a custom closeBtnText', () => {
		const wrapper = mount(Notification, {
			props: { notification: makeNotification('info'), options: {}, closeBtnText: 'Masquer' },
		})

		const closeBtn = wrapper.find('.notification__close')
		expect(closeBtn.text()).toBe('Masquer')
		expect(closeBtn.attributes('aria-label')).toBe('Masquer la notification')
	})

	it('uses the same accessible name when only the close icon is displayed', () => {
		const wrapper = mount(Notification, {
			props: { notification: makeNotification('info'), options: {}, closeBtnText: 'Masquer' },
			slots: { action: () => h(VBtn, () => 'Voir le détail') },
		})

		const closeBtn = wrapper.find('.notification__close')
		expect(closeBtn.text()).toBe('')
		expect(closeBtn.attributes('aria-label')).toBe('Masquer la notification')
	})

	it('falls back to the default accessible name when closeBtnText is empty', () => {
		const wrapper = mount(Notification, {
			props: { notification: makeNotification('info'), options: {}, closeBtnText: '' },
		})

		expect(wrapper.find('.notification__close').attributes('aria-label')).toBe('Fermer la notification')
	})

	it('lets an aria-label passed through the btn options take precedence', () => {
		const wrapper = mount(Notification, {
			props: {
				notification: makeNotification('info'),
				options: { btn: { 'aria-label': 'Ignorer ce message' } },
				closeBtnText: 'Masquer',
			},
		})

		expect(wrapper.find('.notification__close').attributes('aria-label')).toBe('Ignorer ce message')
	})

	it('renders a real focusable button provided via the action slot', () => {
		const wrapper = mount(Notification, {
			props: { notification: makeNotification('info'), options: {} },
			slots: { action: () => h(VBtn, { variant: 'outlined', class: 'action-btn' }, () => 'Voir le détail') },
		})

		const actionBtn = wrapper.find('.notification__actions .action-btn')
		expect(actionBtn.exists()).toBe(true)
		expect(actionBtn.element.tagName).toBe('BUTTON')
		expect(actionBtn.attributes('tabindex')).not.toBe('-1')
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
