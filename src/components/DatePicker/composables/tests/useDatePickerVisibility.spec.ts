import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest'
import { ref } from 'vue'
import { useDatePickerVisibility } from '../useDatePickerVisibility'

// Mock pour les hooks de cycle de vie de Vue
vi.mock('vue', async () => {
	const actual = await vi.importActual('vue')
	return {
		...actual,
		onMounted: vi.fn(fn => fn()),
		onBeforeUnmount: vi.fn(),
		nextTick: vi.fn(fn => fn && fn()),
	}
})

describe('useDatePickerVisibility', () => {
	// Mocks et setup
	const mockUpdateAccessibility = vi.fn()
	const mockValidateDates = vi.fn()
	const mockEmitClosed = vi.fn()
	const mockEmitFocus = vi.fn()
	const isDatePickerVisible = ref(false)
	const isManualInputActive = ref(false)
	const hasInteracted = ref(false)
	// Mock pour document.addEventListener
	const originalAddEventListener = document.addEventListener
	const originalRemoveEventListener = document.removeEventListener
	const mockAddEventListener = vi.fn()
	const mockRemoveEventListener = vi.fn()

	beforeEach(() => {
		// Réinitialiser les mocks et les refs avant chaque test
		mockUpdateAccessibility.mockReset()
		mockValidateDates.mockReset()
		mockEmitClosed.mockReset()
		mockEmitFocus.mockReset()
		isDatePickerVisible.value = false
		isManualInputActive.value = false
		hasInteracted.value = false

		// Restaurer les mocks de document
		document.addEventListener = mockAddEventListener
		document.removeEventListener = mockRemoveEventListener
		mockAddEventListener.mockReset()
		mockRemoveEventListener.mockReset()
	})

	// Restaurer les fonctions originales après tous les tests
	afterAll(() => {
		document.addEventListener = originalAddEventListener
		document.removeEventListener = originalRemoveEventListener
	})

	it('devrait enregistrer un écouteur d\'événement pour les clics en dehors du DatePicker', () => {
		useDatePickerVisibility({
			isDatePickerVisible,
			isManualInputActive,
			hasInteracted,
			updateAccessibility: mockUpdateAccessibility,
			validateDates: mockValidateDates,
			emitClosed: mockEmitClosed,
			emitFocus: mockEmitFocus,
		})

		expect(mockAddEventListener).toHaveBeenCalledWith('click', expect.any(Function))
	})

	describe('toggleDatePicker', () => {
		it('ne devrait pas basculer le DatePicker si disabled=true', () => {
			const { toggleDatePicker } = useDatePickerVisibility({
				disabled: true,
				isDatePickerVisible,
				isManualInputActive,
				hasInteracted,
				updateAccessibility: mockUpdateAccessibility,
				validateDates: mockValidateDates,
				emitClosed: mockEmitClosed,
				emitFocus: mockEmitFocus,
			})

			toggleDatePicker()

			expect(isDatePickerVisible.value).toBe(false)
		})

		it('ne devrait pas basculer le DatePicker si readonly=true', () => {
			const { toggleDatePicker } = useDatePickerVisibility({
				readonly: true,
				isDatePickerVisible,
				isManualInputActive,
				hasInteracted,
				updateAccessibility: mockUpdateAccessibility,
				validateDates: mockValidateDates,
				emitClosed: mockEmitClosed,
				emitFocus: mockEmitFocus,
			})

			toggleDatePicker()

			expect(isDatePickerVisible.value).toBe(false)
		})

		it('devrait basculer le DatePicker de fermé à ouvert', () => {
			const { toggleDatePicker } = useDatePickerVisibility({
				isDatePickerVisible,
				isManualInputActive,
				hasInteracted,
				updateAccessibility: mockUpdateAccessibility,
				validateDates: mockValidateDates,
				emitClosed: mockEmitClosed,
				emitFocus: mockEmitFocus,
			})

			toggleDatePicker()

			expect(isDatePickerVisible.value).toBe(true)
			expect(mockUpdateAccessibility).toHaveBeenCalledTimes(1)
		})

		it('devrait basculer le DatePicker d\'ouvert à fermé', () => {
			isDatePickerVisible.value = true

			const { toggleDatePicker } = useDatePickerVisibility({
				isDatePickerVisible,
				isManualInputActive,
				hasInteracted,
				updateAccessibility: mockUpdateAccessibility,
				validateDates: mockValidateDates,
				emitClosed: mockEmitClosed,
				emitFocus: mockEmitFocus,
			})

			toggleDatePicker()

			expect(isDatePickerVisible.value).toBe(false)
			expect(mockEmitClosed).toHaveBeenCalledTimes(1)
			expect(mockValidateDates).toHaveBeenCalledTimes(1)
		})
	})

	describe('openDatePicker', () => {
		it('devrait ouvrir le DatePicker s\'il est fermé', () => {
			const { openDatePicker } = useDatePickerVisibility({
				isDatePickerVisible,
				isManualInputActive,
				hasInteracted,
				updateAccessibility: mockUpdateAccessibility,
				validateDates: mockValidateDates,
				emitClosed: mockEmitClosed,
				emitFocus: mockEmitFocus,
			})

			openDatePicker()

			expect(isDatePickerVisible.value).toBe(true)
		})

		it('ne devrait pas modifier l\'état si le DatePicker est déjà ouvert', () => {
			isDatePickerVisible.value = true

			const { openDatePicker } = useDatePickerVisibility({
				isDatePickerVisible,
				isManualInputActive,
				hasInteracted,
				updateAccessibility: mockUpdateAccessibility,
				validateDates: mockValidateDates,
				emitClosed: mockEmitClosed,
				emitFocus: mockEmitFocus,
			})

			openDatePicker()

			expect(isDatePickerVisible.value).toBe(true)
			// updateAccessibility ne devrait pas être appelé une seconde fois
			expect(mockUpdateAccessibility).not.toHaveBeenCalled()
		})
	})

	describe('openDatePickerOnClick', () => {
		it('devrait ouvrir le DatePicker si textFieldActivator=true', () => {
			const { openDatePickerOnClick } = useDatePickerVisibility({
				textFieldActivator: true,
				isDatePickerVisible,
				isManualInputActive,
				hasInteracted,
				updateAccessibility: mockUpdateAccessibility,
				validateDates: mockValidateDates,
				emitClosed: mockEmitClosed,
				emitFocus: mockEmitFocus,
			})

			openDatePickerOnClick()

			expect(isDatePickerVisible.value).toBe(true)
		})

		it('ne devrait pas ouvrir le DatePicker si textFieldActivator=false', () => {
			const { openDatePickerOnClick } = useDatePickerVisibility({
				textFieldActivator: false,
				isDatePickerVisible,
				isManualInputActive,
				hasInteracted,
				updateAccessibility: mockUpdateAccessibility,
				validateDates: mockValidateDates,
				emitClosed: mockEmitClosed,
				emitFocus: mockEmitFocus,
			})

			openDatePickerOnClick()

			expect(isDatePickerVisible.value).toBe(false)
		})
	})

	describe('openDatePickerOnFocus', () => {
		it('devrait ouvrir le DatePicker si textFieldActivator=true', () => {
			const { openDatePickerOnFocus } = useDatePickerVisibility({
				textFieldActivator: true,
				isDatePickerVisible,
				isManualInputActive,
				hasInteracted,
				updateAccessibility: mockUpdateAccessibility,
				validateDates: mockValidateDates,
				emitClosed: mockEmitClosed,
				emitFocus: mockEmitFocus,
			})

			openDatePickerOnFocus()

			expect(isDatePickerVisible.value).toBe(true)
			expect(mockEmitFocus).toHaveBeenCalledTimes(1)
			expect(isManualInputActive.value).toBe(true)
			expect(hasInteracted.value).toBe(true)
		})

		it('ne devrait pas ouvrir le DatePicker si textFieldActivator=false', () => {
			const { openDatePickerOnFocus } = useDatePickerVisibility({
				textFieldActivator: false,
				isDatePickerVisible,
				isManualInputActive,
				hasInteracted,
				updateAccessibility: mockUpdateAccessibility,
				validateDates: mockValidateDates,
				emitClosed: mockEmitClosed,
				emitFocus: mockEmitFocus,
			})

			openDatePickerOnFocus()

			expect(isDatePickerVisible.value).toBe(false)
			expect(mockEmitFocus).toHaveBeenCalledTimes(1)
			expect(isManualInputActive.value).toBe(true)
			expect(hasInteracted.value).toBe(true)
		})
	})

	describe('handleClickOutside', () => {
		it('ne devrait rien faire si le DatePicker est fermé', () => {
			const { handleClickOutside } = useDatePickerVisibility({
				isDatePickerVisible,
				isManualInputActive,
				hasInteracted,
				updateAccessibility: mockUpdateAccessibility,
				validateDates: mockValidateDates,
				emitClosed: mockEmitClosed,
				emitFocus: mockEmitFocus,
			})

			const event = new MouseEvent('click', { bubbles: true })
			Object.defineProperty(event, 'target', { value: document.createElement('div') })

			handleClickOutside(event)

			expect(mockEmitClosed).not.toHaveBeenCalled()
			expect(mockValidateDates).not.toHaveBeenCalled()
		})

		it('ne devrait rien faire si le clic est à l\'intérieur du DatePicker', () => {
			isDatePickerVisible.value = true

			const { handleClickOutside } = useDatePickerVisibility({
				isDatePickerVisible,
				isManualInputActive,
				hasInteracted,
				updateAccessibility: mockUpdateAccessibility,
				validateDates: mockValidateDates,
				emitClosed: mockEmitClosed,
				emitFocus: mockEmitFocus,
			})

			// Créer un élément avec la classe date-picker-container
			const container = document.createElement('div')
			container.className = 'date-picker-container'

			// Créer un élément enfant
			const child = document.createElement('button')
			container.appendChild(child)

			// Simuler un clic sur l'enfant
			const event = { target: child } as unknown as MouseEvent

			// Mock pour closest
			child.closest = vi.fn().mockReturnValue(container)

			handleClickOutside(event)

			expect(mockEmitClosed).not.toHaveBeenCalled()
			expect(mockValidateDates).not.toHaveBeenCalled()
		})

		it('devrait fermer le DatePicker si le clic est à l\'extérieur', () => {
			isDatePickerVisible.value = true

			const { handleClickOutside } = useDatePickerVisibility({
				isDatePickerVisible,
				isManualInputActive,
				hasInteracted,
				updateAccessibility: mockUpdateAccessibility,
				validateDates: mockValidateDates,
				emitClosed: mockEmitClosed,
				emitFocus: mockEmitFocus,
			})

			// Créer un élément extérieur
			const outsideElement = document.createElement('div')

			// Mock pour closest
			outsideElement.closest = vi.fn().mockReturnValue(null)

			// Simuler un clic sur l'élément extérieur
			const event = { target: outsideElement } as unknown as MouseEvent

			handleClickOutside(event)

			expect(mockEmitClosed).toHaveBeenCalledTimes(1)
			expect(mockValidateDates).toHaveBeenCalledTimes(1)
		})
	})
})
