import { ref, nextTick, type Ref, onBeforeUnmount } from 'vue'
import { expandMonthAccessibleName } from '@/composables/date/useDatePickerAccessibility'
import { locales } from '../locales'

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
	const monthButtonObservers: MutationObserver[] = []
	const primaryThemeColor = 'rgb(var(--v-theme-primary, 12, 65, 154))'

	const normalizeMonthLabel = (rawMonth: string | null | undefined, fallback: string): string => {
		const source = (rawMonth ?? '').trim() || fallback.trim()
		if (!source) return ''
		return source.charAt(0).toLocaleLowerCase('fr-FR') + source.slice(1)
	}

	const buildMonthAriaLabel = (
		rawMonth: string | null | undefined,
		displayMonth: string,
	): string => {
		const fullMonth = rawMonth ? expandMonthAccessibleName(rawMonth) : ''
		const monthLabel = fullMonth || normalizeMonthLabel(rawMonth, displayMonth)
		if (!monthLabel) return locales.selectMonth()
		return `${locales.selectMonth()} (${fullMonth} / ${displayMonth} ${locales.selectedByDefault})`
	}

	const buildYearAriaLabel = (year: string | null | undefined): string => {
		const cleanYear = (year ?? '').trim()
		if (cleanYear) {
			return `${locales.selectYear()} (${cleanYear} ${locales.selectedByDefault})`
		}
		return locales.selectYear()
	}

	onBeforeUnmount(() => {
		monthButtonObservers.forEach(observer => observer.disconnect())
		monthButtonObservers.length = 0
	})

	/**
	 * Retourne un nom personnalisé pour le mois en fonction de sa valeur
	 * @param monthName - Le nom du mois à personnaliser
	 * @returns Le nom personnalisé du mois
	 */
	const getCustomMonthName = (monthName: string | null | undefined): string => {
		if (!monthName) return ''

		const lowerMonth = monthName.toLowerCase()
		const normalizedEnglishMonths = [
			'january',
			'february',
			'march',
			'april',
			'may',
			'june',
			'july',
			'august',
			'september',
			'october',
			'november',
			'december',
		]
		const englishIndex = normalizedEnglishMonths.indexOf(lowerMonth)
		if (englishIndex !== -1) {
			return locales.monthNamesShort[englishIndex]!
		}

		const frenchIndex = locales.monthNames.findIndex(name => name.toLowerCase() === lowerMonth)
		if (frenchIndex !== -1) {
			return locales.monthNamesShort[frenchIndex]!
		}

		// Si le mois n'est pas reconnu, retourner le mois avec la première lettre en majuscule
		return monthName.charAt(0).toUpperCase() + monthName.slice(1)
	}

	/**
	 * Récupère et modifie les boutons du mois et de l'année avec une icône SVG chevron-down
	 */
	const customizeMonthButton = () => {
		if (isPickerVisibleGetter() || monthName?.value) {
			nextTick(() => {
				// Personnalisation des boutons du mois pour tous les DatePickers
				const monthBtns = document.querySelectorAll('.v-date-picker-controls__month-btn')
				if (monthBtns.length > 0) {
					// Récupérer le texte original et le nettoyer du premier bouton pour référence
					// Cela n'affectera pas la personnalisation des autres boutons
					monthButtonText.value = monthBtns[0]!.textContent?.trim() || ''
					const parts = monthButtonText.value.split(' ')
					yearText.value = parts[1] ? parts[1] : ''

					// Appliquer la personnalisation à tous les boutons du mois
					monthBtns.forEach((monthBtn) => {
						// Extraire le mois et l'année pour ce bouton spécifique
						const btnText = monthBtn.textContent?.trim() || ''
						const btnParts = btnText.split(' ').filter(Boolean)
						// Utiliser le monthName fourni s'il existe, sinon utiliser le texte extrait
						const rawMonthText = monthName?.value || btnParts[0]
						// Personnaliser le nom du mois avec notre fonction switch case
						const monthText = getCustomMonthName(rawMonthText)
						const monthAriaLabel = buildMonthAriaLabel(rawMonthText, monthText)

						// Styliser le bouton existant comme un VBtn avec une icône Material Design
						const monthBtnElement = monthBtn as HTMLElement
						monthBtnElement.classList.add(
							'v-btn',
							'v-btn--density-comfortable',
							'v-btn--variant-text',
							'v-theme--light',
							'v-btn--size-default',
							'custom-month-btn',
						)
						monthBtnElement.setAttribute('data-ripple', 'false')
						monthBtnElement.setAttribute('aria-label', monthAriaLabel)
						monthBtnElement.setAttribute('title', monthAriaLabel)
						monthBtnElement.style.color = primaryThemeColor

						const buttonContentHTML = `
							<div class="v-btn__content" data-no-activator="" style="color: ${primaryThemeColor};">
								<span style="color: ${primaryThemeColor};">${monthText}</span> 
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" class="ms-1" style="fill: ${primaryThemeColor};" aria-hidden="true"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg>
							</div>
						`

						// Remplacer le contenu du bouton original par le contenu stylisé uniquement
						monthBtn.innerHTML = buttonContentHTML
					})

					// Personnalisation des boutons d'année pour tous les DatePickers
					const yearBtns = document.querySelectorAll('.v-date-picker-controls__mode-btn')
					yearBtns.forEach((yearBtn) => {
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
						else if (monthBtnParts[1]) {
							displayedYear = monthBtnParts[1]
						}
						else if (yearText.value) {
							displayedYear = yearText.value
						}
						else {
							// Si aucune année n'est trouvée, utiliser l'année courante
							displayedYear = new Date().getFullYear().toString()
						}

						const yearAriaLabel = buildYearAriaLabel(displayedYear)

						// Styliser le bouton existant pour l'année
						const yearBtnElement = yearBtn as HTMLElement
						yearBtnElement.classList.add(
							'v-btn',
							'v-btn--density-comfortable',
							'v-btn--variant-text',
							'v-theme--light',
							'v-btn--size-default',
							'custom-year-btn',
						)
						yearBtnElement.setAttribute('data-ripple', 'false')
						yearBtnElement.setAttribute('aria-label', yearAriaLabel)
						yearBtnElement.setAttribute('title', yearAriaLabel)
						yearBtnElement.style.color = primaryThemeColor

						const yearButtonContentHTML = `
							<div class="v-btn__content" data-no-activator="" style="color: ${primaryThemeColor};">
								<span style="color: ${primaryThemeColor};">${displayedYear}</span> 
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" class="ms-1" style="fill: ${primaryThemeColor};" aria-hidden="true"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg>
							</div>
						`

						// Remplacer le contenu du bouton d'année par le contenu stylisé uniquement
						yearBtn.innerHTML = yearButtonContentHTML
					})
				}
			})
		}
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
					monthButtonObservers.push(observer)
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
