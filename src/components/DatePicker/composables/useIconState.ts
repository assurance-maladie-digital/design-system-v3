import { computed, type Ref } from 'vue'

/**
 * Composable pour déterminer l'icône à afficher en fonction de l'état de validation
 *
 * @param options - Options de configuration
 * @returns Fonction pour obtenir l'icône appropriée
 */
export const useIconState = (options: {
	noCalendar?: boolean
	disableErrorHandling?: boolean
	errorMessages: Ref<string[]>
	warningMessages: Ref<string[]>
	successMessages: Ref<string[]>
}) => {
	const {
		noCalendar = false,
		disableErrorHandling = false,
		errorMessages,
		warningMessages,
		successMessages,
	} = options

	/**
	 * Détermine l'icône à afficher en fonction de l'état de validation
	 *
	 * @returns Le type d'icône à afficher ('error', 'warning', 'success' ou undefined)
	 */
	const getIconValue = computed(() => {
		if (noCalendar || disableErrorHandling) {
			return undefined
		}

		switch (true) {
			case errorMessages.value.length > 0:
				return 'error'
			case warningMessages.value.length > 0:
				return 'warning'
			case successMessages.value.length > 0:
				return 'success'
			default:
				return undefined
		}
	})

	// Propriété exposée pour être utilisée dans le template
	const getIcon = getIconValue

	return {
		getIcon,
		getIconValue,
	}
}
