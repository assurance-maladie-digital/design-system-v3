import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

import { useSySelectMenu } from '../useSySelectMenu'

vi.mock('../../../common/combobox/useSyComboboxMenu', () => {
	return {
		useSyComboboxMenu: vi.fn(() => {
			return {
				toggleMenu: vi.fn(),
				closeList: vi.fn(),
			}
		}),
	}
})

import { useSyComboboxMenu } from '../../../common/combobox/useSyComboboxMenu'

describe('useSySelectMenu', () => {
	it('wires useSyComboboxMenu and computes initial active index from selected item', () => {
		const readonly = ref(false)
		const multiple = ref(false)
		const isOpen = ref(false)
		const list = ref<{ $el?: HTMLElement } | null>(null)
		const formattedItems = ref([{ id: 1 }, { id: 2 }, { id: 3 }])
		const setActiveDescendant = vi.fn()
		const isItemSelected = vi.fn((item: Record<string, unknown>) => item.id === 2)

		useSySelectMenu({
			readonly,
			multiple,
			isOpen,
			list,
			formattedItems,
			isItemSelected: isItemSelected as unknown as (item: { [key: string]: unknown }) => boolean,
			setActiveDescendant,
		})

		const mocked = vi.mocked(useSyComboboxMenu)
		expect(mocked).toHaveBeenCalledTimes(1)
		const callArgs = mocked.mock.calls[0]?.[0] as unknown as { getInitialActiveIndex: () => number }
		expect(callArgs).toBeTruthy()
		expect(callArgs.getInitialActiveIndex()).toBe(1)
	})
})
