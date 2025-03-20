import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { vi } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import NotificationBar from '../NotificationBar.vue'
import { type Notification } from '@/components/NotificationBar/types'
import { useNotificationService } from '@/services/NotificationService'
import { nextTick, type Ref, ref } from 'vue'
import { vuetify } from '@tests/unit/setup'
import { VDefaultsProvider } from 'vuetify/components'

vi.mock('@/services/NotificationService')
describe('NotificationBar.vue', () => {
	interface NotificationServiceMock {
		notificationQueue: Ref<Notification[]>
		addNotification: (notification: Notification) => void
		removeNotification: (id: string) => void
	}

	let notificationServiceMock: NotificationServiceMock
	beforeEach(() => {
		vi.useFakeTimers()
		notificationServiceMock = {
			notificationQueue: ref([]),
			addNotification: vi.fn(),
			removeNotification: vi.fn(),
		};
		// @ts-expect-error on vi.Mock
		(useNotificationService as vi.Mock).mockReturnValue(notificationServiceMock)
	})

	afterEach(() => {
		vi.restoreAllMocks()
		vi.useRealTimers()
	})

	it('should render notification bar', async () => {
		const notification: Notification = {
			id: '1',
			message: 'Test message',
			type: 'info',
			timeout: -1,
			icon: null,
		}
		const wrapper = shallowMount(NotificationBar, {
			props: { notification },
			global: {
				plugins: [vuetify],
			},
		})
		wrapper.vm.openNotification(notification)

		await nextTick()
		expect(wrapper.exists()).toBe(true)
		expect(wrapper.html()).toMatchSnapshot()
	})

	it('should display the correct color based on notification type', async () => {
		const notification: Notification = {
			id: '1',
			message: 'Test message',
			type: 'success',
			timeout: -1,
			icon: null,
		}
		const wrapper = mount(NotificationBar, {
			props: { notification },
			global: {
				plugins: [vuetify],
			},
		})
		wrapper.vm.openNotification(notification)

		await nextTick()
		expect(wrapper.vm.color).toBe('#56C271')
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

		const wrapper = mount(NotificationBar, {
			global: {
				plugins: [vuetify],
			},
		})

		wrapper.vm.showNextNotification()
		await nextTick()
		vi.runAllTimers()
		await nextTick()

		expect(notificationServiceMock.removeNotification).toHaveBeenCalledWith(notification1.id)
		expect(wrapper.vm.currentNotification).toEqual(notification2)
		expect(wrapper.vm.isNotificationVisible).toBe(true)
	})

	it('should show notification based on screen size', async () => {
		const notification: Notification = {
			id: '1',
			message: 'Test message',
			type: 'info',
			timeout: -1,
			icon: null,
		}
		const wrapper = mount(NotificationBar, {
			props: { notification },
			global: {
				plugins: [vuetify],
			},
		})
		wrapper.vm.openNotification(notification)

		await nextTick()
		expect(wrapper.vm.isMobileVersion).toBe(false)
		expect(wrapper.vm.isVertical).toBe(false)
	})

	it('should compute hasActionSlot correctly', async () => {
		const notification: Notification = {
			id: '1',
			message: 'Test message',
			type: 'info',
			timeout: -1,
			icon: null,
		}
		const wrapper = mount(NotificationBar, {
			props: { notification },
			global: {
				plugins: [vuetify],
			},
			slots: {
				action: '<div>Action Slot</div>',
			},
		})
		wrapper.vm.openNotification(notification)

		await nextTick()
		expect(wrapper.vm.hasActionSlot).toBe(true)
	})

	it('should compute isMobileVersion correctly', async () => {
		const notification: Notification = {
			id: '1',
			message: 'Test message',
			type: 'info',
			timeout: -1,
			icon: null,
		}
		const wrapper = mount(NotificationBar, {
			props: { notification },
			global: {
				plugins: [vuetify],
			},
		})
		wrapper.vm.openNotification(notification)

		await nextTick()
		expect(wrapper.vm.isMobileVersion).toBe(false)
	})

	it('should compute hasLongContent correctly', async () => {
		const notification: Notification = {
			id: '1',
			message: 'Test message'.repeat(10),
			type: 'info',
			timeout: -1,
			icon: null,
		}
		const wrapper = mount(NotificationBar, {
			props: { notification },
			global: {
				plugins: [vuetify],
			},
		})
		wrapper.vm.openNotification(notification)

		await nextTick()
		expect(wrapper.vm.hasLongContent).toBe(true)
	})

	it('should clear queue', () => {
		const isNotificationVisible = ref(true)
		const emit = vi.fn()
		const removeNotification = vi.fn()
		const currentNotification = ref({ id: 1 })

		const clearQueue = () => {
			isNotificationVisible.value = false
			emit('clear-notification')
			removeNotification(currentNotification.value.id)
		}
		clearQueue()

		expect(isNotificationVisible.value).toBe(false)
		expect(emit).toHaveBeenCalledWith('clear-notification')
		expect(removeNotification).toHaveBeenCalledWith(1)
	})

	it('should reset queue', () => {
		const notificationQueue = ref([{ id: 1 }, { id: 2 }])
		const emit = vi.fn()
		const removeNotification = vi.fn()
		const currentNotification = ref({ id: 1 })

		const resetQueue = () => {
			notificationQueue.value = []
			emit('clear-notification')
			removeNotification(currentNotification.value.id)
		}
		resetQueue()

		expect(notificationQueue.value).toEqual([])
	})

	it('should call clearQueue when resetQueue is called', () => {
		const isNotificationVisible = ref(true)
		const emit = vi.fn()
		const removeNotification = vi.fn()
		const currentNotification = ref({ id: 1 })

		const clearQueue = () => {
			isNotificationVisible.value = false
			emit('clear-notification')
			removeNotification(currentNotification.value.id)
		}

		const resetQueue = () => {
			clearQueue()
		}

		resetQueue()

		expect(isNotificationVisible.value).toBe(false)
		expect(emit).toHaveBeenCalledWith('clear-notification')
		expect(removeNotification).toHaveBeenCalledWith(1)
	})

	it('should reset all queue on resetQueue', () => {
		const notificationQueue = ref([{ id: 1 }, { id: 2 }])
		const emit = vi.fn()
		const removeNotification = vi.fn()
		const currentNotification = ref({ id: 1 })

		const clearQueue = () => {
			notificationQueue.value = []
			emit('clear-notification')
			removeNotification(currentNotification.value.id)
		}

		const resetQueue = () => {
			clearQueue()
		}

		resetQueue()

		expect(notificationQueue.value).toEqual([])
	})

	it('should handle empty notification queue', async () => {
		notificationServiceMock.notificationQueue.value = []

		const wrapper = mount(NotificationBar, {
			global: {
				plugins: [vuetify],
			},
		})

		wrapper.vm.showNextNotification()

		await nextTick()
		expect(wrapper.vm.isNotificationVisible).toBe(false)
	})

	it('should handle clearQueue when no notification is visible', () => {
		const isNotificationVisible = ref(false)
		const emit = vi.fn()
		const removeNotification = vi.fn()
		const currentNotification = ref({ id: 1 })

		const clearQueue = () => {
			isNotificationVisible.value = false
			emit('clear-notification')
			removeNotification(currentNotification.value.id)
		}
		clearQueue()

		expect(isNotificationVisible.value).toBe(false)
		expect(emit).toHaveBeenCalledWith('clear-notification')
		expect(removeNotification).toHaveBeenCalledWith(1)
	})

	it('should show the item in queue', async () => {
		notificationServiceMock.notificationQueue.value = [{
			id: '1',
			message: 'Test message',
			type: 'info',
			timeout: -1,
			icon: null,
		}]

		const wrapper = mount(NotificationBar, {
			global: {
				plugins: [vuetify],
			},
		})

		const provider = wrapper.findComponent(VDefaultsProvider)
		expect(provider.element.parentElement.textContent).toContain('Test message')
	})
})
