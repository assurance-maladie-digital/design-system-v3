import { type Ref, nextTick, onMounted, onBeforeUnmount } from 'vue'

/**
 * Composable pour gérer la visibilité et les interactions avec le DatePicker
 *
 * @param options - Options de configuration
 * @returns Fonctions pour gérer la visibilité du DatePicker
 */
export const useDatePickerVisibility = (options: {
	// Propriétés de configuration
	disabled?: boolean
	readonly?: boolean
	textFieldActivator?: boolean

	// Références réactives
	isDatePickerVisible: Ref<boolean>
	isManualInputActive: Ref<boolean>
	hasInteracted: Ref<boolean>

	// Fonctions
	updateAccessibility: () => void
	validateDates: () => void

	// Émetteurs d'événements
	emitClosed: () => void
	emitFocus: () => void
}) => {
	const {
		disabled = false,
		readonly = false,
		textFieldActivator = false,
		isDatePickerVisible,
		isManualInputActive,
		hasInteracted,
		updateAccessibility,
		validateDates,
		emitClosed,
		emitFocus,
	} = options

	/**
	 * Bascule l'affichage du DatePicker
	 */
	const toggleDatePicker = () => {
		if (disabled || readonly) return

		isDatePickerVisible.value = !isDatePickerVisible.value

		if (isDatePickerVisible.value) {
			// Mettre à jour l'accessibilité après l'ouverture du DatePicker
			nextTick(() => {
				updateAccessibility()
			})
		}
		else {
			emitClosed()
			validateDates()
		}
	}

	/**
	 * Ouvre le DatePicker s'il n'est pas déjà visible
	 */
	const openDatePicker = () => {
		if (!isDatePickerVisible.value) {
			toggleDatePicker()
		}
	}

	/**
	 * Ouvre le DatePicker lors d'un clic sur le champ de texte
	 */
	const openDatePickerOnClick = () => {
		if (textFieldActivator) {
			openDatePicker()
		}
	}

	/**
	 * Gère le focus sur le champ de texte
	 */
	const openDatePickerOnFocus = () => {
		// Only open the DatePicker if textFieldActivator is true
		if (textFieldActivator) {
			openDatePicker()
		}
		// Always emit the focus event
		emitFocus()
		isManualInputActive.value = true
		hasInteracted.value = true
	}

	/**
	 * Gère le clic sur l'icône du DatePicker
	 */
	const openDatePickerOnIconClick = () => {
		toggleDatePicker()
	}

	/**
	 * Gère les clics en dehors du DatePicker pour le fermer
	 */
	const handleClickOutside = (event: MouseEvent) => {
		if (!isDatePickerVisible.value) return

		const target = event.target as HTMLElement
		const container = target.closest('.date-picker-container')

		// Si on clique dans le conteneur du DatePicker, on ne fait rien
		if (container) return
		emitClosed()
		// Déclencher la validation à la fermeture
		validateDates()
	}

	// Gestion des événements de clic en dehors du DatePicker
	onMounted(() => {
		document.addEventListener('click', handleClickOutside)
	})

	onBeforeUnmount(() => {
		document.removeEventListener('click', handleClickOutside)
	})

	/**
	 * Gère l'ouverture du DatePicker lors de l'appui sur Entrée ou Espace
	 */
	const handleKeyboardNavigation = (event: KeyboardEvent) => {
		if ((event.key === 'Enter' || event.key === ' ') && !disabled && !readonly) {
			event.preventDefault() // Empêcher le comportement par défaut
			openDatePicker()
			return true
		}
		return false
	}

	return {
		toggleDatePicker,
		openDatePicker,
		openDatePickerOnClick,
		openDatePickerOnFocus,
		openDatePickerOnIconClick,
		handleClickOutside,
		handleKeyboardNavigation,
	}
}
