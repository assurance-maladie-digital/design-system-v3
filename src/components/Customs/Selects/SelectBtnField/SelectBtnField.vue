<script lang="ts" setup>
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import { mdiCheck } from '@mdi/js'
	import { computed, ref, watch } from 'vue'
	import { validationPropsDefaults, type FieldValidationProps } from '@/composables/unifyValidation/useValidation'
	import { useSelectBtnFieldValidation } from './composables/useSelectBtnFieldValidation'
	import type { SelectBtnItem, SelectBtnValue } from './types'

	const props = withDefaults(defineProps<{
		modelValue?: SelectBtnValue
		items?: SelectBtnItem[]
		label?: string
		ariaLabelledby?: string | undefined
		multiple?: boolean
		inline?: boolean
		helpText?: string
		hideDetails?: boolean
	} & FieldValidationProps>(), {
		modelValue: null,
		items: () => [],
		label: undefined,
		ariaLabelledby: undefined,
		multiple: false,
		inline: false,
		helpText: undefined,
		hideDetails: false,
		...validationPropsDefaults,
		isValidateOnBlur: false, // La validation se déclenche immédiatement à la sélection
	})

	const emits = defineEmits<{
		(e: 'update:modelValue', value: SelectBtnValue): void
	}>()

	const internalValue = ref<SelectBtnValue>(props.multiple ? [] : null)
	const listRef = ref<HTMLElement | null>(null)
	const optionsRef = ref<Array<HTMLElement>>([])

	const {
		focused,
		validate,
		clearValidation,
		errors,
		warnings,
		successes,
		hasError,
		hasWarning,
		hasSuccess,
	} = useSelectBtnFieldValidation(props)

	defineExpose({
		validateOnSubmit: validate,
		validate,
		clearValidation,
		errors,
		warnings,
		successes,
		hasError,
		hasWarning,
		hasSuccess,
	})

	watch(() => props.modelValue, (value) => {
		if (props.multiple) {
			internalValue.value = Array.isArray(value) ? value : []
		}
		else {
			internalValue.value = value ?? null
		}
	}, {
		immediate: true,
		deep: true,
	})

	const messages = computed<string[]>(() => {
		if (hasError.value) return errors.value
		if (hasWarning.value) return warnings.value
		if (hasSuccess.value && props.showSuccessMessages) return successes.value
		return []
	})

	const messageClass = computed(() => {
		if (hasError.value) return 'select-btn-field__message--error'
		if (hasWarning.value) return 'select-btn-field__message--warning'
		if (hasSuccess.value) return 'select-btn-field__message--success'
		return ''
	})

	const showHelpText = computed(() => !!props.helpText && messages.value.length === 0)

	const filteredItems = computed(() => props.items.filter((item) => {
		return item.value !== null && item.value !== undefined
	}))

	function isSelected(value: number | string): boolean {
		if (props.multiple) {
			return (
				Array.isArray(internalValue.value)
				&& internalValue.value.includes(value)
			)
		}
		return internalValue.value === value
	}

	function getIconStyles(item: SelectBtnItem): Record<string, string> {
		return {
			visibility: isSelected(item.value) ? 'visible' : 'hidden',
		}
	}

	function getNewValue(item: SelectBtnItem): SelectBtnValue {
		if (props.multiple) {
			const typedValue = Array.isArray(internalValue.value)
				? internalValue.value
				: []

			// if the item is unique, select only it
			if (item.unique && !typedValue.includes(item.value)) {
				return [item.value]
			}

			// If the item is not already selected, add it to the array
			if (!typedValue.includes(item.value)) {
				// remove unique items from the old value
				const oldItems = typedValue.filter(
					(oldItem) => {
						const completeItem = filteredItems.value.find(
							filteredItem => filteredItem.value === oldItem,
						)
						return completeItem && !completeItem.unique
					},
				)

				return [...oldItems, item.value]
			}

			// If the item is already selected, remove it from the array
			return typedValue.filter(value => value !== item.value)
		}

		// If the item is already selected, deselect it
		if (internalValue.value === item.value) {
			return null
		}

		// Select the item
		return item.value
	}

	function toggleItem(item: SelectBtnItem): void {
		if (props.readonly || props.disabled) {
			return
		}

		internalValue.value = getNewValue(item)
		emits('update:modelValue', internalValue.value)
	}

	const focusedIndex = ref<number>(-1)

	/*
	 * Get the current index of the active item
	 * The active item depends on whether the select is multiple or not
	 * If multiple, the active item is the focused item
	 * If not multiple, the active item is the selected item
	*/
	function getCurrentIndex(): number {
		if (props.multiple) {
			const current = document.activeElement as HTMLElement
			return optionsRef.value.findIndex(item => item === current)
		}
		else {
			return optionsRef.value.findIndex(item => item.getAttribute('aria-selected') === 'true')
		}
	}

	function focusPrevious(): void {
		const index = getCurrentIndex()
		if (index > 0) {
			focusedIndex.value = index - 1
			optionsRef.value[index - 1]?.focus()
		}
		else {
			focusedIndex.value = optionsRef.value.length - 1
			optionsRef.value[optionsRef.value.length - 1]?.focus()
		}

		// auto select the focused item if not multiple
		const item = filteredItems.value[index > 0 ? index - 1 : optionsRef.value.length - 1]
		if (!props.multiple && item && !isSelected(item.value)) {
			toggleItem(item)
		}
	}

	function focusNext(): void {
		const index = getCurrentIndex()
		if (index < optionsRef.value.length - 1) {
			focusedIndex.value = index + 1
			optionsRef.value[index + 1]!.focus()
		}
		else {
			focusedIndex.value = 0
			optionsRef.value[0]!.focus()
		}

		// auto select the focused item if not multiple
		const item = filteredItems.value[index < optionsRef.value.length - 1 ? index + 1 : 0]
		if (!props.multiple && item && !isSelected(item.value)) {
			toggleItem(item)
		}
	}

	function focusFirst(): void {
		focusedIndex.value = 0
		optionsRef.value[0]?.focus()
	}

	function focusLast(): void {
		focusedIndex.value = optionsRef.value.length - 1
		optionsRef.value[optionsRef.value.length - 1]?.focus()
	}

	function handleFocusIn(): void {
		focused.value = true
	}

	function handleBlur(): void {
		if ((!listRef.value?.contains(document.activeElement) || !(listRef.value === document.activeElement))) {
			focusedIndex.value = -1
		}
		if (!listRef.value?.contains(document.activeElement)) {
			focused.value = false
		}
	}

	function handleInitFocus(e: FocusEvent): void {
		// Don't auto-select if focus was caused by mouse interaction
		if (isMouseInteraction.value) {
			const element = e.target as HTMLElement
			focusedIndex.value = optionsRef.value.findIndex(item => item === element)
			return
		}

		const element = e.target as HTMLElement
		const index = optionsRef.value.findIndex(item => item === element)
		focusedIndex.value = index
		const item = filteredItems.value[index]
		// Only auto-select on keyboard focus (Tab or arrow keys)
		if (!props.multiple && !internalValue.value && item) {
			toggleItem(item)
		}
	}

	const isMouseInteraction = ref(false)

	function handleMouseDown(): void {
		isMouseInteraction.value = true
	}

	function handleMouseUp(): void {
		isMouseInteraction.value = false
	}
</script>

<template>
	<div
		class="select-btn-field"
	>
		<ul
			ref="listRef"
			class="select-btn-field__options"
			:class="{
				'select-btn-field__options--inline': props.inline,
				'select-btn-field__options--column': !props.inline,
				'select-btn-field__options--error': hasError,
				'select-btn-field__options--warning': hasWarning && !hasError,
				'select-btn-field__options--success': hasSuccess && !hasError && !hasWarning,
				'select-btn-field__options--readonly': readonly,
				'select-btn-field__options--disabled': disabled,
			}"
			:aria-label="props.label"
			:aria-labelledby="props.ariaLabelledby ?? undefined"
			role="listbox"
			:aria-orientation="props.inline ? 'horizontal' : 'vertical'"
			:aria-multiselectable="props.multiple ? 'true' : 'false'"
			:aria-invalid="hasError ? 'true' : 'false'"
			:aria-required="props.required ? 'true' : undefined"
			:aria-readonly="readonly ? 'true' : 'false'"
			:aria-disabled="disabled ? 'true' : undefined"
			:tabindex="focusedIndex === -1 ? '0' : '-1'"
			@focusin="handleFocusIn"
			@focusout="handleBlur"
			@keydown.left.prevent="focusPrevious"
			@keydown.right.prevent="focusNext"
			@keydown.up.prevent="focusPrevious"
			@keydown.down.prevent="focusNext"
			@keydown.home.prevent="focusFirst"
			@keydown.end.prevent="focusLast"
		>
			<li
				v-for="(item, index) in filteredItems"
				:key="`select-btn-field-item-${index}`"
				ref="optionsRef"
				v-ripple="!props.readonly && !props.disabled"
				class="select-btn-field__item"
				:class="{
					'select-btn-field__item--selected': isSelected(item.value),
				}"
				role="option"
				:tabindex="index === focusedIndex ? '0' : '-1'"
				:aria-selected="props.multiple ? undefined : (isSelected(item.value) ? 'true' : 'false')"
				:aria-checked="props.multiple ? (isSelected(item.value) ? 'true' : 'false') : undefined"
				@keydown.space.prevent="toggleItem(item)"
				@mousedown="handleMouseDown"
				@mouseup="handleMouseUp"
				@click="toggleItem(item)"
				@focus="handleInitFocus"
			>
				<div class="select-btn-field__item-content">
					<span class="text-body-1">
						{{ item.text }}
					</span>

					<SyIcon
						:icon="mdiCheck"
						:decorative="true"
						:style="getIconStyles(item)"
					/>
				</div>
			</li>
		</ul>

		<div
			v-if="!props.hideDetails && (messages.length > 0 || showHelpText)"
			class="select-btn-field__messages px-3 mt-2"
		>
			<template v-if="messages.length > 0">
				<p
					v-for="(message, index) in messages"
					:key="`select-btn-field-message-${index}`"
					class="select-btn-field__message v-messages mb-0 opacity-100"
					:class="messageClass"
				>
					{{ message }}
				</p>
			</template>

			<p
				v-else-if="showHelpText"
				class="select-btn-field__help-text mb-0"
			>
				{{ props.helpText }}
			</p>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.select-btn-field__options {
	display: flex;
	list-style-type: none;
	padding: 0;
	margin: 0;
	gap: var(--v-gap-2);

	&:focus-visible {
		outline: 2px solid rgb(var(--v-theme-primary));
		outline-offset: 3px;
		border-radius: var(--v-radius-rounded);
	}
}

.select-btn-field__options--inline {
	flex-flow: row wrap;
	width: fit-content;
	max-width: 100%;
}

.select-btn-field__options--column {
	flex-direction: column;
}

.select-btn-field__item {
	padding: 8px 16px;
	color: rgb(var(--v-theme-primary));
	border: 1px solid rgb(var(--v-theme-primary));
	min-height: 56px;
	border-radius: var(--v-radius-rounded);
	cursor: pointer;
	position: relative;
	transition: background-color 0.2s, color 0.2s;
	background-color: rgb(var(--v-theme-surface));

	&--selected {
		background-color: rgb(var(--v-theme-primary));
		color: rgb(var(--v-theme-onPrimary));
	}

	&:focus-visible {
		outline: 2px solid rgb(var(--v-theme-primary));
		outline-offset: 3px;
	}

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		transition: background-color 0.2s;
		border-radius: var(--v-radius-rounded);
	}

	&:hover::before {
		/* stylelint-disable-next-line custom-property-pattern */
		background-color: rgba(var(--v-theme-interactionDarkHover), 0.2);
	}

	&--selected:hover::before {
		/* stylelint-disable-next-line custom-property-pattern */
		background-color: rgba(var(--v-theme-interactionLightenHover), 0.2);
	}
}

.select-btn-field__item-content {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 5px 0;
	gap: 4px;
}

// États de validation :
// - item non sélectionné : contour + texte à la couleur de l'état ;
// - item sélectionné : fond rempli de la couleur de l'état, texte et icône en blanc.
.select-btn-field__options--error .select-btn-field__item:not(.select-btn-field__item--selected) {
	color: rgb(var(--v-theme-error));
	border-color: rgb(var(--v-theme-error));
}

.select-btn-field__options--error .select-btn-field__item--selected {
	background-color: rgb(var(--v-theme-error));
	border-color: rgb(var(--v-theme-error));
	color: rgb(var(--v-theme-onPrimary));
}

.select-btn-field__options--warning .select-btn-field__item:not(.select-btn-field__item--selected) {
	color: rgb(var(--v-theme-onWarningVariant));
	border-color: rgb(var(--v-theme-onWarningVariant));
}

.select-btn-field__options--warning .select-btn-field__item--selected {
	background-color: rgb(var(--v-theme-onWarningVariant));
	border-color: rgb(var(--v-theme-onWarningVariant));
	color: rgb(var(--v-theme-onPrimary));
}

.select-btn-field__options--success .select-btn-field__item:not(.select-btn-field__item--selected) {
	color: rgb(var(--v-theme-onSuccessVariant));
	border-color: rgb(var(--v-theme-onSuccessVariant));
}

.select-btn-field__options--success .select-btn-field__item--selected {
	background-color: rgb(var(--v-theme-onSuccessVariant));
	border-color: rgb(var(--v-theme-onSuccessVariant));
	color: rgb(var(--v-theme-onPrimary));
}

.select-btn-field__options--disabled {
	opacity: var(--v-disabled-opacity, 0.38);
	pointer-events: none;
}

.select-btn-field__messages {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.select-btn-field__message--error {
	color: rgb(var(--v-theme-error));
}

.select-btn-field__message--warning {
	color: rgb(var(--v-theme-onWarningVariant));
}

.select-btn-field__message--success {
	color: rgb(var(--v-theme-onSuccessVariant));
}

.select-btn-field__help-text {
	color: rgba(var(--v-theme-onSurface), var(--v-medium-emphasis-opacity));
	font-size: var(--v-fontSize-liensEtLibelles);
	line-height: 1.2;
}
</style>
