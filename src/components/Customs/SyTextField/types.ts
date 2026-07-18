import type { FieldValidationProps } from '@/composables/unifyValidation/useValidation'
import type { SyTextFieldLocales } from './locales'

export type IconType = 'info' | 'success' | 'warning' | 'error' | 'close' | 'calendar' | undefined
export type VariantStyle = 'outlined' | 'plain' | 'underlined' | 'filled' | 'solo' | 'solo-inverted' | 'solo-filled'
export type ColorType = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error'
export type ValidateOnType = 'eager' | 'lazy' | 'blur' | 'input' | 'submit' | 'invalid-input' | 'blur lazy' | 'input lazy' | 'submit lazy' | 'invalid-input lazy' | 'blur eager' | 'input eager' | 'submit eager' | 'invalid-input eager' | 'lazy blur' | 'lazy input' | 'lazy submit' | 'lazy invalid-input' | 'eager blur' | 'eager input' | 'eager submit' | 'eager invalid-input' | undefined

export type SyTextFieldProps = {
	modelValue?: string | number | null | undefined
	prependIcon?: IconType
	appendIcon?: IconType
	prependInnerIcon?: IconType
	appendInnerIcon?: IconType
	prependTooltip?: string
	appendTooltip?: string
	tooltipLocation?: 'top' | 'bottom' | 'start' | 'end'
	variantStyle?: VariantStyle
	color?: ColorType
	isClearable?: boolean
	showDivider?: boolean
	label?: string
	readonly?: boolean
	isActive?: boolean
	baseColor?: string
	bgColor?: string
	centerAffix?: boolean
	counter?: string | number | boolean
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
	counterValue?: number | ((value: any) => number)
	density?: 'default' | 'comfortable' | 'compact'
	direction?: 'horizontal' | 'vertical'
	isDirty?: boolean
	disabled?: boolean
	isFlat?: boolean
	isFocused?: boolean
	areSpinButtonsHidden?: boolean
	hint?: string
	id?: string
	loading?: string | boolean
	maxWidth?: string | number
	messages?: string | string[]
	minWidth?: string | number
	name?: string
	displayPersistentClear?: boolean
	displayPersistentCounter?: boolean
	displayPersistentHint?: boolean
	displayPersistentPlaceholder?: boolean
	placeholder?: string
	prefix?: string
	isReversed?: boolean
	role?: string
	rounded?: string | number | boolean
	isOnSingleLine?: boolean
	suffix?: string
	theme?: string
	isTiled?: boolean
	type?: string
	width?: string | number
	displayAsterisk?: boolean
	noIcon?: boolean
	disableClickButton?: boolean
	autocomplete?: string
	helpText?: string
	maxlength?: string | number
	title?: string | false
	hideDetails?: boolean | 'auto'
	/** Surcharge des libellés d'accessibilité (boutons +/-, vider, chargement) et des messages de validation. */
	locales?: SyTextFieldLocales
} & FieldValidationProps
