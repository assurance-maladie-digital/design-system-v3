import type { ValidationResult, ValidationRule } from '@/utils/rules/types'
import { numberMatchRegex, parseToFrNumberFormat, parseToNumber } from '../../numberHelper/numberHelper'
import { ref } from 'vue'

// On a besoin de tester si le nombre reçu est inférieur ou égal au nombre maximal autorisé
export type Value = string

export function maxNumberRule(maxNumber: string | number): ValidationRule<Value> {
	return (value: Value): ValidationResult => {
		if (value === '' || value === undefined || value === null) {
			return true
		}
		const valueHasGoodFormat = numberMatchRegex(value)
		const maxDateHasGoodFormat = numberMatchRegex(maxNumber)
		const valid = ref(false)
		if (valueHasGoodFormat && maxDateHasGoodFormat) {
			const numberToTest = parseToNumber(value)
			const maxNumberAsNumber = parseToNumber(maxNumber)
			valid.value = Boolean(numberToTest <= maxNumberAsNumber)
		}

		return valid.value || `Le nombre saisi doit être inférieur ou égal à ${parseToFrNumberFormat(maxNumber)}.`
	}
}
