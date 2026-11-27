import { computed, useAttrs, type ComputedRef, type Ref } from 'vue'
import { useTextField, type TextFieldProps } from '@/composables/useTextField'

/** Validation state exposed by the picker validation composables (errors, warnings, successes) */
export interface PickerValidationState {
	errors: Ref<string[]>
	warnings: Ref<string[]>
	successes: Ref<string[]>
	hasError: Ref<boolean>
	hasWarning: Ref<boolean>
	hasSuccess: Ref<boolean>
}

/** Props shared by picker text inputs: forwarded attrs, field props and validation state */
export type PickerInputProps =
	TextFieldProps
	& {
		required?: boolean
		displayAsterisk?: boolean
		showSuccessMessages?: boolean
		errorMessages: string[]
		warningMessages: string[]
		successMessages: string[]
		hasError: boolean
		hasWarning: boolean
		hasSuccess: boolean
	}
	// Attributes forwarded by the root (classes, listeners, etc.)
	& Record<string, unknown>

/**
 * Builds the props to `v-bind` on a picker text input: attrs forwarded by the root
 * component, field props and validation state.
 */
export function usePickerInputProps(
	props: TextFieldProps & { required?: boolean, displayAsterisk?: boolean, showSuccessMessages?: boolean },
	validation: PickerValidationState,
): ComputedRef<PickerInputProps> {
	const attrs = useAttrs()
	const fieldProps = useTextField(props)
	return computed(() => ({
		...attrs,
		...fieldProps.value,
		required: props.required,
		displayAsterisk: props.displayAsterisk,
		errorMessages: validation.errors.value,
		warningMessages: validation.warnings.value,
		successMessages: validation.successes.value,
		hasError: validation.hasError.value,
		hasWarning: validation.hasWarning.value,
		hasSuccess: validation.hasSuccess.value,
		showSuccessMessages: props.showSuccessMessages,
	}))
}
