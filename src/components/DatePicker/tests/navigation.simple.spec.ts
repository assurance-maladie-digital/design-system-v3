import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { vuetify } from '../../../../tests/unit/setup'
import CalendarModeDatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
import ComplexDatePicker from '@/components/DatePicker/ComplexDatePicker/ComplexDatePicker.vue'

/**
 * Tests simples pour vérifier que la correction de navigation année/mois fonctionne
 */

describe('DatePicker Navigation Fix - Simple Tests', () => {
	const baseConfig = {
		global: {
			plugins: [vuetify],
		},
	}

	describe('CalendarMode DatePicker', () => {
		it('should have the correct navigation handlers', async () => {
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

			// Vérifier que les handlers existent
			expect(typeof component.handleYearUpdate).toBe('function')
			expect(typeof component.handleMonthUpdate).toBe('function')
			expect(typeof component.resetViewMode).toBe('function')
		})

		it('should navigate correctly through year -> months -> month', async () => {
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

			// État initial : year
			expect(component.currentViewMode).toBe('year')

			// Navigation : year -> months
			component.handleYearUpdate()
			await nextTick()
			expect(component.currentViewMode).toBe('months')

			// Navigation : months -> month
			component.handleMonthUpdate()
			await nextTick()
			expect(component.currentViewMode).toBe('month')
		})

		it('should reset view mode correctly', async () => {
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

			// Changer le mode
			component.currentViewMode = 'months'
			expect(component.currentViewMode).toBe('months')

			// Réinitialiser
			component.resetViewMode()
			await nextTick()
			expect(component.currentViewMode).toBe('year') // Retour à year pour birthDate
		})
	})

	describe('ComplexDatePicker', () => {
		it('should have the correct navigation handlers', async () => {
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
		})

		it('should navigate correctly through year -> months -> month', async () => {
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

			// État initial : year
			expect(component.currentViewMode).toBe('year')

			// Navigation : year -> months
			component.handleYearUpdate()
			await nextTick()
			expect(component.currentViewMode).toBe('months')

			// Navigation : months -> month
			component.handleMonthUpdate()
			await nextTick()
			expect(component.currentViewMode).toBe('month')
		})
	})
})
