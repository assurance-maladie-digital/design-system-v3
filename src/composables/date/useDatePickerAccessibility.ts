/**
 * Composable pour améliorer l'accessibilité du DatePicker
 */
import { nextTick } from 'vue'

/**
 * Améliore l'accessibilité du DatePicker en ajoutant des attributs ARIA et des instructions pour les lecteurs d'écran
 * @returns Une fonction pour mettre à jour l'accessibilité du DatePicker
 */
export function useDatePickerAccessibility() {
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
			srOnlyEl.textContent = 'Utilisez les flèches pour naviguer entre les dates et Entrée pour sélectionner une date'

			datePickerEl.prepend(srOnlyEl)
		}
	}

	return {
		updateAccessibility,
	}
}

export default useDatePickerAccessibility
