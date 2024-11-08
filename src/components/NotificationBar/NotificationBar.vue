<script setup lang="ts">
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { useNotificationService } from '@/services/NotificationService'
	import { mdiAlertCircleOutline, mdiAlertOctagonOutline, mdiCheckCircleOutline, mdiClose, mdiInformationOutline } from '@mdi/js'
	import { computed, getCurrentInstance, ref, watch } from 'vue'
	import { useDisplay } from 'vuetify'
	import defaultOptions from './options'
	import { type Notification } from './types'

	const props = withDefaults(defineProps<CustomizableOptions & {
		closeBtnText?: string
		rounded?: 0 | 1 | 2 | 3 | 4 | 'xs' | 'sm' | true | 'lg' | 'xl' | 'pill' | 'circle' | 'shaped'
		bottom?: true | false
	}>(), {
		closeBtnText: 'Fermer',
		rounded: 4,
		bottom: false,
	})

	const options = useCustomizableOptions(defaultOptions, props)

	const display = useDisplay()

	const { notificationQueue, removeNotification } = useNotificationService()

	const instance = getCurrentInstance()

	const currentNotification = ref<Notification>()
	const isNotificationVisible = ref(false)

	const isProcessingNotifications = ref(false) // Nouvelle variable pour suivre le traitement

	const hasActionSlot = computed(() => !!instance?.slots.action)
	const isMobileVersion = computed(() => display.name.value === 'xs')
	const isTabletVersion = computed(() => display.name.value === 'sm')
	const hasLongContent = computed(() => (currentNotification.value?.message?.length ?? 0) > 50)

	const iconMapping: Record<string, string> = {
		info: mdiInformationOutline,
		success: mdiCheckCircleOutline,
		warning: mdiAlertCircleOutline,
		error: mdiAlertOctagonOutline,
	}

	const icon = computed(() => {
		return currentNotification.value ? iconMapping[currentNotification.value.type] : null
	})

	const color = computed(() => {
		if (currentNotification.value) {
			const typeColor: Record<string, string> = {
				info: 'info',
				success: '#56C271',
				warning: '#F0B323',
				error: 'error',
			}
			return typeColor[currentNotification.value.type] || 'info'
		}
		return 'info'
	})

	const contentStyle = computed(() => {
		if (currentNotification.value) {
			const isDarkText = currentNotification.value.type === 'success' || currentNotification.value.type === 'warning'
			return {
				contentColor: isDarkText ? 'grey-darken-80' : 'white',
			}
		}
		return {
			contentColor: 'white',
		}
	})

	const smallCloseBtn = computed(() => isMobileVersion.value && !hasLongContent.value && !hasActionSlot.value)

	const setNotification = (notification: Notification) => {
		currentNotification.value = { ...notification }
	}

	const processNotificationQueue = async () => {
		isProcessingNotifications.value = true

		while (notificationQueue.value.length > 0) {
			const nextNotification = notificationQueue.value[0]
			setNotification(nextNotification)
			isNotificationVisible.value = true

			let timeout = nextNotification.timeout ?? -1

			if (timeout <= 0) {
				// Attend que la notification soit fermée manuellement car pas de timeout
				await new Promise<void>((resolve) => {
					const stopWatch = watch(isNotificationVisible, (visible) => {
						if (!visible) {
							stopWatch()
							resolve()
						}
					})
				})
			}
			else {
				// Attend la fin du délai du timeout avant de fermer la notification automatiquement
				await new Promise<void>((resolve) => {
					const timeoutId = setTimeout(() => {
						handleClearNotification()
						resolve()
					}, timeout)

					const stopWatch = watch(isNotificationVisible, (visible) => {
						if (!visible) {
							clearTimeout(timeoutId)
							stopWatch()
							resolve()
						}
					})
				})
			}

			// Retire la notification de la file
			removeNotification(nextNotification.id)
		}

		isProcessingNotifications.value = false
	}

	const handleClearNotification = () => {
		isNotificationVisible.value = false
		if (currentNotification.value) {
			removeNotification(currentNotification.value.id)
			currentNotification.value = undefined
		}
	}

	const openNotification = (notification: Notification) => {
		setNotification(notification)
		isNotificationVisible.value = true
	}

	const showNextNotification = () => {
		if (notificationQueue.value.length > 0) {
			const nextNotification = notificationQueue.value[0]
			setNotification(nextNotification)
			isNotificationVisible.value = true
		}
	}

	watch(
		() => notificationQueue.value.length,
		(newLength) => {
			if (newLength > 0 && !isProcessingNotifications.value) {
				processNotificationQueue()
			}
		},
	)

	defineExpose({
		openNotification,
		handleClearNotification,
		showNextNotification,
		processNotificationQueue,
		currentNotification,
		isNotificationVisible,
		hasActionSlot,
		isMobileVersion,
		hasLongContent,
		color,
		icon,
		contentStyle,
		smallCloseBtn,
		isVertical: computed(() => hasLongContent.value && isMobileVersion.value),
	})

</script>

<template>
	<div v-if="currentNotification">
		<VSnackbar
			v-bind="options.snackbar"
			v-model="isNotificationVisible"
			role="status"
			:color="color"
			:location="props.bottom ? 'bottom' : 'top'"
			:vertical="hasLongContent"
			:multi-line="hasLongContent"
			:timeout="currentNotification?.timeout ?? -1"
			:width="isMobileVersion || isTabletVersion ? 'auto' : '960px'"
			:rounded="props.rounded"
			:class="[{ 'long-text': hasLongContent }]"
		>
			<div class="d-flex align-center ga-2">
				<VIcon
					v-if="!isMobileVersion && icon"
					v-bind="options.icon"
					:icon="icon"
					size="24"
					aria-hidden="true"
				/>
				<p :class="'text-' + contentStyle.contentColor">
					{{ currentNotification?.message }}
				</p>
			</div>

			<template #actions>
				<div
					class="d-flex ga-2"
					style="width:100%"
					:class="hasLongContent ? 'action-section-longText' : 'action-section-shortText'"
				>
					<slot name="action" />
					<VBtn
						class="notification-bar__close"
						:class="{ 'ma-0': smallCloseBtn }"
						aria-label="Fermer la notification"
						v-bind="options.btn"
						@click="handleClearNotification"
					>
						<template v-if="!smallCloseBtn">
							{{ closeBtnText }}
						</template>
						<template v-else>
							<VIcon :icon="mdiClose" />
						</template>
					</VBtn>
				</div>
			</template>
		</VSnackbar>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens.scss';

.vd-notification-content {
  display: flex;
  align-items: center;
}

.vd-notification-bar :deep(.v-snack__wrapper) {
  padding: 16px;
  min-width: 0;
  max-width: none;
}

:deep(.v-snackbar__content) {
  padding: tokens.$padding-4 !important;
}
:deep(.v-snackbar__actions) {
  margin-inline-end: 10px;
}

.vd-notification-bar.v-snackbar--vertical :deep() {
  .v-snackbar--vertical .v-snackbar__wrapper .v-snackbar__actions {
    width: 100% !important;
    align-self: auto;
  }
  .v-snack__wrapper {
    align-items: stretch;
    flex-direction: row;
  }

  .v-snack__action {
    align-self: stretch;
    align-items: stretch;
    flex-direction: column;
  }

  .v-snackbar__content {
    margin: 0;
    width: 100%;
    display: flex;
  }

  .vd-notification-content {
    flex-direction: column;
    display: flex;
  }
}

.long-text :deep(.v-snackbar__actions) {
  width: 98% !important;
}

.short-text :deep(.v-snackbar__actions) {
  width: 48% !important;
}

.action-section-longText {
  justify-content: space-around;
}

.action-section-shortText {
  justify-content: end !important;
}
</style>
