import { type ValidationRule } from '@/composables/validation/useValidation'
import { computed, ref, type Ref } from 'vue'
import { useValidation } from '@/composables/unifyValidation/useValidation'

export function usePhoneFieldValidation(params: {
	modelValue: Ref<string>
	readonly: Ref<boolean>
	disabled: Ref<boolean>
	required: Ref<boolean>
	counter: Ref<number>
	label: Ref<string>
	phoneFieldIdentifier: Ref<string>
	shouldDisableErrorHandling: Ref<boolean>
	hasError: Ref<boolean>
	hasWarning: Ref<boolean>
	hasSuccess: Ref<boolean>
	showSuccessMessages: Ref<boolean>
	disableErrorHandling: Ref<boolean>
	isValidateOnBlur: Ref<boolean>
	focused: Ref<boolean>
	customRules: Ref<ValidationRule[]>
	warningRules?: Ref<ValidationRule[]>
	successRules?: Ref<ValidationRule[]>
	rules?: Ref<((value: string) => true | string)[]>
}) {
	const validationRules = computed<ValidationRule[]>(() => {
		const rules = [{
			type: 'exactLength',
			options: {
				length: params.counter.value,
				ignoreSpace: true,
				message: `Le numéro de téléphone doit contenir ${params.counter.value} chiffres.`,
				successMessage: `Le champ ${params.phoneFieldIdentifier.value} est valide.`,
				fieldIdentifier: params.phoneFieldIdentifier.value,
			},
		}] as ValidationRule[]

		if (params.required.value) {
			rules.unshift({
				type: 'required',
				options: {
					length: params.counter.value,
					ignoreSpace: true,
					message: `Le champ ${params.phoneFieldIdentifier.value} est requis.`,
					fieldIdentifier: params.phoneFieldIdentifier.value,
				},
			})
		}

		return rules
	})

	const { hasError, hasWarning, hasSuccess, errors, warnings, successes } = useValidation({
		modelValue: params.modelValue,
		readonly: params.readonly,
		disabled: params.disabled,
		required: params.required,
		isValidateOnBlur: params.isValidateOnBlur,
		showSuccessMessages: params.showSuccessMessages,
		disableErrorHandling: params.disableErrorHandling,
		label: params.label,
		focused: params.focused,
		customRules: params.customRules,
		customWarningRules: params.warningRules ?? ref([]),
		customSuccessRules: params.successRules ?? ref([]),
		useVuetifyValidation: ref(false),
		rules: params.rules ?? ref(undefined),

	})

	const iconColor = computed(() => {
		if (params.shouldDisableErrorHandling.value) return '#222324'
		if (hasError.value) return 'error'
		if (hasWarning.value) return 'warning'
		if (hasSuccess.value) return 'success'
		return '#222324'
	})

	return {
		errors,
		warnings,
		successes,
		hasError,
		hasWarning,
		hasSuccess,
		validationRules,
		iconColor,
	}
}
