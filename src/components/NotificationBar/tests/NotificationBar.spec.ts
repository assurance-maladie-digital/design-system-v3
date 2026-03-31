import { type Notification } from '@/components/NotificationBar/types'
import { useNotificationService } from '@/services/NotificationService'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, type Ref, ref } from 'vue'
import NotificationBar from '../NotificationBar.vue'

vi.mock('@/services/NotificationService')
describe('NotificationBar.vue', () => {
	interface NotificationServiceMock {
		notificationQueue: Ref<Notification[]>
		clearAllEvent: Ref<boolean>
		addNotification: (notification: Notification) => void
		removeNotification: (id: string) => void
		clearQueue: () => void
	}

	let notificationServiceMock: NotificationServiceMock
	beforeEach(() => {
		vi.useFakeTimers()
		notificationServiceMock = {
			notificationQueue: ref([]),
			clearAllEvent: ref(false),
			addNotification: vi.fn(),
			removeNotification: vi.fn(),
			clearQueue: vi.fn(),
		};
		// @ts-expect-error on vi.Mock
		(useNotificationService as vi.Mock).mockReturnValue(notificationServiceMock)
	})

	afterEach(() => {
		vi.restoreAllMocks()
		vi.useRealTimers()
	})

	it('should display a notification', async () => {
		// Setup a visible notification
		const notification: Notification = {
			id: '1',
			message: 'Test message',
			type: 'info',
			timeout: -1,
			icon: null,
		}
		notificationServiceMock.notificationQueue.value = [notification]

		// Mount the component
		const wrapper = mount(NotificationBar)
		vi.runAllTimers()
		await nextTick()

		// Verify notification is visible
		expect(wrapper.html()).toContain('Test message')
	})

	it('should handle clearQueue functionality', async () => {
		const notifications: Notification[] = [
			{ id: '1', message: 'Message 1', type: 'info', timeout: -1, icon: null },
			{ id: '2', message: 'Message 2', type: 'info', timeout: -1, icon: null },
		]
		notificationServiceMock.notificationQueue.value = notifications

		const wrapper = mount(NotificationBar)
		vi.runAllTimers()
		await nextTick()

		// Verify notifications are visible
		expect(wrapper.html()).toContain('Message 1')
		expect(wrapper.html()).not.toContain('Message 2')
		wrapper.vm.clearAll()

		expect(notificationServiceMock.clearQueue).toHaveBeenCalled()
		notificationServiceMock.notificationQueue.value = []

		await nextTick()
		expect(wrapper.html()).not.toContain('Message 1')
		expect(wrapper.html()).not.toContain('Message 2')
	})

	it('should render notification bar', async () => {
		const notification: Notification = {
			id: '1',
			message: 'Test message',
			type: 'info',
			timeout: -1,
			icon: null,
		}
		notificationServiceMock.notificationQueue.value = [notification]
		const wrapper = mount(NotificationBar)
		vi.runAllTimers()
		await nextTick()
		expect(wrapper.exists()).toBe(true)
		expect(wrapper.html()).toMatchSnapshot()
	})

	it('should render nany notification when showall is true', async () => {
		const notifications: Notification[] = [
			{ id: '1', message: 'Message 1', type: 'info', timeout: -1, icon: null },
			{ id: '2', message: 'Message 2', type: 'info', timeout: -1, icon: null },
		]
		notificationServiceMock.notificationQueue.value = notifications

		const wrapper = mount(NotificationBar, {
			props: { showAll: true },
		})
		vi.runAllTimers()
		await nextTick()

		// Verify notifications are visible
		expect(wrapper.html()).toContain('Message 1')
		expect(wrapper.html()).toContain('Message 2')
	})

	it('take into account the changes in the notification queue', async () => {
		// Setup a visible notification
		const notification: Notification = {
			id: '1',
			message: 'Test message',
			type: 'info',
			timeout: -1,
			icon: null,
		}
		notificationServiceMock.notificationQueue.value = [notification]

		// Mount the component
		const wrapper = mount(NotificationBar,
			{ props: { showAll: true } },
		)
		vi.runAllTimers()
		await nextTick()

		// Verify notification is visible
		expect(wrapper.html()).toContain('Test message')

		notificationServiceMock.notificationQueue.value = [
			{ id: '2', message: 'Another message', type: 'info', timeout: -1, icon: null },
			{ id: '3', message: 'something else', type: 'info', timeout: -1, icon: null },
		]
		vi.runAllTimers()
		await nextTick()
		vi.runAllTimers()
		await nextTick()

		expect(wrapper.html()).toContain('Another message')
		expect(wrapper.html()).toContain('something else')
	})

	it('should show the next notification in the queue', async () => {
		notificationServiceMock.removeNotification = vi.fn(() => {
			notificationServiceMock.notificationQueue.value.shift()
		})

		const notification1: Notification = {
			id: '1',
			message: 'Test message 1',
			type: 'info',
			timeout: -1,
			icon: null,
		}
		const notification2 = {
			id: '2',
			message: 'Test message 2',
			type: 'success',
			timeout: -1,
			icon: null,
		} as const satisfies Notification
		notificationServiceMock.notificationQueue.value = [notification1, notification2]

		const wrapper = mount(NotificationBar)
		vi.runAllTimers()
		await nextTick()

		expect(wrapper.html()).toContain('Test message 1')

		wrapper.vm.clearNotification(notification1.id)

		expect(notificationServiceMock.removeNotification).toHaveBeenCalledWith(notification1.id)
		// wait fot the transition to complete and next notification to show
		vi.runAllTimers() // first remove the first notification
		await nextTick()
		vi.runAllTimers() // then show the next notification
		await nextTick()

		expect(wrapper.html()).toContain('Test message 2')
		expect(wrapper.html()).not.toContain('Test message 1')
	})

	it('should render default slot content instead of message', async () => {
		const notification: Notification = {
			id: '1',
			message: 'Message original',
			type: 'info',
			timeout: -1,
			icon: null,
		}
		notificationServiceMock.notificationQueue.value = [notification]

		const wrapper = mount(NotificationBar, {
			slots: {
				default: '<span>Contenu personnalisé</span>',
			},
		})
		vi.runAllTimers()
		await nextTick()

		expect(wrapper.html()).toContain('Contenu personnalisé')
		expect(wrapper.html()).not.toContain('Message original')
	})

	it('should expose notification slotProp in default slot', async () => {
		const notification: Notification = {
			id: 'abc',
			message: 'Message original',
			type: 'info',
			timeout: -1,
			icon: null,
		}
		notificationServiceMock.notificationQueue.value = [notification]

		const wrapper = mount(NotificationBar, {
			slots: {
				default: `<template #default="{ notification }"><span>id: {{ notification.id }}</span></template>`,
			},
		})
		vi.runAllTimers()
		await nextTick()

		expect(wrapper.html()).toContain('id: abc')
	})

	it('should fall back to message when no default slot is provided', async () => {
		const notification: Notification = {
			id: '1',
			message: 'Message fallback',
			type: 'info',
			timeout: -1,
			icon: null,
		}
		notificationServiceMock.notificationQueue.value = [notification]

		const wrapper = mount(NotificationBar)
		vi.runAllTimers()
		await nextTick()

		expect(wrapper.html()).toContain('Message fallback')
	})

	it('should compute action', async () => {
		const notification: Notification = {
			id: '1',
			message: 'Test message',
			type: 'info',
			timeout: -1,
			icon: null,
		}
		notificationServiceMock.notificationQueue.value = [notification]
		const wrapper = mount(NotificationBar, {
			props: { notification },
			slots: {
				action: '<div>Action Slot</div>',
			},
		})
		vi.runAllTimers()
		await nextTick()
		expect(wrapper.html()).toContain('Test message')
		vi.runAllTimers()
		await nextTick()
		expect(wrapper.html()).toContain('Action Slot')
	})

	it('should compute action:id slot', async () => {
		const notification: Notification = {
			id: '1',
			message: 'Test message',
			type: 'info',
			timeout: -1,
			icon: null,
		}
		notificationServiceMock.notificationQueue.value = [notification]
		const wrapper = mount(NotificationBar, {
			props: { notification },
			slots: {
				'action:1': '<div>Action Slot for ID 1</div>',
			},
		})
		vi.runAllTimers()
		await nextTick()
		expect(wrapper.html()).toContain('Test message')
		expect(wrapper.html()).toContain('Action Slot for ID 1')
	})

	it('should show the item in queue', async () => {
		notificationServiceMock.notificationQueue.value = [{
			id: '1',
			message: 'Test message',
			type: 'info',
			timeout: -1,
			icon: null,
		}]

		const wrapper = mount(NotificationBar)
		vi.runAllTimers()
		await nextTick()

		expect(wrapper.html()).toContain('Test message')
	})

	it('handle close button click', async () => {
		notificationServiceMock.removeNotification = vi.fn(() => {
			notificationServiceMock.notificationQueue.value.shift()
		})

		const notification: Notification = {
			id: '1',
			message: 'Test message',
			type: 'info',
			timeout: -1,
			icon: null,
		}
		notificationServiceMock.notificationQueue.value = [notification]

		const wrapper = mount(NotificationBar)
		vi.runAllTimers()
		await nextTick()

		expect(wrapper.html()).toContain('Test message')

		const closeButton = wrapper.find('.notification__close')
		await closeButton.trigger('click')

		expect(notificationServiceMock.removeNotification).toHaveBeenCalledWith(notification.id)

		vi.runAllTimers()
		await nextTick()

		expect(wrapper.html()).not.toContain('Test message')
	})

	it('hide the notifications when the timeout is reached', async () => {
		notificationServiceMock.removeNotification = vi.fn(() => {
			notificationServiceMock.notificationQueue.value.shift()
		})

		const notification: Notification = {
			id: '1',
			message: 'Test message',
			type: 'info',
			timeout: 3000,
			icon: null,
		}
		notificationServiceMock.notificationQueue.value = [notification]

		const wrapper = mount(NotificationBar)
		vi.runAllTimers()
		await nextTick()

		expect(wrapper.html()).toContain('Test message')

		// Advance timers by 3 seconds to trigger timeout
		vi.advanceTimersByTime(3000)
		await nextTick()

		expect(notificationServiceMock.removeNotification).toHaveBeenCalledWith(notification.id)

		vi.runAllTimers()
		await nextTick()

		expect(wrapper.html()).not.toContain('Test message')
	})

	it('run all the timeout simultaneously', async () => {
		notificationServiceMock.removeNotification = vi.fn(() => {
			notificationServiceMock.notificationQueue.value.shift()
		})

		notificationServiceMock.notificationQueue.value = [
			{ id: '1', message: 'Message 1', type: 'info', timeout: 1000, icon: null },
			{ id: '2', message: 'Message 2', type: 'info', timeout: 2000, icon: null },
			{ id: '3', message: 'Message 3', type: 'info', timeout: 3000, icon: null },
		]

		const wrapper = mount(NotificationBar, {
			props: { showAll: true },
		})

		expect(wrapper.html()).toContain('Message 1')
		expect(wrapper.html()).toContain('Message 3')
		expect(wrapper.html()).toContain('Message 2')

		vi.advanceTimersByTime(2500)
		await nextTick()

		expect(notificationServiceMock.removeNotification).toHaveBeenCalledTimes(2)

		expect(wrapper.html()).not.toContain('Message 1')
		expect(wrapper.html()).not.toContain('Message 2')
		expect(wrapper.html()).toContain('Message 3')

		vi.advanceTimersByTime(1000)
		await nextTick()

		expect(notificationServiceMock.removeNotification).toHaveBeenCalledTimes(3)

		expect(wrapper.html()).not.toContain('Message 1')
		expect(wrapper.html()).not.toContain('Message 2')
		expect(wrapper.html()).not.toContain('Message 3')
	})
})
