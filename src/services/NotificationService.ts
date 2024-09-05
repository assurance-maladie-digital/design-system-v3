import { ref } from 'vue'
import type { Notification } from '@/components/NotificationBar/types'

const notificationQueue = ref<Notification[]>([])

export function useNotificationService() {
	const addNotification = (notification: Notification) => {
		if (!notificationQueue.value.some(n => n.id === notification.id)) {
			notificationQueue.value.push(notification)
		}
	}

	const removeNotification = (id: string) => {
		notificationQueue.value = notificationQueue.value.filter(n => n.id !== id)
	}

	const clearQueue = () => {
		notificationQueue.value = []
	}

	return {
		notificationQueue,
		addNotification,
		removeNotification,
		clearQueue,
	}
}
