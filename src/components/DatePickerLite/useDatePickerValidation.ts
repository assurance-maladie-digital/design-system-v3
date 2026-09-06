import type { ValidationRule as SyValidationRule } from '@/composables/validation/useValidation'
import { useValidation } from '@/composables/unifyValidation/useValidation'
import { computed, type Ref } from 'vue'
import type { ValidationRule as VuetifyValidationRule } from 'vuetify'
import type { locales } from './locales'

export function useDatePickerValidation(args: {
	modelValue: Ref<unknown>
	readonly: Ref<boolean>
	disabled: Ref<boolean>
	required: Ref<boolean>
	isValidateOnBlur: Ref<boolean>
	showSuccessMessages: Ref<boolean>
	disableErrorHandling: Ref<boolean>
	useVuetifyValidation: Ref<boolean>
	label: Ref<string | undefined>
	rules: Ref<VuetifyValidationRule[] | undefined>
	customRules: Ref<SyValidationRule[]>
	customWarningRules?: Ref<SyValidationRule[]>
	customSuccessRules?: Ref<SyValidationRule[]>
	errorMessages?: Ref<string[] | null | undefined>
	warningMessages?: Ref<string[] | null | undefined>
	successMessages?: Ref<string[] | null | undefined>
	hasErrorProp?: Ref<boolean>
	hasWarningProp?: Ref<boolean>
	hasSuccessProp?: Ref<boolean>
	maxErrors?: Ref<number>
	focused: Ref<boolean>
	locales: Ref<typeof locales>
	onReset: () => void
}) {
	const allCustomRules = computed<SyValidationRule[]>(() => {
		const base: SyValidationRule[] = args.required.value
			? [{
					type: 'required',
					options: {
						message: args.locales.value.fieldRequired(args.label.value),
						fieldIdentifier: args.label.value,
					},
				}]
			: []
		return [...base, ...(args.customRules.value ?? [])]
	})

	/**
	 * The validation composable mutates directly the modelValue when clear is called at the level of the form,
	 * since we do not use the modelValue of the component to validate but the textfield value
	 * we need to intercept the clear action and reset ourselves the model of the component.
	 */
	const validationModel = computed({
		get: () => args.modelValue.value,
		set: (value) => {
			if (value == null) {
				args.onReset()
			}
			else {
				// The validation should never set the modelValue to a non null value.
				throw new Error('DatePickerLite: In the validation pipeline modelValue can only be set to null or undefined to reset the value.')
			}
		},
	})

	return useValidation({
		modelValue: validationModel,
		readonly: args.readonly,
		disabled: args.disabled,
		required: args.required,
		isValidateOnBlur: args.isValidateOnBlur,
		showSuccessMessages: args.showSuccessMessages,
		disableErrorHandling: args.disableErrorHandling,
		useVuetifyValidation: args.useVuetifyValidation,
		label: args.label,
		rules: args.rules,
		customRules: allCustomRules,
		customWarningRules: args.customWarningRules,
		customSuccessRules: args.customSuccessRules,
		errorMessages: args.errorMessages,
		warningMessages: args.warningMessages,
		successMessages: args.successMessages,
		hasErrorProp: args.hasErrorProp,
		hasWarningProp: args.hasWarningProp,
		hasSuccessProp: args.hasSuccessProp,
		maxErrors: args.maxErrors,
		focused: args.focused,
	})
}
