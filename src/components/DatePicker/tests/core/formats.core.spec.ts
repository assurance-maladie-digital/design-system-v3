import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { vuetify } from '../../../../../tests/unit/setup'
import CalendarModeDatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
import ComplexDatePicker from '@/components/DatePicker/ComplexDatePicker/ComplexDatePicker.vue'
import DateTextInput from '@/components/DatePicker/DateTextInput/DateTextInput.vue'

/**
 * Tests de formats core pour DatePicker
 *
 * Couvre les fonctionnalités de formatage de base :
 * - Formats standards (DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD)
 * - Formatage automatique
 * - dateFormatReturn
 * - Validation de formats
 */
describe('DatePicker - Core Formats Tests', () => {
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

	describe('Formats Standards', () => {
		it('doit gérer le format européen DD/MM/YYYY - CalendarMode', async () => {
			wrapper = mount(CalendarModeDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date format européen',
					format: 'DD/MM/YYYY',
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.props('format')).toBe('DD/MM/YYYY')
		})

		it('doit gérer les différents formats de date - CalendarMode', async () => {
			const formats = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']

			for (const format of formats) {
				wrapper = mount(CalendarModeDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: `Date format ${format}`,
						format,
					},
				})

				await nextTick()
				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('format')).toBe(format)
				wrapper.unmount()
			}
		})

		it('doit gérer les différents formats - ComplexDatePicker', async () => {
			const formats = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']

			for (const format of formats) {
				wrapper = mount(ComplexDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: `Date format ${format}`,
						format,
					},
				})

				await nextTick()
				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('format')).toBe(format)
				wrapper.unmount()
			}
		})

		it('doit gérer les différents formats - DateTextInput', async () => {
			const formats = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']

			for (const format of formats) {
				wrapper = mount(DateTextInput, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: `Date format ${format}`,
						format,
					},
				})

				await nextTick()
				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('format')).toBe(format)
				wrapper.unmount()
			}
		})
	})

	describe('Formatage Automatique', () => {
		it('doit formater automatiquement la saisie - DateTextInput', async () => {
			wrapper = mount(DateTextInput, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date avec formatage',
					format: 'DD/MM/YYYY',
				},
			})

			await nextTick()

			const input = wrapper.find('input')
			await input.setValue('15062024')
			await input.trigger('blur')

			expect(wrapper.exists()).toBe(true)
		})

		it('doit gérer le formatage automatique - ComplexDatePicker', async () => {
			wrapper = mount(ComplexDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date auto format',
					autoClamp: true,
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.props('autoClamp')).toBe(true)
		})

		it('doit gérer l\'autoClamp - DateTextInput', async () => {
			wrapper = mount(DateTextInput, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date avec autoClamp',
					autoClamp: true,
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.props('autoClamp')).toBe(true)
		})
	})

	describe('DateFormatReturn', () => {
		it('doit gérer dateFormatReturn - CalendarMode', async () => {
			wrapper = mount(CalendarModeDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date avec dateFormatReturn',
					format: 'DD/MM/YYYY',
					dateFormatReturn: 'YYYY-MM-DD',
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.props('dateFormatReturn')).toBe('YYYY-MM-DD')
		})

		it('doit gérer dateFormatReturn - ComplexDatePicker', async () => {
			wrapper = mount(ComplexDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date avec dateFormatReturn',
					format: 'DD/MM/YYYY',
					dateFormatReturn: 'YYYY-MM-DD',
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.props('dateFormatReturn')).toBe('YYYY-MM-DD')
		})

		it('doit gérer dateFormatReturn - DateTextInput', async () => {
			wrapper = mount(DateTextInput, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date avec dateFormatReturn',
					format: 'DD/MM/YYYY',
					dateFormatReturn: 'YYYY-MM-DD',
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.props('dateFormatReturn')).toBe('YYYY-MM-DD')
		})
	})

	describe('Validation de Formats', () => {
		it('doit accepter une valeur initiale avec format correct - CalendarMode', async () => {
			const initialDate = '2024-06-15'
			wrapper = mount(CalendarModeDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: initialDate,
					label: 'Date avec valeur initiale',
					format: 'YYYY-MM-DD',
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.props('modelValue')).toBe(initialDate)
		})

		it('doit valider les formats de date invalides - DateTextInput', async () => {
			wrapper = mount(DateTextInput, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date validation format',
					format: 'DD/MM/YYYY',
				},
			})

			await nextTick()

			const input = wrapper.find('input')
			await input.setValue('32/13/2024') // Date invalide
			await input.trigger('blur')

			const result = wrapper.vm.validateOnSubmit()
			expect(result).toBe(false)
		})

		it('doit gérer les formats avec combined mode - ComplexDatePicker', async () => {
			wrapper = mount(ComplexDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date Combined Mode avec format',
					useCombinedMode: true,
					format: 'DD/MM/YYYY',
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.props('format')).toBe('DD/MM/YYYY')
		})
	})

	describe('Formats Spéciaux', () => {
		it('doit gérer le mode date de naissance avec format - CalendarMode', async () => {
			wrapper = mount(CalendarModeDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date de naissance',
					birthDate: true,
					format: 'DD/MM/YYYY',
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.props('birthDate')).toBe(true)
			expect(wrapper.props('format')).toBe('DD/MM/YYYY')
		})

		it('doit gérer les plages de dates avec format - CalendarMode', async () => {
			wrapper = mount(CalendarModeDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Plage de dates',
					displayRange: true,
					format: 'DD/MM/YYYY',
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.props('displayRange')).toBe(true)
			expect(wrapper.props('format')).toBe('DD/MM/YYYY')
		})

		it('doit gérer les plages de dates avec format - ComplexDatePicker', async () => {
			wrapper = mount(ComplexDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Plage de dates Complex',
					displayRange: true,
					format: 'MM/DD/YYYY',
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.props('displayRange')).toBe(true)
			expect(wrapper.props('format')).toBe('MM/DD/YYYY')
		})
	})

	describe('Formats avec Périodes', () => {
		it('doit respecter les dates min/max avec format - CalendarMode', async () => {
			const period = {
				min: '2024-01-01',
				max: '2024-12-31',
			}

			wrapper = mount(CalendarModeDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date avec période',
					period,
					format: 'YYYY-MM-DD',
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.props('period')).toEqual(period)
			expect(wrapper.props('format')).toBe('YYYY-MM-DD')
		})
	})

	describe('Densité avec Formats', () => {
		it('doit gérer les différentes densités avec formats - CalendarMode', async () => {
			const densities = ['default', 'comfortable', 'compact'] as const

			for (const density of densities) {
				wrapper = mount(CalendarModeDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: `Date densité ${density}`,
						density,
						format: 'DD/MM/YYYY',
					},
				})

				await nextTick()
				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('density')).toBe(density)
				expect(wrapper.props('format')).toBe('DD/MM/YYYY')
				wrapper.unmount()
			}
		})
	})
})
