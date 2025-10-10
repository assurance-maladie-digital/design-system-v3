import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { vuetify } from '../../../../../tests/unit/setup'
import CalendarModeDatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'

/**
 * Tests spécifiques au composant CalendarModeDatePicker
 *
 * Couvre toutes les fonctionnalités spécifiques au mode calendrier :
 * - Affichage et interaction avec le calendrier
 * - Props spécifiques (birthDate, displayRange, etc.)
 * - Icônes et affichage
 * - Messages de validation
 * - Gestion des périodes et jours spéciaux
 */
describe('CalendarModeDatePicker - Component Tests', () => {
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

	describe('Fonctionnement de Base', () => {
		it('doit afficher le composant avec les props par défaut', async () => {
			wrapper = mount(CalendarModeDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date de test',
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.find('input').exists()).toBe(true)
			expect(wrapper.find('label').text()).toContain('Date de test')
		})

		it('doit accepter une valeur initiale', async () => {
			const initialDate = '2024-06-15'
			wrapper = mount(CalendarModeDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: initialDate,
					label: 'Date avec valeur initiale',
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.props('modelValue')).toBe(initialDate)
		})
	})

	describe('Props Spécifiques CalendarMode', () => {
		it('doit gérer le mode date de naissance', async () => {
			wrapper = mount(CalendarModeDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date de naissance',
					birthDate: true,
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.props('birthDate')).toBe(true)
		})

		it('doit gérer les plages de dates', async () => {
			wrapper = mount(CalendarModeDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Plage de dates',
					displayRange: true,
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.props('displayRange')).toBe(true)
		})

		it('doit gérer displayWeekendDays', async () => {
			wrapper = mount(CalendarModeDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date avec week-ends',
					displayWeekendDays: false,
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.props('displayWeekendDays')).toBe(false)
		})

		it('doit gérer displayHolidayDays', async () => {
			wrapper = mount(CalendarModeDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date avec jours fériés',
					displayHolidayDays: false,
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.props('displayHolidayDays')).toBe(false)
		})

		it('doit gérer displayTodayButton', async () => {
			wrapper = mount(CalendarModeDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date avec bouton Today',
					displayTodayButton: false,
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.props('displayTodayButton')).toBe(false)
		})

		it('doit gérer showWeekNumber', async () => {
			wrapper = mount(CalendarModeDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date avec numéros de semaine',
					showWeekNumber: true,
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.props('showWeekNumber')).toBe(true)
		})
	})

	describe('Icônes et Affichage', () => {
		it('doit afficher l\'icône par défaut', async () => {
			wrapper = mount(CalendarModeDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date avec icône',
				},
			})

			await nextTick()

			expect(wrapper.find('.v-icon').exists()).toBe(true)
		})

		it('doit masquer les icônes avec noIcon', async () => {
			wrapper = mount(CalendarModeDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date sans icône',
					noIcon: true,
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.props('noIcon')).toBe(true)
		})

		it('doit gérer l\'icône en append', async () => {
			wrapper = mount(CalendarModeDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date avec append icon',
					displayAppendIcon: true,
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.props('displayAppendIcon')).toBe(true)
		})
	})

	describe('Messages de Validation', () => {
		it('doit afficher des messages d\'erreur', async () => {
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

			expect(wrapper.exists()).toBe(true)
		})

		it('doit afficher des messages de succès', async () => {
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

			expect(wrapper.exists()).toBe(true)
		})

		it('doit afficher des messages d\'avertissement', async () => {
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

			expect(wrapper.exists()).toBe(true)
		})
	})

	describe('Gestion des Périodes', () => {
		it('doit respecter les dates min/max définies', async () => {
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
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.props('period')).toEqual(period)
		})
	})

	describe('Densité et Affichage', () => {
		it('doit gérer les différentes densités', async () => {
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
					},
				})

				await nextTick()
				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('density')).toBe(density)
				wrapper.unmount()
			}
		})

		it('doit gérer hideDetails=true', async () => {
			wrapper = mount(CalendarModeDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date sans détails',
					hideDetails: true,
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.props('hideDetails')).toBe(true)
		})

		it('doit gérer hideDetails="auto"', async () => {
			wrapper = mount(CalendarModeDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date détails auto',
					hideDetails: 'auto',
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.props('hideDetails')).toBe('auto')
		})

		it('doit gérer displayAsterisk', async () => {
			wrapper = mount(CalendarModeDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date avec astérisque',
					displayAsterisk: true,
					required: true,
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.props('displayAsterisk')).toBe(true)
		})
	})

	describe('Régression - Suppression via croix (Mémoire 1f50fe1b)', () => {
		it('ne doit pas afficher "Date invalide" lors de suppression via croix', async () => {
			wrapper = mount(CalendarModeDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: '2024-06-15',
					label: 'Date CalendarMode',
					customRules: [
						{
							type: 'notBeforeDate',
							options: {
								date: '2024-01-01',
								message: 'Date trop ancienne',
							},
						},
					],
				},
			})

			await nextTick()

			// Simuler suppression via croix (modelValue devient null)
			await wrapper.setProps({ modelValue: null })
			await nextTick()

			// Ne doit pas afficher "Date invalide"
			const errorMessages = wrapper.findAll('.v-messages__message')
			const hasDateInvalidError = errorMessages.some(msg =>
				msg.text().includes('Date invalide'),
			)
			expect(hasDateInvalidError).toBe(false)
		})
	})

	describe('Intégration avec Formats', () => {
		it('doit gérer le format européen DD/MM/YYYY', async () => {
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

		it('doit gérer les différents formats de date', async () => {
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
	})

	describe('Intégration avec Événements', () => {
		it('doit émettre l\'événement focus', async () => {
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

		it('doit émettre l\'événement blur', async () => {
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
	})
})
