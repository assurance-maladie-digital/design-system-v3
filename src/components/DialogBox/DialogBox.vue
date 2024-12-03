<script setup lang="ts">
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { mdiClose } from '@mdi/js'
	import { ref } from 'vue'
	import type { VDialog } from 'vuetify/components'
	import { config } from './config'
	import { locales } from './locales'

	const props = withDefaults(defineProps<{
		title?: string
		width?: string
		cancelBtnText?: string
		confirmBtnText?: string
		hideActions?: boolean
		persistent?: boolean
	} & CustomizableOptions>(), {
		title: undefined,
		width: '800px',
		cancelBtnText: locales.cancelBtn,
		confirmBtnText: locales.confirmBtn,
		hideActions: false,
		persistent: false,
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

		const filteredElements = elements.filter(element => (
			!element.hasAttribute('disabled')
			&& !element.getAttribute('aria-hidden')
		))

		return filteredElements
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
</script>

<template>
	<VDialog
		v-model="dialog"
		v-bind="$attrs"
		:width="props.width"
		:persistent="props.persistent"
		:retain-focus="false"
		aria-modal="true"
		class="vd-dialog-box"
		@keydown.tab="handleFocus"
	>
		<VCard
			v-bind="options.card"
			id="dialogContent"
			ref="dialogContent"
			:aria-labelledby="props.title ? props.title : 'dialogContent'"
		>
			<VCardTitle v-bind="options.cardTitle">
				<slot name="title">
					<h2
						v-if="title"
						class="text-h6 font-weight-bold"
					>
						{{ props.title }}
					</h2>
				</slot>

				<VSpacer v-bind="options.spacer" />

				<VBtn
					v-if="!props.persistent"
					v-bind="options.closeBtn"
					:aria-label="locales.closeBtn"
					@click="dialog = false"
				>
					<VIcon v-bind="options.icon">
						{{ closeIcon }}
					</VIcon>
				</VBtn>
			</VCardTitle>
			<slot />

			<div
				v-if="!props.hideActions"
				v-bind="options.actionsCtn"
				class="vd-dialog-box-actions-ctn"
			>
				<VSpacer v-bind="options.actionsSpacer" />

				<slot name="actions">
					<VBtn
						v-bind="options.cancelBtn"
						@click="$emit('cancel')"
					>
						{{ props.cancelBtnText }}
					</VBtn>

					<VBtn
						v-bind="options.confirmBtn"
						data-test-id="confirm-btn"
						@click="$emit('confirm')"
					>
						{{ props.confirmBtnText }}
					</VBtn>
				</slot>
			</div>
		</VCard>
	</VDialog>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens' as *;
.v-card__title > * {
	line-height: 1em;
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

.vd-dialog-box-actions-ctn  {
	display: flex;
	flex-direction: column-reverse;
	justify-content: stretch;
	gap: $spacing-small;
}

@media screen and (min-width: $container-mobile-max-width) {
	.vd-dialog-box-actions-ctn  {
		flex-direction: row;
	}
}
</style>
