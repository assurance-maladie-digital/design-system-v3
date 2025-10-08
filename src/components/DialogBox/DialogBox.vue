<script setup lang="ts">
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { mdiClose } from '@mdi/js'
	import { nextTick, ref, toRef, useId, watch } from 'vue'
	import type { VBtn, VDialog } from 'vuetify/components'
	import { useDisplay } from 'vuetify/lib/framework.mjs'
	import SyIcon from '../Customs/SyIcon/SyIcon.vue'
	import { config } from './config'
	import { locales } from './locales'
	import { useDraggable } from './useDraggable'

	const props = withDefaults(defineProps<{
		title?: string
		width?: string
		cancelBtnText?: string
		confirmBtnText?: string
		hideActions?: boolean
		persistent?: boolean
		autofocusValidateBtn?: boolean
		draggable?: boolean
	} & CustomizableOptions>(), {
		title: undefined,
		width: '800px',
		cancelBtnText: locales.cancelBtn,
		confirmBtnText: locales.confirmBtn,
		hideActions: false,
		persistent: false,
		autofocusValidateBtn: false,
	})

	defineEmits(['cancel', 'confirm', 'update:modelValue'])
	defineSlots<{
		default?: () => undefined
		title?: () => undefined
		actions?: () => undefined
	}>()

	const dialog = defineModel<boolean>({
		default: false,
	})

	const confirmBtn = ref<VBtn | null>(null)
	// Restore the focus to the last active element when the dialog is closed
	let activeElement: HTMLElement | null = null
	watch(dialog, (newValue) => {
		if (newValue) {
			activeElement = document.activeElement as HTMLElement
			if (props.autofocusValidateBtn) {
				nextTick(() => {
					confirmBtn.value?.$el.focus()
				})
			}
			else if (props.draggable) {
				nextTick(() => {
					dialogContent.value?.$el.querySelector('.sy-dialog-box-title')?.focus()
				})
			}
		}
		else if (activeElement) {
			activeElement.focus()
		}
	}, { immediate: true })

	const id = `dialog-${useId()}`
	const dialogContent = ref<VDialog | undefined>(undefined)

	const options = useCustomizableOptions(config, props)

	const closeIcon = mdiClose

	async function getSelectableElements(): Promise<HTMLElement[]> {
		const parentNode = dialogContent?.value?.$el // Is undefined when dialog is closed

		if (!parentNode) {
			return []
		}

		const elements = Array.from<HTMLElement>(parentNode.querySelectorAll(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
		))

		return elements.filter(element => (
			!element.hasAttribute('disabled')
			&& !element.getAttribute('aria-hidden')
		))
	}

	async function handleFocus(e: KeyboardEvent): Promise<void> {
		const selectableElements = await getSelectableElements()

		const focused = selectableElements.findIndex(
			(el: HTMLElement) => el === e.target,
		)

		const isOutside = focused === -1
		const lastElement = selectableElements.length - 1

		if (!e.shiftKey && (isOutside || focused === lastElement)) {
			e.preventDefault()
			selectableElements[0].focus()
		}
		else if (e.shiftKey && (isOutside || focused === 0)) {
			e.preventDefault()
			selectableElements[lastElement].focus()
		}
	}

	const display = useDisplay()

	const {
		isGrabbing,
		startDragging,
		moveToLeft,
		moveToRight,
		moveToBottom,
		moveToTop,
	} = useDraggable(toRef(props, 'draggable'), dialogContent)
</script>

<template>
	<VDialog
		v-model="dialog"
		:scrim="props.draggable ? 'transparent' : true"
		v-bind="$attrs"
		:width="props.width"
		:persistent="props.persistent"
		:retain-focus="false"
		aria-modal="true"
		class="sy-dialog-box"
		:aria-labelledby="id"
		@keydown.tab="handleFocus"
	>
		<VCard
			v-bind="options.card"
			ref="dialogContent"
			:class="{
				'sy-dialog-box-draggable': props.draggable,
				'sy-dialog-box-draggable--active': props.draggable && isGrabbing,
			}"
			:aria-label="props.draggable ? locales.draggable : undefined"
		>
			<VCardTitle
				class="sy-dialog-box-title"
				v-bind="options.cardTitle"
				:title="props.draggable ? locales.dragInstruction : undefined"
				:aria-label="props.draggable ? locales.dragInstructionLabel : undefined"
				:tabindex="props.draggable ? 0 : undefined"
				@mousedown="startDragging"
				@keydown.left.self="moveToLeft"
				@keydown.right.self="moveToRight"
				@keydown.up.self="moveToTop"
				@keydown.down.self="moveToBottom"
			>
				<slot name="title">
					<h2
						v-if="title"
						:id="id"
						class="text-h6 font-weight-bold"
					>
						{{ props.title }}
					</h2>
				</slot>

				<VSpacer v-bind="options.spacer" />

				<VBtn
					v-if="!props.persistent"
					class="sy-dialog-box-close-btn"
					v-bind="options.closeBtn"
					:aria-label="locales.closeBtn"
					@click.stop="dialog = false"
				>
					<SyIcon
						:icon="closeIcon"
						:decorative="true"
						v-bind="options.icon"
					/>
				</VBtn>
			</VCardTitle>

			<div
				class="px-6"
				v-bind="options.cardText"
			>
				<slot />
			</div>

			<div
				v-if="!props.hideActions"
				v-bind="options.cardActions"
				class="sy-dialog-box-actions-ctn"
			>
				<VSpacer v-bind="options.actionsSpacer" />

				<slot name="actions">
					<template v-if="display.xs.value">
						<VBtn
							v-bind="options.confirmBtn"
							data-test-id="confirm-btn"
							@click="$emit('confirm')"
						>
							{{ props.confirmBtnText }}
						</VBtn>

						<VBtn
							v-bind="options.cancelBtn"
							@click="$emit('cancel')"
						>
							{{ props.cancelBtnText }}
						</VBtn>
					</template>
					<template v-else>
						<VBtn
							class="sy-dialog-box-cancel-btn"
							v-bind="options.cancelBtn"
							@click="$emit('cancel')"
						>
							{{ props.cancelBtnText }}
						</VBtn>

						<VBtn
							v-bind="options.confirmBtn"
							ref="confirmBtn"
							class="sy-dialog-box-confirm-btn"
							:class="props.autofocusValidateBtn ? 'sy-dialog-box-confirm-btn--autofocus' : ''"
							data-test-id="confirm-btn"
							@click="$emit('confirm')"
						>
							{{ props.confirmBtnText }}
						</VBtn>
					</template>
				</slot>
			</div>
		</VCard>
	</VDialog>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens' as *;

.sy-dialog-box-title {
  line-height: normal;
}

.v-btn--icon {
	color: $colors-icon-base;
	position: absolute;
	right: 24px;
}

h2 {
	word-break: break-word;
	text-wrap: balance;
}

.sy-dialog-box-close-btn:focus-visible,
.sy-dialog-box-cancel-btn:focus-visible,
.sy-dialog-box-confirm-btn:focus-visible,
.sy-dialog-box-confirm-btn--autofocus:focus {
	:deep(.v-btn__overlay) {
		display: none;
	}

	&::after {
		opacity: 1;
		border: transparent;
		outline: 2px solid rgb(var(--v-theme-primary));
		outline-offset: 2px;
	}
}

.sy-dialog-box-actions-ctn {
	display: flex;
	flex-direction: column;
	justify-content: stretch;
	gap: $spacing-small;
}

.sy-dialog-box-draggable .sy-dialog-box-title {
	cursor: grab;

	&:focus-visible {
		outline: 2px solid rgb(var(--v-theme-primary));
		outline-offset: -2px;
		border-radius: 3px;
	}
}

.sy-dialog-box-draggable--active .sy-dialog-box-title {
	cursor: grabbing;
	user-select: none;
}

@media screen and (min-width: $container-mobile-max-width) {
	.sy-dialog-box-actions-ctn {
		flex-direction: row;
	}
}
</style>
