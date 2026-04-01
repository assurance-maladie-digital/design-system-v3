/**
 * Composable pour améliorer l'accessibilité du CalendarMode
 */
import { nextTick, onBeforeUnmount, onMounted } from 'vue'

/**
 * Améliore l'accessibilité du CalendarMode en ajoutant des attributs ARIA et des instructions pour les lecteurs d'écran
 * @returns Des fonctions pour mettre à jour l'accessibilité du CalendarMode et gérer les événements clavier
 */
export function useDatePickerAccessibility() {
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

		// Ajouter des labels de navigation sur les boutons comportant les icônes attendues
		const navButtons = datePickerEl.querySelectorAll<HTMLButtonElement>('.v-date-picker-header button')
		navButtons.forEach((button) => {
			const icon = button.querySelector('i')
			if (icon?.classList.contains('mdi-chevron-left')) {
				button.setAttribute('aria-label', 'Mois précédent')
				return
			}

			if (icon?.classList.contains('mdi-chevron-right')) {
				button.setAttribute('aria-label', 'Mois suivant')
				return
			}

			button.removeAttribute('aria-label')
		})

		// Ajouter les instructions pour lecteurs d'écran si elles n'existent pas déjà
		// if (!datePickerEl.querySelector('.sr-only-instructions')) {
		// 	const srOnly = document.createElement('div')
		// 	srOnly.className = 'sr-only sr-only-instructions'
		// 	srOnly.textContent = 'Utilisez tab pour naviguer entre les dates et Entrée ou Espace pour sélectionner une date'
		// 	datePickerEl.prepend(srOnly)
		// }

		// Ajouter un attribut role="application" au conteneur principal
		// Ne pas forcer role="application" ni aria-label générique : on laisse les rôles natifs du picker (grille/boutons) et les labels existants.

		// Ne pas surcharger Enter/Espace : laisser les comportements natifs des boutons
	}

	// Référence pour le MutationObserver (désactivé)
	// const observer: MutationObserver | null = null

	/**
	 * Corrige les attributs ARIA invalides dans le composant
	 * Ici on ne supprime plus globalement aria-expanded/aria-haspopup pour éviter de casser la combobox.
	 */
	const fixAriaAttributes = () => {
		// Désormais no-op pour éviter de retirer des attributs utiles.
	}

	/**
	 * Simule un clic sur l'élément focalisé lorsque la touche Entrée est pressée.
	 * Ne touche pas aux autres touches (espace, etc.).
	 */
	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key !== 'Enter') return

		event.preventDefault()
		const target = document.activeElement
		if (target instanceof HTMLElement) {
			target.click()
		}
	}

	/**
	 * (Observer désactivé) : on évite de muter globalement les attributs aria du document.
	 */
	const setupMutationObserver = () => {
		// noop
	}

	// Configurer l'observateur au montage du composant
	onMounted(() => {
		// Exécuter une première fois pour nettoyer les attributs initiaux
		fixAriaAttributes()
		// Configurer l'observateur pour les changements futurs
		setupMutationObserver()
	})

	// Nettoyer l'observateur avant de démonter le composant (noop ici)
	onBeforeUnmount(() => {
		/* noop */
	})

	return {
		updateAccessibility,
		handleKeyDown,
		fixAriaAttributes,
	}
}

export default useDatePickerAccessibility
