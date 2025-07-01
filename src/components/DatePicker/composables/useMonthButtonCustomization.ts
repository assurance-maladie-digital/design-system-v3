import { ref, nextTick, type Ref } from 'vue'

/**
 * Composable pour personnaliser les boutons du mois et de l'année dans les composants DatePicker
 * @param isPickerVisibleGetter - Fonction qui retourne l'état de visibilité du DatePicker
 * @param monthName - Référence au nom du mois à utiliser
 * @param yearName - Référence au nom de l'année à utiliser
 */
export function useMonthButtonCustomization(
	isPickerVisibleGetter: () => boolean,
	monthName?: Ref<string | null>,
	yearName?: Ref<string | null>,
) {
	const monthButtonText = ref('')
	const yearText = ref('')

	/**
	 * Retourne un nom personnalisé pour le mois en fonction de sa valeur
	 * @param monthName - Le nom du mois à personnaliser
	 * @returns Le nom personnalisé du mois
	 */
	const getCustomMonthName = (monthName: string | null | undefined): string => {
		if (!monthName) return ''

		// Convertir en minuscules pour faciliter la comparaison
		const lowerMonth = monthName.toLowerCase()

		switch (lowerMonth) {
			case 'january':
			case 'janvier':
				return 'Janv.'
			case 'february':
			case 'février':
				return 'Févr.'
			case 'march':
			case 'mars':
				return 'Mars'
			case 'april':
			case 'avril':
				return 'Avr.'
			case 'may':
			case 'mai':
				return 'Mai'
			case 'june':
			case 'juin':
				return 'Juin'
			case 'july':
			case 'juillet':
				return 'Juil.'
			case 'august':
			case 'août':
				return 'Août'
			case 'september':
			case 'septembre':
				return 'Sept.'
			case 'october':
			case 'octobre':
				return 'Oct.'
			case 'november':
			case 'novembre':
				return 'Nov.'
			case 'december':
			case 'décembre':
				return 'Déc.'
			default:
				// Si le mois n'est pas reconnu, retourner le mois avec la première lettre en majuscule
				return monthName.charAt(0).toUpperCase() + monthName.slice(1)
		}
	}

	/**
	 * Récupère et modifie les boutons du mois et de l'année avec une icône SVG chevron-down
	 */
	const customizeMonthButton = () => {
		if (isPickerVisibleGetter() || monthName?.value) {
			nextTick(() => {
				// Personnalisation du bouton du mois
				const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')
				if (monthBtn) {
					// Récupérer le texte original et le nettoyer
					monthButtonText.value = monthBtn.textContent?.trim() || ''

					// Extraire le mois et l'année
					const parts = monthButtonText.value.split(' ')
					// Utiliser le monthName fourni s'il existe, sinon utiliser le texte extrait
					const rawMonthText = monthName?.value || parts[0]
					// Personnaliser le nom du mois avec notre fonction switch case
					const monthText = getCustomMonthName(rawMonthText)
					yearText.value = parts.length > 1 ? parts[1] : ''

					// Créer un bouton stylisé comme un VBtn avec une icône Material Design
					const buttonHTML = `
						<button class="v-btn v-btn--density-comfortable v-btn--variant-text v-theme--light v-btn--size-default" style="color: var(--v-theme-primary); margin-left: -12px;" data-ripple="false">
							<span class="v-btn__overlay"></span>
							<span class="v-btn__underlay"></span>
							<div class="v-btn__content" data-no-activator="" style="color: var(--v-theme-primary);">
								<span style="color: var(--v-theme-primary);">${monthText.charAt(0).toUpperCase() + monthText.slice(1)}</span> 
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" class="ms-1" style="fill: var(--v-theme-primary);" aria-label="chevron-down" role="img"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg>
							</div>
						</button>
					`

					// Remplacer le contenu du bouton original
					monthBtn.innerHTML = buttonHTML

					// Personnalisation du bouton d'année si l'année est disponible
					if (yearText.value || yearName?.value) {
						const yearBtn = document.querySelector('.v-date-picker-controls__mode-btn')
						if (yearBtn) {
							// Utiliser le yearName fourni s'il existe, sinon utiliser yearText
							const displayedYear = yearName?.value || yearText.value
							// Créer un bouton stylisé pour l'année
							const yearButtonHTML = `
								<button class="v-btn v-btn--density-comfortable v-btn--variant-text v-theme--light v-btn--size-default" style="color: var(--v-theme-primary);" data-ripple="false">
									<span class="v-btn__overlay"></span>
									<span class="v-btn__underlay"></span>
									<div class="v-btn__content" data-no-activator="" style="color: var(--v-theme-primary);">
										<span style="color: var(--v-theme-primary);">${displayedYear}</span> 
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" class="ms-1" style="fill: var(--v-theme-primary);" aria-label="chevron-down" role="img"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg>
									</div>
								</button>
							`

							// Remplacer le contenu du bouton d'année
							yearBtn.innerHTML = yearButtonHTML
						}
					}
				}
			})
		}
	}

	/**
	 * Configure un observateur pour détecter les changements dans le DOM
	 * et personnaliser les boutons du mois et de l'année automatiquement avec une icône SVG chevron-down
	 */
	const setupMonthButtonObserver = () => {
		nextTick(() => {
			const targetNode = document.querySelector('.v-date-picker-controls')
			if (targetNode) {
				const observer = new MutationObserver(() => {
					customizeMonthButton()
				})
				observer.observe(targetNode, { childList: true, subtree: true })
			}
		})
	}

	return {
		monthButtonText,
		customizeMonthButton,
		setupMonthButtonObserver,
	}
}
