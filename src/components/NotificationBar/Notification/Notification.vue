<script setup lang="ts">
	import { computed, getCurrentInstance } from 'vue'
	import { useDisplay } from 'vuetify'
	import { mdiAlertOutline, mdiAlertOctagonOutline, mdiCheckCircleOutline, mdiClose, mdiInformationOutline } from '@mdi/js'
	import type { Notification } from '../types'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'

	const props = withDefaults(defineProps<{
		notification: Notification
		options: {
			btn?: Record<string, unknown>
			icon?: Record<string, unknown>
		}
		closeBtnText?: string
		rounded?: 0 | 1 | 2 | 3 | 4 | 'xs' | 'sm' | true | 'lg' | 'xl' | 'pill' | 'circle' | 'shaped'
	}>(), {
		closeBtnText: 'Fermer',
		rounded: 4,
	})

	const emits = defineEmits<{
		(e: 'close', id: string): void
	}>()

	const display = useDisplay()
	const isMobileVersion = computed(() => display.name.value === 'xs')
	const hasLongContent = computed(() => (props.notification.message.length > 50))

	const iconMapping: Record<string, string> = {
		info: mdiInformationOutline,
		success: mdiCheckCircleOutline,
		warning: mdiAlertOutline,
		error: mdiAlertOctagonOutline,
	}

	const icon = computed(() => {
		if (props.notification.icon === null)
			return undefined

		if (props.notification.icon !== undefined)
			return props.notification.icon

		return iconMapping[props.notification.type] ?? mdiInformationOutline
	})

	const instance = getCurrentInstance()
	const hasActionSlot = computed(() => {
		return !!instance?.slots.action || !!instance?.slots[`action:${props.notification.id}`]
	})
</script>

<!-- eslint-disable vuejs-accessibility/no-static-element-interactions -->
<template>
	<div
		class="notification"
		:class="[
			`notification--${props.notification.type}`,
			`notification--${props.rounded}`,
			{ 'notification--long-text': hasLongContent },
			{ 'notification--short-text': !hasLongContent },
			{ 'notification--with-action': hasActionSlot },
			`rounded-${props.rounded}`
		]"
		:style="{
			borderRadius: typeof props.rounded == 'number' ? `${props.rounded}px` : ''
		}"
		@keydown.escape="emits('close', props.notification.id)"
	>
		<SyIcon
			v-if="icon"
			v-bind="options.icon"
			:icon="icon"
			size="24"
			decorative
		/>

		<span class="notification__message">
			<slot :notification="props.notification">{{ notification.message }}</slot>
		</span>
		<div
			class="d-flex ga-2 notification__actions"
			:class="notification.message.length > 50 ? 'action-section-long-text' : 'action-section-short-text'"
		>
			<slot
				name="action"
				:notification="props.notification"
			/>
			<slot
				:name="`action:${props.notification.id}`"
				:notification="props.notification"
			/>
			<VBtn
				class="notification__close ml-auto"
				:class="{ 'ma-0': isMobileVersion && hasLongContent && !hasActionSlot }"
				aria-label="Fermer la notification"
				v-bind="options.btn"
				@click="emits('close', notification.id)"
			>
				<template v-if="(!isMobileVersion || hasLongContent) && !hasActionSlot">
					{{ props.closeBtnText }}
				</template>
				<template v-else>
					<SyIcon	:icon="mdiClose" />
				</template>
			</VBtn>
		</div>
	</div>
</template>
<style scoped lang="scss">
	
	.notification {
		display: flex;
		align-items: center;
		width: 100%;
		transform: translateX(-50%);
		padding: var(--v-theme-gap-2) var(--v-theme-gap-4);
		margin-block: var(--v-theme-gap-1);
		gap: var(--v-theme-gap-2) var(--v-theme-gap-4);
		box-shadow:
			0 3px 5px -1px var(--v-shadow-key-umbra-opacity, rgb(0 0 0 / 20%)),
			0 6px 10px 0 var(--v-shadow-key-penumbra-opacity, rgb(0 0 0 / 14%)),
			0 1px 18px 0 var(--v-shadow-key-ambient-opacity, rgb(0 0 0 / 12%));

		// prevent margins collapsing
		clear: both;
		float: left;
	}

	.notification__close:focus-visible {
		:deep(.v-btn__overlay) {
			display: none;
		}

		&::after {
			display: none;
		}
	}

	/* stylelint-disable custom-property-pattern */
	.notification--info {
		background-color: rgb(var(--v-theme-backgroundInfoContrasted, '12, 65, 154'));
		color: rgb(var(--v-theme-textOnDark, '255, 255, 255'));

		.notification__close:focus-visible {
			outline: 2px solid rgb(var(--v-theme-textOnDark, '255, 255, 255'));
		}
	}

	.notification--success {
		background-color: rgb(var(--v-theme-backgroundSuccessContrasted, '86, 194, 113'));
		color: rgb(var(--v-theme-textBase, '0, 0, 0'));

		.notification__close:focus-visible {
			outline: 2px solid rgb(var(--v-theme-textBase, '0, 0, 0'));
		}
	}

	.notification--warning {
		background-color: rgb(var(--v-theme-backgroundWarningContrasted, '240, 179, 35'));
		color: rgb(var(--v-theme-textBase, '0, 0, 0'));

		.notification__close:focus-visible {
			outline: 2px solid rgb(var(--v-theme-textBase, '0, 0, 0'));
		}
	}

	.notification--error {
		background-color: rgb(var(--v-theme-backgroundErrorContrasted, '179, 63, 46'));
		color: rgb(var(--v-theme-textOnDark, '255, 255, 255'));

		.notification__close:focus-visible {
			outline: 2px solid rgb(var(--v-theme-textOnDark, '255, 255, 255'));
		}
	}

	.notification__message {
		flex-grow: 1;
	}

	.notification--long-text {
		/* stylelint-disable-next-line */
		@media screen and (width <= 600px) {
			flex-direction: column;
			align-items: flex-start;
			padding: var(--v-theme-gap-4);

			.notification__actions {
				justify-content: space-between;
				width: 100%;
			}
		}

		.notification__actions {
			justify-content: space-around;
		}
	}

	.notification--short-text {
		.notification__actions {
			justify-content: flex-end !important;
		}
	}

</style>
