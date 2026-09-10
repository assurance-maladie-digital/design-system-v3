<script lang="ts" setup>
	/**
	 * Handle the validation and the syncronisation beweens the sub component
	 * Do not handle :
	 * - The text input format
	 * - The visual rendering
	 */

	import { computed, nextTick, provide, readonly as readonlyState, ref, toRef, useAttrs, watch, type ComponentPublicInstance } from 'vue'
	import DatePickerLiteInput from './DatePickerLiteText/DatePickerLiteInput.vue'
	import DatePickerLiteVisual from './DatePickerLiteVisual/DatePickerLiteVisual.vue'
	import { locales as defaultLocales } from './locales'
	import { calendarLocalesKey } from '@/components/Common/Calendar/locales'
	import { defaultTextFieldProps, useTextField } from '@/components/Common/Calendar/useTextField'
	import { defaultDatePickerLiteVisualProps } from './DatePickerLiteVisual/DatePickerLiteVisualProps'
	import { useDatePickerValidation } from './useDatePickerValidation'
	import { validationPropsDefaults } from '@/composables/unifyValidation/useValidation'
	import { useLocales } from '@/composables/useLocales'
	import type { DatePickerLiteInputProps, DatePickerLiteInputSlotProps, DatePickerLiteProps, DatePickerLiteRange } from './types'

	// Attributes (including listeners such as @input) are forwarded to the field through
	// inputProps; otherwise they would also land on the root div (duplicate via bubbling)
	defineOptions({ inheritAttrs: false })

	// `modelValue` is declared by defineModel; the rest by defineProps
	const props = withDefaults(defineProps<Omit<DatePickerLiteProps, 'modelValue'>>(), {
		locales: () => ({}),
		helpText: 'Format JJ/MM/AAAA',
		...validationPropsDefaults,
		...defaultDatePickerLiteVisualProps,
		...defaultTextFieldProps,
		mode: 'single',
		disabled: false,
		readonly: false,
		displayAsterisk: false,
	})

	const locales = useLocales(defaultLocales, () => props.locales)

	provide(calendarLocalesKey, locales)

	const emits = defineEmits<{
		(e: 'update:open', value: boolean): void
	}>()

	const attrs = useAttrs()
	const textInput = ref<ComponentPublicInstance<typeof DatePickerLiteInput> | null>(null)
	// Opening button tracked by the `input` slot (`:ref="toggleBtnRef"`)
	const customToggleBtn = ref<HTMLButtonElement | null>(null)
	// The menu anchors to the `input` slot wrapper (full width), with the fallback included
	const customInputEl = ref<HTMLElement | null>(null)
	const toggleBtn = computed(() => customToggleBtn.value ?? textInput.value?.toggleBtn ?? null)

	// defineModel handles controlled/uncontrolled state without echoing back to the parent;
	// readonly/disabled remain enforced at the source (DatePickerLiteVisual, readonly field)
	// Single/range normalization lives inside DatePickerLiteInput, keyed by `mode`
	const internalValue = defineModel<Date | DatePickerLiteRange>()

	watch(internalValue, async () => {
		// Wait for DatePickerLiteInput to update textValue before validating
		await nextTick()
		validate()
	})

	// Raw text content, used as the validation base (an incomplete entry never parses to Date).
	// Default value comes from the exposed ref on DatePickerLiteInput (replaces update:textValue).
	// A custom input owns its text representation and reports it through updateTextValue.
	const slotTextValue = ref<string | undefined>(undefined)
	const textValue = computed(() => textInput.value ? textInput.value.textValue : slotTextValue.value)

	const focused = ref(false)

	const { errors, warnings, successes, hasError, hasWarning, hasSuccess, validate, clearValidation } = useDatePickerValidation({
		modelValue: textValue,
		onReset: () => internalValue.value = undefined,
		readonly: toRef(props, 'readonly'),
		disabled: toRef(props, 'disabled'),
		required: toRef(props, 'required'),
		isValidateOnBlur: toRef(props, 'isValidateOnBlur'),
		showSuccessMessages: toRef(props, 'showSuccessMessages'),
		disableErrorHandling: toRef(props, 'disableErrorHandling'),
		useVuetifyValidation: toRef(props, 'useVuetifyValidation'),
		label: toRef(props, 'label'),
		rules: toRef(props, 'rules'),
		customRules: toRef(props, 'customRules'),
		customWarningRules: toRef(props, 'customWarningRules'),
		customSuccessRules: toRef(props, 'customSuccessRules'),
		errorMessages: toRef(props, 'errorMessages'),
		warningMessages: toRef(props, 'warningMessages'),
		successMessages: toRef(props, 'successMessages'),
		hasErrorProp: toRef(props, 'hasError'),
		hasWarningProp: toRef(props, 'hasWarning'),
		hasSuccessProp: toRef(props, 'hasSuccess'),
		maxErrors: toRef(props, 'maxErrors'),
		focused,
		locales,
	})

	const inputProps = computed<DatePickerLiteInputProps>(() => ({
		...attrs,
		...useTextField(props).value,
		required: props.required,
		displayAsterisk: props.displayAsterisk,
		errorMessages: errors.value,
		warningMessages: warnings.value,
		successMessages: successes.value,
		hasError: hasError.value,
		hasWarning: hasWarning.value,
		hasSuccess: hasSuccess.value,
		showSuccessMessages: props.showSuccessMessages,
	}))

	const inputSlotProps = computed<DatePickerLiteInputSlotProps>(() => ({
		mode: props.mode,
		modelValue: internalValue.value,
		updateModelValue: (value: Date | DatePickerLiteRange | undefined) => {
			internalValue.value = value
		},
		inputProps: inputProps.value,
		updateTextValue: (value: string | undefined) => {
			slotTextValue.value = value
		},
		setFocused: (value: boolean) => {
			focused.value = value
		},
		toggleBtnRef: customToggleBtn,
	}))

	defineSlots<{
		input(slotProps: DatePickerLiteInputSlotProps): void
	}>()

	defineExpose({
		errors: readonlyState(errors),
		warnings: readonlyState(warnings),
		successes: readonlyState(successes),
		hasError,
		hasWarning,
		hasSuccess,
		validateOnSubmit: validate,
		clearValidation,
	})
</script>

<template>
	<div class="date-picker-lite">
		<div
			ref="customInputEl"
			class="date-picker-lite__input"
		>
			<slot
				name="input"
				v-bind="inputSlotProps"
			>
				<DatePickerLiteInput
					ref="textInput"
					v-model="internalValue"
					:mode="props.mode"
					v-bind="inputProps"
					@focus="focused = true"
					@blur="focused = false"
				/>
			</slot>
		</div>
		<DatePickerLiteVisual
			v-model="internalValue"
			:text-input="customInputEl"
			:toggle-btn
			:mode="props.mode"
			:min-year
			:max-year
			:years-order
			:initial-view
			:disabled
			:readonly
			@update:open="emits('update:open', $event)"
		/>
	</div>
</template>
