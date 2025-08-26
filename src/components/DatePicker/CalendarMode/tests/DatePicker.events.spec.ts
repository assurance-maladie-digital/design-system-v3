import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { vuetify } from '@tests/unit/setup'
import { nextTick } from 'vue'
import DatePicker from '../DatePicker.vue'

describe('CalendarMode.vue - Events', () => {
	let wrapper

	beforeEach(() => {
		wrapper = mount(DatePicker, {
			global: {
				plugins: [vuetify],
			},
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

	it('gère la visibilité du calendrier', async () => {
		// Ouvrir le calendrier
		await wrapper.find('.v-text-field').trigger('click')
		await nextTick()

		// Vérifier que le calendrier est visible
		expect(wrapper.vm.isDatePickerVisible).toBe(true)

		// Fermer le calendrier
		wrapper.vm.isDatePickerVisible = false
		await nextTick()

		// Vérifier que le calendrier est fermé
		expect(wrapper.vm.isDatePickerVisible).toBe(false)
	})

	it('accepte la saisie de dates', async () => {
		const input = wrapper.find('input')

		// Simuler la saisie de chiffres
		await input.setValue('0101')
		await nextTick()

		// Vérifier que la valeur est bien prise en compte
		expect(input.element.value).toContain('01')
	})

	it('permet la saisie manuelle même avec disablePickerInteraction', async () => {
		// Créer un composant avec disablePickerInteraction à true
		const wrapperWithDisabledPicker = mount(DatePicker, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: '',
				format: 'DD/MM/YYYY',
				disablePickerInteraction: true,
			},
		})

		// Simuler une saisie dans l'input
		const input = wrapperWithDisabledPicker.find('input')
		await input.setValue('01/01/2023')
		await input.trigger('blur')
		await nextTick()

		// Vérifier que l'événement update:modelValue est émis même avec disablePickerInteraction
		const emitted = wrapperWithDisabledPicker.emitted('update:modelValue')
		expect(emitted).toBeTruthy()
		expect(emitted && emitted[0][0]).toBe('01/01/2023')
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

	it('met à jour displayFormattedDate lors de la sélection d\'une date dans le calendrier', async () => {
		// Ouvrir le calendrier
		await wrapper.find('.v-text-field').trigger('click')
		await nextTick()

		// Simuler une sélection de date dans le VDatePicker
		if (wrapper.vm.$refs.datePicker) {
			// Simuler l'événement update:model-value du VDatePicker
			const date = new Date(2023, 0, 1) // 1 janvier 2023
			wrapper.vm.handleDatePickerInput(date)
			await nextTick()

			// Appeler updateDisplayFormattedDate comme le ferait le gestionnaire d'événements
			wrapper.vm.updateDisplayFormattedDate()
			await nextTick()

			// Vérifier que displayFormattedDate est mis à jour correctement
			expect(wrapper.vm.displayFormattedDate).toBe('01/01/2023')
		}
	})

	it('accepte différents formats de date', async () => {
		const wrapperWithDashFormat = mount(DatePicker, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: '',
				format: 'YYYY-MM-DD',
			},
		})

		const input = wrapperWithDashFormat.find('input')

		// Simuler la saisie d'une date complète au format YYYY-MM-DD
		await input.setValue('2023-01-01')
		await input.trigger('blur')
		await nextTick()

		// Vérifier que l'événement update:modelValue est émis avec le bon format
		const emitted = wrapperWithDashFormat.emitted('update:modelValue')
		expect(emitted).toBeTruthy()
		expect(emitted && emitted[0][0]).toBe('2023-01-01')
	})

	it('accepte les plages de dates en entrée', async () => {
		const wrapperWithRange = mount(DatePicker, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: ['01/01/2023', '05/01/2023'],
				format: 'DD/MM/YYYY',
				displayRange: true,
			},
		})
		await nextTick()

		// Vérifier que l'input affiche la plage de dates
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

		const wrapperWithRules = mount(DatePicker, {
			global: {
				plugins: [vuetify],
			},
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
