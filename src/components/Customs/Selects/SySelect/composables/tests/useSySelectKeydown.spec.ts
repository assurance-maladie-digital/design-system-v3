import { describe, expect, it, vi } from 'vitest'

import { useSySelectKeydown } from '../useSySelectKeydown'

const fieldKeydownSpy = vi.fn((opts: unknown) => {
	void opts
	return { onFieldKeydown: vi.fn() }
})
const listKeydownSpy = vi.fn((opts: unknown) => {
	void opts
	return { onListKeydown: vi.fn() }
})
vi.mock('../../../common/combobox/useSyComboboxFieldKeydown', () => {
	return {
		useSyComboboxFieldKeydown: (opts: unknown) => fieldKeydownSpy(opts),
	}
})
vi.mock('../../../common/combobox/useSyComboboxListKeydown', () => {
	return {
		useSyComboboxListKeydown: (opts: unknown) => listKeydownSpy(opts),
	}
})

describe('useSySelectKeydown', () => {
	it('delegates printable character handling to useSyComboboxFieldKeydown', () => {
		const handleCharacterKey = vi.fn()
		const api = useSySelectKeydown({
			handleEnterKey: vi.fn(),
			handleSpaceKey: vi.fn(),
			handleDownKey: vi.fn(),
			handleUpKey: vi.fn(),
			handleEscapeKey: vi.fn(),
			handleHomeKey: vi.fn(),
			handleEndKey: vi.fn(),
			handlePageUpKey: vi.fn(),
			handlePageDownKey: vi.fn(),
			handleTabKey: vi.fn(),
			handleCharacterKey,
			closeList: vi.fn(),
		})

		api.onFieldKeydown(new KeyboardEvent('keydown', { key: 'a' }))
		expect(fieldKeydownSpy).toHaveBeenCalledTimes(1)
		const opts = fieldKeydownSpy.mock.calls[0]?.[0] as unknown as { onCharacter: (_e: KeyboardEvent, key: string) => void }
		expect(opts).toBeTruthy()
		opts.onCharacter(new KeyboardEvent('keydown', { key: 'a' }), 'a')
		expect(handleCharacterKey).toHaveBeenCalledWith('a')
	})
})
