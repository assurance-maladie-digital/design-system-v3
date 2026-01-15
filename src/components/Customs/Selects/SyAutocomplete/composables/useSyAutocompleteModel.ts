import { watch, type Ref } from 'vue'

import type { SelectItemArrayType, SelectItemValueType } from '../types'

type UseSyAutocompleteModelOptions = {
	// Props as refs
	modelValue: Ref<SelectItemValueType | SelectItemArrayType>
	search: Ref<string>
	multiple: Ref<boolean>
	minChars: Ref<number>
	getSelectedText: () => string | null

	// Internal state
	selectedItem: Ref<SelectItemValueType | SelectItemArrayType>
	searchValue: Ref<string>
	isOpen: Ref<boolean>
	pendingFocusIndex: Ref<number | null>

	// Side-effects
	openMenu: (skipInitialFocus?: boolean) => void
	resetFetchState: () => void
	scheduleFetch: (query: string) => void
	clearActiveDescendant: () => void
	markTouched: () => void
	markOpenedByTyping: (value: boolean) => void

	emitUpdateModelValue: (value: SelectItemValueType | SelectItemArrayType) => void
	emitUpdateSearch: (value: string) => void
}

export function useSyAutocompleteModel(options: UseSyAutocompleteModelOptions) {
	watch(() => options.modelValue.value, (newValue) => {
		options.selectedItem.value = newValue
	})

	watch(() => options.search.value, (newValue) => {
		options.searchValue.value = newValue
	})

	watch(options.searchValue, (newValue) => {
		options.emitUpdateSearch(newValue)
		const trimmed = newValue.trim()
		options.pendingFocusIndex.value = null

		// Si l'utilisateur efface manuellement le texte en mode single, on efface aussi la sélection.
		// Sinon, le composant conserve une valeur sélectionnée et la validation required ne se déclenche pas.
		if (!options.multiple.value && trimmed.length === 0 && options.selectedItem.value != null) {
			options.selectedItem.value = null
			options.emitUpdateModelValue(null)
			options.markTouched()
		}

		// Single: si l'utilisateur modifie le texte après avoir sélectionné une option,
		// et que le texte ne correspond plus à l'option sélectionnée, on efface la sélection.
		// Sinon, required considère encore le champ "rempli" alors que le texte est partiel.
		if (!options.multiple.value && trimmed.length > 0 && options.selectedItem.value != null) {
			const selectedText = (options.getSelectedText()?.trim() ?? '')
			if (selectedText && trimmed !== selectedText) {
				options.selectedItem.value = null
				options.emitUpdateModelValue(null)
				options.markTouched()
			}
		}

		if (trimmed.length >= options.minChars.value) {
			if (!options.isOpen.value) {
				options.clearActiveDescendant()
				options.markOpenedByTyping(true)
				options.openMenu(true)
			}
			else {
				options.scheduleFetch(newValue)
				// Quand les résultats sont rafraîchis par la saisie, on réinitialise l'option active au début.
				options.clearActiveDescendant()
			}
		}
		else {
			options.resetFetchState()
		}
	})
}
