import { type Ref } from 'vue'

export interface AccordionItem {
	id: string
	title: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- mock Axios headers
	content: any
	headingLevel?: number
	disabled?: boolean
}

export interface AccordionKeyboardNavigation {
	handleKeyNavigation: (event: KeyboardEvent, itemId: string, index: number) => void
}

export default function useAccordionKeyboardNavigation(
	items: Ref<AccordionItem[]> | AccordionItem[],
	setFocus: (itemId: string | null) => void,
): AccordionKeyboardNavigation {
	// Gestion de la navigation clavier entre les éléments d'accordéon
	const handleKeyNavigation = (event: KeyboardEvent, itemId: string, index: number) => {
		if (event.key === 'ArrowDown') {
			event.preventDefault()
			focusNextHeader(index)
		}
		else if (event.key === 'ArrowUp') {
			event.preventDefault()
			focusPreviousHeader(index)
		}
		else if (event.key === 'Home') {
			event.preventDefault()
			focusFirstHeader()
		}
		else if (event.key === 'End') {
			event.preventDefault()
			focusLastHeader()
		}
	}

	const getItemsArray = (): AccordionItem[] => {
		return 'value' in items ? items.value : items
	}

	const focusNextHeader = (currentIndex: number) => {
		const itemsArray = getItemsArray()
		let nextIndex = (currentIndex + 1) % itemsArray.length

		// Si le prochain élément est désactivé, on continue à chercher
		let attempts = 0
		while (itemsArray[nextIndex].disabled && attempts < itemsArray.length) {
			nextIndex = (nextIndex + 1) % itemsArray.length
			attempts++
		}

		focusHeaderByIndex(nextIndex)
	}

	const focusPreviousHeader = (currentIndex: number) => {
		const itemsArray = getItemsArray()
		let prevIndex = (currentIndex - 1 + itemsArray.length) % itemsArray.length

		// Si l'élément précédent est désactivé, on continue à chercher
		let attempts = 0
		while (itemsArray[prevIndex].disabled && attempts < itemsArray.length) {
			prevIndex = (prevIndex - 1 + itemsArray.length) % itemsArray.length
			attempts++
		}

		focusHeaderByIndex(prevIndex)
	}

	const focusFirstHeader = () => {
		const itemsArray = getItemsArray()
		let index = 0

		// Si le premier élément est désactivé, on cherche le prochain disponible
		while (index < itemsArray.length && itemsArray[index].disabled) {
			index++
		}

		if (index < itemsArray.length) {
			focusHeaderByIndex(index)
		}
	}

	const focusLastHeader = () => {
		const itemsArray = getItemsArray()
		let index = itemsArray.length - 1

		// Si le dernier élément est désactivé, on cherche le précédent disponible
		while (index >= 0 && itemsArray[index].disabled) {
			index--
		}

		if (index >= 0) {
			focusHeaderByIndex(index)
		}
	}

	const focusHeaderByIndex = (index: number) => {
		const itemsArray = getItemsArray()
		const itemId = itemsArray[index].id
		const headerElement = document.getElementById(`accordion-button-${itemId}`)
		headerElement?.focus()
		setFocus(itemId)
	}

	return {
		handleKeyNavigation,
	}
}
