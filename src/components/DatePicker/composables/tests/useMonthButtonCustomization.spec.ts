import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useMonthButtonCustomization } from '../useMonthButtonCustomization'

describe('useMonthButtonCustomization', () => {
	let isPickerVisibleGetter: () => boolean
	// Définir explicitement le type pour éviter les erreurs de compatibilité
	let monthName = ref<string | null>(null)
	let yearName = ref<string | null>(null)

	beforeEach(() => {
		// Réinitialiser les refs pour chaque test
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
})
