import type { Ref } from 'vue'
import type { ValidationResult, VuetifyValidationRule } from '@/composables/unifyValidation/useValidation'
import type { DateInput, DateModelValue } from '@/composables/date/useDateInitializationDayjs'

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
	validate?: (value: unknown) => boolean | string | Promise<boolean | string>
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
	customSuccessRules?: DatePickerRule[]
	customWarningRules?: DatePickerRule[]
	dateFormatReturn?: string
	density?: 'default' | 'comfortable' | 'compact'
	disableErrorHandling?: boolean
	disabled?: boolean
	errorMessages?: string[] | null
	hasError?: boolean
	hasSuccess?: boolean
	hasWarning?: boolean
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
	maxErrors?: number
	modelValue?: DateInput
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
	rules?: VuetifyValidationRule[]
	showSuccessMessages?: boolean
	successMessages?: string[] | null
	showWeekNumber?: boolean
	textFieldActivator?: boolean
	title?: string | false
	useVuetifyValidation?: boolean
	warningMessages?: string[] | null
	width?: string
}

/**
 * Props spécifiques à DateTextInput
 */
export interface DateTextInputProps extends Omit<DatePickerCommonProps, 'displayAsterisk' | 'displayHolidayDays' | 'displayTodayButton' | 'displayWeekendDays' | 'headingLevel' | 'hideDetails' | 'noCalendar' | 'period' | 'showWeekNumber' | 'textFieldActivator' | 'width'> {
	disableClickButton?: boolean
	externalErrorMessages?: string[]
}

/**
 * Props spécifiques à CalendarMode
 */
export interface CalendarModeProps extends DatePickerCommonProps {
	useCombinedMode?: boolean
}

export interface DatePickerPublicValidateOptions {
	force?: boolean
	textValue?: string
	calendarMode?: boolean
}

export type DatePickerPublicValidateResult = boolean | ValidationResult | Promise<boolean | ValidationResult>

export interface FormattedDateInputResult {
	formatted: string
	cursorPos: number
}

export type DatePickerValidationMessagesRef = Readonly<Ref<readonly string[]>>

export type InitializeSelectedDatesFn = (
	modelValue: DateInput | null,
	format: string,
	dateFormatReturn?: string,
) => DateObjectValue

export interface DateTextInputPublicApi {
	validateOnSubmit: () => Promise<boolean> | boolean
	validate: (options?: DatePickerPublicValidateOptions) => DatePickerPublicValidateResult
	reset: () => void
	errors: DatePickerValidationMessagesRef
	warnings: DatePickerValidationMessagesRef
	successes: DatePickerValidationMessagesRef
	focus: () => void
	blur: () => void
}

export interface ComplexDatePickerPublicApi {
	validateOnSubmit: () => Promise<boolean> | boolean
	isDatePickerVisible: Ref<boolean>
	selectedDates: Ref<DateObjectValue>
	errorMessages: DatePickerValidationMessagesRef
	errors: DatePickerValidationMessagesRef
	warnings: DatePickerValidationMessagesRef
	successes: DatePickerValidationMessagesRef
	handleClickOutside: (event: MouseEvent) => void
	initializeSelectedDates: InitializeSelectedDatesFn
	handleSelectToday: () => void
	updateAccessibility: () => void
	openDatePicker: () => Promise<void> | void
	updateDisplayFormattedDate: (value: string) => void
	currentMonth: Ref<string | null>
	currentMonthName: Ref<string | null>
	toggleDatePicker: () => Promise<void> | void
	validate: (options?: DatePickerPublicValidateOptions) => DatePickerPublicValidateResult
	clearValidation: () => void
	formatDateInput: (input: string, cursorPosition?: number) => FormattedDateInputResult
	emitBlur: () => void
	validateDateFormat: (value: string) => { isValid: boolean, message: string }
	displayFormattedDate: Ref<string>
	handleDateSelected: (value: DateModelValue) => void
	updateSelectedDates: (value: Date | null) => Promise<void> | void
	resetViewMode: () => void
	reset: () => void
}

export interface CalendarModeDatePickerPublicApi {
	validateOnSubmit: () => Promise<boolean> | boolean
	isDatePickerVisible: Ref<boolean>
	selectedDates: Ref<DateObjectValue>
	errorMessages: DatePickerValidationMessagesRef
	errors: DatePickerValidationMessagesRef
	warnings: DatePickerValidationMessagesRef
	successes: DatePickerValidationMessagesRef
	handleClickOutside: (event: MouseEvent) => void
	initializeSelectedDates: InitializeSelectedDatesFn
	updateAccessibility: () => void
	openDatePicker: () => Promise<void> | void
	updateSelectedDates: (value: DateModelValue | Date) => Promise<void> | void
	handleSelectToday: () => void
	validate: (options?: DatePickerPublicValidateOptions) => DatePickerPublicValidateResult
	clearValidation: () => void
	reset: () => void
}

/**
 * Defaults communs entre CalendarMode et ComplexDatePicker
 */
export const DatePickerCommonDefaults = {
	autoClamp: false,
	bgColor: 'white',
	birthDate: false,
	customRules: () => [],
	customSuccessRules: () => [],
	customWarningRules: () => [],
	dateFormatReturn: '',
	density: 'default' as const,
	disableErrorHandling: false,
	disabled: false,
	errorMessages: null,
	hasError: false,
	hasSuccess: false,
	hasWarning: false,
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
	maxErrors: 1,
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
	rules: undefined,
	showSuccessMessages: false,
	successMessages: null,
	showWeekNumber: false,
	textFieldActivator: false,
	title: false,
	useVuetifyValidation: false,
	warningMessages: null,
	width: '100%',
} as const
