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

	it('personnalise correctement les noms de mois (février -> Févr.)', async () => {
		monthName.value = 'février'
		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
		)

		await customizeMonthButton()
		await nextTick()

		const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
		expect(monthBtn.textContent).toContain('Févr.')
	})

	it('capitalise le premier caractère si le mois n\'est pas reconnu', async () => {
		monthName.value = 'pluviose'
		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
		)

		await customizeMonthButton()
		await nextTick()

		const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
		expect(monthBtn.textContent).toContain('Pluviose')
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

		expect(monthBtn.innerHTML).toContain('<svg') // icône ajoutée
		expect(monthBtn.textContent).toContain('Janv.') // mois transformé
		expect(monthButtonText.value).toBe('janvier 2023')

		expect(yearBtn.innerHTML).toContain('2023')
		expect(yearBtn.innerHTML).toContain('<svg')
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

	it('observe les changements du DOM et personnalise automatiquement', async () => {
		const { setupMonthButtonObserver } = useMonthButtonCustomization(() => true)
		const spy = vi.spyOn(document, 'querySelectorAll')

		setupMonthButtonObserver()
		await nextTick()

		expect(spy).toHaveBeenCalledWith('.v-date-picker-controls')
	})

	// Test du cas de figure : picker non visible mais refs avec valeurs
	it('ne personnalise pas les boutons quand le picker n\'est pas visible même si les refs ont des valeurs', async () => {
		// Configurer pour que le picker ne soit pas visible
		isPickerVisibleGetter = () => false

		// Définir des valeurs pour les refs
		monthName.value = 'janvier'
		yearName.value = '2023'

		const { customizeMonthButton } = useMonthButtonCustomization(
			isPickerVisibleGetter,
			monthName,
			yearName,
		)

		// Spy sur querySelectorAll pour vérifier qu'il n'est pas appelé
		const querySelectorAllSpy = vi.spyOn(document, 'querySelectorAll')

		await customizeMonthButton()
		await nextTick()

		// Vérifier que querySelectorAll n'a pas été appelé car le picker n'est pas visible
		expect(querySelectorAllSpy).not.toHaveBeenCalled()

		querySelectorAllSpy.mockRestore()
	})

	// Test du cas de figure : restauration des boutons quand refs sont null et picker non visible
	it('restaure les boutons originaux quand les refs sont null et picker non visible', async () => {
		// Configurer pour que le picker ne soit pas visible
		isPickerVisibleGetter = () => false

		// Définir les refs à null
		monthName.value = null
		yearName.value = null

		// Mock des boutons avec data-original-text
		const mockMonthBtn = {
			textContent: 'janvier 2023',
			innerHTML: 'Bouton personnalisé',
			setAttribute: vi.fn(),
			hasAttribute: vi.fn().mockReturnValue(false),
			getAttribute: vi.fn().mockReturnValue('janvier 2023'),
		}

		const mockYearBtn = {
			textContent: '2023',
			innerHTML: 'Bouton année personnalisé',
			setAttribute: vi.fn(),
			hasAttribute: vi.fn().mockReturnValue(false),
			getAttribute: vi.fn().mockReturnValue('2023'),
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

		// Vérifier que les boutons sont restaurés à leur état original
		expect(mockMonthBtn.getAttribute).toHaveBeenCalledWith('data-original-text')
		expect(mockMonthBtn.innerHTML).toBe('janvier 2023')
		expect(mockYearBtn.getAttribute).toHaveBeenCalledWith('data-original-text')
		expect(mockYearBtn.innerHTML).toBe('2023')
	})
})
