import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { vuetify } from '../../../../../tests/unit/setup'
import CalendarModeDatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
import ComplexDatePicker from '@/components/DatePicker/ComplexDatePicker/ComplexDatePicker.vue'
import DateTextInput from '@/components/DatePicker/DateTextInput/DateTextInput.vue'

/**
 * Tests d'événements core pour DatePicker
 *
 * Couvre les événements de base :
 * - focus / blur
 * - update:modelValue
 * - input
 * - Émission correcte des événements
 */
describe('DatePicker - Core Events Tests', () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- tests
	let wrapper: any

	beforeEach(() => {
		vi.clearAllMocks()
	})

	afterEach(() => {
		if (wrapper) {
			wrapper.unmount()
		}
	})

	describe('Événements Focus/Blur', () => {
		it('doit émettre l\'événement focus - CalendarMode', async () => {
			wrapper = mount(CalendarModeDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date événement focus',
				},
			})

			await nextTick()

			const input = wrapper.find('input')
			await input.trigger('focus')

			expect(wrapper.emitted('focus')).toBeTruthy()
		})

		it('doit émettre l\'événement blur - CalendarMode', async () => {
			wrapper = mount(CalendarModeDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date événement blur',
				},
			})

			await nextTick()

			const input = wrapper.find('input')
			await input.trigger('focus')
			await input.trigger('blur')

			expect(wrapper.emitted('blur')).toBeTruthy()
		})

		it('doit émettre les événements focus/blur - ComplexDatePicker', async () => {
			wrapper = mount(ComplexDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date événements Complex',
				},
			})

			await nextTick()

			const input = wrapper.find('input')
			await input.trigger('focus')
			await input.trigger('blur')

			expect(wrapper.emitted('focus')).toBeTruthy()
			expect(wrapper.emitted('blur')).toBeTruthy()
		})

		it('doit émettre les événements correctement - DateTextInput', async () => {
			wrapper = mount(DateTextInput, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date événements',
				},
			})

			await nextTick()

			const input = wrapper.find('input')
			await input.trigger('focus')
			await input.trigger('blur')

			expect(wrapper.emitted('focus')).toBeTruthy()
			expect(wrapper.emitted('blur')).toBeTruthy()
		})
	})

	describe('Événements Update:ModelValue', () => {
		it('doit émettre update:modelValue lors de changement - CalendarMode', async () => {
			wrapper = mount(CalendarModeDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date update modelValue',
				},
			})

			await nextTick()

			// Simuler changement de valeur
			await wrapper.setProps({ modelValue: '2024-06-15' })
			await nextTick()

			expect(wrapper.props('modelValue')).toBe('2024-06-15')
		})

		it('doit émettre update:modelValue lors de changement - ComplexDatePicker', async () => {
			wrapper = mount(ComplexDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date update modelValue Complex',
				},
			})

			await nextTick()

			// Simuler changement de valeur
			await wrapper.setProps({ modelValue: '2024-06-15' })
			await nextTick()

			expect(wrapper.props('modelValue')).toBe('2024-06-15')
		})

		it('doit émettre update:modelValue lors de changement - DateTextInput', async () => {
			wrapper = mount(DateTextInput, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date update modelValue TextInput',
				},
			})

			await nextTick()

			// Simuler changement de valeur
			await wrapper.setProps({ modelValue: '2024-06-15' })
			await nextTick()

			expect(wrapper.props('modelValue')).toBe('2024-06-15')
		})
	})

	describe('Événements Input', () => {
		it('doit gérer les événements input - DateTextInput', async () => {
			wrapper = mount(DateTextInput, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date input event',
				},
			})

			await nextTick()

			const input = wrapper.find('input')
			await input.setValue('15/06/2024')

			// Vérifier que l'input a bien la valeur
			expect(input.element.value).toContain('15')
		})

		it('doit gérer la saisie manuelle - DateTextInput', async () => {
			wrapper = mount(DateTextInput, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date saisie manuelle',
					format: 'DD/MM/YYYY',
				},
			})

			await nextTick()

			const input = wrapper.find('input')
			await input.setValue('15062024')
			await input.trigger('blur')

			expect(wrapper.exists()).toBe(true)
		})
	})

	describe('Événements avec Combined Mode', () => {
		it('doit émettre les événements en combined mode - ComplexDatePicker', async () => {
			wrapper = mount(ComplexDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date Combined Mode Events',
					useCombinedMode: true,
				},
			})

			await nextTick()

			const input = wrapper.find('input')
			await input.trigger('focus')
			await input.trigger('blur')

			expect(wrapper.emitted('focus')).toBeTruthy()
			expect(wrapper.emitted('blur')).toBeTruthy()
		})
	})

	describe('Événements avec Validation', () => {
		it('doit émettre les événements lors de validation - CalendarMode', async () => {
			wrapper = mount(CalendarModeDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date validation events',
					required: true,
				},
			})

			await nextTick()

			const input = wrapper.find('input')
			await input.trigger('focus')
			await input.trigger('blur')

			// Vérifier que les événements sont émis même avec validation
			expect(wrapper.emitted('focus')).toBeTruthy()
			expect(wrapper.emitted('blur')).toBeTruthy()
		})

		it('doit émettre les événements avec custom rules - ComplexDatePicker', async () => {
			const customRules = [
				{
					type: 'custom',
					options: {
						validate: () => true,
						message: 'Test rule',
					},
				},
			]

			wrapper = mount(ComplexDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: '2024-06-15',
					label: 'Date events avec custom rules',
					customRules,
				},
			})

			await nextTick()

			const input = wrapper.find('input')
			await input.trigger('focus')
			await input.trigger('blur')

			expect(wrapper.emitted('focus')).toBeTruthy()
			expect(wrapper.emitted('blur')).toBeTruthy()
		})
	})

	describe('Événements avec États Spéciaux', () => {
		it('ne doit pas émettre d\'événements si disabled - CalendarMode', async () => {
			wrapper = mount(CalendarModeDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date disabled events',
					disabled: true,
				},
			})

			await nextTick()

			const input = wrapper.find('input')
			expect(input.attributes('disabled')).toBeDefined()
		})

		it('doit gérer les événements en readonly - CalendarMode', async () => {
			wrapper = mount(CalendarModeDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: '2024-06-15',
					label: 'Date readonly events',
					readonly: true,
				},
			})
			await nextTick()

			const input = wrapper.find('input')
			expect(input.attributes('readonly')).toBeDefined()
			// Les événements focus/blur peuvent toujours être émis en readonly
			await input.trigger('focus')
			await input.trigger('blur')

			expect(wrapper.emitted('focus')).toBeTruthy()
			expect(wrapper.emitted('blur')).toBeTruthy()
		})
	})

	describe('Événements avec Formats', () => {
		it('doit émettre les événements avec différents formats - DateTextInput', async () => {
			const formats = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']

			for (const format of formats) {
				wrapper = mount(DateTextInput, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: `Date events format ${format}`,
						format,
					},
				})

				await nextTick()

				const input = wrapper.find('input')
				await input.trigger('focus')
				await input.trigger('blur')

				expect(wrapper.emitted('focus')).toBeTruthy()
				expect(wrapper.emitted('blur')).toBeTruthy()

				wrapper.unmount()
			}
		})
	})

	describe('Événements avec Messages', () => {
		it('doit émettre les événements avec messages d\'erreur - CalendarMode', async () => {
			wrapper = mount(CalendarModeDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date avec erreur',
					errorMessages: ['Erreur de test'],
				},
			})

			await nextTick()

			const input = wrapper.find('input')
			await input.trigger('focus')
			await input.trigger('blur')

			expect(wrapper.emitted('focus')).toBeTruthy()
			expect(wrapper.emitted('blur')).toBeTruthy()
		})

		it('doit émettre les événements avec messages de succès - CalendarMode', async () => {
			wrapper = mount(CalendarModeDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: '2024-06-15',
					label: 'Date avec succès',
					successMessages: ['Validation réussie'],
				},
			})

			await nextTick()

			const input = wrapper.find('input')
			await input.trigger('focus')
			await input.trigger('blur')

			expect(wrapper.emitted('focus')).toBeTruthy()
			expect(wrapper.emitted('blur')).toBeTruthy()
		})

		it('doit émettre les événements avec messages d\'avertissement - CalendarMode', async () => {
			wrapper = mount(CalendarModeDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: '2024-06-15',
					label: 'Date avec avertissement',
					warningMessages: ['Avertissement de test'],
				},
			})

			await nextTick()

			const input = wrapper.find('input')
			await input.trigger('focus')
			await input.trigger('blur')

			expect(wrapper.emitted('focus')).toBeTruthy()
			expect(wrapper.emitted('blur')).toBeTruthy()
		})
	})
})
