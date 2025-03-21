import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { vuetify } from '@tests/unit/setup'
import { nextTick } from 'vue'
import DatePicker from '../DatePicker.vue'

describe('DatePicker.vue', () => {
	let wrapper

	beforeEach(() => {
		wrapper = mount(DatePicker, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: '',
				required: true,
			},
		})
	})

	it('displays the placeholder text as label', () => {
		const placeholder = 'Sélectionner une date'
		const wrapper = mount(DatePicker, {
			global: {
				plugins: [vuetify],
			},
			props: { placeholder },
		})

		// Vérifier que le placeholder est affiché comme label
		const label = wrapper.find('label')
		expect(label.text()).toBe(placeholder)
	})

	it('emits update:modelValue event on date selection', async () => {
		const wrapper = mount(DatePicker, {
			global: {
				plugins: [vuetify],
			},
		})
		const input = wrapper.find('input')
		await input.setValue('01/01/2023')
		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
	})

	it('renders the component', () => {
		const wrapper = mount(DatePicker, {
			global: {
				plugins: [vuetify],
			},
		})
		expect(wrapper.exists()).toBe(true)
	})

	it('emits the correct formatted date on date selection', async () => {
		const input = wrapper.find('input')
		await input.setValue('01/01/2023')
		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
		expect(wrapper.emitted('update:modelValue')[0]).toEqual(['01/01/2023'])
	})

	it('toggles the date picker visibility on focus', async () => {
		const input = wrapper.find('input')
		await input.trigger('focus')
		expect(wrapper.vm.isDatePickerVisible).toBe(true)
	})

	it('renders the date picker with proper structure', async () => {
		// Ouvrir le DatePicker pour que les éléments soient dans le DOM
		wrapper.vm.isDatePickerVisible = true
		await nextTick()
		// Simuler un clic pour s'assurer que le DatePicker est complètement initialisé
		const input = wrapper.find('input')
		await input.trigger('click')
		await nextTick()
		// Attendre un peu pour que le DOM soit mis à jour
		await new Promise(resolve => setTimeout(resolve, 100))
		// Vérifier que le DatePicker est visible
		const datePickerEl = document.querySelector('.v-date-picker')
		expect(datePickerEl).not.toBeNull()
		// Vérifier qu'il y a des boutons de navigation
		const navigationButtons = datePickerEl?.querySelectorAll('button') || []
		expect(navigationButtons.length).toBeGreaterThan(0)
	})

	it('handles invalid date input gracefully', async () => {
		const input = wrapper.find('input')
		await input.setValue('invalid date')
		expect(wrapper.vm.selectedDates).toBeNull()
		expect(wrapper.emitted('update:modelValue')).toBeFalsy()
	})

	it('hides the date picker when at least two dates are selected in range mode', async () => {
		const wrapper = mount(DatePicker, {
			global: {
				plugins: [vuetify],
			},
			props: {
				displayRange: true, // Activer le mode plage
			},
		})

		// Simule la visibilité initiale du date picker
		wrapper.vm.isDatePickerVisible = true

		// Simule la sélection de deux dates via la propriété `selectedDates`
		wrapper.vm.selectedDates = [new Date('2023-01-01'), new Date('2023-01-05')]
		await nextTick()

		// Vérifie que le date picker est masqué
		expect(wrapper.vm.isDatePickerVisible).toBe(false)
	})

	it('removes the click event listener on unmount', async () => {
		const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

		// Monte le composant
		const wrapper = mount(DatePicker, {
			global: {
				plugins: [vuetify],
			},
		})

		// Démonte le composant
		wrapper.unmount()

		// Vérifie que removeEventListener a été appelé avec les bons arguments
		expect(removeEventListenerSpy).toHaveBeenCalledWith('click', wrapper.vm.handleClickOutside)

		// Nettoie le spy
		removeEventListenerSpy.mockRestore()
	})

	it('returns an array of all dates between two valid dates', () => {
		const datesArray = ['01/01/2023', '05/01/2023']
		const result = wrapper.vm.initializeSelectedDates(datesArray, 'DD/MM/YYYY')

		expect(Array.isArray(result)).toBe(true)
		expect(result.length).toBe(2)
		expect(result[0]).toBeInstanceOf(Date)
		expect(result[1]).toBeInstanceOf(Date)
		expect(result[0].toISOString().split('T')[0]).toBe('2023-01-01')
		expect(result[1].toISOString().split('T')[0]).toBe('2023-01-05')
	})

	it('handles invalid date inputs gracefully', () => {
		const datesArray = ['invalid date', '05/01/2023']
		const result = wrapper.vm.initializeSelectedDates(datesArray, 'DD/MM/YYYY')

		expect(result).toEqual([])
	})

	it('handles a single date correctly', () => {
		const singleDate = '01/01/2023'
		const result = wrapper.vm.initializeSelectedDates(singleDate, 'DD/MM/YYYY')

		expect(result).toBeInstanceOf(Date)
		expect(result.toISOString().split('T')[0]).toBe('2023-01-01')
	})

	it('returns an empty array if start date is after end date', () => {
		const datesArray = ['05/01/2023', '01/01/2023']
		const result = wrapper.vm.initializeSelectedDates(datesArray, 'DD/MM/YYYY')

		expect(result).toEqual([])
	})

	it('returns true when there are no validation errors', async () => {
		const wrapper = mount(DatePicker, {
			global: {
				plugins: [vuetify],
			},
			props: {
				required: true, // Le champ est requis
			},
		})

		// Simule une date valide
		wrapper.vm.selectedDates = [new Date('2023-01-01')]
		await nextTick()

		const result = wrapper.vm.validateOnSubmit()

		// Vérifie que validateOnSubmit retourne true et qu'il n'y a pas d'erreurs
		expect(result).toBe(true)
		expect(wrapper.vm.errorMessages).toEqual([])
	})

	it('returns false when there are validation errors', async () => {
		const wrapper = mount(DatePicker, {
			global: {
				plugins: [vuetify],
			},
			props: {
				required: true, // Le champ est requis
			},
		})

		// Simule l'absence de date sélectionnée
		wrapper.vm.selectedDates = null
		await nextTick()

		const result = wrapper.vm.validateOnSubmit()

		// Vérifie que validateOnSubmit retourne false et qu'il y a des erreurs
		expect(result).toBe(false)
		expect(wrapper.vm.errorMessages).toContain('La date est requise.')
	})

	it('parses a valid date string into a Date instance', () => {
		const modelValue = '15/01/2023' // Chaîne valide
		const result = wrapper.vm.initializeSelectedDates(modelValue, 'DD/MM/YYYY')

		expect(result).toBeInstanceOf(Date) // Doit retourner une instance de Date
		expect(result.toISOString().split('T')[0]).toBe('2023-01-15') // Correspond à la date attendue
	})

	it('returns null if modelValue is null or undefined', () => {
		const modelValue = null
		const result = wrapper.vm.initializeSelectedDates(modelValue, 'DD/MM/YYYY')

		expect(result).toBeNull() // Doit retourner null
	})

	it('handles an invalid date string gracefully', () => {
		const modelValue = 'invalid date'
		const result = wrapper.vm.initializeSelectedDates(modelValue, 'DD/MM/YYYY')

		expect(result).toBeNull()
	})

	it('sets selectedDates to null when input is empty', () => {
		wrapper.vm.updateSelectedDates('') // Simule un input vide

		expect(wrapper.vm.selectedDates).toBeNull() // Vérifie que selectedDates est null
	})

	it('parses a valid date string and updates selectedDates', () => {
		const validInput = '15/01/2023'
		wrapper.vm.updateSelectedDates(validInput) // Simule un input valide

		expect(wrapper.vm.selectedDates).toBeInstanceOf(Date) // Vérifie que selectedDates est une instance de Date
		expect(wrapper.vm.selectedDates.toISOString().split('T')[0]).toBe('2023-01-15') // Vérifie la date exacte
	})

	it('does not update selectedDates for invalid date string', () => {
		const invalidInput = 'invalid-date'
		wrapper.vm.updateSelectedDates(invalidInput) // Simule un input invalide

		expect(wrapper.vm.selectedDates).toBeNull() // Vérifie que selectedDates reste null
	})
})
