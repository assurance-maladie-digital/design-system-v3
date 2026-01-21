import { watchEffect, type ComputedRef, type Ref } from 'vue'

import { sanitizeHtml } from '@/utils/sanitizeHtml'

export interface UseSyComboboxHtmlItemsOptions<ItemType> {
	allowHtml: Ref<boolean>
	htmlItemRefs: Ref<HTMLElement[]>
	formattedItems: ComputedRef<ItemType[]>
	getItemText: (item: ItemType) => string
}

export function useSyComboboxHtmlItems<ItemType>(options: UseSyComboboxHtmlItemsOptions<ItemType>) {
	watchEffect(() => {
		if (!options.allowHtml.value) {
			return
		}

		options.htmlItemRefs.value.forEach((el, index) => {
			const item = options.formattedItems.value[index]
			if (!el || !item) {
				return
			}
			el.innerHTML = sanitizeHtml(String(options.getItemText(item) ?? ''))
		})
	})
}
