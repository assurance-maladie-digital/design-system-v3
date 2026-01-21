import { nextTick, watch, type Ref } from 'vue'

export interface UseSySelectOpenFocusOptions {
	isOpen: Ref<boolean>
	restoreOnOpen: boolean
	initialFocusIndex: number
	formattedItemsLength: Ref<number>
	lastFocusedIndex: Ref<number>
	setActiveDescendant: (index: number) => void
	clearVisualFocus: () => void
}

export function useSySelectOpenFocus(options: UseSySelectOpenFocusOptions) {
	watch(options.isOpen, (open) => {
		if (open) {
			nextTick(() => {
				if (
					options.restoreOnOpen
					&& options.lastFocusedIndex.value >= 0
					&& options.lastFocusedIndex.value < options.formattedItemsLength.value
				) {
					options.setActiveDescendant(options.lastFocusedIndex.value)
					return
				}

				const safeInitialIndex = Math.min(
					Math.max(options.initialFocusIndex, 0),
					Math.max(options.formattedItemsLength.value - 1, 0),
				)
				options.setActiveDescendant(safeInitialIndex)
			})
		}
		else {
			options.clearVisualFocus()
		}
	})
}
