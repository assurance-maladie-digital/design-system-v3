import type { ValidationRule as SyValidationRule } from '@/composables/validation/useValidation'
import { useValidation } from '@/composables/unifyValidation/useValidation'
import { computed, type Ref } from 'vue'
import type { ValidationRule as VuetifyValidationRule } from 'vuetify'

export function useMonthPickerValidation(args: {
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
}) {
	const allCustomRules = computed<SyValidationRule[]>(() => {
		const base: SyValidationRule[] = args.required.value
			? [{
					type: 'required',
					options: {
						message: `Le champ ${args.label.value || 'ce champ'} est requis.`,
						fieldIdentifier: args.label.value,
					},
				}]
			: []
		return [...base, ...(args.customRules.value ?? [])]
	})

	return useValidation({
		modelValue: args.modelValue,
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
