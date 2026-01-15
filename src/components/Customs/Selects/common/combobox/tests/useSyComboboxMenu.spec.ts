import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'

import { useSyComboboxMenu } from '../useSyComboboxMenu'

describe('useSyComboboxMenu', () => {
	it('openMenu sets isOpen and schedules initial active index', async () => {
		const readonly = ref(false)
		const multiple = ref(false)
		const isOpen = ref(false)
		const list = ref<{ $el?: HTMLElement } | null>(null)
		const setActiveDescendant = vi.fn()
		const getInitialActiveIndex = vi.fn(() => 2)

		const { openMenu } = useSyComboboxMenu({
			readonly,
			multiple,
			isOpen,
			list,
			setActiveDescendant,
			getInitialActiveIndex,
		})

		openMenu()
		expect(isOpen.value).toBe(true)

		await nextTick()
		expect(getInitialActiveIndex).toHaveBeenCalled()
		expect(setActiveDescendant).toHaveBeenCalledWith(2)
	})

	it('toggleMenu closes when already open', () => {
		const readonly = ref(false)
		const multiple = ref(false)
		const isOpen = ref(true)
		const list = ref<{ $el?: HTMLElement } | null>(null)

		const { toggleMenu } = useSyComboboxMenu({
			readonly,
			multiple,
			isOpen,
			list,
			setActiveDescendant: vi.fn(),
			getInitialActiveIndex: vi.fn(() => 0),
		})

		toggleMenu()
		expect(isOpen.value).toBe(false)
	})

	it('closeList keeps menu open on multiple click inside list', () => {
		const readonly = ref(false)
		const multiple = ref(true)
		const isOpen = ref(true)
		const listEl = document.createElement('div')
		const list = ref<{ $el?: HTMLElement } | null>({ $el: listEl })

		const { closeList } = useSyComboboxMenu({
			readonly,
			multiple,
			isOpen,
			list,
			setActiveDescendant: vi.fn(),
			getInitialActiveIndex: vi.fn(() => 0),
		})

		const inside = document.createElement('button')
		listEl.appendChild(inside)

		closeList({ target: inside } as unknown as Event)
		expect(isOpen.value).toBe(true)
	})
})
