import { describe, expect, it, vi } from 'vitest'
import { computed, ref } from 'vue'

import { useSyComboboxIds } from '../useSyComboboxIds'

describe('useSyComboboxIds', () => {
	it('generates inputId with prefix', () => {
		vi.spyOn(Math, 'random').mockReturnValue(0.123456789)

		const { inputId } = useSyComboboxIds({
			inputIdPrefix: 'sy-select',
			defaultMenuId: 'sy-select-menu',
			menuId: computed(() => 'sy-select-menu'),
		})

		expect(inputId.value.startsWith('sy-select-')).toBe(true)
	})

	it('generates a uniqueMenuId when menuId equals defaultMenuId', () => {
		vi.spyOn(Math, 'random').mockReturnValue(0.123456789)

		const { uniqueMenuId } = useSyComboboxIds({
			inputIdPrefix: 'sy-select',
			defaultMenuId: 'sy-select-menu',
			menuId: computed(() => 'sy-select-menu'),
		})

		expect(uniqueMenuId.value).toContain('sy-select-menu-')
	})

	it('keeps provided menuId when it differs from defaultMenuId', () => {
		const menuId = ref('custom-menu-id')
		const { uniqueMenuId } = useSyComboboxIds({
			inputIdPrefix: 'sy-select',
			defaultMenuId: 'sy-select-menu',
			menuId,
		})

		expect(uniqueMenuId.value).toBe('custom-menu-id')
	})
})
