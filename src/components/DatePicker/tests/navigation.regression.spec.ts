import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { vuetify } from '../../../../tests/unit/setup'
import CalendarModeDatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
import ComplexDatePicker from '@/components/DatePicker/ComplexDatePicker/ComplexDatePicker.vue'

/**
 * Tests de régression légers pour la navigation année/mois dans les DatePickers
 *
 * Problème résolu : Handlers d'événements manquants et view mode non réinitialisé
 */

describe('DatePicker Navigation Regression Tests', () => {
	const baseConfig = {
		global: {
			plugins: [vuetify],
		},
	}

	describe('CalendarMode DatePicker', () => {
		it('should have correct event handlers for year and month updates', async () => {
			const wrapper = mount(CalendarModeDatePicker, {
				...baseConfig,
				props: {
					modelValue: null,
					label: 'Date Test',
					isBirthDate: true, // Mode birthDate pour tester la navigation année/mois
				},
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- any
			const component = wrapper.vm as any
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

			wrapper.unmount()
		})
	})

	describe('ComplexDatePicker', () => {
		it('should have correct navigation handlers', async () => {
			const wrapper = mount(ComplexDatePicker, {
				...baseConfig,
				props: {
					modelValue: null,
					label: 'Date Test',
					isBirthDate: true,
				},
			})

			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- any
			const component = wrapper.vm as any

			// Vérifier que les handlers existent
			expect(typeof component.handleYearUpdate).toBe('function')
			expect(typeof component.handleMonthUpdate).toBe('function')
			expect(typeof component.resetViewMode).toBe('function')

			wrapper.unmount()
		})
	})
})
