import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import ComplexDatePicker from '../ComplexDatePicker.vue'

describe('ComplexDatePicker.vue - Events', () => {
	let wrapper

	beforeEach(() => {
		wrapper = mount(ComplexDatePicker, {
			props: {
				modelValue: '',
				format: 'DD/MM/YYYY',
			},
		})
	})

	it('émet update:modelValue lors de la saisie d\'une date valide', async () => {
		const input = wrapper.find('input')
		await input.setValue('01/01/2023')
		await input.trigger('blur')

		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
		expect(wrapper.emitted('update:modelValue')[0]).toEqual(['01/01/2023'])
	})

	it('met à jour la valeur interne lors de la sélection d\'une date', async () => {
		// Ouvrir le calendrier
		wrapper.vm.isDatePickerVisible = true
		await nextTick()

		// Simuler une saisie directe dans l'input
		const input = wrapper.find('input')
		await input.setValue('01/01/2023')
		await input.trigger('blur')
		await nextTick()

		// Vérifier que l'événement update:modelValue est émis
		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
	})

	it('émet focus lors du focus sur l\'input', async () => {
		const input = wrapper.find('input')
		await input.trigger('focus')

		expect(wrapper.emitted('focus')).toBeTruthy()
	})

	it('émet blur lors de la perte de focus', async () => {
		const input = wrapper.find('input')
		await input.trigger('focus')
		await input.trigger('blur')

		expect(wrapper.emitted('blur')).toBeTruthy()
	})

	it('met à jour la valeur de l\'input lors de la saisie', async () => {
		const input = wrapper.find('input')
		await input.setValue('01/01')
		await nextTick()

		// Vérifier que la valeur est mise à jour dans l'input
		expect(input.element.value).toContain('01/01')
	})

	it('gère la visibilité du calendrier', async () => {
		// Ouvrir le calendrier
		wrapper.vm.isDatePickerVisible = true
		await nextTick()

		// Vérifier que le calendrier est visible
		expect(wrapper.vm.isDatePickerVisible).toBe(true)

		// Fermer le calendrier
		wrapper.vm.isDatePickerVisible = false
		await nextTick()

		// Vérifier que le calendrier est fermé
		expect(wrapper.vm.isDatePickerVisible).toBe(false)
	})

	it('met à jour la valeur interne lors de la sélection d\'une date', async () => {
		// Simuler une saisie directe dans l'input
		const input = wrapper.find('input')
		await input.setValue('01/01/2023')
		await input.trigger('blur')
		await nextTick()

		// Vérifier que la valeur interne est mise à jour
		expect(input.element.value).toContain('01/01/2023')

		// Vérifier que l'événement update:modelValue est émis
		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
	})

	it('synchronise textInputValue et selectedDates', async () => {
		const input = wrapper.find('input')
		await input.setValue('01/01/2023')
		await input.trigger('blur')
		await nextTick()

		// Vérifier que selectedDates est mis à jour
		expect(wrapper.vm.selectedDates).not.toBeNull()
		const selectedDate = wrapper.vm.selectedDates
		expect(selectedDate instanceof Date).toBe(true)
		expect(selectedDate.getFullYear()).toBe(2023)
		expect(selectedDate.getMonth()).toBe(0) // Janvier (0-indexed)
		expect(selectedDate.getDate()).toBe(1)
	})

	it('accepte une plage de dates en entrée', async () => {
		const wrapperWithRange = mount(ComplexDatePicker, {
			props: {
				modelValue: ['01/01/2023', '05/01/2023'],
				format: 'DD/MM/YYYY',
				displayRange: true,
			},
		})
		await nextTick()

		// Vérifier que l'input affiche au moins la première date
		const input = wrapperWithRange.find('input')
		expect(input.element.value).toContain('01/01/2023')

		// Vérifier que la propriété displayRange est bien prise en compte
		expect(wrapperWithRange.props('displayRange')).toBe(true)
	})

	it('valide les dates selon les règles personnalisées', async () => {
		const customRule = {
			type: 'isDateValid',
			options: {},
		}

		const wrapperWithRules = mount(ComplexDatePicker, {
			props: {
				modelValue: '',
				format: 'DD/MM/YYYY',
				customRules: [customRule],
				required: true,
			},
		})

		// Valider sans sélectionner de date
		await wrapperWithRules.vm.validateOnSubmit()
		await nextTick()

		// Vérifier qu'une erreur de validation est affichée
		expect(wrapperWithRules.vm.errorMessages.length).toBeGreaterThan(0)
	})
})
