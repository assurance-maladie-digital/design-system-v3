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
	rootElGetter?: () => HTMLElement | null | undefined,
) {
	const monthButtonText = ref('')
	const yearText = ref('')
	const monthButtonObservers: MutationObserver[] = []
	const observedControls = new WeakSet<Element>()
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

	const buildYearAriaLabel = (year: string | number | null | undefined): string => {
		const cleanYear = String(year ?? '').trim()
		if (cleanYear) {
			return `${locales.selectYear()} (${cleanYear} ${locales.selectedByDefault})`
		}
		return locales.selectYear()
	}

	const createChevronIcon = (): SVGSVGElement => {
		const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
		icon.setAttribute('viewBox', '0 0 24 24')
		icon.setAttribute('width', '18')
		icon.setAttribute('height', '18')
		icon.setAttribute('class', 'ms-1')
		icon.setAttribute('aria-hidden', 'true')
		icon.style.fill = primaryThemeColor

		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
		path.setAttribute('d', 'M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z')
		icon.appendChild(path)

		return icon
	}

	const replaceButtonContent = (
		button: Element,
		visibleText: string,
		ariaLabel: string,
		customizationKey: string,
	) => {
		const buttonElement = button as HTMLElement

		buttonElement.classList.add(
			'v-btn',
			'v-btn--density-comfortable',
			'v-btn--variant-text',
			'v-theme--light',
			'v-btn--size-default',
			customizationKey,
		)
		buttonElement.setAttribute('data-ripple', 'false')
		buttonElement.setAttribute('aria-label', ariaLabel)
		buttonElement.setAttribute('title', ariaLabel)
		buttonElement.style.color = primaryThemeColor

		const signature = `${visibleText}|${ariaLabel}`
		if (buttonElement.dataset.datePickerCustomizationSignature === signature) return

		const content = document.createElement('div')
		content.className = 'v-btn__content'
		content.setAttribute('data-no-activator', '')
		content.style.color = primaryThemeColor

		const label = document.createElement('span')
		label.style.color = primaryThemeColor
		label.textContent = visibleText

		content.append(label, createChevronIcon())
		buttonElement.replaceChildren(content)
		buttonElement.dataset.datePickerCustomizationSignature = signature
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
				const root = rootElGetter?.() ?? document
				// Personnalisation des boutons du mois pour tous les DatePickers
				const monthBtns = root.querySelectorAll('.v-date-picker-controls__month-btn')
				if (monthBtns.length > 0) {
					// Récupérer le texte original et le nettoyer du premier bouton pour référence
					// Cela n'affectera pas la personnalisation des autres boutons
					monthButtonText.value = monthBtns[0]!.textContent?.trim() || ''
					const parts = monthButtonText.value.split(' ')
					if (parts[1]) {
						yearText.value = parts[1]
					}

					// Appliquer la personnalisation à tous les boutons du mois
					monthBtns.forEach((monthBtn) => {
						const monthBtnElement = monthBtn as HTMLElement
						// Extraire le mois et l'année pour ce bouton spécifique
						const btnText = monthBtn.textContent?.trim() || ''
						const btnParts = btnText.split(' ').filter(Boolean)
						// Utiliser le monthName fourni s'il existe, sinon utiliser le texte extrait
						const rawMonthText = monthName?.value || monthBtnElement.dataset.datePickerRawMonth || btnParts[0]
						// Personnaliser le nom du mois avec notre fonction switch case
						const monthText = getCustomMonthName(rawMonthText)
						const monthAriaLabel = buildMonthAriaLabel(rawMonthText, monthText)

						if (rawMonthText) {
							monthBtnElement.dataset.datePickerRawMonth = rawMonthText
						}
						replaceButtonContent(monthBtn, monthText, monthAriaLabel, 'custom-month-btn')
					})

					// Personnalisation des boutons d'année pour tous les DatePickers
					const yearBtns = root.querySelectorAll('.v-date-picker-controls__mode-btn')
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

						replaceButtonContent(yearBtn, displayedYear, yearAriaLabel, 'custom-year-btn')
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
			const root = rootElGetter?.() ?? document
			const targetNodes = root.querySelectorAll('.v-date-picker-controls')
			if (targetNodes.length > 0) {
				targetNodes.forEach((targetNode) => {
					if (observedControls.has(targetNode)) return
					observedControls.add(targetNode)
					let isScheduled = false
					const observer = new MutationObserver(() => {
						if (isScheduled) return
						isScheduled = true
						nextTick(() => {
							isScheduled = false
							customizeMonthButton()
						})
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
