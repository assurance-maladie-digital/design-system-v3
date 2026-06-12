/**
 * Types pour les composants CalendarMode
 */

/**
 * Type représentant une valeur de date qui peut être une Date, un tableau de Dates ou null
 * Utilisé pour les opérations internes du CalendarMode avec des objets Date
 */
export type DateObjectValue = Date | (Date | null)[] | null

/**
 * @deprecated Utilisez DateObjectValue pour les objets Date ou importez DateModelValue depuis useDateInitializationDayjs pour les chaînes
 */
export type DateValue = DateObjectValue

/**
 * Options d'une règle de validation personnalisée du DatePicker.
 * Le champ `options` est intentionnellement ouvert car les règles legacy
 * peuvent contenir des propriétés arbitraires (message, date, validate, …).
 */
export interface DatePickerRuleOptions {
	message?: string
	date?: string | Date
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	validate?: ((value: any) => boolean | string) | ((value: any) => Promise<boolean | string>)
	[key: string]: unknown
}

/**
 * Règle de validation personnalisée du DatePicker
 */
export interface DatePickerRule {
	type: string
	options: DatePickerRuleOptions
}

/**
 * Props communes entre CalendarMode et ComplexDatePicker
 */
export interface DatePickerCommonProps {
	autoClamp?: boolean
	bgColor?: string
	/** @deprecated Utilisez isBirthDate à la place */
	birthDate?: boolean
	customRules?: DatePickerRule[]
	customWarningRules?: DatePickerRule[]
	dateFormatReturn?: string
	density?: 'default' | 'comfortable' | 'compact'
	disableErrorHandling?: boolean
	disabled?: boolean
	displayAppendIcon?: boolean
	displayAsterisk?: boolean
	displayHolidayDays?: boolean
	displayIcon?: boolean
	displayPrependIcon?: boolean
	displayRange?: boolean
	displayTodayButton?: boolean
	displayWeekendDays?: boolean
	format?: string
	headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
	hideDetails?: boolean | 'auto'
	hint?: string
	isBirthDate?: boolean
	isOutlined?: boolean
	isValidateOnBlur?: boolean
	label?: string
	modelValue?: import('@/composables/date/useDateInitializationDayjs').DateInput
	noCalendar?: boolean
	noIcon?: boolean
	period?: {
		max?: string
		min?: string
	}
	persistentHint?: boolean
	placeholder?: string
	readonly?: boolean
	required?: boolean
	showSuccessMessages?: boolean
	showWeekNumber?: boolean
	textFieldActivator?: boolean
	title?: string | false
	width?: string
}

/**
 * Props spécifiques à DateTextInput
 */
export interface DateTextInputProps extends Omit<DatePickerCommonProps, 'displayAsterisk' | 'displayHolidayDays' | 'displayTodayButton' | 'displayWeekendDays' | 'headingLevel' | 'hideDetails' | 'noCalendar' | 'period' | 'showWeekNumber' | 'textFieldActivator' | 'width'> {
	externalErrorMessages?: string[]
}

/**
 * Props spécifiques à CalendarMode
 */
export interface CalendarModeProps extends DatePickerCommonProps {
	useCombinedMode?: boolean
}

/**
 * Defaults communs entre CalendarMode et ComplexDatePicker
 */
export const DatePickerCommonDefaults = {
	autoClamp: false,
	bgColor: 'white',
	birthDate: false,
	customRules: () => [],
	customWarningRules: () => [],
	dateFormatReturn: '',
	density: 'default' as const,
	disableErrorHandling: false,
	disabled: false,
	displayAppendIcon: false,
	displayAsterisk: false,
	displayHolidayDays: true,
	displayIcon: true,
	displayPrependIcon: true,
	displayRange: false,
	displayTodayButton: true,
	displayWeekendDays: true,
	format: 'DD/MM/YYYY',
	headingLevel: 3 as const,
	hideDetails: false,
	hint: undefined,
	isBirthDate: false,
	label: undefined,
	isOutlined: true,
	isValidateOnBlur: true,
	modelValue: undefined,
	noCalendar: false,
	noIcon: false,
	period: () => ({ min: '', max: '' }),
	persistentHint: false,
	placeholder: undefined,
	readonly: false,
	required: false,
	showSuccessMessages: false,
	showWeekNumber: false,
	textFieldActivator: false,
	title: false,
	width: '100%',
} as const
