import type { ValidationResult, ValidationRule } from '@/utils/rules/types'
import { dateMatchIso, dateToFormatFr, stringToDate } from '../../dateHelper/dateHelper'

// On a besoin de tester si la date reçue est supérieure ou égale à la date minimale autorisée
export type Value = string

export function notBeforeDate(minDate: string): ValidationRule<Value> {
	return (value: Value): ValidationResult => {
		if (value === '' || value === undefined || value === null) {
			return true
		}
		const valueHasGoodFormat = dateMatchIso(value)
		const minDateHasGoodFormat = dateMatchIso(minDate)
		let valid = false
		if (valueHasGoodFormat && minDateHasGoodFormat) {
			const dateToTest = stringToDate(value)
			const minDateAsDate = stringToDate(minDate)

			if (dateToTest && minDateAsDate) {
				valid = Boolean(dateToTest >= minDateAsDate)
			}
		}

		return valid || `La date saisie doit être ultérieure ou égale au ${dateToFormatFr(minDate)}.`
	}
}
