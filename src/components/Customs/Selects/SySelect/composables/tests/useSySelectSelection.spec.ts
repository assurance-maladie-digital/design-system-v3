import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

import { useSySelectSelection } from '../useSySelectSelection'

describe('useSySelectSelection', () => {
	it('selectItem emits valueKey when returnObject is false (single)', () => {
		const emitUpdateModelValue = vi.fn()
		const selectedItem = ref<string | null>(null)
		const isOpen = ref(true)

		const { selectItem } = useSySelectSelection({
			items: ref([{ text: 'A', value: 'a' }]),
			formattedItems: ref([{ text: 'A', value: 'a' }]),
			selectedItem,
			multiple: ref(false),
			chips: ref(false),
			returnObject: ref(false),
			textKey: ref('text'),
			plainTextKey: ref(''),
			valueKey: ref('value'),
			allowHtml: ref(false),
			isOpen,
			ensureNativeInputFocus: () => {},
			setActiveDescendant: () => {},
			restoreFocus: () => {},
			emitUpdateModelValue,
		})

		selectItem({ text: 'A', value: 'a' })
		expect(emitUpdateModelValue).toHaveBeenCalledWith('a')
		expect(isOpen.value).toBe(false)
	})
})
