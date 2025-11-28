import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useDateRangeInput } from '../useDateRangeInput'

describe('useDateRangeInput', () => {
	// Mocks et setup
	const format = 'DD/MM/YYYY'
	const mockParseDate = vi.fn()
	const mockFormatDate = vi.fn()

	beforeEach(() => {
		// Réinitialiser les mocks avant chaque test
		mockParseDate.mockReset()
		mockFormatDate.mockReset()

		// Configuration par défaut des mocks
		mockParseDate.mockImplementation((dateStr) => {
			if (dateStr === '01/01/2023') return new Date(2023, 0, 1)
			if (dateStr === '10/01/2023') return new Date(2023, 0, 10)
			if (dateStr === '01') return null // Date incomplète
			if (dateStr === '01/01') return null // Date incomplète
			return null
		})

		mockFormatDate.mockImplementation((date) => {
			if (date.getTime() === new Date(2023, 0, 1).getTime()) return '01/01/2023'
			if (date.getTime() === new Date(2023, 0, 10).getTime()) return '10/01/2023'
			return ''
		})
	})

	describe('hasRangeSeparator', () => {
		it('devrait retourner true si la valeur contient le séparateur de plage', () => {
			const { hasRangeSeparator } = useDateRangeInput(format, true, mockParseDate, mockFormatDate)

			expect(hasRangeSeparator('01/01/2023 - 10/01/2023')).toBe(true)
		})

		it('devrait retourner false si la valeur ne contient pas le séparateur de plage', () => {
			const { hasRangeSeparator } = useDateRangeInput(format, true, mockParseDate, mockFormatDate)

			expect(hasRangeSeparator('01/01/2023')).toBe(false)
		})
	})

	describe('extractRangeParts', () => {
		it('devrait extraire correctement les deux parties d\'une plage de dates', () => {
			const { extractRangeParts } = useDateRangeInput(format, true, mockParseDate, mockFormatDate)

			const [startStr, endStr] = extractRangeParts('01/01/2023 - 10/01/2023')

			expect(startStr).toBe('01/01/2023')
			expect(endStr).toBe('10/01/2023')
		})

		it('devrait retourner une chaîne vide pour la deuxième partie si elle n\'existe pas', () => {
			const { extractRangeParts } = useDateRangeInput(format, true, mockParseDate, mockFormatDate)

			const [startStr, endStr] = extractRangeParts('01/01/2023 - ')

			expect(startStr).toBe('01/01/2023')
			expect(endStr).toBe('')
		})
	})

	describe('formatRangeForDisplay', () => {
		it('devrait retourner une chaîne vide si la date de début est null', () => {
			const { formatRangeForDisplay } = useDateRangeInput(format, true, mockParseDate, mockFormatDate)

			const result = formatRangeForDisplay(null, new Date(2023, 0, 10))

			expect(result).toBe('')
		})

		it('devrait retourner la date de début suivie du séparateur de plage si la date de fin est null', () => {
			const { formatRangeForDisplay } = useDateRangeInput(format, true, mockParseDate, mockFormatDate)

			const startDate = new Date(2023, 0, 1)
			const result = formatRangeForDisplay(startDate, null)

			// Maintenant, nous attendons que le séparateur de plage soit inclus
			expect(result).toBe('01/01/2023 - ')
			expect(mockFormatDate).toHaveBeenCalledWith(startDate, format)
		})

		it('devrait formater correctement une plage de dates complète', () => {
			const { formatRangeForDisplay } = useDateRangeInput(format, true, mockParseDate, mockFormatDate)

			const startDate = new Date(2023, 0, 1)
			const endDate = new Date(2023, 0, 10)
			const result = formatRangeForDisplay(startDate, endDate)

			expect(result).toBe('01/01/2023 - 10/01/2023')
			expect(mockFormatDate).toHaveBeenCalledWith(startDate, format)
			expect(mockFormatDate).toHaveBeenCalledWith(endDate, format)
		})
	})

	describe('parseRangeInput', () => {
		it('devrait retourner [null, null] si la valeur est vide', () => {
			const { parseRangeInput } = useDateRangeInput(format, true, mockParseDate, mockFormatDate)

			const [startDate, endDate] = parseRangeInput('')

			expect(startDate).toBeNull()
			expect(endDate).toBeNull()
		})

		it('devrait parser correctement une plage de dates complète', () => {
			const { parseRangeInput } = useDateRangeInput(format, true, mockParseDate, mockFormatDate)

			const [startDate, endDate] = parseRangeInput('01/01/2023 - 10/01/2023')

			expect(startDate).toEqual(new Date(2023, 0, 1))
			expect(endDate).toEqual(new Date(2023, 0, 10))
			expect(mockParseDate).toHaveBeenCalledWith('01/01/2023', format)
			expect(mockParseDate).toHaveBeenCalledWith('10/01/2023', format)
		})

		it('devrait parser correctement une date unique sans séparateur', () => {
			const { parseRangeInput } = useDateRangeInput(format, true, mockParseDate, mockFormatDate)

			const [startDate, endDate] = parseRangeInput('01/01/2023')

			expect(startDate).toEqual(new Date(2023, 0, 1))
			expect(endDate).toBeNull()
			expect(mockParseDate).toHaveBeenCalledWith('01/01/2023', format)
		})
	})

	describe('handleRangeInput', () => {
		it('devrait traiter une date unique en mode non-plage', () => {
			const { handleRangeInput } = useDateRangeInput(format, false, mockParseDate, mockFormatDate)

			const result = handleRangeInput('', '01/01/2023')

			expect(result.formattedValue).toBe('01/01/2023')
			expect(result.dates[0]).toEqual(new Date(2023, 0, 1))
			expect(result.dates[1]).toBeNull()
			expect(result.isComplete).toBe(true)
		})

		it('devrait ajouter automatiquement le séparateur quand la première date est complète', () => {
			const { handleRangeInput } = useDateRangeInput(format, true, mockParseDate, mockFormatDate)

			const result = handleRangeInput('', '01/01/2023')

			expect(result.formattedValue).toBe('01/01/2023 - ')
			expect(result.dates[0]).toEqual(new Date(2023, 0, 1))
			expect(result.dates[1]).toBeNull()
			expect(result.isComplete).toBe(false)
			expect(result.justCompletedFirstDate).toBe(true)
			expect(result.cursorPosition).toBe('01/01/2023 - '.length)
		})

		it('devrait détecter le début de la saisie de la seconde date', () => {
			const { handleRangeInput } = useDateRangeInput(format, true, mockParseDate, mockFormatDate)

			const result = handleRangeInput('01/01/2023 - ', '01/01/2023 - 1')

			expect(result.formattedValue).toBe('01/01/2023 - 1')
			expect(result.dates[0]).toEqual(new Date(2023, 0, 1))
			expect(result.dates[1]).toBeNull() // Car '1' n'est pas une date valide
			expect(result.isComplete).toBe(false)
			expect(result.cursorPosition).toBe('01/01/2023 - 1'.length)
		})

		it('devrait gérer correctement une plage de dates complète', () => {
			const { handleRangeInput } = useDateRangeInput(format, true, mockParseDate, mockFormatDate)

			const result = handleRangeInput('01/01/2023 - 1', '01/01/2023 - 10/01/2023')

			expect(result.formattedValue).toBe('01/01/2023 - 10/01/2023')
			expect(result.dates[0]).toEqual(new Date(2023, 0, 1))
			expect(result.dates[1]).toEqual(new Date(2023, 0, 10))
			expect(result.isComplete).toBe(true)
		})
	})

	describe('initializeWithDates', () => {
		it('devrait initialiser correctement l\'état avec des dates existantes', () => {
			const { initializeWithDates, firstDate, secondDate, isEditingSecondDate } = useDateRangeInput(format, true, mockParseDate, mockFormatDate)

			const startDate = new Date(2023, 0, 1)
			const endDate = new Date(2023, 0, 10)

			initializeWithDates(startDate, endDate)

			expect(firstDate.value).toBe(startDate)
			expect(secondDate.value).toBe(endDate)
			expect(isEditingSecondDate.value).toBe(true)
		})

		it('devrait initialiser isEditingSecondDate à false si une des dates est null', () => {
			const { initializeWithDates, firstDate, secondDate, isEditingSecondDate } = useDateRangeInput(format, true, mockParseDate, mockFormatDate)

			const startDate = new Date(2023, 0, 1)

			initializeWithDates(startDate, null)

			expect(firstDate.value).toBe(startDate)
			expect(secondDate.value).toBeNull()
			expect(isEditingSecondDate.value).toBe(false)
		})
	})

	describe('resetState', () => {
		it('devrait réinitialiser l\'état', () => {
			const { initializeWithDates, resetState, firstDate, secondDate, isEditingSecondDate } = useDateRangeInput(format, true, mockParseDate, mockFormatDate)

			// Initialiser d'abord avec des valeurs
			initializeWithDates(new Date(2023, 0, 1), new Date(2023, 0, 10))

			// Puis réinitialiser
			resetState()

			expect(firstDate.value).toBeNull()
			expect(secondDate.value).toBeNull()
			expect(isEditingSecondDate.value).toBe(false)
		})
	})

	describe('isValidRange', () => {
		it('devrait retourner true si la date de début est antérieure à la date de fin', () => {
			const { isValidRange } = useDateRangeInput(format, true, mockParseDate, mockFormatDate)

			const startDate = new Date(2023, 0, 1)
			const endDate = new Date(2023, 0, 10)

			expect(isValidRange(startDate, endDate)).toBe(true)
		})

		it('devrait retourner true si les dates sont identiques', () => {
			const { isValidRange } = useDateRangeInput(format, true, mockParseDate, mockFormatDate)

			const date = new Date(2023, 0, 1)

			expect(isValidRange(date, date)).toBe(true)
		})

		it('devrait retourner false si la date de début est postérieure à la date de fin', () => {
			const { isValidRange } = useDateRangeInput(format, true, mockParseDate, mockFormatDate)

			const startDate = new Date(2023, 0, 10)
			const endDate = new Date(2023, 0, 1)

			expect(isValidRange(startDate, endDate)).toBe(false)
		})

		it('devrait retourner true si une des dates est null', () => {
			const { isValidRange } = useDateRangeInput(format, true, mockParseDate, mockFormatDate)

			const date = new Date(2023, 0, 1)

			expect(isValidRange(date, null)).toBe(true)
			expect(isValidRange(null, date)).toBe(true)
			expect(isValidRange(null, null)).toBe(true)
		})
	})

	describe('currentRangeIsValid', () => {
		it('devrait retourner true si la plage est valide', () => {
			const { initializeWithDates, currentRangeIsValid } = useDateRangeInput(format, true, mockParseDate, mockFormatDate)

			initializeWithDates(new Date(2023, 0, 1), new Date(2023, 0, 10))

			expect(currentRangeIsValid.value).toBe(true)
		})

		it('devrait retourner false si la plage est invalide', () => {
			const { initializeWithDates, currentRangeIsValid } = useDateRangeInput(format, true, mockParseDate, mockFormatDate)

			initializeWithDates(new Date(2023, 0, 10), new Date(2023, 0, 1))

			expect(currentRangeIsValid.value).toBe(false)
		})
	})

	describe('handleKeydown', () => {
		it('devrait bloquer les caractères non numériques et non spéciaux', () => {
			const { handleKeydown } = useDateRangeInput(format, true, mockParseDate, mockFormatDate)
			const preventDefault = vi.fn()
			const input = document.createElement('input')
			const event = {
				key: 'a',
				altKey: false,
				ctrlKey: false,
				metaKey: false,
				preventDefault,
				target: input,
			} as unknown as KeyboardEvent & { target: HTMLInputElement }

			handleKeydown(event)

			expect(preventDefault).toHaveBeenCalledTimes(1)
		})

		it('devrait autoriser les chiffres', () => {
			const { handleKeydown } = useDateRangeInput(format, true, mockParseDate, mockFormatDate)
			const preventDefault = vi.fn()
			const input = document.createElement('input')
			const event = {
				key: '5',
				altKey: false,
				ctrlKey: false,
				metaKey: false,
				preventDefault,
				target: input,
			} as unknown as KeyboardEvent & { target: HTMLInputElement }

			handleKeydown(event)

			expect(preventDefault).not.toHaveBeenCalled()
		})

		it('devrait supprimer le séparateur de plage avec Backspace en mode plage', () => {
			vi.useFakeTimers()
			const { handleKeydown } = useDateRangeInput(format, true, mockParseDate, mockFormatDate)
			const preventDefault = vi.fn()
			const input = document.createElement('input')
			input.value = '01/01/2023 - 10/01/2023'
			const separatorPos = '01/01/2023 - '.length
			input.selectionStart = separatorPos
			input.selectionEnd = separatorPos
			const dispatchSpy = vi.spyOn(input, 'dispatchEvent')

			const setSelectionRangeSpy = vi.spyOn(input, 'setSelectionRange')
			const event = {
				key: 'Backspace',
				altKey: false,
				ctrlKey: false,
				metaKey: false,
				preventDefault,
				target: input,
			} as unknown as KeyboardEvent & { target: HTMLInputElement }

			handleKeydown(event)
			vi.runAllTimers()

			expect(preventDefault).toHaveBeenCalledTimes(1)
			// L'implémentation retire uniquement le séparateur ' - ' sans ajouter d'espace
			expect(input.value).toBe('01/01/202310/01/2023')
			expect(dispatchSpy).toHaveBeenCalled()
			expect(setSelectionRangeSpy).toHaveBeenCalled()
			vi.useRealTimers()
		})

		it('ne fait rien de spécial pour Backspace si la sélection n’est pas au niveau du séparateur', () => {
			const { handleKeydown } = useDateRangeInput(format, true, mockParseDate, mockFormatDate)
			const preventDefault = vi.fn()
			const input = document.createElement('input')
			input.value = '01/01/2023 - 10/01/2023'
			input.selectionStart = 0
			input.selectionEnd = 0
			const dispatchSpy = vi.spyOn(input, 'dispatchEvent')
			const event = {
				key: 'Backspace',
				altKey: false,
				ctrlKey: false,
				metaKey: false,
				preventDefault,
				target: input,
			} as unknown as KeyboardEvent & { target: HTMLInputElement }

			handleKeydown(event)

			expect(preventDefault).not.toHaveBeenCalled()
			expect(dispatchSpy).not.toHaveBeenCalled()
		})

		it('ne déclenche pas la logique spécifique plage en mode non-plage', () => {
			const { handleKeydown } = useDateRangeInput(format, false, mockParseDate, mockFormatDate)
			const preventDefault = vi.fn()
			const input = document.createElement('input')
			input.value = '01/01/2023 - 10/01/2023'
			input.selectionStart = '01/01/2023 - '.length
			input.selectionEnd = input.selectionStart
			const dispatchSpy = vi.spyOn(input, 'dispatchEvent')
			const event = {
				key: 'Backspace',
				altKey: false,
				ctrlKey: false,
				metaKey: false,
				preventDefault,
				target: input,
			} as unknown as KeyboardEvent & { target: HTMLInputElement }

			handleKeydown(event)

			expect(preventDefault).not.toHaveBeenCalled()
			expect(dispatchSpy).not.toHaveBeenCalled()
		})
	})

	describe('handlePaste', () => {
		it('ne fait rien si clipboardData est manquant', () => {
			const { handlePaste } = useDateRangeInput(format, true, mockParseDate, mockFormatDate)
			const input = document.createElement('input')
			const preventDefault = vi.fn()
			const event = {
				clipboardData: null,
				preventDefault,
				target: input,
			} as unknown as ClipboardEvent

			handlePaste(event)
			expect(preventDefault).not.toHaveBeenCalled()
		})

		it('empêche le collage si aucun chiffre n’est présent', () => {
			const { handlePaste } = useDateRangeInput(format, true, mockParseDate, mockFormatDate)
			const input = document.createElement('input')
			const preventDefault = vi.fn()
			const event = {
				clipboardData: {
					getData: vi.fn(() => 'abc'),
				},
				preventDefault,
				target: input,
			} as unknown as ClipboardEvent

			handlePaste(event)

			expect(preventDefault).toHaveBeenCalledTimes(1)
			expect(input.value).toBe('')
		})

		it('filtre le texte collé et n’insère que les chiffres', () => {
			vi.useFakeTimers()
			const { handlePaste } = useDateRangeInput(format, true, mockParseDate, mockFormatDate)
			const input = document.createElement('input')
			input.value = ''
			input.selectionStart = 0
			input.selectionEnd = 0
			const preventDefault = vi.fn()
			const event = {
				clipboardData: {
					getData: vi.fn(() => '01/0a/2023'),
				},
				preventDefault,
				target: input,
			} as unknown as ClipboardEvent
			const dispatchSpy = vi.spyOn(input, 'dispatchEvent')

			const setSelectionRangeSpy = vi.spyOn(input, 'setSelectionRange')

			handlePaste(event)
			vi.runAllTimers()

			expect(preventDefault).toHaveBeenCalledTimes(1)
			expect(input.value).toBe('0102023')
			expect(dispatchSpy).toHaveBeenCalled()
			expect(setSelectionRangeSpy).toHaveBeenCalled()
			vi.useRealTimers()
		})

		it('ne modifie pas la valeur si le texte collé est déjà nettoyé', () => {
			const { handlePaste } = useDateRangeInput(format, true, mockParseDate, mockFormatDate)
			const input = document.createElement('input')
			input.value = ''
			const preventDefault = vi.fn()
			const event = {
				clipboardData: {
					getData: vi.fn(() => '01012023'),
				},
				preventDefault,
				target: input,
			} as unknown as ClipboardEvent

			handlePaste(event)

			expect(preventDefault).not.toHaveBeenCalled()
			expect(input.value).toBe('')
		})
	})
})
