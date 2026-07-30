import { mdiAlertCircle, mdiAlert, mdiCheck } from '@mdi/js'
import { computed, ref, type Ref } from 'vue'
import type { ValidationRule as VuetifyValidationRule } from 'vuetify'
import type { locales as defaultLocales } from './locales'
import type { ValidationRule } from '@/composables/validation/useValidation'
import { useValidation } from '@/composables/unifyValidation/useValidation'

export function usePasswordField(params: {
	password: Ref<string | null>
	focused: Ref<boolean>
	readonly: Ref<boolean>
	disabled: Ref<boolean>
	label: Ref<string>
	required: Ref<boolean>
	isValidateOnBlur: Ref<boolean>
	showSuccessMessages: Ref<boolean>
	disableErrorHandling: Ref<boolean>
	useVuetifyValidation: Ref<boolean>
	rules: Ref<VuetifyValidationRule[] | undefined>
	customRules: Ref<ValidationRule[] | undefined>
	customWarningRules: Ref<ValidationRule[] | undefined>
	customSuccessRules: Ref<ValidationRule[] | undefined>
	errorMessages: Ref<string[] | null | undefined>
	warningMessages: Ref<string[] | null | undefined>
	successMessages: Ref<string[] | null | undefined>
	hasErrorProp: Ref<boolean | undefined>
	hasWarningProp: Ref<boolean | undefined>
	hasSuccessProp: Ref<boolean | undefined>
	maxErrors: Ref<number | undefined>
	locales: Ref<typeof defaultLocales>
}) {
	const alertMessage = ref('')

	const allCustomRules = computed<ValidationRule[]>(() => {
		const rules: ValidationRule[] = []

		if (params.required.value) {
			rules.push({
				type: 'required',
				options: {
					message: params.locales.value.required,
					fieldIdentifier: params.label.value || 'password',
				},
			})
		}

		return [...rules, ...(params.customRules.value || [])]
	})

	const { errors, warnings, successes, hasError, hasWarning, hasSuccess, validate, clearValidation } = useValidation({
		modelValue: params.password,
		readonly: params.readonly,
		disabled: params.disabled,
		required: params.required,
		isValidateOnBlur: params.isValidateOnBlur,
		showSuccessMessages: params.showSuccessMessages,
		disableErrorHandling: params.disableErrorHandling,
		useVuetifyValidation: params.useVuetifyValidation,
		label: params.label,
		rules: params.rules,
		customRules: allCustomRules,
		customWarningRules: computed<ValidationRule[]>(() => params.customWarningRules.value || []),
		customSuccessRules: computed<ValidationRule[]>(() => params.customSuccessRules.value || []),
		errorMessages: params.errorMessages,
		warningMessages: params.warningMessages,
		successMessages: params.successMessages,
		hasErrorProp: computed<boolean>(() => params.hasErrorProp.value ?? false),
		hasWarningProp: computed<boolean>(() => params.hasWarningProp.value ?? false),
		hasSuccessProp: computed<boolean>(() => params.hasSuccessProp.value ?? false),
		maxErrors: computed<number>(() => params.maxErrors.value ?? 1),
		focused: params.focused,
	})

	const validationIcon = computed(() => {
		if (hasError.value) return mdiAlertCircle
		if (hasWarning.value) return mdiAlert
		if (hasSuccess.value) return mdiCheck
		return ''
	})

	const validationColor = computed(() => {
		if (hasError.value) return 'error'
		if (hasWarning.value) return 'onWarningVariant'
		if (hasSuccess.value) return 'onSuccessVariant'
		return 'rgb(var(--v-theme-onSurface))'
	})

	return {
		alertMessage,
		errors,
		warnings,
		successes,
		hasError,
		hasWarning,
		hasSuccess,
		validationIcon,
		validationColor,
		validate,
		clearValidation,
	}
}
