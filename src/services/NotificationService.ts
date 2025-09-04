import { ref } from 'vue'
import type { Notification } from '@/components/NotificationBar/types'

const notificationQueue = ref<Notification[]>([])
const clearAllEvent = ref(false) // Signal pour déclencher la fermeture des notifications affichées

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
		// Signaler pour fermer les notifications affichées
		clearAllEvent.value = true
		// Reset le signal après un court délai
		setTimeout(() => {
			clearAllEvent.value = false
		}, 100)
		// Vider la file d'attente
		notificationQueue.value = []
	}

	return {
		notificationQueue,
		clearAllEvent,
		addNotification,
		removeNotification,
		clearQueue,
	}
}
