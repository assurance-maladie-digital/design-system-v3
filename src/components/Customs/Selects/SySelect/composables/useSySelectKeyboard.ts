import { ref, watch, nextTick, type Ref } from 'vue'

export type ItemType = {
	[key: string]: unknown
}

export interface UseSySelectKeyboardOptions {
	isOpen: Ref<boolean>
	formattedItems: Ref<ItemType[]>
	toggleMenu: (skipInitialFocus?: boolean) => void
	selectItem: (item: ItemType | null, event?: Event) => void
	getItemText: (item: unknown) => unknown
}

export function useSySelectKeyboard(options: UseSySelectKeyboardOptions) {
	const {
		isOpen,
		formattedItems,
		toggleMenu,
		selectItem,
		getItemText,
	} = options

	// État central pour le focus et la navigation
	const activeDescendantId = ref('')
	const lastFocusedIndex = ref(-1)

	/**
	 * Fonction centrale pour gérer le focus visuel et ARIA
	 * Cette fonction est le point d'entrée unique pour toute modification du focus
	 * @param index Index de l'élément à activer
	 * @param options Options supplémentaires
	 */
	const setActiveDescendant = (index: number, options: { scrollIntoView?: boolean } = { scrollIntoView: true }) => {
		// Vérifier si l'index est valide
		if (index >= 0 && index < formattedItems.value.length) {
			// Mettre à jour l'ID pour ARIA
			activeDescendantId.value = `option-${index}`
			// Stocker l'index pour référence future
			lastFocusedIndex.value = index

			// Appliquer les changements visuels au prochain cycle de rendu
			nextTick(() => {
				const element = document.getElementById(`option-${index}`)
				if (element) {
					// Faire défiler l'élément en vue si demandé
					if (options.scrollIntoView) {
						element.scrollIntoView({ block: 'nearest' })
					}

					// Appliquer la classe de focus visuel
					element.classList.add('keyboard-focused')

					// Supprimer le focus visuel des autres éléments
					const allItems = document.querySelectorAll('.v-list-item')
					allItems.forEach((item) => {
						if (item !== element) {
							item.classList.remove('keyboard-focused')
						}
					})
				}
			})
		}
		else {
			// Réinitialiser le focus si l'index est invalide
			clearActiveDescendant()
		}
	}

	/**
	 * Fonction pour effacer le focus actif
	 */
	const clearActiveDescendant = () => {
		activeDescendantId.value = ''
		lastFocusedIndex.value = -1

		// Supprimer la classe de focus visuel de tous les éléments
		nextTick(() => {
			const allItems = document.querySelectorAll('.v-list-item')
			allItems.forEach((item) => {
				item.classList.remove('keyboard-focused')
			})
		})
	}

	/**
	 * Fonction pour effacer seulement le focus visuel et ARIA sans réinitialiser lastFocusedIndex
	 * Utilisée quand on ferme le dropdown mais qu'on veut conserver la mémoire du dernier focus
	 */
	const clearVisualFocus = () => {
		activeDescendantId.value = ''

		// Supprimer la classe de focus visuel de tous les éléments
		nextTick(() => {
			const allItems = document.querySelectorAll('.v-list-item')
			allItems.forEach((item) => {
				item.classList.remove('keyboard-focused')
			})
		})
	}

	/**
	 * Trouve l'index de l'élément actuellement sélectionné ou actif
	 * Utilise lastFocusedIndex comme source de vérité principale
	 */
	const findSelectedItemIndex = () => {
		// Si nous avons un index mémorisé valide, l'utiliser
		if (lastFocusedIndex.value >= 0 && lastFocusedIndex.value < formattedItems.value.length) {
			return lastFocusedIndex.value
		}

		// Sinon, essayer de récupérer l'index à partir de l'ID ARIA
		if (activeDescendantId.value) {
			const activeIndex = parseInt(activeDescendantId.value.split('-')[1])
			if (!isNaN(activeIndex) && activeIndex >= 0 && activeIndex < formattedItems.value.length) {
				// Synchroniser lastFocusedIndex avec l'index trouvé
				lastFocusedIndex.value = activeIndex
				return activeIndex
			}
		}

		return -1
	}

	// Find the next item that starts with the given character
	const findItemStartingWith = (char: string) => {
		const lowerChar = char.toLowerCase()
		const startIndex = findSelectedItemIndex() + 1

		// Search from current position to end
		for (let i = startIndex; i < formattedItems.value.length; i++) {
			const itemTextValue = getItemText(formattedItems?.value[i])
			// Ensure itemTextValue is string-like before calling toString
			const itemText = itemTextValue != null ? String(itemTextValue).toLowerCase() : ''
			if (itemText.startsWith(lowerChar)) {
				return i
			}
		}

		// If not found, search from beginning to current position
		for (let i = 0; i < startIndex; i++) {
			const itemTextValue = getItemText(formattedItems?.value[i])
			// Ensure itemTextValue is string-like before calling toString
			const itemText = itemTextValue != null ? String(itemTextValue).toLowerCase() : ''
			if (itemText.startsWith(lowerChar)) {
				return i
			}
		}

		return -1
	}

	// Keyboard event handlers
	const handleEnterKey = () => {
		if (isOpen.value) {
			const index = findSelectedItemIndex()
			if (index >= 0) {
				selectItem(formattedItems.value[index])
			}
		}
		else {
			// Sinon, ouvrir/fermer le menu
			toggleMenu()
		}
	}

	// Gestionnaire pour la touche Échap
	const handleEscapeKey = () => {
		if (isOpen.value) {
			toggleMenu()
		}
	}

	const handleSpaceKey = () => {
		if (isOpen.value) {
			const index = findSelectedItemIndex()
			if (index >= 0) {
				selectItem(formattedItems.value[index])
			}
		}
		else {
			toggleMenu()
		}
	}

	const handleDownKey = () => {
		if (!isOpen.value) {
			// Passer skipInitialFocus=true pour éviter que toggleMenu override notre focus
			toggleMenu(true)
			nextTick(() => {
				// Restaurer le dernier item qui avait le focus, ou le premier item par défaut
				const indexToFocus = lastFocusedIndex.value >= 0 && lastFocusedIndex.value < formattedItems.value.length
					? lastFocusedIndex.value
					: 0
				setActiveDescendant(indexToFocus)
			})
		}
		else {
			// Utiliser lastFocusedIndex comme point de départ (pas l'item sélectionné)
			const currentIndex = lastFocusedIndex.value >= 0 ? lastFocusedIndex.value : 0
			const nextIndex = Math.min(currentIndex + 1, formattedItems.value.length - 1)
			setActiveDescendant(nextIndex)
		}
	}

	const handleUpKey = () => {
		if (!isOpen.value) {
			// Passer skipInitialFocus=true pour éviter que toggleMenu override notre focus
			toggleMenu(true)
			nextTick(() => {
				// Aller au premier item quand on ouvre avec flèche haut (comportement RGAA correct)
				setActiveDescendant(0)
			})
		}
		else {
			const currentIndex = findSelectedItemIndex()
			// Ne pas boucler : rester au premier item si on est déjà au premier
			const prevIndex = currentIndex >= 0 ? Math.max(currentIndex - 1, 0) : 0
			setActiveDescendant(prevIndex)
		}
	}

	const handleCharacterKey = (key: string) => {
		// Handle printable characters for keyboard navigation
		if (key.length === 1 && key.match(/\S/)) {
			const index = findItemStartingWith(key)
			if (index >= 0) {
				if (!isOpen.value) {
					toggleMenu()
					// Attendre que le menu soit ouvert avant de définir le focus
					nextTick(() => {
						setActiveDescendant(index)
					})
				}
				else {
					// Menu déjà ouvert, définir le focus immédiatement
					setActiveDescendant(index)
				}
			}
		}
	}

	const handleHomeKey = () => {
		if (!isOpen.value) {
			toggleMenu()
			nextTick(() => {
				// Aller au premier item
				setActiveDescendant(0)
			})
		}
		else {
			// Menu déjà ouvert, aller au premier item
			setActiveDescendant(0)
		}
	}

	const handleEndKey = () => {
		if (!isOpen.value) {
			toggleMenu()
			nextTick(() => {
				// Aller au dernier item
				setActiveDescendant(formattedItems.value.length - 1)
			})
		}
		else {
			// Menu déjà ouvert, aller au dernier item
			setActiveDescendant(formattedItems.value.length - 1)
		}
	}

	const handlePageUpKey = () => {
		if (!isOpen.value) {
			toggleMenu()
			nextTick(() => {
				// Aller au premier item
				setActiveDescendant(0)
			})
		}
		else {
			// Menu déjà ouvert, naviguer de 10 items vers le haut
			const currentIndex = lastFocusedIndex.value >= 0 ? lastFocusedIndex.value : 0
			const newIndex = Math.max(currentIndex - 10, 0)
			setActiveDescendant(newIndex)
		}
	}

	const handlePageDownKey = () => {
		if (!isOpen.value) {
			toggleMenu()
			nextTick(() => {
				// Aller au dernier item
				setActiveDescendant(formattedItems.value.length - 1)
			})
		}
		else {
			// Menu déjà ouvert, naviguer de 10 items vers le bas
			const currentIndex = lastFocusedIndex.value >= 0 ? lastFocusedIndex.value : 0
			const newIndex = Math.min(currentIndex + 10, formattedItems.value.length - 1)
			setActiveDescendant(newIndex)
		}
	}

	const handleTabKey = () => {
		if (isOpen.value && activeDescendantId.value) {
			// Trouver l'item actuellement focusé
			const currentIndex = parseInt(activeDescendantId.value.split('-')[1])
			if (!isNaN(currentIndex) && currentIndex >= 0 && currentIndex < formattedItems.value.length) {
				const currentItem = formattedItems.value[currentIndex]
				// Sélectionner l'item qui a le focus
				selectItem(currentItem)
			}
		}
		// Fermer le menu (la navigation Tab normale continuera après)
		if (isOpen.value) {
			isOpen.value = false
			clearActiveDescendant()
		}
		// Ne pas empêcher le comportement par défaut de Tab pour permettre
		// la navigation vers l'élément suivant focusable
	}

	// Watch activeDescendantId pour synchroniser lastFocusedIndex
	watch(activeDescendantId, (newId) => {
		if (newId) {
			const index = parseInt(newId.split('-')[1])
			if (!isNaN(index) && index >= 0 && index < formattedItems.value.length) {
				// Synchroniser lastFocusedIndex avec l'ID ARIA
				lastFocusedIndex.value = index
			}
		}
	})

	// Gérer l'ouverture et la fermeture de la liste
	watch(isOpen, (open) => {
		if (open) {
			// À l'ouverture, restaurer le dernier focus ou initialiser au premier élément
			nextTick(() => {
				if (lastFocusedIndex.value >= 0 && lastFocusedIndex.value < formattedItems.value.length) {
					// Restaurer le dernier focus
					setActiveDescendant(lastFocusedIndex.value)
				}
				else {
					// Initialiser au premier élément
					setActiveDescendant(0)
				}
			})
		}
		else {
			// Conserver lastFocusedIndex mais effacer le focus visuel et ARIA
			clearVisualFocus()
		}
	})

	// Fonction utilitaire pour restaurer le focus après une action
	const restoreFocus = () => {
		if (isOpen.value) {
			// Si la liste est ouverte, restaurer le focus sur le dernier élément actif ou le premier élément
			const indexToFocus = lastFocusedIndex.value >= 0 ? lastFocusedIndex.value : 0
			setActiveDescendant(indexToFocus)
		}
	}

	// Return the composable API
	return {
		activeDescendantId,
		lastFocusedIndex,
		setActiveDescendant,
		clearActiveDescendant,
		findSelectedItemIndex,
		findItemStartingWith,
		handleEnterKey,
		handleSpaceKey,
		handleDownKey,
		handleUpKey,
		handleCharacterKey,
		handleEscapeKey,
		handleHomeKey,
		handleEndKey,
		handlePageUpKey,
		handlePageDownKey,
		handleTabKey,
		restoreFocus,
	}
}
