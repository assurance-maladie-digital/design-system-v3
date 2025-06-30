import type { ValidationResult, ValidationRule } from '@/utils/rules/types'
import { dateMatchIso, dateToFormatFr, stringToDate } from '../../dateHelper/dateHelper'

// On a besoin de tester si la date reçue est inférieure ou égale à la date maximale autorisée
export type Value = string

export function notAfterDate(maxDate: string): ValidationRule<Value> {
	return (value: Value): ValidationResult => {
		if (value === '' || value === undefined || value === null) {
			return true
		}
		const valueHasGoodFormat = dateMatchIso(value)
		const maxDateHasGoodFormat = dateMatchIso(maxDate)
		let valid = false
		if (valueHasGoodFormat && maxDateHasGoodFormat) {
			const dateToTest = stringToDate(value)
			const maxDateAsDate = stringToDate(maxDate)

			if (dateToTest && maxDateAsDate) {
				valid = Boolean(dateToTest <= maxDateAsDate)
			}
		}

		return valid || `La date saisie doit être antérieure ou égale au ${dateToFormatFr(maxDate)}.`
	}
}
