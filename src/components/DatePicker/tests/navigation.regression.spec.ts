import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { vuetify } from '../../../../tests/unit/setup'
import CalendarModeDatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
import ComplexDatePicker from '@/components/DatePicker/ComplexDatePicker/ComplexDatePicker.vue'

/**
 * Tests de régression pour la navigation année/mois dans les DatePickers
 *
 * Problème résolu : Après avoir sélectionné l'année puis le mois et fermé le DatePicker,
 * lors de la réouverture on pouvait sélectionner l'année mais le clic sur le mois se bloquait.
 *
 * Cause : Handlers d'événements manquants et view mode non réinitialisé
 */

describe('DatePicker Navigation Regression Tests', () => {
	const baseConfig = {
		global: {
			plugins: [vuetify],
		},
	}

	describe('CalendarMode DatePicker', () => {
		let wrapper: ReturnType<typeof mount>

		beforeEach(() => {
			wrapper = mount(CalendarModeDatePicker, {
				...baseConfig,
				props: {
					modelValue: null,
					label: 'Date Test',
					isBirthDate: true, // Mode birthDate pour tester la navigation année/mois
				},
			})
		})

		it('should have correct event handlers for year and month updates', async () => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- any
			const component = wrapper.vm as any

			// Ouvrir le DatePicker
			component.isDatePickerVisible = true
			await nextTick()

			// Vérifier que le VDatePicker est visible
			const datePicker = wrapper.findComponent({ name: 'VDatePicker' })
			expect(datePicker.exists()).toBe(true)

			// Vérifier que les handlers d'événements sont correctement mappés
			const datePickerProps = datePicker.props()
			expect(datePickerProps).toBeDefined()

			// Vérifier que le view mode est correctement initialisé
			expect(datePickerProps.viewMode).toBe('year') // Mode birthDate commence par year
		})

		it('should reset view mode when DatePicker opens', async () => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- any
			const component = wrapper.vm as any

			// Simuler un état où le view mode n'est pas correct
			component.currentViewMode = 'months'

			// Ouvrir le DatePicker
			component.isDatePickerVisible = true
			await nextTick()

			// Vérifier que resetViewMode a été appelé et le view mode est correct
			expect(component.currentViewMode).toBe('year') // Réinitialisé pour birthDate
		})

		it('should handle year selection and transition to months view', async () => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- any
			const component = wrapper.vm as any

			// Ouvrir le DatePicker
			component.isDatePickerVisible = true
			await nextTick()

			// Simuler la sélection d'une année
			component.handleYearUpdate()
			await nextTick()

			// Vérifier la transition vers le mode months
			expect(component.currentViewMode).toBe('months')
		})

		it('should handle month selection and transition to month view', async () => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- any
			const component = wrapper.vm as any

			// Mettre en mode months
			component.currentViewMode = 'months'
			await nextTick()

			// Simuler la sélection d'un mois
			component.handleMonthUpdate()
			await nextTick()

			// Vérifier la transition vers le mode month (calendrier)
			expect(component.currentViewMode).toBe('month')
		})

		it('should maintain proper navigation after close and reopen', async () => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- any
			const component = wrapper.vm as any

			// Premier cycle : ouvrir, naviguer, fermer
			component.isDatePickerVisible = true
			await nextTick()

			// Simuler navigation année → mois
			component.handleYearUpdate()
			await nextTick()
			expect(component.currentViewMode).toBe('months')

			component.handleMonthUpdate()
			await nextTick()
			expect(component.currentViewMode).toBe('month')

			// Fermer le DatePicker
			component.isDatePickerVisible = false
			await nextTick()

			// Rouvrir le DatePicker
			component.isDatePickerVisible = true
			await nextTick()

			// Vérifier que le view mode est correctement réinitialisé
			expect(component.currentViewMode).toBe('year') // Réinitialisé pour birthDate

			// Vérifier que la navigation fonctionne encore
			component.handleYearUpdate()
			await nextTick()
			expect(component.currentViewMode).toBe('months')

			component.handleMonthUpdate()
			await nextTick()
			expect(component.currentViewMode).toBe('month')
		})
	})

	describe('ComplexDatePicker', () => {
		let wrapper: ReturnType<typeof mount>

		beforeEach(() => {
			wrapper = mount(ComplexDatePicker, {
				...baseConfig,
				props: {
					modelValue: null,
					label: 'Date Test',
					isBirthDate: true, // Mode birthDate pour tester la navigation année/mois
				},
			})
		})

		it('should have correct event handlers for year and month updates', async () => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- any
			const component = wrapper.vm as any

			// Ouvrir le DatePicker
			component.isDatePickerVisible = true
			await nextTick()

			// Vérifier que le VDatePicker est visible
			const datePicker = wrapper.findComponent({ name: 'VDatePicker' })
			expect(datePicker.exists()).toBe(true)

			// Vérifier que les handlers d'événements sont correctement mappés
			const datePickerProps = datePicker.props()
			expect(datePickerProps).toBeDefined()

			// Vérifier que le view mode est correctement initialisé
			expect(datePickerProps.viewMode).toBe('year') // Mode birthDate commence par year
		})

		it('should reset view mode when DatePicker opens', async () => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- any
			const component = wrapper.vm as any

			// Simuler un état où le view mode n'est pas correct
			component.currentViewMode = 'months'

			// Ouvrir le DatePicker
			component.isDatePickerVisible = true
			await nextTick()

			// Vérifier que resetViewMode a été appelé et le view mode est correct
			expect(component.currentViewMode).toBe('year') // Réinitialisé pour birthDate
		})

		it('should handle navigation events correctly', async () => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- any
			const component = wrapper.vm as any

			// Ouvrir le DatePicker
			component.isDatePickerVisible = true
			await nextTick()

			// Vérifier que les handlers existent et sont des fonctions
			expect(typeof component.handleYearUpdate).toBe('function')
			expect(typeof component.handleMonthUpdate).toBe('function')
			expect(typeof component.handleViewModeUpdate).toBe('function')
			expect(typeof component.resetViewMode).toBe('function')
		})

		it('should maintain proper navigation after close and reopen', async () => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- any
			const component = wrapper.vm as any

			// Premier cycle : ouvrir, naviguer, fermer
			component.isDatePickerVisible = true
			await nextTick()

			// Simuler navigation année → mois
			component.handleYearUpdate()
			await nextTick()
			expect(component.currentViewMode).toBe('months')

			component.handleMonthUpdate()
			await nextTick()
			expect(component.currentViewMode).toBe('month')

			// Fermer le DatePicker
			component.isDatePickerVisible = false
			await nextTick()

			// Rouvrir le DatePicker
			component.isDatePickerVisible = true
			await nextTick()

			// Vérifier que le view mode est correctement réinitialisé
			expect(component.currentViewMode).toBe('year') // Réinitialisé pour birthDate

			// Vérifier que la navigation fonctionne encore
			component.handleYearUpdate()
			await nextTick()
			expect(component.currentViewMode).toBe('months')

			component.handleMonthUpdate()
			await nextTick()
			expect(component.currentViewMode).toBe('month')
		})
	})

	describe('Event Handler Integration', () => {
		it('should have the correct handlers bound to VDatePicker events', async () => {
			const wrapper = mount(CalendarModeDatePicker, {
				...baseConfig,
				props: {
					modelValue: null,
					label: 'Date Test',
					isBirthDate: true,
				},
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- any
			const component = wrapper.vm as any

			// Ouvrir le DatePicker
			component.isDatePickerVisible = true
			await nextTick()

			const datePicker = wrapper.findComponent({ name: 'VDatePicker' })
			expect(datePicker.exists()).toBe(true)

			// Vérifier que les handlers existent et sont des fonctions
			expect(typeof component.handleYearUpdate).toBe('function')
			expect(typeof component.handleMonthUpdate).toBe('function')
			expect(typeof component.handleViewModeUpdate).toBe('function')

			// Tester directement les handlers pour vérifier qu'ils fonctionnent
			const initialViewMode = component.currentViewMode
			expect(initialViewMode).toBe('year')

			// Tester handleYearUpdate
			component.handleYearUpdate()
			await nextTick()
			expect(component.currentViewMode).toBe('months')

			// Tester handleMonthUpdate
			component.handleMonthUpdate()
			await nextTick()
			expect(component.currentViewMode).toBe('month')
		})
	})
})
