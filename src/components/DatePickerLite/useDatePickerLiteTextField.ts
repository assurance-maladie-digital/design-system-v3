import { computed, ref, useAttrs, useSlots, type ComputedRef, type Ref, type Slot } from 'vue'
import { useTextField, type TextFieldProps } from '@/composables/useTextField'
import type {
	DatePickerLiteInputProps,
	DatePickerLiteInputSlotProps,
	DatePickerLiteMode,
} from './types'

/** Slots of the root component forwarded to the text input */
const TEXT_FIELD_SLOT_NAMES = new Set(['default', 'prepend', 'append', 'prepend-inner', 'append-inner', 'details'])

/** Validation state exposed by `useDatePickerValidation` */
interface DatePickerLiteValidationState {
	errors: Ref<string[]>
	warnings: Ref<string[]>
	successes: Ref<string[]>
	hasError: Ref<boolean>
	hasWarning: Ref<boolean>
	hasSuccess: Ref<boolean>
}

interface UseDatePickerLiteTextFieldOptions {
	props: TextFieldProps & {
		required?: boolean
		displayAsterisk?: boolean
		showSuccessMessages?: boolean
		inputFormat: string
		separator: string
		mode: DatePickerLiteMode
	}
	locale: Ref<string>
	/** Shared with the validation composable */
	focused: Ref<boolean>
	/** Text of the field (default input via update:textValue, custom slot via updateTextValue), kept in sync with the model by `useDatePickerLiteTextSync` */
	textValue: Ref<string | null | undefined>
	validation: DatePickerLiteValidationState
}

/**
 * Centralizes the text field wiring of DatePickerLite (assembly only — no state
 * effect; the text↔model sync lives in `useDatePickerLiteTextSync`):
 * - `inputProps`: props to `v-bind` on the text input (attrs forwarded by the root,
 *   field props, validation state and the picker-specific props)
 * - `inputSlotProps`: props of the `input` slot (text value, focus, custom toggle button)
 * - `textFieldSlots`: root slots forwarded to the text input, visual-picker slots excluded
 */
export function useDatePickerLiteTextField(options: UseDatePickerLiteTextFieldOptions): {
	/** Props to `v-bind` on the text input (attrs forwarded by the root, field props, validation state and the picker-specific props) */
	inputProps: ComputedRef<DatePickerLiteInputProps>
	/** Props of the `input` slot (text value, focus handling, custom toggle button) */
	inputSlotProps: ComputedRef<DatePickerLiteInputSlotProps>
	/** Opening button tracked by a custom `input` slot (`:ref="toggleBtnRef"`) */
	customToggleBtn: Ref<HTMLButtonElement | null>
	/** Root slots forwarded to the text input, visual-picker slots excluded */
	textFieldSlots: ComputedRef<Record<string, Slot | undefined>>
} {
	const attrs = useAttrs()
	const slots = useSlots()
	const fieldProps = useTextField(options.props)
	const { errors, warnings, successes, hasError, hasWarning, hasSuccess } = options.validation

	const inputProps = computed<DatePickerLiteInputProps>(() => ({
		...attrs,
		...fieldProps.value,
		inputFormat: options.props.inputFormat,
		locale: options.locale.value,
		mode: options.props.mode,
		separator: options.props.separator,
		required: options.props.required,
		displayAsterisk: options.props.displayAsterisk,
		showSuccessMessages: options.props.showSuccessMessages,
		errorMessages: errors.value,
		warningMessages: warnings.value,
		successMessages: successes.value,
		hasError: hasError.value,
		hasWarning: hasWarning.value,
		hasSuccess: hasSuccess.value,
	}))

	const customToggleBtn = ref<HTMLButtonElement | null>(null)

	const inputSlotProps = computed<DatePickerLiteInputSlotProps>(() => ({
		inputProps: inputProps.value,
		textValue: options.textValue.value,
		updateTextValue: (value) => {
			options.textValue.value = value
		},
		setFocused: (value) => {
			options.focused.value = value
		},
		toggleBtnRef: customToggleBtn,
	}))

	const textFieldSlots = computed(() => Object.fromEntries(
		Object.entries(slots).filter(([name]) => TEXT_FIELD_SLOT_NAMES.has(name)),
	))

	return {
		inputProps,
		inputSlotProps,
		customToggleBtn,
		textFieldSlots,
	}
}
