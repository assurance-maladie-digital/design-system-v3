import type { FieldValidationProps } from '@/composables/unifyValidation/useValidation'
import type { CustomizableOptions } from '@/composables/useCustomizableOptions'
import type { ColorType } from '@/components/Customs/SyTextField/types'
import type { locales } from './locales'

export interface PasswordFieldProps extends CustomizableOptions, FieldValidationProps {
	modelValue?: string | null
	variantStyle?: 'outlined' | 'underlined'
	color?: ColorType
	label: string
	clearable?: boolean
	placeholder?: string
	displayAsterisk?: boolean
	bgColor?: string
	autocompleteType?: 'current-password' | 'new-password'
	helpText?: string
	hideDetails?: boolean
	locales?: typeof locales
}
