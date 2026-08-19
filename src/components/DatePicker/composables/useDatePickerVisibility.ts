import { type Ref, nextTick, onMounted, onBeforeUnmount, unref, type MaybeRef } from 'vue'

/**
 * Composable pour gérer la visibilité et les interactions avec le CalendarMode
 *
 * @param options - Options de configuration
 * @returns Fonctions pour gérer la visibilité du CalendarMode
 */
export const useDatePickerVisibility = (options: {
	// Propriétés de configuration
	disabled?: MaybeRef<boolean>
	readonly?: MaybeRef<boolean>
	textFieldActivator?: MaybeRef<boolean>

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

	const canInteract = (): boolean => !unref(disabled) && !unref(readonly)

	const closeDatePickerInternal = (): void => {
		isDatePickerVisible.value = false
		emitClosed()
		validateDates()
	}

	const openDatePickerInternal = (): void => {
		isDatePickerVisible.value = true
		nextTick(() => {
			updateAccessibility()
		})
	}

	/**
	 * Bascule l'affichage du CalendarMode
	 */
	const toggleDatePicker = () => {
		if (!canInteract()) return

		if (isDatePickerVisible.value) {
			closeDatePickerInternal()
			return
		}

		openDatePickerInternal()
	}

	/**
	 * Ouvre le CalendarMode s'il n'est pas déjà visible
	 */
	const openDatePicker = () => {
		if (!canInteract() || isDatePickerVisible.value) return
		openDatePickerInternal()
	}

	/**
	 * Gère le focus sur le champ de texte
	 */
	const openDatePickerOnFocus = () => {
		// Only open the CalendarMode if textFieldActivator is true
		if (unref(textFieldActivator)) {
			openDatePicker()
		}
		// Always emit the focus event
		emitFocus()
		isManualInputActive.value = true
		hasInteracted.value = true
	}

	/**
	 * Gère le clic sur l'icône du CalendarMode
	 */
	const openDatePickerOnIconClick = () => {
		toggleDatePicker()
	}

	/**
	 * Gère les clics en dehors du CalendarMode pour le fermer
	 */
	const handleClickOutside = (event: MouseEvent) => {
		if (!isDatePickerVisible.value) return

		const target = event.target as HTMLElement
		const container = target.closest('.date-picker-container, .date-picker-overlay-content')

		// Si on clique dans le conteneur du CalendarMode, on ne fait rien
		if (container) return
		closeDatePickerInternal()
	}

	// Gestion des événements de clic en dehors du CalendarMode
	onMounted(() => {
		document.addEventListener('click', handleClickOutside)
	})

	onBeforeUnmount(() => {
		document.removeEventListener('click', handleClickOutside)
	})

	/**
	 * Gère l'ouverture du CalendarMode depuis le champ.
	 * ArrowDown aligne le comportement du mode combiné sur le pattern APG date picker combobox.
	 */
	const handleKeyboardNavigation = (event: KeyboardEvent) => {
		if ((
			event.key === 'Enter'
			|| event.key === 'ArrowDown'
		) && canInteract()) {
			event.preventDefault() // Empêcher le comportement par défaut
			openDatePicker()
			return true
		}
		return false
	}

	return {
		toggleDatePicker,
		openDatePicker,
		openDatePickerOnFocus,
		openDatePickerOnIconClick,
		handleClickOutside,
		handleKeyboardNavigation,
	}
}
