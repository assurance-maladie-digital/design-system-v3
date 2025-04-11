/**
 * Composable pour améliorer l'accessibilité du DatePicker
 */
import { nextTick } from 'vue'

/**
 * Améliore l'accessibilité du DatePicker en ajoutant des attributs ARIA et des instructions pour les lecteurs d'écran
 * @returns Des fonctions pour mettre à jour l'accessibilité du DatePicker et gérer les événements clavier
 */
export function useDatePickerAccessibility() {
	// Référence pour suivre si l'événement a déjà été traité
	let isProcessingEnterKey = false

	/**
	 * Gestionnaire d'événements clavier pour simuler le comportement de la touche espace avec la touche entrée
	 * @param event L'événement clavier
	 */
	const handleKeyDown = (event: Event): void => {
		const keyboardEvent = event as KeyboardEvent
		// Si la touche entrée est pressée et que nous ne sommes pas déjà en train de traiter un événement
		if (keyboardEvent.key === 'Enter' && !isProcessingEnterKey) {
			// Marquer que nous sommes en train de traiter l'événement pour éviter les doublons
			isProcessingEnterKey = true

			// Empêcher le comportement par défaut de la touche entrée
			keyboardEvent.preventDefault()

			// Récupérer l'élément actuellement focalisé
			const focusedElement = document.activeElement

			// Simuler un événement de touche espace
			if (focusedElement && focusedElement instanceof HTMLElement) {
				// Créer et déclencher un événement de clic qui simule le comportement de l'espace
				const clickEvent = new MouseEvent('click', {
					bubbles: true,
					cancelable: true,
					view: window,
				})

				// Déclencher un seul événement de clic
				focusedElement.dispatchEvent(clickEvent)
			}

			// Réinitialiser l'état après un délai pour permettre le traitement des autres événements
			setTimeout(() => {
				isProcessingEnterKey = false
			}, 100)
		}
	}

	/**
	 * Met à jour les attributs d'accessibilité du DatePicker
	 * Ajoute des attributs ARIA et des instructions pour les lecteurs d'écran
	 */
	const updateAccessibility = async (): Promise<void> => {
		await nextTick()

		// Utiliser des attributs data pour sélectionner les éléments, ce qui est plus stable que les classes CSS
		const datePickerEl = document.querySelector('.v-date-picker')
		if (!datePickerEl) return

		// Ajouter un attribut role="application" au conteneur principal
		datePickerEl.setAttribute('role', 'application')
		datePickerEl.setAttribute('aria-label', 'Sélecteur de date')

		// Sélectionner tous les boutons de navigation
		const navigationButtons = datePickerEl.querySelectorAll('button')

		// Attribuer des labels significatifs basés sur la position ou l'icône
		navigationButtons.forEach((button) => {
			const iconEl = button.querySelector('.v-icon')
			if (!iconEl) return

			// Utiliser le contenu de l'icône pour déterminer sa fonction
			const iconContent = iconEl.textContent || ''
			const iconClasses = iconEl.className || ''

			if (iconClasses.includes('mdi-chevron-left') || iconContent.includes('chevron-left')) {
				button.setAttribute('aria-label', 'Mois précédent')
			}
			else if (iconClasses.includes('mdi-chevron-right') || iconContent.includes('chevron-right')) {
				button.setAttribute('aria-label', 'Mois suivant')
			}
			else if (iconClasses.includes('mdi-chevron-down') || iconContent.includes('chevron-down')
				|| iconClasses.includes('mdi-menu-down') || iconContent.includes('menu-down')) {
				button.setAttribute('aria-label', 'Changer de vue')
			}
		})

		// Ajouter des instructions pour les lecteurs d'écran
		let srOnlyEl = datePickerEl.querySelector('.sr-only-instructions')
		if (!srOnlyEl) {
			srOnlyEl = document.createElement('span')
			srOnlyEl.className = 'sr-only-instructions'
			srOnlyEl.setAttribute('aria-live', 'polite')
			// Utiliser HTMLElement pour accéder aux propriétés de style
			const srOnlyHtmlEl = srOnlyEl as HTMLElement
			srOnlyHtmlEl.style.position = 'absolute'
			srOnlyHtmlEl.style.width = '1px'
			srOnlyHtmlEl.style.height = '1px'
			srOnlyHtmlEl.style.padding = '0'
			srOnlyHtmlEl.style.margin = '-1px'
			srOnlyHtmlEl.style.overflow = 'hidden'
			srOnlyHtmlEl.style.clip = 'rect(0, 0, 0, 0)'
			srOnlyHtmlEl.style.whiteSpace = 'nowrap'
			srOnlyHtmlEl.style.border = '0'
			srOnlyEl.textContent = 'Utilisez tab pour naviguer entre les dates et Entrée ou Espace pour sélectionner une date'
			datePickerEl.prepend(srOnlyEl)
		}

		// Ajouter un gestionnaire d'événements clavier pour la touche entrée
		// Utiliser des casts explicites pour rassurer TypeScript sur les types
		datePickerEl.removeEventListener('keydown', handleKeyDown as EventListener) // Supprimer d'abord pour éviter les doublons
		datePickerEl.addEventListener('keydown', handleKeyDown as EventListener)
	}

	return {
		updateAccessibility,
		handleKeyDown,
	}
}

export default useDatePickerAccessibility
