import { ref, nextTick, type Ref, watch } from 'vue'

/**
 * Composable pour personnaliser les boutons du mois et de l'année dans les composants CalendarMode
 * @param isPickerVisibleGetter - Fonction qui retourne l'état de visibilité du CalendarMode
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
		if (isPickerVisibleGetter()) {
			nextTick(() => {
				// Personnalisation des boutons du mois pour tous les DatePickers
				const monthBtns = document.querySelectorAll('.v-date-picker-controls__month-btn')
				if (monthBtns.length > 0) {
					// Récupérer le texte original et le nettoyer du premier bouton pour référence
					// Cela n'affectera pas la personnalisation des autres boutons
					monthButtonText.value = monthBtns[0].textContent?.trim() || ''
					const parts = monthButtonText.value.split(' ')
					yearText.value = parts.length > 1 ? parts[1] : ''

					// Appliquer la personnalisation à tous les boutons du mois
					monthBtns.forEach((monthBtn) => {
						// Stocker le texte original avant la personnalisation si ce n'est pas déjà fait
						if (!monthBtn.hasAttribute('data-original-text')) {
							const originalText = monthBtn.textContent?.trim() || ''
							monthBtn.setAttribute('data-original-text', originalText)
						}

						// Extraire le mois et l'année pour ce bouton spécifique
						const btnText = monthBtn.textContent?.trim() || ''
						const btnParts = btnText.split(' ')
						// Utiliser le monthName fourni s'il existe, sinon utiliser le texte extrait
						const rawMonthText = monthName?.value || btnParts[0]
						// Personnaliser le nom du mois avec notre fonction switch case
						const monthText = getCustomMonthName(rawMonthText)

						// Créer un bouton stylisé comme un VBtn avec une icône Material Design
						const buttonHTML = `
							<button class="v-btn v-btn--density-comfortable v-btn--variant-text v-theme--light v-btn--size-default" style="color: var(--v-theme-primary); margin-left: -12px;" data-ripple="false" aria-label="${monthText}">
								<span class="v-btn__overlay"></span>
								<span class="v-btn__underlay"></span>
								<div class="v-btn__content" data-no-activator="" style="color: var(--v-theme-primary);">
									<span style="color: var(--v-theme-primary);">${monthText.charAt(0).toUpperCase() + monthText.slice(1)}</span>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" class="ms-1" style="fill: var(--v-theme-primary);" aria-hidden="true"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg>
								</div>
							</button>
						`

						// Remplacer le contenu du bouton original
						monthBtn.innerHTML = buttonHTML
					})

					// Personnalisation des boutons d'année pour tous les DatePickers
					const yearBtns = document.querySelectorAll('.v-date-picker-controls__mode-btn')
					yearBtns.forEach((yearBtn) => {
						// Stocker le texte original avant la personnalisation si ce n'est pas déjà fait
						if (!yearBtn.hasAttribute('data-original-text')) {
							const originalText = yearBtn.textContent?.trim() || ''
							yearBtn.setAttribute('data-original-text', originalText)
						}

						// Trouver le parent CalendarMode-controls pour ce bouton d'année
						const parentControl = yearBtn.closest('.v-date-picker-controls')
						if (!parentControl) return

						// Trouver le bouton de mois correspondant dans le même contrôle
						const siblingMonthBtn = parentControl.querySelector('.v-date-picker-controls__month-btn')
						if (!siblingMonthBtn) return

						// Extraire le texte du bouton de mois pour obtenir l'année
						const monthBtnText = siblingMonthBtn.textContent?.trim() || ''
						const monthBtnParts = monthBtnText.split(' ')

						// Déterminer l'année à afficher selon les priorités
						let displayedYear = ''
						if (yearName?.value) {
							displayedYear = yearName.value
						}
						else if (monthBtnParts.length > 1) {
							displayedYear = monthBtnParts[1]
						}
						else if (yearText.value) {
							displayedYear = yearText.value
						}
						else {
							// Si aucune année n'est trouvée, utiliser l'année courante
							displayedYear = new Date().getFullYear().toString()
						}

						// Créer un bouton stylisé pour l'année
						const yearButtonHTML = `
							<button class="v-btn v-btn--density-comfortable v-btn--variant-text v-theme--light v-btn--size-default" style="color: var(--v-theme-primary);" data-ripple="false" aria-label="${displayedYear}">
								<span class="v-btn__overlay"></span>
								<span class="v-btn__underlay"></span>
								<div class="v-btn__content" data-no-activator="" style="color: var(--v-theme-primary);">
									<span style="color: var(--v-theme-primary);">${displayedYear}</span>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" class="ms-1" style="fill: var(--v-theme-primary);" aria-hidden="true"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg>
								</div>
							</button>
						`

						// Remplacer le contenu du bouton d'année
						yearBtn.innerHTML = yearButtonHTML
					})
				}
			})
		}
		else {
			// Si les refs sont null et le picker n'est pas visible, restaurer les boutons à leur état original
			nextTick(() => {
				// Restaurer les boutons du mois
				const monthBtns = document.querySelectorAll('.v-date-picker-controls__month-btn')
				monthBtns.forEach((monthBtn) => {
					// Restaurer le contenu original du bouton
					const originalText = monthBtn.getAttribute('data-original-text') || monthBtn.textContent?.trim() || ''
					if (originalText) {
						monthBtn.innerHTML = originalText
						// Stocker le texte original pour une restauration future
						monthBtn.setAttribute('data-original-text', originalText)
					}
				})

				// Restaurer les boutons d'année
				const yearBtns = document.querySelectorAll('.v-date-picker-controls__mode-btn')
				yearBtns.forEach((yearBtn) => {
					// Restaurer le contenu original du bouton
					const originalText = yearBtn.getAttribute('data-original-text') || yearBtn.textContent?.trim() || ''
					if (originalText) {
						yearBtn.innerHTML = originalText
						// Stocker le texte original pour une restauration future
						yearBtn.setAttribute('data-original-text', originalText)
					}
				})
			})
		}
	}

	/**
	 * Configure des watchers pour réagir aux changements des refs monthName et yearName
	 */
	if (monthName) {
		watch(monthName, () => {
			customizeMonthButton()
		})
	}

	if (yearName) {
		watch(yearName, () => {
			customizeMonthButton()
		})
	}

	/**
	 * Configure des observateurs pour détecter les changements dans le DOM
	 * et personnaliser les boutons du mois et de l'année automatiquement avec une icône SVG chevron-down
	 * pour tous les DatePickers présents sur la page
	 */
	const setupMonthButtonObserver = () => {
		nextTick(() => {
			const targetNodes = document.querySelectorAll('.v-date-picker-controls')
			if (targetNodes.length > 0) {
				targetNodes.forEach((targetNode) => {
					const observer = new MutationObserver(() => {
						customizeMonthButton()
					})
					observer.observe(targetNode, { childList: true, subtree: true })
				})
			}
		})
	}

	return {
		monthButtonText,
		customizeMonthButton,
		setupMonthButtonObserver,
	}
}
