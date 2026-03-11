/**
 * Composable pour améliorer l'accessibilité du CalendarMode
 */
import { nextTick, onBeforeUnmount, onMounted } from 'vue'

/**
 * Améliore l'accessibilité du CalendarMode en ajoutant des attributs ARIA et des instructions pour les lecteurs d'écran
 * @returns Des fonctions pour mettre à jour l'accessibilité du CalendarMode et gérer les événements clavier
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
	 * Met à jour les attributs d'accessibilité du CalendarMode
	 * Ajoute des attributs ARIA et des instructions pour les lecteurs d'écran
	 * Corrige également les attributs ARIA invalides
	 */
	const updateAccessibility = async (): Promise<void> => {
		await nextTick()

		// Utiliser des attributs data pour sélectionner les éléments, ce qui est plus stable que les classes CSS
		const datePickerEl = document.querySelector('.v-date-picker')
		if (!datePickerEl) return

		// Supprimer le role application et l'aria-label générique pour conserver les rôles internes (grid)
		datePickerEl.removeAttribute('role')
		datePickerEl.removeAttribute('aria-label')

		// Si le date picker est affiché dans une popup, appliquer les attributs de dialogue sur le conteneur
		const popupContainer = datePickerEl.closest('.v-overlay__content')
		if (popupContainer instanceof HTMLElement) {
			popupContainer.setAttribute('role', 'dialog')
			popupContainer.setAttribute('aria-modal', 'true')
		}

		// Sélectionner tous les boutons de navigation
		const navigationButtons = datePickerEl.querySelectorAll('button')

		// Attribuer des labels significatifs basés sur la position ou l'icône
		navigationButtons.forEach(async (button) => {
			// find btn with aria-label contain item
			if (button.className.includes('v-date-picker-controls__mode-btn')) {
				button.removeAttribute('aria-label')
			}
			// Vérifier si le bouton contient un SVG ou une icône
			const svgEl = button.querySelector('svg')
			const iconEl = button.querySelector('.v-icon')

			// Get any existing visible text content
			const buttonText = button.textContent?.trim() || ''

			// Traiter les boutons avec SVG
			if (svgEl) {
				const svgContent = svgEl.innerHTML

				// Left arrow (previous month)
				if (svgContent.includes('M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z')) {
					const accessibleName = buttonText ? `${buttonText} (Mois précédent)` : 'Mois précédent'
					button.setAttribute('aria-label', accessibleName)
				}
				// Right arrow (next month)
				else if (svgContent.includes('M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z')) {
					const accessibleName = buttonText ? `${buttonText} (Mois suivant)` : 'Mois suivant'
					button.setAttribute('aria-label', accessibleName)
				}
				// Calendar icon
				else if (svgContent.includes('M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z')) {
					const accessibleName = buttonText ? `${buttonText} (Ouvrir le calendrier)` : 'Ouvrir le calendrier'
					button.setAttribute('aria-label', accessibleName)
				}
			}
			// Traiter les boutons avec icônes Material Design
			else if (iconEl) {
				// Left arrow (previous month)
				if (iconEl.classList.contains('mdi-chevron-left')) {
					const accessibleName = buttonText ? `${buttonText} (Mois précédent)` : 'Mois précédent'
					button.setAttribute('aria-label', accessibleName)
				}
				// Right arrow (next month)
				else if (iconEl.classList.contains('mdi-chevron-right')) {
					const accessibleName = buttonText ? `${buttonText} (Mois suivant)` : 'Mois suivant'
					button.setAttribute('aria-label', accessibleName)
				}
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

	// Référence pour le MutationObserver
	let observer: MutationObserver | null = null

	/**
	 * Corrige les attributs ARIA invalides dans le composant
	 * Supprime les attributs aria-haspopup, aria-expanded et aria-controls inappropriés
	 */
	const fixAriaAttributes = (root?: HTMLElement) => {
		try {
			// Limiter le nettoyage au conteneur du date picker pour ne pas impacter les autres widgets
			const container = root
				?? document.querySelector('.date-picker-container')
				?? document.querySelector('.v-date-picker')

			if (!container) return

			const datePicker = container.querySelector('.v-date-picker') ?? container
			if (datePicker instanceof HTMLElement && datePicker.getAttribute('role') === 'application') {
				datePicker.removeAttribute('role')
			}

			// Supprimer uniquement les aria-haspopup="menu" résiduels sur le date picker lui-même
			if (datePicker instanceof HTMLElement && datePicker.getAttribute('aria-haspopup') === 'menu') {
				datePicker.removeAttribute('aria-haspopup')
			}
		}
		catch {
			// Do nothing
		}
	}

	/**
	 * Configure un MutationObserver pour surveiller les changements dans le DOM
	 * et réexécuter fixAriaAttributes lorsque nécessaire
	 */
	const setupMutationObserver = () => {
		// Nettoyer l'observateur existant s'il y en a un
		if (observer) {
			observer.disconnect()
		}

		// Créer un nouvel observateur
		observer = new MutationObserver((mutations) => {
			if (!Array.isArray(mutations)) return
			// Vérifier si les mutations concernent des attributs ARIA ou des éléments pertinents
			const shouldFix = mutations.some((mutation) => {
				if (!mutation) return false
				// Vérification défensive pour s'assurer que mutation.el existe avant d'accéder à ses propriétés
				if (mutation.target === undefined || mutation.target === null) return false

				// Si un attribut a été modifié
				if (mutation.type === 'attributes') {
					const attributeName = mutation.attributeName
					return attributeName && (
						attributeName.startsWith('aria-')
						|| attributeName === 'class'
						|| attributeName === 'style'
					)
				}
				// Si des nœuds ont été ajoutés ou supprimés
				return mutation.type === 'childList'
			})

			// Si des modifications pertinentes ont été détectées, corriger les attributs ARIA
			if (shouldFix) {
				// Utiliser nextTick pour s'assurer que le DOM est stable avant de faire les corrections
				nextTick(() => {
					fixAriaAttributes()
				})
			}
		})

		// Observer le document entier pour les changements
		observer.observe(document.body, {
			childList: true, // Observer les ajouts/suppressions d'enfants
			subtree: true, // Observer les descendants
			attributes: true, // Observer les changements d'attributs
			attributeFilter: ['aria-expanded', 'aria-haspopup', 'aria-controls', 'class'], // Filtrer les attributs à observer
		})
	}

	// Configurer l'observateur au montage du composant
	onMounted(() => {
		// Exécuter une première fois pour nettoyer les attributs initiaux
		fixAriaAttributes()
		// Configurer l'observateur pour les changements futurs
		setupMutationObserver()
	})

	// Nettoyer l'observateur avant de démonter le composant
	onBeforeUnmount(() => {
		if (observer) {
			observer.disconnect()
			observer = null
		}
	})

	return {
		updateAccessibility,
		handleKeyDown,
		fixAriaAttributes,
	}
}

export default useDatePickerAccessibility
