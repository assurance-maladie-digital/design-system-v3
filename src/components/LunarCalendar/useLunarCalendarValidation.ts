import { computed, ref, toValue, type Ref } from 'vue'
import { useValidation, type ValidationRule } from '@/composables/unifyValidation/useValidation'
import type { LunarCalendarProps } from './types'
import { locales as defaultLocales } from './locales'

function getYearFromModel(model: string): number | null {
	const parts = model.split('/')
	if (parts.length !== 3 || parts[2]?.length !== 4 || isNaN(Number(parts[2]))) {
		return null
	}
	return Number(parts[2])
}

export function useLunarCalendarValidation(modelValue: Ref<string | undefined>, props: LunarCalendarProps) {
	const focused = ref(false)
	const locales = props.locales ?? defaultLocales

	const customRules = computed<ValidationRule[]>(() => {
		const rules: ValidationRule[] = []

		rules.push({
			type: 'custom',
			options: {
				validate: (value: string) => {
					if (!value) return true
					const regex = /^\d{2}\/\d{2}\/\d{4}$/
					return regex.test(value)
				},
				message: locales.invalidDate,
			},
		})

		const minYear = toValue(props.minYear)
		const maxYear = toValue(props.maxYear)

		if (minYear !== undefined && maxYear !== undefined) {
			rules.push({
				type: 'custom',
				options: {
					validate: (value: string) => {
						const year = getYearFromModel(value)
						if (year === null) return true
						return year >= minYear && year <= maxYear
					},
					message: locales.yearBetween(minYear, maxYear),
				},
			})
		}
		else if (minYear !== undefined) {
			rules.push({
				type: 'custom',
				options: {
					validate: (value: string) => {
						const year = getYearFromModel(value)
						if (year === null) return true
						return year >= minYear
					},
					message: locales.yearMin(minYear),
				},
			})
		}
		else if (maxYear !== undefined) {
			rules.push({
				type: 'custom',
				options: {
					validate: (value: string) => {
						const year = getYearFromModel(value)
						if (year === null) return true
						return year <= maxYear
					},
					message: locales.yearMax(maxYear),
				},
			})
		}

		return rules
	})

	const defaultRules = computed<ValidationRule[]>(() => props.required
		? [{
				type: 'required',
				options: {
					message: locales.requiredField(props.label),
					fieldIdentifier: props.label,
				},
			}]
		: [],
	)

	const { validate, clearValidation, errors, warnings, successes, hasError, hasWarning, hasSuccess } = useValidation({
		modelValue,
		readonly: computed(() => props.readonly ?? false),
		disabled: computed(() => props.disabled ?? false),
		required: computed(() => props.required ?? false),
		isValidateOnBlur: computed(() => props.isValidateOnBlur ?? true),
		showSuccessMessages: computed(() => props.showSuccessMessages ?? false),
		disableErrorHandling: computed(() => props.disableErrorHandling ?? false),
		useVuetifyValidation: false,
		label: computed(() => props.label),
		customRules: computed(() => [...defaultRules.value, ...customRules.value]),
		customWarningRules: computed(() => props.customWarningRules ?? []),
		customSuccessRules: computed(() => props.customSuccessRules ?? []),
		errorMessages: computed(() => props.errorMessages ?? []),
		warningMessages: computed(() => props.warningMessages ?? []),
		successMessages: computed(() => props.successMessages ?? []),
		hasErrorProp: computed(() => props.hasError ?? false),
		hasWarningProp: computed(() => props.hasWarning ?? false),
		hasSuccessProp: computed(() => props.hasSuccess ?? false),
		maxErrors: computed(() => props.maxErrors ?? 1),
		focused,
	})

	return {
		focused,
		validate,
		clearValidation,
		errors,
		warnings,
		successes,
		hasError,
		hasWarning,
		hasSuccess,
	}
}
