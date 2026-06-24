/**
 * Composable pour améliorer l'accessibilité du CalendarMode
 */
import { nextTick, onBeforeUnmount, onMounted } from 'vue'

export type DatePickerViewMode = 'month' | 'year' | 'months' | undefined

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

		// Masquer les entêtes de jours de la semaine (L M M J V S D) aux lecteurs d'écran
		const weekdayHeaders = datePickerEl.querySelectorAll<HTMLElement>('.v-date-picker-month__weekday')
		weekdayHeaders.forEach((el) => {
			el.setAttribute('aria-hidden', 'true')
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

	/**
	 * Met à jour aria-expanded sur les boutons de contrôle mois/année selon le mode d'affichage courant,
	 * et aria-selected sur les boutons des panneaux mois/années (identifiés par la classe Vuetify v-btn--active).
	 * - bouton mois  → aria-expanded="true" quand viewMode === 'months'
	 * - bouton année → aria-expanded="true" quand viewMode === 'year'
	 * - item actif dans .v-date-picker-months / .v-date-picker-years → aria-selected="true", les autres "false"
	 */
	const updateControlsAriaExpanded = async (viewMode: DatePickerViewMode): Promise<void> => {
		await nextTick()

		const datePickerEl = document.querySelector('.v-date-picker')
		if (!datePickerEl) return

		const monthBtn = datePickerEl.querySelector<HTMLButtonElement>('.v-date-picker-controls__month-btn')
		const modeBtn = datePickerEl.querySelector<HTMLButtonElement>('.v-date-picker-controls__mode-btn')

		if (monthBtn) {
			monthBtn.setAttribute('aria-expanded', String(viewMode === 'months'))
		}

		if (modeBtn) {
			modeBtn.setAttribute('aria-expanded', String(viewMode === 'year'))
		}

		// aria-selected sur les boutons du panneau mois
		const monthPanelBtns = datePickerEl.querySelectorAll<HTMLButtonElement>('.v-date-picker-months button')
		monthPanelBtns.forEach((btn) => {
			btn.setAttribute('aria-selected', String(btn.classList.contains('v-btn--active')))
		})

		// aria-selected sur les boutons du panneau années
		const yearPanelBtns = datePickerEl.querySelectorAll<HTMLButtonElement>('.v-date-picker-years button')
		yearPanelBtns.forEach((btn) => {
			btn.setAttribute('aria-selected', String(btn.classList.contains('v-btn--active')))
		})

		// Masquer le panneau années quand le panneau mois est ouvert et vice-versa
		const monthsPanel = datePickerEl.querySelector<HTMLElement>('.v-date-picker-months')
		const yearsPanel = datePickerEl.querySelector<HTMLElement>('.v-date-picker-years')

		if (monthsPanel && yearsPanel) {
			const monthsVisible = viewMode === 'months'
			yearsPanel.setAttribute('aria-hidden', String(monthsVisible))
			yearsPanel.querySelectorAll<HTMLElement>('button').forEach((btn) => {
				btn.setAttribute('tabindex', monthsVisible ? '-1' : '0')
			})

			const yearsVisible = viewMode === 'year'
			monthsPanel.setAttribute('aria-hidden', String(yearsVisible))
			monthsPanel.querySelectorAll<HTMLElement>('button').forEach((btn) => {
				btn.setAttribute('tabindex', yearsVisible ? '-1' : '0')
			})
		}
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
		updateControlsAriaExpanded,
		handleKeyDown,
		fixAriaAttributes,
	}
}

export default useDatePickerAccessibility
