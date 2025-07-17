import type { ValidationResult, ValidationRule } from '@/utils/rules/types'
import { dateMatchFrIso, dateMatchIso, dateToBasicFormat, dateToFormatFr, stringToDate } from '../../dateHelper/dateHelper'
import { ref } from 'vue'

// On a besoin de tester si la date reçue est inférieure ou égale à la date maximale autorisée
export type Value = string

export function notAfterDate(maxDate: string, fieldType: string): ValidationRule<Value> {
	return (value: Value): ValidationResult => {
		if (value === '' || value === undefined || value === null) {
			return true
		}

		const currentValue = ref(value)
		if (fieldType === 'text' && dateMatchFrIso(value)) {
			currentValue.value = dateToBasicFormat(value)
		}

		const valueHasGoodFormat = dateMatchIso(currentValue.value)
		const maxDateHasGoodFormat = dateMatchIso(maxDate)
		let valid = false
		if (valueHasGoodFormat && maxDateHasGoodFormat) {
			const dateToTest = stringToDate(currentValue.value)
			const maxDateAsDate = stringToDate(maxDate)

			if (dateToTest && maxDateAsDate) {
				valid = Boolean(dateToTest <= maxDateAsDate)
			}
		}

		return valid || `La date saisie doit être antérieure ou égale au ${dateToFormatFr(maxDate)}.`
	}
}
