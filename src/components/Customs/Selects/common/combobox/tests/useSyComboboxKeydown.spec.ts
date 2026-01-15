import { describe, expect, it, vi } from 'vitest'

import { useSyComboboxFieldKeydown } from '../useSyComboboxFieldKeydown'
import { useSyComboboxListKeydown } from '../useSyComboboxListKeydown'

describe('useSyComboboxFieldKeydown', () => {
	it('routes ArrowDown and prevents default', () => {
		const onArrowDown = vi.fn()
		const { onFieldKeydown } = useSyComboboxFieldKeydown({ onArrowDown })

		const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
		const preventDefault = vi.spyOn(event, 'preventDefault')

		onFieldKeydown(event)
		expect(preventDefault).toHaveBeenCalled()
		expect(onArrowDown).toHaveBeenCalledWith(event)
	})

	it('calls onCharacter for printable key', () => {
		const onCharacter = vi.fn()
		const { onFieldKeydown } = useSyComboboxFieldKeydown({ onCharacter })

		const event = new KeyboardEvent('keydown', { key: 'a' })
		onFieldKeydown(event)
		expect(onCharacter).toHaveBeenCalledWith(event, 'a')
	})
})

describe('useSyComboboxListKeydown', () => {
	it('routes Home and prevents default', () => {
		const onHome = vi.fn()
		const { onListKeydown } = useSyComboboxListKeydown({
			onEscape: vi.fn(),
			onTab: vi.fn(),
			onEnter: vi.fn(),
			onArrowDown: vi.fn(),
			onArrowUp: vi.fn(),
			onHome,
			onEnd: vi.fn(),
			onPageUp: vi.fn(),
			onPageDown: vi.fn(),
		})

		const event = new KeyboardEvent('keydown', { key: 'Home' })
		const preventDefault = vi.spyOn(event, 'preventDefault')

		onListKeydown(event)
		expect(preventDefault).toHaveBeenCalled()
		expect(onHome).toHaveBeenCalledWith(event)
	})
})
