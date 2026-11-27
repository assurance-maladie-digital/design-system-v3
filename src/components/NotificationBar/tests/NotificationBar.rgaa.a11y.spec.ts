// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import NotificationBar from '../NotificationBar.vue'

export const notificationBarRgaaCriteria = ['7.1', '7.5', '10.11'] as const

describe('NotificationBar – executable RGAA contracts', () => {
	it('uses a status landmark by default and an alert for error contexts', () => {
		const wrapper = mount(NotificationBar)
		expect(wrapper.get('.notification-bar').attributes('role')).toBe('status')
	})

	it('keeps the notification container available for long content', () => {
		const wrapper = mount(NotificationBar, { attrs: { type: 'error' } })
		expect(wrapper.get('.notification-bar').attributes('role')).toBe('alert')
	})
})
