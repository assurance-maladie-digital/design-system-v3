import { computed, type Ref } from 'vue'

type UseSyComboboxCalculatedWidthOptions = {
	width: Ref<string>
}

export function useSyComboboxCalculatedWidth(options: UseSyComboboxCalculatedWidthOptions) {
	const calculatedWidth = computed(() => {
		if (options.width.value && options.width.value !== 'undefined') {
			const numericValue = Number(options.width.value)
			if (!isNaN(numericValue) && options.width.value === numericValue.toString()) {
				return `${numericValue}px`
			}
			return options.width.value
		}
		return undefined
	})

	return { calculatedWidth }
}
