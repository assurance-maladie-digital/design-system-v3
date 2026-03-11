import type { ValidationRule as SyValidationRule } from '@/composables/validation/useValidation'
import { computed, isRef, ref, toValue, watch, type Ref } from 'vue'
import type { ValidationRule } from 'vuetify'
import { useCustomValidation } from './useCustomValidation'
import { useVuetifyValidation as useVuetifyValidationComposable } from './useVuetifyValidation'
export interface FieldValidationProps {
	modelValue: unknown
	readonly?: boolean
	disabled?: boolean
	required?: boolean
	isValidateOnBlur?: boolean
	showSuccessMessages?: boolean
	disableErrorHandling?: boolean
	// When true (Vuetify native mode), the controller should not handle errors/successes
	useVuetifyValidation?: boolean
	label: string
	rules?: ValidationRule[]
	customRules?: SyValidationRule[]
	customWarningRules?: SyValidationRule[]
	customSuccessRules?: SyValidationRule[]
	errorMessages?: string[] | null
	warningMessages?: string[] | null
	successMessages?: string[] | null
	hasError?: boolean
	hasWarning?: boolean
	hasSuccess?: boolean
	maxErrors?: number
}

export const validationPropsDefaults = {
	readonly: false,
	disabled: false,
	required: false,
	isValidateOnBlur: true,
	showSuccessMessages: true,
	disableErrorHandling: false,
	customRules: () => [],
	customWarningRules: () => [],
	customSuccessRules: () => [],
	errorMessages: null,
	warningMessages: null,
	successMessages: null,
	useVuetifyValidation: false,
	hasError: false,
	hasWarning: false,
	hasSuccess: false,
	maxErrors: 1,
}

export function useValidation(params: {
	modelValue: Ref<unknown>
	readonly: Ref<boolean>
	disabled: Ref<boolean>
	required: Ref<boolean>
	isValidateOnBlur: Ref<boolean>
	showSuccessMessages: Ref<boolean>
	disableErrorHandling: Ref<boolean>
	label: Ref<string>
	errorMessages?: Ref<string[] | null | undefined>
	warningMessages?: Ref<string[] | null | undefined>
	successMessages?: Ref<string[] | null | undefined>
	hasErrorProp?: Ref<boolean>
	hasWarningProp?: Ref<boolean>
	hasSuccessProp?: Ref<boolean>
} & ({
	useVuetifyValidation: true
	rules: Ref<ValidationRule[] | undefined>
	customRules?: never
	customWarningRules?: never
	customSuccessRules?: never
	maxErrors?: Ref<number>
} | {
	useVuetifyValidation: false
	customRules: Ref<SyValidationRule[]>
	customWarningRules?: Ref<SyValidationRule[]>
	customSuccessRules?: Ref<SyValidationRule[]>
	rules?: never
} | {
	useVuetifyValidation: Ref<boolean>
	customRules: Ref<SyValidationRule[]>
	customWarningRules?: Ref<SyValidationRule[]>
	customSuccessRules?: Ref<SyValidationRule[]>
	rules: Ref<ValidationRule[] | undefined>
	maxErrors?: Ref<number>
})) {
	const errors = ref<string[]>([])
	const warnings = ref<string[]>([])
	const successes = ref<string[]>([])

	if (isRef(params.errorMessages)) {
		watch(params.errorMessages, (newVal) => {
			errors.value = newVal || []
		}, { immediate: true })
	}
	if (isRef(params.warningMessages)) {
		watch(params.warningMessages, (newVal) => {
			warnings.value = newVal || []
		}, { immediate: true })
	}
	if (isRef(params.successMessages)) {
		watch(params.successMessages, (newVal) => {
			successes.value = newVal || []
		}, { immediate: true })
	}

	let vuetifyValidator: ReturnType<typeof useVuetifyValidationComposable> | null = null
	if (params.useVuetifyValidation !== false) {
		vuetifyValidator = useVuetifyValidationComposable(
			params.modelValue,
			params.rules,
			params.disabled,
			errors,
			params.hasErrorProp || ref(false),
			computed(() => params.errorMessages?.value || []),
			ref(false), // focused
			params.maxErrors || ref(1), // maxErrors
			params.label,
			params.label,
			params.readonly,
			'input',
		)
	}

	const customValidator = useCustomValidation(
		params.modelValue,
		params.customRules || ref([]),
		params.customWarningRules || ref([]),
		params.customSuccessRules || ref([]),
		errors,
		warnings,
		successes,
		params.showSuccessMessages,
		params.label,
	)

	async function validate(): Promise<boolean> {
		if (params.readonly.value || params.disabled.value || params.disableErrorHandling.value) {
			errors.value = []
			warnings.value = []
			successes.value = []

			return true
		}

		if (toValue(params.useVuetifyValidation)) {
			const result = await vuetifyValidator!.validate()
			return result?.length === 0
		}

		else {
			const result = await customValidator.validate()
			return result.state.errors.length === 0
		}
	}

	const hasError = computed(() => errors.value.length > 0 || params.hasErrorProp?.value)
	const hasWarning = computed(() => warnings.value.length > 0 || params.hasWarningProp?.value)
	const hasSuccess = computed(() => (successes.value.length > 0 && !hasError.value && !hasWarning.value) || params.hasSuccessProp?.value)

	return {
		errors,
		warnings,
		successes,
		hasError,
		hasWarning,
		hasSuccess,
		validate,
	}
}
