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

	watch(() => notificationQueue.value.length, async (queueLength) => {
		if (queueLength > 0 && currentNotification.value === undefined) {
			openNotification(notificationQueue.value[0])
		}
	}, { immediate: true })

	let timeoutID: ReturnType<typeof setTimeout>
	function openNotification(notification: Notification) {
		currentNotification.value = notification
		isNotificationVisible.value = true

		if ((notification.timeout || 0) > 0) {
			timeoutID = setTimeout(() => {
				isNotificationVisible.value = false
			}, notification.timeout)
		}
	}

	watch(isNotificationVisible, async (isVisible) => {
		if (!isVisible) {
			// wait for the snackbar close animation to finish
			await new Promise(resolve => setTimeout(resolve, 100))
			if (currentNotification.value) {
				removeNotification(currentNotification.value.id)
			}
			currentNotification.value = undefined

			if (notificationQueue.value.length > 0) {
				openNotification(notificationQueue.value[0])
			}
		}
	})

	function showNextNotification() {
		clearTimeout(timeoutID)
		isNotificationVisible.value = false
	}

	defineExpose({
		openNotification,
		showNextNotification,
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
	<VSnackbar
		v-bind="options.snackbar"
		v-model="isNotificationVisible"
		role="status"
		:eager="true"
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
			<p
				class="sy-notification-content"
				:class="'text-' + contentStyle.contentColor"
			>
				{{ currentNotification?.message }}
			</p>
		</div>

		<template #actions>
			<div
				class="d-flex ga-2"
				style="width: 100%;"
				:class="hasLongContent ? 'action-section-long-text' : 'action-section-short-text'"
			>
				<slot name="action" />
				<VBtn
					class="notification-bar__close"
					:class="{ 'ma-0': smallCloseBtn }"
					aria-label="Fermer la notification"
					v-bind="options.btn"
					@click="isNotificationVisible = false"
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
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

:deep(.v-overlay__content) {
	max-width: 100%;
}

:deep(.v-snackbar__content) {
	width: 100%;
	padding: tokens.$padding-4 !important;
}

:deep(.v-snackbar__actions) {
	margin-inline-end: 10px;
}

.long-text :deep(.v-snackbar__actions) {
	width: 98% !important;
}

.short-text :deep(.v-snackbar__actions) {
	width: 48% !important;
}

.action-section-long-text {
	justify-content: space-around;
}

.action-section-short-text {
	justify-content: end !important;
}

.sy-notification-content {
	min-width: 0;
	word-wrap: break-word;
}
</style>
