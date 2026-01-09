// @vitest-environment jsdom

import { describe, it, beforeEach, afterEach } from 'vitest'
import { vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import NotificationBar from '../NotificationBar.vue'
import type { Notification } from '@/components/NotificationBar/types'
import { useNotificationService } from '@/services/NotificationService'
import { ref, type Ref } from 'vue'

vi.mock('@/services/NotificationService')

interface NotificationServiceMock {
	notificationQueue: Ref<Notification[]>
	clearAllEvent: Ref<boolean>
	removeNotification: (id: string) => void
	clearQueue: () => void
}

let notificationServiceMock: NotificationServiceMock

// Scénario d’accessibilité : snackbar d’information visible avec message court.

describe('NotificationBar – accessibility (axe)', () => {
	beforeEach(() => {
		notificationServiceMock = {
			notificationQueue: ref([]),
			clearAllEvent: ref(false),
			removeNotification: vi.fn(),
			clearQueue: vi.fn(),
		}
		const mockedUseNotificationService = useNotificationService as unknown as {
			mockReturnValue: (value: NotificationServiceMock) => void
		}
		mockedUseNotificationService.mockReturnValue(notificationServiceMock)
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('has no obvious axe violations with visible info notification', async () => {
		const notification: Notification = {
			id: '1',
			message: 'Message d’information',
			type: 'info',
			timeout: -1,
			icon: null,
		}

		useNotificationService().notificationQueue.value = [notification]

		const wrapper = mount(NotificationBar, {
			attachTo: document.body,
		})

		const results = await axe(document.body)
		assertNoA11yViolations(results, 'NotificationBar – visible info notification', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})
})
