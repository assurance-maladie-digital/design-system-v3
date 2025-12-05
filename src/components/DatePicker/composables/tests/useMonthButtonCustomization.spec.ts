import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, nextTick, type Ref, defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { useMonthButtonCustomization } from '../useMonthButtonCustomization'

describe('useMonthButtonCustomization', () => {
	let isPickerVisibleGetter: () => boolean
	// Définir explicitement le type pour éviter les erreurs de compatibilité
	let monthName: Ref<string | null>
	let yearName: Ref<string | null>

	const mountUseMonthButtonCustomization = (options?: {
		isVisibleGetter?: () => boolean
		month?: Ref<string | null>
		year?: Ref<string | null>
	}) => {
		const exposed = {} as ReturnType<typeof useMonthButtonCustomization>
		const TestComponent = defineComponent({
			setup() {
				Object.assign(
					exposed,
					useMonthButtonCustomization(
						options?.isVisibleGetter ?? isPickerVisibleGetter,
						options?.month ?? monthName,
						options?.year ?? yearName,
					),
				)
				return () => null
			},
		})

		const wrapper = mount(TestComponent)
		return { exposed, wrapper }
	}

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
		const { exposed } = mountUseMonthButtonCustomization()

		await exposed.customizeMonthButton()
		await nextTick()

		const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
		expect(monthBtn.textContent).toContain('janv.')
	})

	it('personnalise correctement les noms de mois (février -> févr.)', async () => {
		monthName.value = 'février'
		const { exposed } = mountUseMonthButtonCustomization()

		await exposed.customizeMonthButton()
		await nextTick()

		const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
		expect(monthBtn.textContent).toContain('févr.')
	})

	it('capitalise le premier caractère si le mois n\'est pas reconnu', async () => {
		monthName.value = 'pluviose'
		const { exposed } = mountUseMonthButtonCustomization()

		await exposed.customizeMonthButton()
		await nextTick()

		const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
		expect(monthBtn.textContent).toContain('Pluviose')
	})

	it('customise les boutons du mois et de l’année', async () => {
		// S'assurer que monthName est null pour ce test
		monthName.value = null
		const { exposed } = mountUseMonthButtonCustomization()

		await exposed.customizeMonthButton()
		await nextTick()

		const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
		const yearBtn = document.querySelector('.v-date-picker-controls__mode-btn')!

		expect(monthBtn.innerHTML).toContain('<svg') // icône ajoutée
		expect(monthBtn.textContent).toContain('janv.') // mois transformé
		expect(exposed.monthButtonText.value).toBe('janvier 2023')

		expect(yearBtn.innerHTML).toContain('2023')
		expect(yearBtn.innerHTML).toContain('<svg')
	})

	it('utilise monthName et yearName si fournis', async () => {
		monthName.value = 'mars'
		yearName.value = '2030'
		const { exposed } = mountUseMonthButtonCustomization()

		await exposed.customizeMonthButton()
		await nextTick()

		const monthBtn = document.querySelector('.v-date-picker-controls__month-btn')!
		const yearBtn = document.querySelector('.v-date-picker-controls__mode-btn')!

		expect(monthBtn.textContent).toContain('mars')
		expect(yearBtn.textContent).toContain('2030')
	})

	it('observe les changements du DOM et personnalise automatiquement', async () => {
		const { exposed } = mountUseMonthButtonCustomization({ isVisibleGetter: () => true })
		const spy = vi.spyOn(document, 'querySelectorAll')

		exposed.setupMonthButtonObserver()
		await nextTick()

		expect(spy).toHaveBeenCalledWith('.v-date-picker-controls')
	})
})
