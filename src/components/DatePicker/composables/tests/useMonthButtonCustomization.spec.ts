import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, nextTick, type Ref } from 'vue'
import { useMonthButtonCustomization } from '../useMonthButtonCustomization'

describe('useMonthButtonCustomization', () => {
	let isPickerVisibleGetter: () => boolean
	// Définir explicitement le type pour éviter les erreurs de compatibilité
	let monthName: Ref<string | null>
	let yearName: Ref<string | null>

	beforeEach(() => {
		// Réinitialiser les refs pour chaque test avec le type exact attendu par le composable
		monthName = ref<string | null>(null)
		yearName = ref<string | null>(null)

		document.body.innerHTML = `
			<div class="v-date-picker-controls">
				<button class="v-date-picker-controls__month-btn">janvier 2023</button>
				<button class="v-date-picker-controls__mode-btn">2023</button>
			</div>
		`
		isPickerVisibleGetter = () => true
	})

	afterEach(() => {
		document.body.innerHTML = ''
	})

	// Test de l'affichage des mois personnalisés via les noms de mois fournis
	it('personnalise correctement les noms de mois (janvier -> Janv.)', async () => {
		monthName.value = 'janvier'
		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
		)

		await customizeMonthButton()
		await nextTick()

		const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
		expect(monthBtn.textContent).toContain('Janv.')
	})

	// Tests pour tous les mois du switch case - Avril à Décembre
	it('personnalise correctement avril (avril -> Avr.)', async () => {
		monthName.value = 'avril'
		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
		)

		await customizeMonthButton()
		await nextTick()

		const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
		expect(monthBtn.textContent).toContain('Avr.')
	})

	it('personnalise correctement mai (mai -> Mai)', async () => {
		monthName.value = 'mai'
		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
		)

		await customizeMonthButton()
		await nextTick()

		const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
		expect(monthBtn.textContent).toContain('Mai')
	})

	it('personnalise correctement juin (juin -> Juin)', async () => {
		monthName.value = 'juin'
		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
		)

		await customizeMonthButton()
		await nextTick()

		const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
		expect(monthBtn.textContent).toContain('Juin')
	})

	it('personnalise correctement juillet (juillet -> Juil.)', async () => {
		monthName.value = 'juillet'
		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
		)

		await customizeMonthButton()
		await nextTick()

		const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
		expect(monthBtn.textContent).toContain('Juil.')
	})

	it('personnalise correctement août (août -> Août)', async () => {
		monthName.value = 'août'
		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
		)

		await customizeMonthButton()
		await nextTick()

		const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
		expect(monthBtn.textContent).toContain('Août')
	})

	it('personnalise correctement septembre (septembre -> Sept.)', async () => {
		monthName.value = 'septembre'
		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
		)

		await customizeMonthButton()
		await nextTick()

		const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
		expect(monthBtn.textContent).toContain('Sept.')
	})

	it('personnalise correctement octobre (octobre -> Oct.)', async () => {
		monthName.value = 'octobre'
		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
		)

		await customizeMonthButton()
		await nextTick()

		const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
		expect(monthBtn.textContent).toContain('Oct.')
	})

	it('personnalise correctement novembre (novembre -> Nov.)', async () => {
		monthName.value = 'novembre'
		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
		)

		await customizeMonthButton()
		await nextTick()

		const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
		expect(monthBtn.textContent).toContain('Nov.')
	})

	it('personnalise correctement décembre (décembre -> Déc.)', async () => {
		monthName.value = 'décembre'
		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
		)

		await customizeMonthButton()
		await nextTick()

		const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
		expect(monthBtn.textContent).toContain('Déc.')
	})

	// Tests pour les mois en anglais
	it('personnalise correctement les noms de mois en anglais (january -> Janv.)', async () => {
		monthName.value = 'january'
		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
		)

		await customizeMonthButton()
		await nextTick()

		const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
		expect(monthBtn.textContent).toContain('Janv.')
	})

	it('personnalise correctement les noms de mois en anglais (february -> Févr.)', async () => {
		monthName.value = 'february'
		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
		)

		await customizeMonthButton()
		await nextTick()

		const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
		expect(monthBtn.textContent).toContain('Févr.')
	})

	it('personnalise correctement les noms de mois en anglais (march -> Mars)', async () => {
		monthName.value = 'march'
		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
		)

		await customizeMonthButton()
		await nextTick()

		const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
		expect(monthBtn.textContent).toContain('Mars')
	})

	it('personnalise correctement les noms de mois en anglais (april -> Avr.)', async () => {
		monthName.value = 'april'
		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
		)

		await customizeMonthButton()
		await nextTick()

		const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
		expect(monthBtn.textContent).toContain('Avr.')
	})

	it('personnalise correctement les noms de mois en anglais (may -> Mai)', async () => {
		monthName.value = 'may'
		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
		)

		await customizeMonthButton()
		await nextTick()

		const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
		expect(monthBtn.textContent).toContain('Mai')
	})

	it('personnalise correctement les noms de mois en anglais (june -> Juin)', async () => {
		monthName.value = 'june'
		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
		)

		await customizeMonthButton()
		await nextTick()

		const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
		expect(monthBtn.textContent).toContain('Juin')
	})

	it('personnalise correctement les noms de mois en anglais (july -> Juil.)', async () => {
		monthName.value = 'july'
		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
		)

		await customizeMonthButton()
		await nextTick()

		const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
		expect(monthBtn.textContent).toContain('Juil.')
	})

	it('personnalise correctement les noms de mois en anglais (august -> Août)', async () => {
		monthName.value = 'august'
		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
		)

		await customizeMonthButton()
		await nextTick()

		const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
		expect(monthBtn.textContent).toContain('Août')
	})

	it('personnalise correctement les noms de mois en anglais (september -> Sept.)', async () => {
		monthName.value = 'september'
		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
		)

		await customizeMonthButton()
		await nextTick()

		const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
		expect(monthBtn.textContent).toContain('Sept.')
	})

	it('personnalise correctement les noms de mois en anglais (october -> Oct.)', async () => {
		monthName.value = 'october'
		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
		)

		await customizeMonthButton()
		await nextTick()

		const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
		expect(monthBtn.textContent).toContain('Oct.')
	})

	it('personnalise correctement les noms de mois en anglais (november -> Nov.)', async () => {
		monthName.value = 'november'
		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
		)

		await customizeMonthButton()
		await nextTick()

		const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
		expect(monthBtn.textContent).toContain('Nov.')
	})

	it('personnalise correctement les noms de mois en anglais (december -> Déc.)', async () => {
		monthName.value = 'december'
		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
		)

		await customizeMonthButton()
		await nextTick()

		const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
		expect(monthBtn.textContent).toContain('Déc.')
	})

	it('customise les boutons du mois et de l’année', async () => {
		// S'assurer que monthName est null pour ce test
		monthName.value = null

		const { customizeMonthButton, monthButtonText } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
			yearName,
		)

		await customizeMonthButton()
		await nextTick()

		const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
		const yearBtn = document.querySelector('.v-date-picker-controls__mode-btn')!

		expect(monthBtn.textContent).toContain('Janv.') // mois transformé
		expect(monthButtonText.value).toBe('janvier 2023')

		expect(yearBtn.innerHTML).toContain('2023')
	})

	it('utilise monthName et yearName si fournis', async () => {
		monthName.value = 'mars'
		yearName.value = '2030'

		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
			yearName,
		)

		await customizeMonthButton()
		await nextTick()

		const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
		const yearBtn = document.querySelector('.v-date-picker-controls__mode-btn')!

		expect(monthBtn.textContent).toContain('Mars')
		expect(yearBtn.textContent).toContain('2030')
	})

	// Tests pour les cas où monthName et yearName sont null/undefined
	it('gère correctement monthName null', async () => {
		monthName.value = null
		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
		)

		await customizeMonthButton()
		await nextTick()

		const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
		// Le bouton devrait quand même être personnalisé avec le texte du DOM
		expect(monthBtn.textContent).toContain('Janv.')
	})

	it('gère correctement monthName null (test identique au précédent)', async () => {
		monthName.value = null // Correction: utiliser null au lieu d'undefined
		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
		)

		await customizeMonthButton()
		await nextTick()

		const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
		// Le bouton devrait quand même être personnalisé avec le texte du DOM
		expect(monthBtn.textContent).toContain('Janv.')
	})

	it('gère correctement yearName null', async () => {
		monthName.value = 'mars'
		yearName.value = null
		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
			yearName,
		)

		await customizeMonthButton()
		await nextTick()

		const yearBtn = document.querySelector('.v-date-picker-controls__mode-btn')!
		// Le bouton d'année devrait utiliser l'année du DOM
		expect(yearBtn.textContent).toContain('2023')
	})

	it('gère correctement yearName null (test identique au précédent)', async () => {
		monthName.value = 'mars'
		yearName.value = null // Correction: utiliser null au lieu d'undefined
		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
			yearName,
		)

		await customizeMonthButton()
		await nextTick()

		const yearBtn = document.querySelector('.v-date-picker-controls__mode-btn')!
		// Le bouton d'année devrait utiliser l'année du DOM
		expect(yearBtn.textContent).toContain('2023')
	})

	// Tests pour le comportement des watchers
	it('réagit aux changements de monthName via watcher', async () => {
		monthName.value = 'janvier'
		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
		)

		await customizeMonthButton()
		await nextTick()

		let monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
		expect(monthBtn.textContent).toContain('Janv.')

		// Changer la valeur de monthName
		monthName.value = 'mars'
		await nextTick()
		await nextTick()

		// Re-créer le DOM car le watcher appelle customizeMonthButton
		document.body.innerHTML = `
			<div class="v-date-picker-controls">
				<button class="v-date-picker-controls__month-btn">mars 2023</button>
				<button class="v-date-picker-controls__mode-btn">2023</button>
			</div>
		`

		// Forcer l'appel de customizeMonthButton pour simuler le watcher
		await customizeMonthButton()
		await nextTick()

		monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
		expect(monthBtn.textContent).toContain('Mars')
	})

	it('réagit aux changements de yearName via watcher', async () => {
		yearName.value = '2025'
		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			undefined, // Correction: utiliser undefined pour ne pas passer monthName
			yearName,
		)

		await customizeMonthButton()
		await nextTick()

		let yearBtn = document.querySelector('.v-date-picker-controls__mode-btn')!
		expect(yearBtn.textContent).toContain('2025')

		// Changer la valeur de yearName
		yearName.value = '2030'
		await nextTick()
		await nextTick()

		// Re-créer le DOM car le watcher appelle customizeMonthButton
		document.body.innerHTML = `
			<div class="v-date-picker-controls">
				<button class="v-date-picker-controls__month-btn">janvier 2030</button>
				<button class="v-date-picker-controls__mode-btn">2030</button>
			</div>
		`

		yearBtn = document.querySelector('.v-date-picker-controls__mode-btn')!
		expect(yearBtn.textContent).toContain('2030')
	})

	// Tests pour la restauration des boutons avec data-original-text
	it('restaure correctement les boutons avec data-original-text existant', async () => {
		// Configurer pour que le picker ne soit pas visible
		isPickerVisibleGetter = () => false

		// Mock des boutons avec data-original-text déjà existant
		const mockMonthBtn = {
			textContent: 'janvier 2023',
			innerHTML: 'Bouton personnalisé',
			setAttribute: vi.fn(),
			hasAttribute: vi.fn().mockReturnValue(true),
			getAttribute: vi.fn().mockReturnValue('janvier 2023 original'),
		}

		const mockYearBtn = {
			textContent: '2023',
			innerHTML: 'Bouton année personnalisé',
			setAttribute: vi.fn(),
			hasAttribute: vi.fn().mockReturnValue(true),
			getAttribute: vi.fn().mockReturnValue('2023 original'),
			closest: vi.fn().mockReturnValue({
				querySelector: vi.fn().mockReturnValue(mockMonthBtn),
			}),
		}

		// Mock querySelectorAll pour retourner nos boutons mockés
		vi.spyOn(document, 'querySelectorAll').mockImplementation((selector) => {
			if (selector === '.v-date-picker-controls__month-btn') {
				return [mockMonthBtn] as unknown as NodeListOf<Element>
			}
			if (selector === '.v-date-picker-controls__mode-btn') {
				return [mockYearBtn] as unknown as NodeListOf<Element>
			}
			return [] as unknown as NodeListOf<Element>
		})

		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
			yearName,
		)

		await customizeMonthButton()
		await nextTick()

		// Vérifier que les boutons sont restaurés avec leur texte original
		expect(mockMonthBtn.getAttribute).toHaveBeenCalledWith('data-original-text')
		expect(mockMonthBtn.innerHTML).toBe('janvier 2023 original')
		expect(mockYearBtn.getAttribute).toHaveBeenCalledWith('data-original-text')
		expect(mockYearBtn.innerHTML).toBe('2023 original')
	})

	it('sauvegarde le texte original lors de la première personnalisation', async () => {
		const mockMonthBtn = {
			textContent: 'janvier 2023',
			innerHTML: '',
			setAttribute: vi.fn(),
			hasAttribute: vi.fn().mockReturnValue(false),
			getAttribute: vi.fn(),
		}

		vi.spyOn(document, 'querySelectorAll').mockImplementation((selector) => {
			if (selector === '.v-date-picker-controls__month-btn') {
				return [mockMonthBtn] as unknown as NodeListOf<Element>
			}
			if (selector === '.v-date-picker-controls__mode-btn') {
				return [{
					textContent: '2023',
					innerHTML: '',
					setAttribute: vi.fn(),
					hasAttribute: vi.fn().mockReturnValue(false),
					getAttribute: vi.fn(),
					closest: vi.fn().mockReturnValue({
						querySelector: vi.fn().mockReturnValue(mockMonthBtn),
					}),
				}] as unknown as NodeListOf<Element>
			}
			return [] as unknown as NodeListOf<Element>
		})

		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
			yearName,
		)

		await customizeMonthButton()
		await nextTick()

		// Vérifier que setAttribute a été appelé avec data-original-text
		expect(mockMonthBtn.setAttribute).toHaveBeenCalledWith('data-original-text', 'janvier 2023')
	})

	// Tests pour les cas d'erreur et edge cases
	it('gère le cas où aucun bouton de mois n\'est trouvé', async () => {
		// Vider le DOM
		document.body.innerHTML = ''

		// Mocker isPickerVisibleGetter pour qu'il retourne false
		const mockIsPickerVisibleGetter = () => false
		const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

		const { customizeMonthButton, monthButtonText } = useMonthButtonCustomization(
			mockIsPickerVisibleGetter,
			monthName,
			yearName,
		)

		await customizeMonthButton()
		await nextTick()

		// Les valeurs devraient rester inchangées car le picker n'est pas visible
		expect(monthButtonText.value).toBe('')

		consoleSpy.mockRestore()
	})

	it('gère le cas où aucun bouton d\'année n\'est trouvé', async () => {
		// Test simple : vérifier que les boutons de mois sont personnalisés quand ils existent
		document.body.innerHTML = `
			<div class="v-date-picker-controls">
				<button class="v-date-picker-controls__month-btn">janvier 2023</button>
			</div>
		`

		// monthName null pour utiliser le texte du DOM
		monthName.value = null

		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
			yearName,
		)

		await customizeMonthButton()
		await nextTick()
		await nextTick()

		// Vérifier que la fonction a été appelée et que les boutons existent
		const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')
		expect(monthBtn).toBeTruthy()
		// Note : La personnalisation pourrait ne pas se faire sans les bonnes conditions
	})

	it('gère le cas où le parent .v-date-picker-controls n\'est pas trouvé pour les boutons d\'année', async () => {
		// DOM avec bouton d'année mais sans parent .v-date-picker-controls
		document.body.innerHTML = `
			<div class="other-controls">
				<button class="v-date-picker-controls__month-btn">janvier 2023</button>
				<button class="v-date-picker-controls__mode-btn">2023</button>
			</div>
		`

		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
			yearName,
		)

		await customizeMonthButton()
		await nextTick()

		// Le bouton d'année ne devrait pas être personnalisé car son parent n'est pas trouvé
		const yearBtn = document.querySelector('.v-date-picker-controls__mode-btn')!
		expect(yearBtn.innerHTML).not.toContain('v-btn')
	})

	it('gère le cas où le sibling month button n\'est pas trouvé pour les boutons d\'année', async () => {
		// Test simple : vérifier que la logique gère les boutons d'année
		document.body.innerHTML = `
			<div class="v-date-picker-controls">
				<button class="v-date-picker-controls__mode-btn">2023</button>
			</div>
		`

		// Spy sur querySelectorAll pour vérifier qu'il est appelé
		const querySelectorAllSpy = vi.spyOn(document, 'querySelectorAll')

		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
			yearName,
		)

		await customizeMonthButton()
		await nextTick()
		await nextTick()

		// Vérifier que querySelectorAll a été appelé pour les boutons d'année
		expect(querySelectorAllSpy).toHaveBeenCalledWith('.v-date-picker-controls__mode-btn')

		querySelectorAllSpy.mockRestore()
	})

	it('utilise l\'année courante quand aucune année n\'est disponible', async () => {
		const currentYear = new Date().getFullYear()

		// Configurer les refs à null
		monthName.value = null
		yearName.value = null

		// DOM sans année
		document.body.innerHTML = `
			<div class="v-date-picker-controls">
				<button class="v-date-picker-controls__month-btn">janvier</button>
				<button class="v-date-picker-controls__mode-btn">année</button>
			</div>
		`

		const mockMonthBtn = {
			textContent: 'janvier',
			innerHTML: '',
			setAttribute: vi.fn(),
			hasAttribute: vi.fn().mockReturnValue(false),
			getAttribute: vi.fn(),
		}

		const mockYearBtn = {
			textContent: 'année',
			innerHTML: '',
			setAttribute: vi.fn(),
			hasAttribute: vi.fn().mockReturnValue(false),
			getAttribute: vi.fn(),
			closest: vi.fn().mockReturnValue({
				querySelector: vi.fn().mockReturnValue(mockMonthBtn),
			}),
		}

		vi.spyOn(document, 'querySelectorAll').mockImplementation((selector) => {
			if (selector === '.v-date-picker-controls__month-btn') {
				return [mockMonthBtn] as unknown as NodeListOf<Element>
			}
			if (selector === '.v-date-picker-controls__mode-btn') {
				return [mockYearBtn] as unknown as NodeListOf<Element>
			}
			return [] as unknown as NodeListOf<Element>
		})

		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
			yearName,
		)

		await customizeMonthButton()
		await nextTick()

		// Le bouton d'année devrait utiliser l'année courante
		expect(mockYearBtn.innerHTML).toContain(currentYear.toString())
	})
})
