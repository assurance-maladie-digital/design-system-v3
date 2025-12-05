import type { ValidationRule } from '@/composables/validation/useValidation'
import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from 'vue'

export function useLunarCalendarRules(
	successMessage: MaybeRefOrGetter<string | undefined>,
	minYear: MaybeRefOrGetter<number | undefined>,
	maxYear: MaybeRefOrGetter<number | undefined>,
): { rules: ComputedRef<ValidationRule[]> } {
	const rules = computed(() => {
		if (toValue(minYear) && toValue(maxYear)) {
			const rule: ValidationRule = {
				type: 'custom',
				options: {
					validate: (value: string) => {
						const year = getYearFromModel(value)
						if (year === null) {
							return true
						}
						return year >= toValue(minYear as number) && year <= toValue(maxYear as number)
					},
					message: `L'année doit être comprise entre ${toValue(minYear)} et ${toValue(maxYear)}.`,
					successMessage: toValue(successMessage),
				},
			}
			return [rule]
		}
		else if (toValue(minYear)) {
			const rule: ValidationRule = {
				type: 'custom',
				options: {
					validate: (value: string) => {
						const year = getYearFromModel(value)
						if (year === null) {
							return true
						}
						return year >= toValue(minYear as number)
					},
					message: `L'année doit être supérieure ou égale à ${toValue(minYear)}.`,
					successMessage: toValue(successMessage),
				},
			}
			return [rule]
		}
		else if (toValue(maxYear)) {
			const rule: ValidationRule = {
				type: 'custom',
				options: {
					validate: (value: string) => {
						const year = getYearFromModel(value)
						if (year === null) {
							return true
						}
						return year <= toValue(maxYear as number)
					},
					message: `L'année doit être inférieure ou égale à ${toValue(maxYear)}.`,
					successMessage: toValue(successMessage),
				},
			}
			return [rule]
		}
		else {
			return []
		}
	})
	return { rules: rules }
}

function getYearFromModel(model: string): number | null {
	const parts = model.split('/')
	if (parts.length !== 3 || parts[2].length !== 4 || isNaN(Number(parts[2]))) {
		return null
	}
	return Number(parts[2])
}
