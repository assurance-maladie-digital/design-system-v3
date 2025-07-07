import type { ValidationResult, ValidationRule } from '@/utils/rules/types'
import { dateMatchFrIso, dateMatchIso, dateToBasicFormat, dateToFormatFr, stringToDate } from '../../dateHelper/dateHelper'
import { ref } from 'vue'

// On a besoin de tester si la date reçue est supérieure ou égale à la date minimale autorisée
export type Value = string

export function notBeforeDate(minDate: string, fieldType: string): ValidationRule<Value> {
	return (value: Value): ValidationResult => {
		if (value === '' || value === undefined || value === null) {
			return true
		}

		const currentValue = ref(value)
		if (fieldType === 'text' && dateMatchFrIso(value)) {
			currentValue.value = dateToBasicFormat(value)
		}

		const valueHasGoodFormat = dateMatchIso(currentValue.value)
		const minDateHasGoodFormat = dateMatchIso(minDate)
		let valid = false
		if (valueHasGoodFormat && minDateHasGoodFormat) {
			const dateToTest = stringToDate(currentValue.value)
			const minDateAsDate = stringToDate(minDate)

			if (dateToTest && minDateAsDate) {
				valid = Boolean(dateToTest >= minDateAsDate)
			}
		}

		return valid || `La date saisie doit être ultérieure ou égale au ${dateToFormatFr(minDate)}.`
	}
}
