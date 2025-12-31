<script setup lang="ts">
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { useNotificationService } from '@/services/NotificationService'
	import { onUnmounted, ref, useAttrs, watch } from 'vue'
	import defaultOptions from './config'
	import Notification from './Notification/Notification.vue'
	import type { Notification as NotificationType } from './types'

	const props = withDefaults(defineProps<CustomizableOptions & {
		closeBtnText?: string
		rounded?: 0 | 1 | 2 | 3 | 4 | 'xs' | 'sm' | true | 'lg' | 'xl' | 'pill' | 'circle' | 'shaped'
		bottom?: true | false
		showAll?: boolean
	}>(), {
		closeBtnText: 'Fermer',
		rounded: 4,
		bottom: false,
		showAll: false,
	})

	const attrs = useAttrs()

	const options = useCustomizableOptions(defaultOptions, props)

	const { notificationQueue, clearQueue, removeNotification } = useNotificationService()

	const displayedNotifications = ref<NotificationType[]>([])
	let nextNotificationTimer: number | undefined = undefined
	watch([notificationQueue, () => props.showAll], () => {
		if (!notificationQueue.value) {
			displayedNotifications.value = []
			return
		}
		if (props.showAll) {
			clearTimeout(nextNotificationTimer)
			displayedNotifications.value = notificationQueue.value
		}
		else if (
			displayedNotifications.value.length !== 1
			|| notificationQueue.value?.[0]?.id !== displayedNotifications.value?.[0]?.id
		) {
			displayedNotifications.value = []
			nextNotificationTimer = window.setTimeout(() => {
				displayedNotifications.value = notificationQueue.value.slice(0, 1)
				nextNotificationTimer = undefined
			}, 200) // wait for the fade out transition to complete
		}
	}, { immediate: true, deep: 2 })

	const timers: Map<string, number> = new Map() // avoid duplicate timers
	watch(displayedNotifications, () => {
		// remove existing timers for removed notifications
		for (const [id, timer] of timers) {
			if (!displayedNotifications.value.find(n => n.id === id)) {
				clearTimeout(timer)
				timers.delete(id)
			}
		}
		if (props.showAll) {
			for (const notification of displayedNotifications.value) {
				timeoutNotification(notification)
			}
		}
		else {
			const notification = displayedNotifications.value[0]
			if (notification) timeoutNotification(notification)
		}
	}, { immediate: true, deep: 2 })

	function timeoutNotification(notification: NotificationType) {
		if (notification.timeout && notification.timeout > 0 && !timers.has(notification.id)) {
			const timer = window.setTimeout(() => {
				removeNotification(notification.id)
				timers.delete(notification.id)
			}, notification.timeout)
			timers.set(notification.id, timer)
		}
	}

	onUnmounted(() => {
		timers.forEach((timer) => {
			clearTimeout(timer)
		})
		clearTimeout(nextNotificationTimer)
	})

	defineExpose({
		clearAll: clearQueue,
		clearNotification: removeNotification,
		notificationQueue,
		displayedNotifications,
	})
</script>

<template>
	<div
		class="notification-bar"
		:class="{
			'notification-bar--queue': !props.showAll,
			'notification-bar--list': props.showAll,
		}"
		:role="attrs?.type === 'error' ? 'alert' : 'status'"
	>
		<TransitionGroup
			name="fade"
			tag="div"
			class="notification-bar-transition"
			:style="{
				bottom: props.bottom ? '4px' : 'auto',
				top: props.bottom ? 'auto' : '4px',
			}"
		>
			<Notification
				v-for="notificationItem in displayedNotifications"
				:key="notificationItem.id"
				:notification="notificationItem"
				:close-btn-text="props.closeBtnText"
				:rounded="props.rounded"
				:options
				@close="removeNotification"
			>
				<!-- pass down slots -->
				<template
					v-for="(_, slotName) in $slots"
					#[slotName]="slotProps"
					:key="slotName"
				>
					<slot
						:name="slotName"
						v-bind="slotProps ?? {}"
					/>
				</template>
			</Notification>
		</TransitionGroup>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

.sy-notification-content {
	min-width: 0;
	word-wrap: break-word;
	overflow-y: auto;
}

:deep(.v-snackbar__wrapper) {
	max-height: 100%;
	overflow-y: auto;
}

.notification-bar-transition {
	max-width: min(calc(100% - 16px), 960px);
	position: fixed;
	z-index: 2000;
	left: 50%;
}

/* Fade transition for notifications */
.notification-bar--queue {
	.notification-bar-transition {
		will-change: opacity;
	}

	.fade-enter-active {
		transition: opacity 0.2s ease-in-out;
	}

	.fade-leave-active {
		transition: opacity 0.17s ease-in-out;
	}

	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
	}
}

.notification-bar--list {
	.notification-bar-transition {
		will-change: opacity, height, padding-block, margin-block;
	}

	.fade-enter-active,
	.fade-leave-active {
		overflow: clip;
		height: auto;
		interpolate-size: allow-keywords;
		box-sizing: border-box;
	}

	.fade-enter-active {
		transition: opacity 0.2s ease-in, height 0.2s ease-in, padding-block 0.2s ease-in, margin-block 0.2s ease-in;
	}

	.fade-leave-active {
		transition: opacity 0.17s ease-out, height 0.17s ease-out, padding-block 0.17s ease-out, margin-block 0.17s ease-out;
	}

	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
		height: 0;
		padding-block: 0;
		margin-block: tokens.$gap-0;
	}
}
</style>
