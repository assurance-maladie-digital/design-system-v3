import { type FieldValidationProps } from '@/composables/unifyValidation/useValidation'
import { type locales as defaultLocales } from './locales'

export type DisplayFormat = 'code' | 'code-abbreviation' | 'code-country' | 'country' | 'abbreviation'
export type Indicatif = {
	code: string
	abbreviation: string
	country: string
	countryFr?: string
	mask?: string
	phoneLength?: number
}
export type PhoneFieldProps = FieldValidationProps & {
	modelValue?: string
	isClearable?: boolean
	dialCodeModel?: string | Indicatif
	outlined?: boolean
	withCountryCode?: boolean
	displayFormat?: DisplayFormat
	customIndicatifs?: Indicatif[]
	useCustomIndicatifsOnly?: boolean
	displayAsterisk?: boolean
	bgColor?: string
	helpText?: string
	hideDetails?: boolean
	autocompleteCountryCode?: string
	autocompletePhone?: string
	withoutFieldset?: boolean
	locales?: typeof defaultLocales
}
