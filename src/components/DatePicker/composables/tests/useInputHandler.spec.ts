import { describe, it, expect, vi } from 'vitest'
import { ref, type ComponentPublicInstance } from 'vue'
import type { DateObjectValue } from '../../types'
import { useInputHandler } from '../useInputHandler'

const parseDate = (value: string): Date | null => {
	const [day, month, year] = value.split('/').map(Number)
	if (!day || !month || !year) return null
	return new Date(year, month - 1, day)
}

const formatDate = (date: Date): string => {
	const d = String(date.getDate()).padStart(2, '0')
	const m = String(date.getMonth() + 1).padStart(2, '0')
	const y = date.getFullYear()
	return `${d}/${m}/${y}`
}

const generateDateRange = (start: Date, end: Date): Date[] => [start, end]

const isDateComplete = (value: string): boolean => value.length === 10

describe('useInputHandler', () => {
	it('handleInput in single mode formats value, updates selectedDates and model', () => {
		const format = 'DD/MM/YYYY'

		const displayFormattedDate = ref('')
		const selectedDates = ref<DateObjectValue>(null)
		const isFormatting = ref(false)
		const isManualInputActive = ref(true)
		const isUpdatingFromInternal = ref(false)
		const clearValidation = vi.fn()
		const validateField = vi.fn()
		const updateModel = vi.fn()
		const emitInput = vi.fn()

		const inputElement = document.createElement('input')
		const wrapper = document.createElement('div')
		wrapper.appendChild(inputElement)
		const inputRef = ref<ComponentPublicInstance | null>({ $el: wrapper } as unknown as ComponentPublicInstance)

		const { handleInput } = useInputHandler({
			format,
			displayRange: false,
			dateFormatReturn: undefined,
			disableErrorHandling: false,
			parseDate,
			formatDate,
			generateDateRange,
			isDateComplete,
			displayFormattedDate,
			selectedDates,
			isFormatting,
			isManualInputActive,
			isUpdatingFromInternal,
			clearValidation,
			validateField,
			updateModel,
			emitInput,
			inputRef,
		})

		inputElement.value = '01/01/2023'
		inputElement.selectionStart = inputElement.value.length
		inputElement.selectionEnd = inputElement.value.length

		handleInput({ target: inputElement } as unknown as Event)

		expect(displayFormattedDate.value).toBe('01/01/2023')
		expect(selectedDates.value).toBeInstanceOf(Date)
		expect(updateModel).toHaveBeenCalledWith('01/01/2023')
		expect(clearValidation).toHaveBeenCalled()
		expect(validateField).toHaveBeenCalledTimes(1)
	})

	it('handleInput in range mode completes first date and prepares second date input', () => {
		const format = 'DD/MM/YYYY'

		const displayFormattedDate = ref('')
		const selectedDates = ref<DateObjectValue>(null)
		const isFormatting = ref(false)
		const isManualInputActive = ref(true)
		const isUpdatingFromInternal = ref(false)
		const clearValidation = vi.fn()
		const validateField = vi.fn()
		const updateModel = vi.fn()
		const emitInput = vi.fn()

		const inputElement = document.createElement('input')
		const wrapper = document.createElement('div')
		wrapper.appendChild(inputElement)
		const inputRef = ref<ComponentPublicInstance | null>({ $el: wrapper } as unknown as ComponentPublicInstance)

		const { handleInput } = useInputHandler({
			format,
			displayRange: true,
			dateFormatReturn: undefined,
			disableErrorHandling: false,
			parseDate,
			formatDate,
			generateDateRange,
			isDateComplete,
			displayFormattedDate,
			selectedDates,
			isFormatting,
			isManualInputActive,
			isUpdatingFromInternal,
			clearValidation,
			validateField,
			updateModel,
			emitInput,
			inputRef,
		})

		inputElement.value = '01/01/2023'
		inputElement.selectionStart = inputElement.value.length
		inputElement.selectionEnd = inputElement.value.length

		handleInput({ target: inputElement } as unknown as Event)

		expect(displayFormattedDate.value).toBe('01/01/2023 - ')
		expect(Array.isArray(selectedDates.value)).toBe(true)
		const dates = selectedDates.value as (Date | null)[]
		expect(dates[0]).toBeInstanceOf(Date)
		expect(dates[1]).toBeNull()
		// In this first-step scenario, updateModel is not called yet for the range
		expect(updateModel).not.toHaveBeenCalled()
	})

	it('handleInput in range mode formats and updates second date', () => {
		const format = 'DD/MM/YYYY'

		// Préparer un état où la première date est déjà complétée
		const displayFormattedDate = ref('01/01/2023 - ')
		const startDate = parseDate('01/01/2023') as Date
		const selectedDates = ref<DateObjectValue>([startDate, null])
		const isFormatting = ref(false)
		const isManualInputActive = ref(true)
		const isUpdatingFromInternal = ref(false)
		const clearValidation = vi.fn()
		const validateField = vi.fn()
		const updateModel = vi.fn()
		const emitInput = vi.fn()

		const inputElement = document.createElement('input')
		const wrapper = document.createElement('div')
		wrapper.appendChild(inputElement)
		const inputRef = ref<ComponentPublicInstance | null>({ $el: wrapper } as unknown as ComponentPublicInstance)

		const { handleInput } = useInputHandler({
			format,
			displayRange: true,
			dateFormatReturn: undefined,
			disableErrorHandling: false,
			parseDate,
			formatDate,
			generateDateRange,
			isDateComplete,
			displayFormattedDate,
			selectedDates,
			isFormatting,
			isManualInputActive,
			isUpdatingFromInternal,
			clearValidation,
			validateField,
			updateModel,
			emitInput,
			inputRef,
		})

		// Saisir la seconde date complète
		inputElement.value = '01/01/2023 - 05/01/2023'
		inputElement.selectionStart = inputElement.value.length
		inputElement.selectionEnd = inputElement.value.length

		handleInput({ target: inputElement } as unknown as Event)

		expect(displayFormattedDate.value).toContain('01/01/2023 -')
		expect(Array.isArray(selectedDates.value)).toBe(true)
		const [start, end] = selectedDates.value as (Date | null)[]
		expect(start).toBeInstanceOf(Date)
		expect(end).toBeInstanceOf(Date)
	})

	it('updateModelFromSelectedDates in range mode expands dates and updates model', () => {
		const format = 'DD/MM/YYYY'

		const displayFormattedDate = ref('01/01/2023 - 05/01/2023')
		const start = new Date(2023, 0, 1)
		const end = new Date(2023, 0, 5)
		const selectedDates = ref<DateObjectValue>([start, end])
		const isFormatting = ref(false)
		const isManualInputActive = ref(true)
		const isUpdatingFromInternal = ref(false)
		const clearValidation = vi.fn()
		const validateField = vi.fn()
		const updateModel = vi.fn()
		const emitInput = vi.fn()
		const inputRef = ref<ComponentPublicInstance | null>(null)

		const { updateModelFromSelectedDates } = useInputHandler({
			format,
			displayRange: true,
			dateFormatReturn: undefined,
			disableErrorHandling: false,
			parseDate,
			formatDate,
			generateDateRange,
			isDateComplete,
			displayFormattedDate,
			selectedDates,
			isFormatting,
			isManualInputActive,
			isUpdatingFromInternal,
			clearValidation,
			validateField,
			updateModel,
			emitInput,
			inputRef,
		})

		updateModelFromSelectedDates()

		expect(Array.isArray(selectedDates.value)).toBe(true)
		const dates = selectedDates.value as Date[]
		expect(dates[0]).toBeInstanceOf(Date)
		expect(dates[1]).toBeInstanceOf(Date)
		expect(updateModel).toHaveBeenCalledWith(['01/01/2023', '05/01/2023'])
	})

	it('updateModelFromSelectedDates in single mode updates model and validates when complete', () => {
		const format = 'DD/MM/YYYY'

		const displayFormattedDate = ref('01/01/2023')
		const date = new Date(2023, 0, 1)
		const selectedDates = ref<DateObjectValue>(date)
		const isFormatting = ref(false)
		const isManualInputActive = ref(true)
		const isUpdatingFromInternal = ref(false)
		const clearValidation = vi.fn()
		const validateField = vi.fn()
		const updateModel = vi.fn()
		const emitInput = vi.fn()
		const inputRef = ref<ComponentPublicInstance | null>(null)

		const { updateModelFromSelectedDates } = useInputHandler({
			format,
			displayRange: false,
			dateFormatReturn: undefined,
			disableErrorHandling: false,
			parseDate,
			formatDate,
			generateDateRange,
			isDateComplete,
			displayFormattedDate,
			selectedDates,
			isFormatting,
			isManualInputActive,
			isUpdatingFromInternal,
			clearValidation,
			validateField,
			updateModel,
			emitInput,
			inputRef,
		})

		updateModelFromSelectedDates()

		expect(updateModel).toHaveBeenCalledWith('01/01/2023')
		expect(validateField).toHaveBeenCalledTimes(1)
		expect(validateField).toHaveBeenCalledWith(date)
	})

	it('updateModelFromSelectedDates in single mode does not validate when error handling is disabled', () => {
		const format = 'DD/MM/YYYY'

		const displayFormattedDate = ref('01/01/2023')
		const date = new Date(2023, 0, 1)
		const selectedDates = ref<DateObjectValue>(date)
		const isFormatting = ref(false)
		const isManualInputActive = ref(true)
		const isUpdatingFromInternal = ref(false)
		const clearValidation = vi.fn()
		const validateField = vi.fn()
		const updateModel = vi.fn()
		const emitInput = vi.fn()
		const inputRef = ref<ComponentPublicInstance | null>(null)

		const { updateModelFromSelectedDates } = useInputHandler({
			format,
			displayRange: false,
			dateFormatReturn: undefined,
			disableErrorHandling: true,
			parseDate,
			formatDate,
			generateDateRange,
			isDateComplete,
			displayFormattedDate,
			selectedDates,
			isFormatting,
			isManualInputActive,
			isUpdatingFromInternal,
			clearValidation,
			validateField,
			updateModel,
			emitInput,
			inputRef,
		})

		updateModelFromSelectedDates()

		expect(updateModel).toHaveBeenCalledWith('01/01/2023')
		expect(validateField).not.toHaveBeenCalled()
	})

	it('updateSelectedDatesFromFormattedValue parses a full range correctly', () => {
		const format = 'DD/MM/YYYY'

		const displayFormattedDate = ref('')
		const selectedDates = ref<DateObjectValue>(null)
		const isFormatting = ref(false)
		const isManualInputActive = ref(true)
		const isUpdatingFromInternal = ref(false)
		const clearValidation = vi.fn()
		const validateField = vi.fn()
		const updateModel = vi.fn()
		const emitInput = vi.fn()
		const inputRef = ref<ComponentPublicInstance | null>(null)

		const { updateSelectedDatesFromFormattedValue } = useInputHandler({
			format,
			displayRange: true,
			dateFormatReturn: undefined,
			disableErrorHandling: false,
			parseDate,
			formatDate,
			generateDateRange,
			isDateComplete,
			displayFormattedDate,
			selectedDates,
			isFormatting,
			isManualInputActive,
			isUpdatingFromInternal,
			clearValidation,
			validateField,
			updateModel,
			emitInput,
			inputRef,
		})

		updateSelectedDatesFromFormattedValue('01/01/2023 - 05/01/2023')

		expect(Array.isArray(selectedDates.value)).toBe(true)
		const dates = selectedDates.value as Date[]
		expect(dates[0]).toBeInstanceOf(Date)
		expect(dates[1]).toBeInstanceOf(Date)
	})

	it('updateSelectedDatesFromFormattedValue in range mode with only start date sets end to null', () => {
		const format = 'DD/MM/YYYY'

		const displayFormattedDate = ref('')
		const selectedDates = ref<DateObjectValue>(null)
		const isFormatting = ref(false)
		const isManualInputActive = ref(true)
		const isUpdatingFromInternal = ref(false)
		const clearValidation = vi.fn()
		const validateField = vi.fn()
		const updateModel = vi.fn()
		const emitInput = vi.fn()
		const inputRef = ref<ComponentPublicInstance | null>(null)

		const { updateSelectedDatesFromFormattedValue } = useInputHandler({
			format,
			displayRange: true,
			dateFormatReturn: undefined,
			disableErrorHandling: false,
			parseDate,
			formatDate,
			generateDateRange,
			isDateComplete,
			displayFormattedDate,
			selectedDates,
			isFormatting,
			isManualInputActive,
			isUpdatingFromInternal,
			clearValidation,
			validateField,
			updateModel,
			emitInput,
			inputRef,
		})

		updateSelectedDatesFromFormattedValue('01/01/2023')

		expect(Array.isArray(selectedDates.value)).toBe(true)
		const dates = selectedDates.value as (Date | null)[]
		expect(dates[0]).toBeInstanceOf(Date)
		expect(dates[1]).toBeNull()
	})

	it('updateSelectedDatesFromFormattedValue in range mode with invalid value clears selection', () => {
		const format = 'DD/MM/YYYY'

		const displayFormattedDate = ref('')
		const selectedDates = ref<DateObjectValue>([new Date(), null])
		const isFormatting = ref(false)
		const isManualInputActive = ref(true)
		const isUpdatingFromInternal = ref(false)
		const clearValidation = vi.fn()
		const validateField = vi.fn()
		const updateModel = vi.fn()
		const emitInput = vi.fn()
		const inputRef = ref<ComponentPublicInstance | null>(null)

		const { updateSelectedDatesFromFormattedValue } = useInputHandler({
			format,
			displayRange: true,
			dateFormatReturn: undefined,
			disableErrorHandling: false,
			parseDate,
			formatDate,
			generateDateRange,
			isDateComplete,
			displayFormattedDate,
			selectedDates,
			isFormatting,
			isManualInputActive,
			isUpdatingFromInternal,
			clearValidation,
			validateField,
			updateModel,
			emitInput,
			inputRef,
		})

		updateSelectedDatesFromFormattedValue('invalid')
		expect(selectedDates.value).toBeNull()
	})

	it('updateSelectedDatesFromFormattedValue in single mode sets a single Date or null', () => {
		const format = 'DD/MM/YYYY'

		const displayFormattedDate = ref('')
		const selectedDates = ref<DateObjectValue>(null)
		const isFormatting = ref(false)
		const isManualInputActive = ref(true)
		const isUpdatingFromInternal = ref(false)
		const clearValidation = vi.fn()
		const validateField = vi.fn()
		const updateModel = vi.fn()
		const emitInput = vi.fn()
		const inputRef = ref<ComponentPublicInstance | null>(null)

		const { updateSelectedDatesFromFormattedValue } = useInputHandler({
			format,
			displayRange: false,
			dateFormatReturn: undefined,
			disableErrorHandling: false,
			parseDate,
			formatDate,
			generateDateRange,
			isDateComplete,
			displayFormattedDate,
			selectedDates,
			isFormatting,
			isManualInputActive,
			isUpdatingFromInternal,
			clearValidation,
			validateField,
			updateModel,
			emitInput,
			inputRef,
		})

		updateSelectedDatesFromFormattedValue('01/01/2023')
		expect(selectedDates.value).toBeInstanceOf(Date)

		updateSelectedDatesFromFormattedValue('invalid')
		expect(selectedDates.value).toBeNull()
	})

	it('updateModelFromSelectedDates with no dates clears the model', () => {
		const format = 'DD/MM/YYYY'

		const displayFormattedDate = ref('')
		const selectedDates = ref<DateObjectValue>(null)
		const isFormatting = ref(false)
		const isManualInputActive = ref(true)
		const isUpdatingFromInternal = ref(false)
		const clearValidation = vi.fn()
		const validateField = vi.fn()
		const updateModel = vi.fn()
		const emitInput = vi.fn()
		const inputRef = ref<ComponentPublicInstance | null>(null)

		const { updateModelFromSelectedDates } = useInputHandler({
			format,
			displayRange: true,
			dateFormatReturn: undefined,
			disableErrorHandling: false,
			parseDate,
			formatDate,
			generateDateRange,
			isDateComplete,
			displayFormattedDate,
			selectedDates,
			isFormatting,
			isManualInputActive,
			isUpdatingFromInternal,
			clearValidation,
			validateField,
			updateModel,
			emitInput,
			inputRef,
		})

		updateModelFromSelectedDates()
		expect(updateModel).toHaveBeenCalledWith(null)
		expect(validateField).not.toHaveBeenCalled()
	})

	it('handleInput does nothing when already formatting', () => {
		const format = 'DD/MM/YYYY'

		const displayFormattedDate = ref('')
		const selectedDates = ref<DateObjectValue>(null)
		const isFormatting = ref(true)
		const isManualInputActive = ref(true)
		const isUpdatingFromInternal = ref(false)
		const clearValidation = vi.fn()
		const validateField = vi.fn()
		const updateModel = vi.fn()
		const emitInput = vi.fn()
		const inputRef = ref<ComponentPublicInstance | null>(null)

		const { handleInput } = useInputHandler({
			format,
			displayRange: false,
			dateFormatReturn: undefined,
			disableErrorHandling: false,
			parseDate,
			formatDate,
			generateDateRange,
			isDateComplete,
			displayFormattedDate,
			selectedDates,
			isFormatting,
			isManualInputActive,
			isUpdatingFromInternal,
			clearValidation,
			validateField,
			updateModel,
			emitInput,
			inputRef,
		})

		const event = {} as Event
		handleInput(event)

		// Aucun traitement ne doit avoir lieu
		expect(updateModel).not.toHaveBeenCalled()
		expect(emitInput).not.toHaveBeenCalled()
		expect(isFormatting.value).toBe(true)
	})

	it('handleInput does nothing when manual input is disabled', () => {
		const format = 'DD/MM/YYYY'

		const displayFormattedDate = ref('')
		const selectedDates = ref<DateObjectValue>(null)
		const isFormatting = ref(false)
		const isManualInputActive = ref(false)
		const isUpdatingFromInternal = ref(false)
		const clearValidation = vi.fn()
		const validateField = vi.fn()
		const updateModel = vi.fn()
		const emitInput = vi.fn()
		const inputRef = ref<ComponentPublicInstance | null>(null)

		const { handleInput } = useInputHandler({
			format,
			displayRange: false,
			dateFormatReturn: undefined,
			disableErrorHandling: false,
			parseDate,
			formatDate,
			generateDateRange,
			isDateComplete,
			displayFormattedDate,
			selectedDates,
			isFormatting,
			isManualInputActive,
			isUpdatingFromInternal,
			clearValidation,
			validateField,
			updateModel,
			emitInput,
			inputRef,
		})

		const event = {} as Event
		handleInput(event)

		// Aucun traitement ne doit avoir lieu
		expect(updateModel).not.toHaveBeenCalled()
		expect(emitInput).not.toHaveBeenCalled()
		expect(isFormatting.value).toBe(false)
	})

	it('updateCursorPosition positionne le curseur dans les bornes et focus l’input', () => {
		const format = 'DD/MM/YYYY'

		const displayFormattedDate = ref('')
		const selectedDates = ref<DateObjectValue>(null)
		const isFormatting = ref(false)
		const isManualInputActive = ref(true)
		const isUpdatingFromInternal = ref(false)
		const clearValidation = vi.fn()
		const validateField = vi.fn()
		const updateModel = vi.fn()
		const emitInput = vi.fn()
		const inputRef = ref<ComponentPublicInstance | null>(null)

		const { updateCursorPosition } = useInputHandler({
			format,
			displayRange: false,
			dateFormatReturn: undefined,
			disableErrorHandling: false,
			parseDate,
			formatDate,
			generateDateRange,
			isDateComplete,
			displayFormattedDate,
			selectedDates,
			isFormatting,
			isManualInputActive,
			isUpdatingFromInternal,
			clearValidation,
			validateField,
			updateModel,
			emitInput,
			inputRef,
		})

		vi.useFakeTimers()
		const inputElement = document.createElement('input')
		inputElement.value = '12345'

		const setSelectionRangeSpy = vi.spyOn(inputElement, 'setSelectionRange')
		const focusSpy = vi.spyOn(inputElement, 'focus')

		// Demander une position au-delà de la longueur, elle doit être clampée
		updateCursorPosition(inputElement, 10)
		vi.runAllTimers()

		expect(setSelectionRangeSpy).toHaveBeenCalledWith(5, 5)
		expect(focusSpy).toHaveBeenCalled()
		vi.useRealTimers()
	})

	it('updateCursorPosition ne fait rien si l’élément input est null', () => {
		const format = 'DD/MM/YYYY'

		const displayFormattedDate = ref('')
		const selectedDates = ref<DateObjectValue>(null)
		const isFormatting = ref(false)
		const isManualInputActive = ref(true)
		const isUpdatingFromInternal = ref(false)
		const clearValidation = vi.fn()
		const validateField = vi.fn()
		const updateModel = vi.fn()
		const emitInput = vi.fn()
		const inputRef = ref<ComponentPublicInstance | null>(null)

		const { updateCursorPosition } = useInputHandler({
			format,
			displayRange: false,
			dateFormatReturn: undefined,
			disableErrorHandling: false,
			parseDate,
			formatDate,
			generateDateRange,
			isDateComplete,
			displayFormattedDate,
			selectedDates,
			isFormatting,
			isManualInputActive,
			isUpdatingFromInternal,
			clearValidation,
			validateField,
			updateModel,
			emitInput,
			inputRef,
		})

		// Ne doit pas lever d’erreur ni faire quoi que ce soit de spécial
		updateCursorPosition(null, 5)
	})

	it('formatRangeInput formate correctement en éditant la première ou la seconde partie', () => {
		const format = 'DD/MM/YYYY'

		const displayFormattedDate = ref('')
		const selectedDates = ref<DateObjectValue>(null)
		const isFormatting = ref(false)
		const isManualInputActive = ref(true)
		const isUpdatingFromInternal = ref(false)
		const clearValidation = vi.fn()
		const validateField = vi.fn()
		const updateModel = vi.fn()
		const emitInput = vi.fn()
		const inputRef = ref<ComponentPublicInstance | null>(null)

		const { formatRangeInput } = useInputHandler({
			format,
			displayRange: true,
			dateFormatReturn: undefined,
			disableErrorHandling: false,
			parseDate,
			formatDate,
			generateDateRange,
			isDateComplete,
			displayFormattedDate,
			selectedDates,
			isFormatting,
			isManualInputActive,
			isUpdatingFromInternal,
			clearValidation,
			validateField,
			updateModel,
			emitInput,
			inputRef,
		})

		// Édition de la première partie
		const valueWithRange = '01/01/2023 - 02/01/2023'
		const firstPartCursorPos = 3 // au milieu de la première date
		const { formattedInput: formattedFirst, newCursorPos: newPosFirst } = formatRangeInput(valueWithRange, firstPartCursorPos)
		const [firstPartAfter, secondPartAfter] = formattedFirst.split(' - ')
		// La seconde partie doit rester inchangée
		expect(secondPartAfter).toBe('02/01/2023')
		// Le curseur doit rester dans la première partie
		expect(newPosFirst).toBeLessThanOrEqual(firstPartAfter.length)

		// Édition de la seconde partie
		const cursorInSecondPart = valueWithRange.length
		const { formattedInput: formattedSecond, newCursorPos: newPosSecond } = formatRangeInput(valueWithRange, cursorInSecondPart)
		const [firstPartAfterSecond] = formattedSecond.split(' - ')
		// La première partie doit rester inchangée
		expect(firstPartAfterSecond).toBe('01/01/2023')
		// Le curseur doit se trouver dans la seconde partie
		expect(newPosSecond).toBeGreaterThan(firstPartAfterSecond.length)
	})
})
