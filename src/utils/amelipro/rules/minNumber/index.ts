import type { ValidationResult, ValidationRule } from '@/utils/rules/types'
import { numberMatchRegex, parseToFrNumberFormat, parseToNumber } from '../../numberHelper/numberHelper'
import { ref } from 'vue'

// On a besoin de tester si le nombre reçu est supérieur ou égal au nombre  minimal autorisé
export type Value = string

export function minNumberRule(minNumber: string | number): ValidationRule<Value> {
	return (value: Value): ValidationResult => {
		if (value === '' || value === undefined || value === null) {
			return true
		}
		const valueHasGoodFormat = numberMatchRegex(value)
		const minDateHasGoodFormat = numberMatchRegex(minNumber)
		const valid = ref(false)
		if (valueHasGoodFormat && minDateHasGoodFormat) {
			const numberToTest = parseToNumber(value)
			const minNumberAsNumber = parseToNumber(minNumber)
			valid.value = Boolean(numberToTest >= minNumberAsNumber)
		}

		return valid.value || `Le nombre saisi doit être supérieur ou égal à ${parseToFrNumberFormat(minNumber)}.`
	}
}
