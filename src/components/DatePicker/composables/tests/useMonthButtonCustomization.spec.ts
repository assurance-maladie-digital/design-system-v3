import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useMonthButtonCustomization } from '../useMonthButtonCustomization'
import { nextTick } from 'vue'

// Mock pour nextTick
vi.mock('vue', async () => {
	const actual = await vi.importActual('vue')
	return {
		...actual as object,
		nextTick: vi.fn((callback) => {
			if (callback) callback()
			return Promise.resolve()
		}),
	}
})

describe('useMonthButtonCustomization', () => {
	// Mock pour document.querySelector
	const mockMonthBtn = {
		textContent: 'Janvier 2025',
		innerHTML: '',
	}

	const mockYearBtn = {
		innerHTML: '',
	}

	beforeEach(() => {
		vi.clearAllMocks()

		// Réinitialiser les mocks pour chaque test
		mockMonthBtn.textContent = 'Janvier 2025'
		mockMonthBtn.innerHTML = ''
		mockYearBtn.innerHTML = ''
		// Mock pour document.querySelector
		document.querySelector = vi.fn((selector) => {
			if (selector === '.v-date-picker-controls__month-btn') {
				return mockMonthBtn
			}
			if (selector === '.v-date-picker-controls__mode-btn') {
				return mockYearBtn
			}
			if (selector === '.v-date-picker-controls') {
				return { childList: true, subtree: true }
			}
			return null
		})

		// Mock pour MutationObserver
		global.MutationObserver = vi.fn().mockImplementation(function (this: { observe: () => void, disconnect: () => void, callback: (mutations: MutationRecord[], observer: MutationObserver) => void }, callback) {
			this.observe = vi.fn()
			this.disconnect = vi.fn()
			// Stocker le callback pour pouvoir le déclencher dans les tests
			this.callback = callback
		})
	})

	it('devrait initialiser correctement', () => {
		const isPickerVisible = () => true
		const { customizeMonthButton, setupMonthButtonObserver } = useMonthButtonCustomization(isPickerVisible)
		expect(customizeMonthButton).toBeDefined()
		expect(setupMonthButtonObserver).toBeDefined()
	})

	it('ne devrait pas appeler nextTick si le picker n\'est pas visible', () => {
		const isPickerVisible = () => false
		const { customizeMonthButton } = useMonthButtonCustomization(isPickerVisible)
		customizeMonthButton()
		expect(nextTick).not.toHaveBeenCalled()
	})

	it('devrait personnaliser le bouton du mois quand le picker est visible', () => {
		const isPickerVisible = () => true
		const { customizeMonthButton } = useMonthButtonCustomization(isPickerVisible)

		customizeMonthButton()
		expect(nextTick).toHaveBeenCalled()
		// Vérifier que le contenu du bouton a été modifié
		expect(mockMonthBtn.innerHTML).not.toBe('')
		expect(mockMonthBtn.innerHTML).toContain('Janvier')
	})

	it('devrait configurer un observateur pour le bouton du mois', () => {
		const isPickerVisible = () => true
		const { setupMonthButtonObserver } = useMonthButtonCustomization(isPickerVisible)

		setupMonthButtonObserver()
		expect(nextTick).toHaveBeenCalled()
		// Vérifier que MutationObserver a été appelé
		expect(global.MutationObserver).toHaveBeenCalled()
	})

	it('devrait extraire correctement le mois et l\'année du texte du bouton', () => {
		const isPickerVisible = () => true
		const { monthButtonText, customizeMonthButton } = useMonthButtonCustomization(isPickerVisible)

		customizeMonthButton()
		expect(monthButtonText.value).toBe('Janvier 2025')
	})
})
