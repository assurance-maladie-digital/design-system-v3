import { computed, type ComputedRef } from 'vue'

type ItemType = {
	[key: string]: unknown
}

export interface UseSyComboboxFormatItemsOptions {
	items: ComputedRef<ItemType[]>
	textKey: ComputedRef<string>
	valueKey: ComputedRef<string>
}

export function useSyComboboxFormatItems(options: UseSyComboboxFormatItemsOptions) {
	const formattedItems = computed(() => {
		return options.items.value.map((item) => {
			if (typeof item === 'string') {
				return { [options.textKey.value]: item, [options.valueKey.value]: item }
			}
			return item
		})
	})

	return { formattedItems }
}
