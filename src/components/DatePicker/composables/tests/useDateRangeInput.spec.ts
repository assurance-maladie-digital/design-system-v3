import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDateRangeInput } from '../useDateRangeInput'

describe('useDateRangeInput', () => {
	const format = 'DD/MM/YYYY'
	const mockParseDate = vi.fn()
	const mockFormatDate = vi.fn()

	beforeEach(() => {
		mockParseDate.mockReset()
		mockFormatDate.mockReset()

		mockParseDate.mockImplementation((dateStr) => {
			if (dateStr === '01/01/2023') return new Date(2023, 0, 1)
			if (dateStr === '10/01/2023') return new Date(2023, 0, 10)
			if (dateStr === '1') return null
			return null
		})

		mockFormatDate.mockImplementation((date) => {
			if (date.getTime() === new Date(2023, 0, 1).getTime()) return '01/01/2023'
			if (date.getTime() === new Date(2023, 0, 10).getTime()) return '10/01/2023'
			return ''
		})
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('formate une plage partielle ou complète pour l’affichage', () => {
		const { formatRangeForDisplay } = useDateRangeInput(format, true, mockParseDate, mockFormatDate)

		expect(formatRangeForDisplay(null, new Date(2023, 0, 10))).toBe('')
		expect(formatRangeForDisplay(new Date(2023, 0, 1), null)).toBe('01/01/2023 - ')
		expect(formatRangeForDisplay(new Date(2023, 0, 1), new Date(2023, 0, 10))).toBe('01/01/2023 - 10/01/2023')
	})

	it('parse une date seule ou une plage complète', () => {
		const { parseRangeInput } = useDateRangeInput(format, true, mockParseDate, mockFormatDate)

		expect(parseRangeInput('')).toEqual([null, null])
		expect(parseRangeInput('01/01/2023')).toEqual([new Date(2023, 0, 1), null])
		expect(parseRangeInput('01/01/2023 - 10/01/2023')).toEqual([new Date(2023, 0, 1), new Date(2023, 0, 10)])
	})

	it('traite une saisie simple en mode non-plage', () => {
		const { handleRangeInput } = useDateRangeInput(format, false, mockParseDate, mockFormatDate)

		const result = handleRangeInput('', '01/01/2023')

		expect(result).toMatchObject({
			formattedValue: '01/01/2023',
			dates: [new Date(2023, 0, 1), null],
			isComplete: true,
		})
	})

	it('complète la première borne puis laisse saisir la seconde', () => {
		const { handleRangeInput } = useDateRangeInput(format, true, mockParseDate, mockFormatDate)

		const firstStep = handleRangeInput('', '01/01/2023')
		expect(firstStep).toMatchObject({
			formattedValue: '01/01/2023 - ',
			dates: [new Date(2023, 0, 1), null],
			isComplete: false,
			justCompletedFirstDate: true,
		})

		const secondStep = handleRangeInput('01/01/2023 - ', '01/01/2023 - 1')
		expect(secondStep).toMatchObject({
			formattedValue: '01/01/2023 - 1',
			dates: [new Date(2023, 0, 1), null],
			isComplete: false,
		})
	})

	it('reconnaît une plage complète quand la seconde borne devient valide', () => {
		const { handleRangeInput } = useDateRangeInput(format, true, mockParseDate, mockFormatDate)

		const result = handleRangeInput('01/01/2023 - 1', '01/01/2023 - 10/01/2023')

		expect(result).toMatchObject({
			formattedValue: '01/01/2023 - 10/01/2023',
			dates: [new Date(2023, 0, 1), new Date(2023, 0, 10)],
			isComplete: true,
		})
	})

	it('valide l’ordre chronologique d’une plage', () => {
		const { isValidRange } = useDateRangeInput(format, true, mockParseDate, mockFormatDate)

		expect(isValidRange(new Date(2023, 0, 1), new Date(2023, 0, 10))).toBe(true)
		expect(isValidRange(new Date(2023, 0, 10), new Date(2023, 0, 1))).toBe(false)
		expect(isValidRange(new Date(2023, 0, 1), null)).toBe(true)
	})

	it('filtre le collage pour ne conserver que les chiffres', () => {
		vi.useFakeTimers()

		const { handlePaste } = useDateRangeInput(format, true, mockParseDate, mockFormatDate)
		const input = document.createElement('input')
		input.selectionStart = 0
		input.selectionEnd = 0
		const preventDefault = vi.fn()
		const dispatchSpy = vi.spyOn(input, 'dispatchEvent')
		const setSelectionRangeSpy = vi.spyOn(input, 'setSelectionRange')

		handlePaste({
			clipboardData: {
				getData: vi.fn(() => '01/0a/2023'),
			},
			preventDefault,
			target: input,
		} as unknown as ClipboardEvent)
		vi.runAllTimers()

		expect(preventDefault).toHaveBeenCalledTimes(1)
		expect(input.value).toBe('0102023')
		expect(dispatchSpy).toHaveBeenCalled()
		expect(setSelectionRangeSpy).toHaveBeenCalled()
	})
})
