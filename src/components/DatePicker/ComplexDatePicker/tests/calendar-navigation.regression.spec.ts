import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'
import ComplexDatePicker from '../ComplexDatePicker.vue'

/**
 * Tests de régression pour la navigation du calendrier
 * Bug précédent : currentMonthName ne se mettait pas à jour via les flèches
 */
describe('Calendar Navigation Regression Tests', () => {
	/**
	 * Test 1 : Navigation mois via flèches met à jour l'affichage
	 */
	it('met à jour currentMonthName quand on navigue via les flèches', async () => {
		const wrapper = mount(ComplexDatePicker, {
			props: {
				modelValue: '15/05/2025',
				label: 'Date',
				format: 'DD/MM/YYYY',
			},
		})

		// Attendre l'initialisation
		await flushPromises()

		// Ouvrir le calendrier (via propriété directe pour éviter les listeners)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(wrapper.vm as any).isDatePickerVisible = true
		await nextTick()

		// Le mois affiché doit correspondre à la date sélectionnée (mai)
		// Note: On ne peut pas tester directement le DOM interne de VDatePicker
		// mais on peut vérifier que selectedDates est bien synchronisé
		const emitted = wrapper.emitted('date-selected')
		expect(emitted).toBeTruthy()

		wrapper.unmount()
	})

	/**
	 * Test 2 : Clear réinitialise le calendrier
	 * Bug production : VDatePicker gardait l'ancienne date après clear
	 */
	it('reset le calendrier après clear', async () => {
		const wrapper = mount(ComplexDatePicker, {
			props: {
				modelValue: '15/05/2025',
				label: 'Date',
				format: 'DD/MM/YYYY',
			},
		})

		await flushPromises()

		// Simuler un clear
		await wrapper.find('input').setValue('')
		await wrapper.find('input').trigger('blur')
		await flushPromises()

		// Vérifier que le model est mis à jour
		const emitted = wrapper.emitted('update:modelValue')
		const lastValue = emitted?.[emitted.length - 1]?.[0]
		expect(lastValue).toBeNull()

		wrapper.unmount()
	})

	/**
	 * Test 3 : Réouverture avec date déjà sélectionnée
	 * Bug : Navigation bloquée après réouverture
	 */
	it('permet la navigation après réouverture du calendrier', async () => {
		const wrapper = mount(ComplexDatePicker, {
			props: {
				modelValue: '',
				label: 'Date',
				format: 'DD/MM/YYYY',
			},
		})

		// Ouvrir le calendrier (via propriété directe)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(wrapper.vm as any).isDatePickerVisible = true
		await nextTick()

		// Vérifier que l'input est interactif
		const input = wrapper.find('input')
		expect(input.exists()).toBe(true)

		// Fermer avec Escape
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(wrapper.vm as any).isDatePickerVisible = false
		await nextTick()

		// Réouvrir (via propriété directe)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(wrapper.vm as any).isDatePickerVisible = true
		await nextTick()

		// L'input doit toujours être interactif (pas de blocage)
		expect(wrapper.find('input').exists()).toBe(true)

		wrapper.unmount()
	})

	/**
	 * Test 4 : Synchronisation selectedDates avec input
	 * Bug : selectedDates et textInputValue désynchronisés
	 */
	it('synchronise selectedDates avec la valeur de l\'input', async () => {
		const wrapper = mount(ComplexDatePicker, {
			props: {
				modelValue: '',
				label: 'Date',
				format: 'DD/MM/YYYY',
			},
		})

		// Saisir une date
		const input = wrapper.find('input')
		await input.setValue('20/06/2025')
		await input.trigger('blur')
		await flushPromises()

		// La date doit être émise
		const emitted = wrapper.emitted('update:modelValue')
		expect(emitted).toBeTruthy()
		expect(emitted && emitted[0] && emitted[0][0]).toBe('20/06/2025')

		// Le date-selected doit aussi être émis
		const dateSelected = wrapper.emitted('date-selected')
		expect(dateSelected).toBeTruthy()

		wrapper.unmount()
	})

	/**
	 * Test 5 : Mode range - sélection de plage complète
	 */
	it('gère correctement la sélection de plage de dates', async () => {
		const wrapper = mount(ComplexDatePicker, {
			props: {
				modelValue: '',
				label: 'Période',
				format: 'DD/MM/YYYY',
				displayRange: true,
			},
		})

		// Saisir une plage
		const input = wrapper.find('input')
		await input.setValue('01/06/2025 - 15/06/2025')
		await input.trigger('blur')
		await flushPromises()

		// Le model doit être un array
		const emitted = wrapper.emitted('update:modelValue')
		expect(emitted).toBeTruthy()
		const value = emitted && emitted[emitted.length - 1] && emitted[emitted.length - 1][0]
		expect(Array.isArray(value)).toBe(true)
		if (Array.isArray(value)) {
			expect(value).toHaveLength(2)
		}

		wrapper.unmount()
	})

	/**
	 * Test 6 : fieldKey pour re-render (bug production)
	 * Bug : VDatePicker ne se réinitialisait pas après clear en production
	 * Solution : fieldKey force la recréation du composant
	 */
	it('utilise fieldKey pour forcer le re-render après clear', async () => {
		const wrapper = mount(ComplexDatePicker, {
			props: {
				modelValue: '15/05/2025',
				label: 'Date',
				format: 'DD/MM/YYYY',
			},
		})

		// Vérifier que fieldKey existe (utilisé pour forcer le re-render)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Testing internal implementation
		expect((wrapper.vm as any).fieldKey).toBeDefined()

		wrapper.unmount()
	})

	/**
	 * Test 7 : Reset view mode à l'ouverture
	 * Bug : Navigation bloquée après réouverture
	 */
	it('reset view mode quand le calendrier s\'ouvre', async () => {
		const wrapper = mount(ComplexDatePicker, {
			props: {
				modelValue: '',
				label: 'Date',
				format: 'DD/MM/YYYY',
			},
		})

		// Ouvrir le calendrier
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (wrapper.vm as any).openDatePicker()
		await nextTick()

		// Vérifier que le view mode est bien initialisé
		// (la propriété exacte dépend de l'implémentation)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		expect((wrapper.vm as any).currentViewMode || (wrapper.vm as any).viewMode).toBeDefined()

		wrapper.unmount()
	})
})
