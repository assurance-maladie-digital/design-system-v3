import type { FieldValidationProps } from '@/composables/unifyValidation/useValidation'
import type { locales } from './locales'

export type IconType = 'info' | 'success' | 'warning' | 'error' | 'close' | 'calendar' | undefined
export type VariantStyle = 'outlined' | 'plain' | 'underlined' | 'filled' | 'solo' | 'solo-inverted' | 'solo-filled'
export type ColorType = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error'
export type DensityType = 'default' | 'comfortable' | 'compact'

// On extrait modelValue car on utilise defineModel
export type LunarCalendarProps = {
	label: string
	placeholder?: string
	isClearable?: boolean
	displayPrependIcon?: boolean
	displayAppendIcon?: boolean
	minYear?: number
	maxYear?: number
	// Props iso avec SyTextField
	helpText?: string
	noIcon?: boolean
	displayAsterisk?: boolean
	prependTooltip?: string
	appendTooltip?: string
	tooltipLocation?: 'top' | 'bottom' | 'start' | 'end'
	variantStyle?: VariantStyle
	color?: ColorType
	density?: DensityType
	loading?: boolean | string
	hint?: string
	bgColor?: string
	baseColor?: string
	counter?: string | number | boolean
	id?: string
	name?: string
	autocomplete?: string
	disabled?: boolean
	readonly?: boolean
	required?: boolean
	hideDetails?: boolean | 'auto'
	locales?: typeof locales
} & Omit<FieldValidationProps, 'modelValue'>
