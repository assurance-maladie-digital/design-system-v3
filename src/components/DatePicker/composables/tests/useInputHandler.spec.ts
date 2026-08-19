import { afterEach, describe, expect, it, vi } from 'vitest'
import { ref, type ComponentPublicInstance } from 'vue'
import type { DateObjectValue } from '../../types'
import { useInputHandler } from '../useInputHandler'

const parseDate = (value: string): Date | null => {
	const [day, month, year] = value.split('/').map(Number)
	if (!day || !month || !year) return null
	return new Date(year, month - 1, day)
}

const formatDate = (date: Date, format = 'DD/MM/YYYY'): string => {
	const day = String(date.getDate()).padStart(2, '0')
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const year = date.getFullYear()

	if (format === 'YYYY-MM-DD') {
		return `${year}-${month}-${day}`
	}

	return `${day}/${month}/${year}`
}

const generateDateRange = (start: Date, end: Date): Date[] => [start, end]

const isDateComplete = (value: string): boolean => value.length === 10

interface CreateInputHandlerParams {
	displayRange?: boolean
	dateFormatReturn?: string
	disableErrorHandling?: boolean
	initialDisplayFormattedDate?: string
	initialSelectedDates?: DateObjectValue
	isFormatting?: boolean
	isManualInputActive?: boolean
}

const createInputHandler = ({
	displayRange = false,
	dateFormatReturn,
	disableErrorHandling = false,
	initialDisplayFormattedDate = '',
	initialSelectedDates = null,
	isFormatting = false,
	isManualInputActive = true,
}: CreateInputHandlerParams = {}) => {
	const displayFormattedDate = ref(initialDisplayFormattedDate)
	const selectedDates = ref<DateObjectValue>(initialSelectedDates)
	const formattingState = ref(isFormatting)
	const manualInputState = ref(isManualInputActive)
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
		format: 'DD/MM/YYYY',
		displayRange,
		dateFormatReturn,
		disableErrorHandling,
		parseDate,
		formatDate,
		generateDateRange,
		isDateComplete,
		displayFormattedDate,
		selectedDates,
		isFormatting: formattingState,
		isManualInputActive: manualInputState,
		isUpdatingFromInternal,
		clearValidation,
		validateField,
		updateModel,
		emitInput,
		inputRef,
	})

	return {
		handleInput,
		displayFormattedDate,
		selectedDates,
		isFormatting: formattingState,
		clearValidation,
		validateField,
		updateModel,
		emitInput,
		inputElement,
	}
}

const triggerInput = (
	inputElement: HTMLInputElement,
	handleInput: (event: Event) => void,
	value: string,
) => {
	inputElement.value = value
	inputElement.selectionStart = value.length
	inputElement.selectionEnd = value.length

	handleInput({ target: inputElement } as unknown as Event)
}

afterEach(() => {
	vi.useRealTimers()
})

describe('useInputHandler', () => {
	it('synchronise une date simple complète avec le modèle et la validation', () => {
		const {
			handleInput,
			displayFormattedDate,
			selectedDates,
			clearValidation,
			validateField,
			updateModel,
			inputElement,
		} = createInputHandler()

		triggerInput(inputElement, handleInput, '01/01/2023')

		expect(displayFormattedDate.value).toBe('01/01/2023')
		expect(selectedDates.value).toBeInstanceOf(Date)
		expect(clearValidation).toHaveBeenCalledTimes(1)
		expect(validateField).toHaveBeenCalledTimes(1)
		expect(updateModel).toHaveBeenCalledWith('01/01/2023')
	})

	it('utilise dateFormatReturn pour le modèle sans changer l’affichage en saisie simple', () => {
		const {
			handleInput,
			displayFormattedDate,
			updateModel,
			inputElement,
		} = createInputHandler({ dateFormatReturn: 'YYYY-MM-DD' })

		triggerInput(inputElement, handleInput, '01/01/2023')

		expect(displayFormattedDate.value).toBe('01/01/2023')
		expect(updateModel).toHaveBeenCalledWith('2023-01-01')
	})

	it('prépare la seconde borne en saisie de plage sans committer le modèle trop tôt', () => {
		vi.useFakeTimers()

		const {
			handleInput,
			displayFormattedDate,
			selectedDates,
			updateModel,
			inputElement,
		} = createInputHandler({ displayRange: true })

		triggerInput(inputElement, handleInput, '01/01/2023')
		vi.runAllTimers()

		expect(displayFormattedDate.value).toBe('01/01/2023 - ')
		expect(selectedDates.value).toEqual([new Date(2023, 0, 1), null])
		expect(updateModel).not.toHaveBeenCalled()
	})

	it('synchronise la seconde borne de plage sans déclencher de commit prématuré', () => {
		const {
			handleInput,
			displayFormattedDate,
			selectedDates,
			updateModel,
			inputElement,
		} = createInputHandler({
			displayRange: true,
			initialDisplayFormattedDate: '01/01/2023 - ',
			initialSelectedDates: [new Date(2023, 0, 1), null],
		})

		triggerInput(inputElement, handleInput, '01/01/2023 - 05/01/2023')

		expect(displayFormattedDate.value).toBe('01/01/2023 - 05/01/2023')
		expect(selectedDates.value).toEqual([new Date(2023, 0, 1), new Date(2023, 0, 5)])
		expect(updateModel).not.toHaveBeenCalled()
	})

	it('ne déclenche pas la validation personnalisée si elle est désactivée', () => {
		const {
			handleInput,
			validateField,
			updateModel,
			inputElement,
		} = createInputHandler({ disableErrorHandling: true })

		triggerInput(inputElement, handleInput, '01/01/2023')

		expect(updateModel).toHaveBeenCalledWith('01/01/2023')
		expect(validateField).not.toHaveBeenCalled()
	})

	it('ignore la saisie si le formatage interne est déjà en cours', () => {
		const {
			handleInput,
			displayFormattedDate,
			isFormatting,
			updateModel,
			emitInput,
		} = createInputHandler({ isFormatting: true })

		handleInput({ target: document.createElement('input') } as unknown as Event)

		expect(displayFormattedDate.value).toBe('')
		expect(updateModel).not.toHaveBeenCalled()
		expect(emitInput).not.toHaveBeenCalled()
		expect(isFormatting.value).toBe(true)
	})

	it('ignore la saisie quand le champ n’est pas en mode manuel', () => {
		const {
			handleInput,
			displayFormattedDate,
			isFormatting,
			updateModel,
			emitInput,
		} = createInputHandler({ isManualInputActive: false })

		handleInput({ target: document.createElement('input') } as unknown as Event)

		expect(displayFormattedDate.value).toBe('')
		expect(updateModel).not.toHaveBeenCalled()
		expect(emitInput).not.toHaveBeenCalled()
		expect(isFormatting.value).toBe(false)
	})
})
