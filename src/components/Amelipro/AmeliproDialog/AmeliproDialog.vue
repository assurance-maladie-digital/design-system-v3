<script setup lang="ts">
	import { computed, onUnmounted, onUpdated, ref, watch } from 'vue'
	import AmeliproBtn from '../AmeliproBtn/AmeliproBtn.vue'
	import AmeliproIconBtn from '../AmeliproIconBtn/AmeliproIconBtn.vue'
	import type { IndexedObject } from '../types'
	import { useDisplay } from 'vuetify'

	const props = defineProps({
		attach: {
			type: Boolean,
			default: false,
		},
		cancelBtnLabel: {
			type: String,
			default: 'Annuler',
		},
		eager: {
			type: Boolean,
			default: false,
		},
		fullscreen: {
			type: Boolean,
			default: false,
		},
		hiddenCancelBtn: {
			type: Boolean,
			default: false,
		},
		labelledby: {
			type: String,
			required: true,
		},
		mainContentMaxHeight: {
			type: String,
			default: undefined,
		},
		mainContentMinHeight: {
			type: String,
			default: '150px',
		},
		modelValue: {
			type: Boolean,
			default: false,
		},
		noClickOutside: {
			type: Boolean,
			default: false,
		},
		noFooter: {
			type: Boolean,
			default: true,
		},
		persistent: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: undefined,
		},
		uniqueId: {
			type: String,
			required: true,
		},
		validationBtnLabel: {
			type: String,
			default: 'Valider',
		},
		width: {
			type: String,
			default: '800px',
		},
	})

	const { smAndUp } = useDisplay()
	const emit = defineEmits(['change', 'confirm', 'update:model-value'])

	const dialog = computed({
		get: (): boolean => props.modelValue,
		set: (newValue: boolean): void => {
			emit('update:model-value', newValue)
		},
	})

	const emitCloseEvent = (closeModal = true): void => {
		if (!props.persistent && closeModal) {
			dialog.value = false
			emit('change', false)
		}
	}

	const mainContentStyles = computed((): IndexedObject => {
		if (props.mainContentMaxHeight) {
			return {
				maxHeight: props.mainContentMaxHeight,
				minHeight: props.mainContentMinHeight,
				overflowY: 'auto',
			}
		}

		return { minHeight: props.mainContentMinHeight }
	})

	const emitConfirmEvent = (): void => {
		emit('confirm')
	}

	// set accessibility attributes on the dialog box
	const setDialogAttributes = (): void => {
		const wrapper = document.body.querySelector(`#${props.uniqueId}`)?.parentElement?.parentElement
		wrapper?.setAttribute('aria-labelledby', props.labelledby)
		getFocusableElements()
	}

	// tabbableEl find all focusable elements in the dialog
	const tabbableEl = ref(document.getElementById(props.uniqueId)?.querySelectorAll('a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'))

	// visibleEl returns visible elements from tabbableEl
	const visibleEl = computed(() => {
		if (tabbableEl.value !== undefined) {
			return Array.from(tabbableEl.value).filter((el: Element) => getComputedStyle(el).getPropertyValue('display') !== 'none' && !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden') && !el.getAttribute('style')?.includes('display: none'))
		}
		return undefined
	})

	// event on tab for last element of the dialogbox and event on tab+shift for the first element of dialogbox
	const tabEvent = (event: KeyboardEvent, position: string): void => {
		if (event.code === 'Tab' && event.shiftKey && position === 'first') {
			event.preventDefault()
			const element = document.body.querySelector('[data-focusable="last"]') as HTMLElement
			element?.focus()
		}

		if (event.code === 'Tab' && position === 'last' && !event.shiftKey) {
			event.preventDefault()
			const element = document.body.querySelector('[data-focusable="first"]') as HTMLElement
			element?.focus()
		}
	}

	// get all visible and focusable elements and set attributes on the first and the last one
	const getFocusableElements = (): void => {
		if (tabbableEl.value) {
			const tabbableElArray = Array.from(tabbableEl.value)
			// reset attributes and events already existing before
			tabbableElArray.filter((el: Element) => el.hasAttribute('data-focusable')).forEach((el: Element) => {
				el.removeEventListener('keydown', (e: Event) => tabEvent(e as KeyboardEvent, 'first'))
				el.removeEventListener('keydown', (e: Event) => tabEvent(e as KeyboardEvent, 'last'))
				el.removeAttribute('data-focusable')
			})

			if (visibleEl.value) {
				const firstFocusable = visibleEl.value[0]
				const lastFocusable = visibleEl.value[visibleEl.value.length - 1]
				// set a data-focusable="first" on the first one and a data-focusable="last"
				firstFocusable?.setAttribute('data-focusable', 'first')
				lastFocusable?.setAttribute('data-focusable', 'last')

				// set an event on the first and last element to make the focus loop into the dialogbox
				firstFocusable?.addEventListener('keydown', (e: Event) => tabEvent(e as KeyboardEvent, 'first'))
				lastFocusable?.addEventListener('keydown', (e: Event) => tabEvent(e as KeyboardEvent, 'last'))
			}
		}
	}
	// create an observer to check DOM changes and update focus loop elements
	const observerConfig = { attributes: true, childList: true, subtree: true }
	const observer = new MutationObserver(() => {
		tabbableEl.value = document.getElementById(props.uniqueId)?.querySelectorAll('a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])')
	})
	const openedOnce = ref(false)
	onUpdated(() => {
		if (dialog.value) {
			if (!openedOnce.value) {
				openedOnce.value = true
				tabbableEl.value = document.getElementById(props.uniqueId)?.querySelectorAll('a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])')
				observer.observe(document.getElementById(props.uniqueId) as Node, observerConfig)
			}
			setDialogAttributes()
		}
	})

	watch(() => useDisplay().name, () => {
		// we reset tabbableEl to update visibleEl which will trigger the secund watch
		tabbableEl.value = document.getElementById(props.uniqueId)?.querySelectorAll('a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])')
	})

	watch(() => visibleEl.value, () => {
		// we disconnect the observer and reconnect it after setDialogAttributes to avoid infinite loop
		observer.disconnect()
		setDialogAttributes()
		observer.observe(document.getElementById(props.uniqueId) as Node, observerConfig)
	})

	onUnmounted(() => observer.disconnect())
</script>

<template>
	<VDialog
		v-model="dialog"
		:attach="attach"
		:class="fullscreen ? undefined : 'dialog-radius'"
		:eager="eager"
		:fullscreen="fullscreen"
		:persistent="persistent || noClickOutside"
		:width="width"
		@click:outside="noClickOutside ? emitCloseEvent(false) : emitCloseEvent"
		@keydown.escape="emitCloseEvent"
	>
		<div
			:id="uniqueId"
			class="bg-ap-white dialog"
		>
			<div
				:id="`${uniqueId}-header`"
				class="mb-0 w-100 d-flex align-center flex-nowrap dialog__header"
			>
				<div class="dialog__title">
					<slot name="header">
						<h2
							v-if="title"
							:id="`${uniqueId}-title`"
							class="ma-0 text-h3"
						>
							{{ title }}
						</h2>
					</slot>
				</div>

				<AmeliproIconBtn
					v-if="!persistent"
					btn-label="Fermer la fenêtre modale"
					class="ml-auto dialog__close-btn"
					icon="croix"
					icon-bg-color="transparent"
					icon-color="ap-blue-darken-1"
					icon-hover-bg-color="transparent"
					icon-hover-color="ap-blue-darken-2"
					size="40px"
					:unique-id="`${ uniqueId }-close-btn`"
					@click="emitCloseEvent"
				/>
			</div>

			<div
				:id="`${uniqueId}-content`"
				class="w-100 mt-4 dialog__content"
				:style="mainContentStyles"
			>
				<slot />
			</div>

			<div
				v-if="$slots.footer || !noFooter"
				:id="`${uniqueId}-footer`"
				class="w-100 mt-4 dialog__footer"
				:class="{
					'd-flex flex-column flex-sm-row align-center': !$slots.footer,
					'justify-sm-space-between': !$slots.footer && !hiddenCancelBtn,
					'justify-sm-end': !$slots.footer && hiddenCancelBtn,
				}"
			>
				<slot name="footer">
					<AmeliproBtn
						v-if="!smAndUp"
						class="mb-4 w-100 dialog__validation-btn--mobile"
						:unique-id="`${ uniqueId }-validation-btn-mobile`"
						@click="emitConfirmEvent"
					>
						{{ validationBtnLabel }}
					</AmeliproBtn>

					<AmeliproBtn
						v-if="!hiddenCancelBtn"
						bordered
						class="dialog__cancel-btn"
						:class="smAndUp ? undefined : 'w-100'"
						color="ap-white"
						hover-color="ap-blue-lighten-3"
						text-color="ap-blue-darken-1"
						:unique-id="`${ uniqueId }-cancel-btn`"
						@click="emitCloseEvent"
					>
						{{ cancelBtnLabel }}
					</AmeliproBtn>

					<AmeliproBtn
						v-if="smAndUp"
						class="dialog__validation-btn"
						:unique-id="`${ uniqueId }-validation-btn-desktop`"
						@click="emitConfirmEvent"
					>
						{{ validationBtnLabel }}
					</AmeliproBtn>
				</slot>
			</div>
		</div>
	</VDialog>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.v-dialog {
	& :deep(.v-overlay__content) {
		overflow-y: auto !important;
	}

	&.dialog-radius :deep(.v-overlay__content) {
		border-radius: apTokens.$card-radius;
	}
}

.dialog {
	padding: apTokens.$dialog-padding;
}

.dialog__header {
	padding-bottom: 0.5rem;
	border-bottom: 1px solid apTokens.$ap-grey-lighten3;
}

.dialog__title {
	width: calc(100% - 60px);
	font-size: apTokens.$font-size-lg;
}
</style>
