import { ref } from 'vue'

export interface AccordionState {
	openItems: { value: string[] }
	focusedItemId: { value: string | null }
	toggleItem: (itemId: string) => void
	isItemOpen: (itemId: string) => boolean
	isItemFocused: (itemId: string) => boolean
	setFocus: (itemId: string | null) => void
}

export default function useAccordionState(openItems: Ref<string[]>): AccordionState {
	const focusedItemId = ref<string | null>(null)

	const toggleItem = (itemId: string) => {
		// Si cet élément est déjà focalisé, on le garde en mémoire
		const wasFocused = focusedItemId.value === itemId

		const index = openItems.value.indexOf(itemId)
		if (index === -1) {
			openItems.value = [...openItems.value, itemId]
			setFocus(itemId)
		}
		else {
			openItems.value = openItems.value.filter(id => id !== itemId)
			if (!wasFocused) {
				setFocus(itemId)
			}
			else {
				setFocus(null)
			}
		}
	}

	const isItemOpen = (itemId: string) => {
		return openItems.value.includes(itemId)
	}

	const isItemFocused = (itemId: string) => {
		return focusedItemId.value === itemId
	}

	// Méthode pour définir explicitement le focus sur un élément
	const setFocus = (itemId: string | null) => {
		if (focusedItemId.value === itemId) return

		focusedItemId.value = itemId
	}

	return {
		openItems,
		focusedItemId,
		toggleItem,
		isItemOpen,
		isItemFocused,
		setFocus,
	}
}
