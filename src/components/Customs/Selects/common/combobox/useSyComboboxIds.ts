import { ref, type Ref } from 'vue'

export interface UseSyComboboxIdsOptions {
	inputIdPrefix: string
	defaultMenuId: string
	menuId: Ref<string>
}

export function useSyComboboxIds(options: UseSyComboboxIdsOptions) {
	const inputId = ref(`${options.inputIdPrefix}-${Math.random().toString(36).substring(7)}`)
	const uniqueMenuId = ref(
		options.menuId.value === options.defaultMenuId
			? `${options.defaultMenuId}-${Math.random().toString(36).substring(7)}`
			: options.menuId.value,
	)

	return {
		inputId,
		uniqueMenuId,
	}
}
