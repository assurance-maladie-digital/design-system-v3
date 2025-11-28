import { describe, it, expect, vi } from 'vitest'
import { useKeyboardEvents } from '../useKeyboardEvents'

describe('useKeyboardEvents', () => {
	it('handleKeyDown blocks disallowed characters', () => {
		const { handleKeyDown } = useKeyboardEvents()

		const preventDefault = vi.fn()
		const event = {
			key: 'a',
			ctrlKey: false,
			metaKey: false,
			preventDefault,
			target: document.createElement('input'),
		} as unknown as KeyboardEvent & { target: HTMLInputElement }

		handleKeyDown(event)

		expect(preventDefault).toHaveBeenCalledTimes(1)
	})

	it('handleKeyDown allows allowed characters and calls onKeyDown', () => {
		const onKeyDown = vi.fn()
		const { handleKeyDown } = useKeyboardEvents({ onKeyDown })

		const preventDefault = vi.fn()
		const target = document.createElement('input')
		const event = {
			key: '5',
			ctrlKey: false,
			metaKey: false,
			preventDefault,
			target,
		} as unknown as KeyboardEvent & { target: HTMLInputElement }

		handleKeyDown(event)

		expect(preventDefault).not.toHaveBeenCalled()
		expect(onKeyDown).toHaveBeenCalledWith(event)
	})

	it('handleKeyDown allows disallowed characters when used with ctrl/meta (shortcuts)', () => {
		const { handleKeyDown } = useKeyboardEvents()

		const preventDefault = vi.fn()
		const target = document.createElement('input')
		const event = {
			key: 'a',
			ctrlKey: true,
			metaKey: false,
			preventDefault,
			target,
		} as unknown as KeyboardEvent & { target: HTMLInputElement }

		handleKeyDown(event)

		expect(preventDefault).not.toHaveBeenCalled()
	})

	it('handleKeyDown allows special keys like Backspace', () => {
		const { handleKeyDown } = useKeyboardEvents()

		const preventDefault = vi.fn()
		const target = document.createElement('input')
		const event = {
			key: 'Backspace',
			ctrlKey: false,
			metaKey: false,
			preventDefault,
			target,
		} as unknown as KeyboardEvent & { target: HTMLInputElement }

		handleKeyDown(event)

		expect(preventDefault).not.toHaveBeenCalled()
	})

	it('handleArrowKeys skips over separator when moving left and right', () => {
		const { handleArrowKeys } = useKeyboardEvents({ separator: '/' })

		const setSelectionRange = vi.fn()
		const input = {
			value: '01/01/2023',
			selectionStart: 3,
			selectionEnd: 3,
			setSelectionRange,
		} as unknown as HTMLInputElement

		// Cursor just after the separator: index 3 (0-based)
		const preventDefaultLeft = vi.fn()
		const leftEvent = {
			key: 'ArrowLeft',
			target: input,
			preventDefault: preventDefaultLeft,
		} as unknown as KeyboardEvent & { target: HTMLInputElement }

		handleArrowKeys(leftEvent)

		expect(preventDefaultLeft).toHaveBeenCalled()
		expect(setSelectionRange).toHaveBeenCalledWith(1, 1)

		// Now test ArrowRight from just before the separator
		input.selectionStart = 2
		input.selectionEnd = 2

		const preventDefaultRight = vi.fn()
		const rightEvent = {
			key: 'ArrowRight',
			target: input,
			preventDefault: preventDefaultRight,
		} as unknown as KeyboardEvent & { target: HTMLInputElement }

		handleArrowKeys(rightEvent)

		expect(preventDefaultRight).toHaveBeenCalled()
		expect(setSelectionRange).toHaveBeenCalledWith(4, 4)
	})

	it('handlePaste prevents paste when no allowed characters remain after filtering', () => {
		const { handlePaste } = useKeyboardEvents()
		const input = document.createElement('input')
		input.value = ''

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

	it('handlePaste inserts filtered allowed characters and moves cursor', () => {
		vi.useFakeTimers()
		const { handlePaste } = useKeyboardEvents()
		const input = document.createElement('input')
		input.value = ''
		input.selectionStart = 0
		input.selectionEnd = 0

		const preventDefault = vi.fn()
		const event = {
			clipboardData: {
				getData: vi.fn(() => '1a2'),
			},
			preventDefault,
			target: input,
		} as unknown as ClipboardEvent
		const dispatchSpy = vi.spyOn(input, 'dispatchEvent')

		const setSelectionRangeSpy = vi.spyOn(input, 'setSelectionRange')

		handlePaste(event)
		vi.runAllTimers()

		expect(preventDefault).toHaveBeenCalledTimes(1)
		expect(input.value).toBe('12')
		expect(dispatchSpy).toHaveBeenCalled()
		expect(setSelectionRangeSpy).toHaveBeenCalled()
		vi.useRealTimers()
	})
})
