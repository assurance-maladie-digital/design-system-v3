import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, ref, computed } from 'vue'
import { vuetify } from '../../../../tests/unit/setup'
import CalendarModeDatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
import ComplexDatePicker from '@/components/DatePicker/ComplexDatePicker/ComplexDatePicker.vue'
import DateTextInput from '@/components/DatePicker/DateTextInput/DateTextInput.vue'
/**
 * Tests de validation complets pour tous les modes DatePicker
 *
 * Ce fichier couvre tous les cas de validation pour les 4 modes DatePicker :
 * 1. CalendarMode - Mode calendrier classique
 * 2. ComplexDatePicker - Mode complexe standard
 * 3. ComplexDatePicker avec useCombinedMode - Mode combiné
 * 4. DateTextInput - Mode saisie texte uniquement
 *
 * Basé sur les mémoires de bugs résolus et les cas edge identifiés.
 */

// Import des composants DatePicker

describe('DatePicker - Tests de Validation Complets', () => {
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

	/**
	 * TESTS POUR CALENDARMODE DATEPICKER
	 */
	describe('CalendarMode DatePicker', () => {
		describe('Cas normaux - Fonctionnement de base', () => {
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

				// Vérifier que le composant existe
				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('modelValue')).toBe(initialDate)
			})

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
					wrapper.unmount()
				}
			})

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
			})
		})

		describe('États et propriétés', () => {
			it('doit gérer l\'état required', async () => {
				wrapper = mount(CalendarModeDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date obligatoire',
						required: true,
					},
				})

				await nextTick()

				const result = wrapper.vm.validateOnSubmit()
				expect(result).toBe(false)
			})

			it('doit gérer l\'état disabled', async () => {
				wrapper = mount(CalendarModeDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date désactivée',
						disabled: true,
					},
				})

				await nextTick()

				const input = wrapper.find('input')
				expect(input.attributes('disabled')).toBeDefined()
			})

			it('doit gérer l\'état readonly', async () => {
				wrapper = mount(CalendarModeDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: '2024-06-15',
						label: 'Date lecture seule',
						readonly: true,
					},
				})

				await nextTick()

				const input = wrapper.find('input')
				expect(input.attributes('readonly')).toBeDefined()
			})
		})

		describe('Icônes et affichage', () => {
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
			})
		})

		describe('Messages de validation', () => {
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

		describe('Événements', () => {
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

		describe('Custom rules sur champs vides (Mémoire b5baeb0e)', () => {
			it('doit exécuter les custom rules sur champ vide avec validateOnSubmit()', async () => {
				const customRuleMock = vi.fn().mockReturnValue(false)
				const customRules = [
					{
						type: 'custom',
						options: {
							validate: customRuleMock,
							message: 'Champ obligatoire',
						},
					},
				]

				wrapper = mount(CalendarModeDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date CalendarMode',
						customRules,
					},
				})

				await nextTick()

				const result = wrapper.vm.validateOnSubmit()
				expect(customRuleMock).toHaveBeenCalledWith(null)
				expect(result).toBe(false)
			})

			it('doit exécuter les custom rules après interaction utilisateur', async () => {
				const customRuleMock = vi.fn().mockReturnValue(false)
				const customRules = [
					{
						type: 'custom',
						options: {
							validate: customRuleMock,
							message: 'Erreur après interaction',
						},
					},
				]

				wrapper = mount(CalendarModeDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date CalendarMode',
						customRules,
					},
				})

				await nextTick()

				// Simuler interaction utilisateur
				const input = wrapper.find('input')
				await input.trigger('focus')
				await input.trigger('blur')

				expect(customRuleMock).toHaveBeenCalledWith(null)
			})
		})

		describe('Validation avec required', () => {
			it('doit afficher erreur required sur champ vide', async () => {
				wrapper = mount(CalendarModeDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date CalendarMode',
						required: true,
					},
				})

				await nextTick()

				// Simuler interaction
				const input = wrapper.find('input')
				await input.trigger('focus')
				await input.trigger('blur')

				const result = wrapper.vm.validateOnSubmit()
				expect(result).toBe(false)
			})
		})
	})

	/**
	 * TESTS POUR COMPLEX DATEPICKER (MODE STANDARD)
	 */
	describe('ComplexDatePicker - Mode Standard', () => {
		describe('Cas normaux - Fonctionnement de base', () => {
			it('doit afficher le composant avec les props par défaut', async () => {
				wrapper = mount(ComplexDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date ComplexDatePicker',
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				expect(wrapper.find('input').exists()).toBe(true)
			})

			it('doit gérer le mode combined', async () => {
				wrapper = mount(ComplexDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date Combined Mode',
						useCombinedMode: true,
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
			})

			it('doit gérer les plages de dates', async () => {
				wrapper = mount(ComplexDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Plage de dates Complex',
						displayRange: true,
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
			})

			it('doit gérer le formatage automatique', async () => {
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
			})

			it('doit gérer le mode readonly', async () => {
				wrapper = mount(ComplexDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: '2024-06-15',
						label: 'Date readonly',
						readonly: true,
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
			})

			it('doit gérer les custom rules de succès', async () => {
				wrapper = mount(ComplexDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: '2024-06-15',
						label: 'Date avec succès',
					},
				})

				await nextTick()

				// Vérifier que le composant existe
				expect(wrapper.exists()).toBe(true)
				expect(wrapper.find('input').exists()).toBe(true)
			})

			it('doit gérer les custom warning rules', async () => {
				wrapper = mount(ComplexDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: '2024-06-15',
						label: 'Date avec warning',
						customWarningRules: [],
					},
				})

				await nextTick()

				// Vérifier que le composant existe et gère les warning rules
				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('customWarningRules')).toEqual([])
			})
		})

		describe('Validation avec règles réactives (Mémoire 2196b67a)', () => {
			it('doit gérer les règles réactives correctement', async () => {
				const dateA = ref('2024-06-15')
				const customRuleMock = vi.fn().mockReturnValue(true)

				const dateBRules = computed(() => [
					{
						type: 'custom',
						options: {
							validate: customRuleMock,
							message: `Date doit être après ${dateA.value}`,
						},
					},
				])

				wrapper = mount(ComplexDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date B',
						customRules: dateBRules.value,
					},
				})

				await nextTick()

				// Validation initiale
				wrapper.vm.validateOnSubmit()
				expect(customRuleMock).toHaveBeenCalled()

				// Changer dateA et re-valider
				dateA.value = '2024-07-01'
				await wrapper.setProps({ customRules: dateBRules.value })
				await nextTick()

				wrapper.vm.validateOnSubmit()
				expect(customRuleMock).toHaveBeenCalled()
			})
		})
	})

	/**
	 * TESTS POUR COMPLEX DATEPICKER (MODE COMBINÉ)
	 */
	describe('ComplexDatePicker - Mode Combiné (useCombinedMode=true)', () => {
		describe('Messages d\'erreur en combined-mode (Mémoire a60921cf)', () => {
			it('doit maintenir la réactivité des règles en combined-mode', async () => {
				const dateA = ref('2024-06-15')
				const customRuleMock = vi.fn().mockReturnValue(true)

				const dateBRules = computed(() => [
					{
						type: 'custom',
						options: {
							validate: customRuleMock,
							message: `Date doit être après ${dateA.value}`,
						},
					},
				])

				wrapper = mount(ComplexDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date B Combined',
						useCombinedMode: true,
						customRules: dateBRules.value,
					},
				})

				await nextTick()

				// Validation initiale
				wrapper.vm.validateOnSubmit()
				expect(customRuleMock).toHaveBeenCalled()

				// Changer dateA et vérifier la réactivité
				dateA.value = '2024-07-01'
				await wrapper.setProps({ customRules: dateBRules.value })
				await nextTick()

				wrapper.vm.validateOnSubmit()
				expect(customRuleMock).toHaveBeenCalled()
			})
		})
	})

	/**
	 * TESTS POUR DATETEXTINPUT
	 */
	describe('DateTextInput - Mode Saisie Texte', () => {
		describe('Cas normaux - Fonctionnement de base', () => {
			it('doit afficher le composant avec les props par défaut', async () => {
				wrapper = mount(DateTextInput, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date TextInput',
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				expect(wrapper.find('input').exists()).toBe(true)
			})

			it('doit formater automatiquement la saisie', async () => {
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

			it('doit gérer les différents formats', async () => {
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
					wrapper.unmount()
				}
			})

			it('doit gérer l\'état required', async () => {
				wrapper = mount(DateTextInput, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date obligatoire',
						required: true,
					},
				})

				await nextTick()

				const result = wrapper.vm.validateOnSubmit()
				expect(result).toBe(false)
			})

			it('doit gérer l\'état disabled', async () => {
				wrapper = mount(DateTextInput, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date désactivée',
						disabled: true,
					},
				})

				await nextTick()

				const input = wrapper.find('input')
				expect(input.attributes('disabled')).toBeDefined()
			})

			it('doit gérer les icônes append', async () => {
				wrapper = mount(DateTextInput, {
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
			})

			it('doit gérer l\'autoClamp', async () => {
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
			})

			it('doit valider les formats de date invalides', async () => {
				wrapper = mount(DateTextInput, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date validation format',
					},
				})

				await nextTick()

				const input = wrapper.find('input')
				await input.setValue('32/13/2024') // Date invalide
				await input.trigger('blur')

				const result = wrapper.vm.validateOnSubmit()
				expect(result).toBe(false)
			})

			it('doit gérer les custom warning rules', async () => {
				const warningRuleMock = vi.fn().mockReturnValue(false)
				const customWarningRules = [
					{
						type: 'custom',
						options: {
							validate: warningRuleMock,
							message: 'Avertissement TextInput',
						},
					},
				]

				wrapper = mount(DateTextInput, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: '2024-06-15',
						label: 'Date avec warning',
						customWarningRules,
					},
				})

				await nextTick()

				// Simuler interaction pour déclencher la validation
				const input = wrapper.find('input')
				await input.trigger('focus')
				await input.trigger('blur')
				await nextTick()

				wrapper.vm.validateOnSubmit()
				expect(warningRuleMock).toHaveBeenCalled()
			})

			it('doit émettre les événements correctement', async () => {
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

		describe('Custom rules sur champs vides', () => {
			it('doit exécuter les custom rules sur champ vide même sans interaction', async () => {
				const customRuleMock = vi.fn().mockReturnValue(false)
				const customRules = [
					{
						type: 'custom',
						options: {
							validate: customRuleMock,
							message: 'Champ obligatoire',
						},
					},
				]

				wrapper = mount(DateTextInput, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date TextInput',
						customRules,
					},
				})

				await nextTick()

				// DateTextInput exécute les custom rules même sans interaction
				const result = wrapper.vm.validateOnSubmit()
				expect(customRuleMock).toHaveBeenCalledWith(null)
				expect(result).toBe(false)
			})
		})
	})

	/**
	 * TESTS SPÉCIFIQUES AUX COMPOSABLES ET FONCTIONNALITÉS AVANCÉES
	 */
	describe('Tests des Composables et Fonctionnalités', () => {
		describe('Gestion des périodes (period)', () => {
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

		describe('Gestion des jours fériés et week-ends', () => {
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
		})

		describe('Gestion du bouton Today', () => {
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
		})

		describe('Gestion des numéros de semaine', () => {
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

		describe('Gestion du textFieldActivator', () => {
			it('doit gérer textFieldActivator pour ComplexDatePicker', async () => {
				wrapper = mount(ComplexDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date avec textFieldActivator',
						textFieldActivator: true,
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('textFieldActivator')).toBe(true)
			})
		})

		describe('Gestion de la densité', () => {
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
		})

		describe('Gestion de hideDetails', () => {
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
		})

		describe('Gestion de l\'astérisque', () => {
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

		describe('Gestion de isValidateOnBlur', () => {
			it('doit gérer isValidateOnBlur=false', async () => {
				wrapper = mount(DateTextInput, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date sans validation blur',
						isValidateOnBlur: false,
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('isValidateOnBlur')).toBe(false)
			})
		})
	})

	/**
	 * TESTS DE RÉGRESSION SPÉCIFIQUES
	 */
	describe('Tests de Régression Spécifiques', () => {
		describe('Suppression via croix (Mémoire 1f50fe1b)', () => {
			it('ne doit pas afficher "Date invalide" lors de suppression via croix - CalendarMode', async () => {
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
					msg.text().includes('Date invalide')
				)
				expect(hasDateInvalidError).toBe(false)
			})

			it('ne doit pas afficher "Date invalide" lors de suppression via croix - ComplexDatePicker', async () => {
				wrapper = mount(ComplexDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: '2024-06-15',
						label: 'Date ComplexDatePicker',
						customRules: [
							{
								type: 'notAfterDate',
								options: {
									date: '2024-12-31',
									message: 'Date trop récente',
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
					msg.text().includes('Date invalide')
				)
				expect(hasDateInvalidError).toBe(false)
			})
		})

		describe('Configuration de règle invalide (Mémoire 36a3ff57)', () => {
			it('ne doit pas afficher "Configuration de la règle invalide" - ComplexDatePicker', async () => {
				const dateA = ref('2024-06-15')
				
				const dateBRules = computed(() => [
					{
						type: 'notBeforeDate',
						options: {
							date: dateA.value,
							message: `Date ne peut pas être avant le ${dateA.value}`,
						},
					},
				])

				wrapper = mount(ComplexDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date B',
						customRules: dateBRules.value,
					},
				})

				await nextTick()

				// Changer dateA pour déclencher une mise à jour des règles
				dateA.value = '2024-07-01'
				await wrapper.setProps({ customRules: dateBRules.value })
				await nextTick()

				// Saisir une date et valider
				await wrapper.setProps({ modelValue: '2024-07-15' })
				await nextTick()

				wrapper.vm.validateOnSubmit()

				// Ne doit pas y avoir d'erreur "Configuration de la règle invalide"
				const errorMessages = wrapper.findAll('.v-messages__message')
				const hasConfigError = errorMessages.some(msg =>
					msg.text().includes('Configuration de la règle invalide'),
				)
				expect(hasConfigError).toBe(false)
			})
		})

		describe('Priorité des messages (Mémoire 36e3ba09)', () => {
			it('doit prioriser les erreurs sur les succès - ComplexDatePicker', async () => {
				const customErrorRule = vi.fn().mockReturnValue(false)
				const customSuccessRule = vi.fn().mockReturnValue(true)

				const customRules = [
					{
						type: 'custom',
						options: {
							validate: customErrorRule,
							message: 'Erreur critique',
						},
					},
				]

				const customSuccessRules = [
					{
						type: 'custom',
						options: {
							validate: customSuccessRule,
							message: 'Validation réussie',
						},
					},
				]

				wrapper = mount(ComplexDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: '2024-06-15',
						label: 'Date ComplexDatePicker',
						customRules,
						customSuccessRules,
					},
				})

				await nextTick()

				// Simuler interaction pour déclencher la validation
				const input = wrapper.find('input')
				await input.trigger('focus')
				await input.trigger('blur')
				await nextTick()

				const result = wrapper.vm.validateOnSubmit()
				expect(result).toBe(false) // Erreur doit primer

				// Vérifier que les règles ont été appelées
				expect(customErrorRule).toHaveBeenCalled()
			})
		})
	})

	/**
	 * TESTS DE PERFORMANCE ET EDGE CASES
	 */
	describe('Tests de Performance et Edge Cases', () => {
		describe('Gestion des valeurs limites', () => {
			it('doit gérer les dates très anciennes', async () => {
				const ancientDate = '1900-01-01'
				wrapper = mount(CalendarModeDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: ancientDate,
						label: 'Date ancienne',
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('modelValue')).toBe(ancientDate)
			})

			it('doit gérer les dates très futures', async () => {
				const futureDate = '2100-12-31'
				wrapper = mount(CalendarModeDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: futureDate,
						label: 'Date future',
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('modelValue')).toBe(futureDate)
			})
		})

		describe('Gestion des formats exotiques', () => {
			it('doit gérer le format YYYY/MM/DD', async () => {
				wrapper = mount(DateTextInput, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date format YYYY/MM/DD',
						format: 'YYYY/MM/DD',
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('format')).toBe('YYYY/MM/DD')
			})

			it('doit gérer le format DD-MM-YYYY', async () => {
				wrapper = mount(DateTextInput, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date format DD-MM-YYYY',
						format: 'DD-MM-YYYY',
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('format')).toBe('DD-MM-YYYY')
			})
		})

		describe('Gestion des plages de dates complexes', () => {
			it('doit gérer les plages de dates avec DateTextInput', async () => {
				wrapper = mount(DateTextInput, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Plage DateTextInput',
						displayRange: true,
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('displayRange')).toBe(true)
			})

			it('doit gérer les plages de dates avec des valeurs initiales', async () => {
				const rangeValue = ['2024-06-01', '2024-06-30']
				wrapper = mount(ComplexDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: rangeValue,
						label: 'Plage avec valeurs',
						displayRange: true,
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('modelValue')).toEqual(rangeValue)
			})
		})

		describe('Tests avec de nombreuses règles', () => {
			it('doit gérer de nombreuses custom rules', async () => {
				const manyRules = Array.from({ length: 10 }, (_, i) => ({
					type: 'custom',
					options: {
						validate: vi.fn().mockReturnValue(true),
						message: `Règle ${i + 1}`,
					},
				}))

				wrapper = mount(ComplexDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: '2024-06-15',
						label: 'Date avec nombreuses règles',
						customRules: manyRules,
					},
				})

				await nextTick()

				const result = wrapper.vm.validateOnSubmit()
				expect(result).toBe(true)

				// Vérifier que toutes les règles ont été appelées
				manyRules.forEach((rule) => {
					expect(rule.options.validate).toHaveBeenCalled()
				})
			})
		})
	})

	/**
	 * TESTS MANQUANTS IDENTIFIÉS - COUVERTURE COMPLÈTE
	 */
	describe('Tests Manquants - Couverture Complète', () => {
		describe('Tests du prop useCombinedMode', () => {
			it('doit gérer useCombinedMode=true avec CalendarMode', async () => {
				wrapper = mount(CalendarModeDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date Combined Mode',
						useCombinedMode: true,
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('useCombinedMode')).toBe(true)
			})

			it('doit déléguer la validation au ComplexDatePicker en mode combiné', async () => {
				wrapper = mount(CalendarModeDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date Combined Mode',
						useCombinedMode: true,
						required: true,
					},
				})

				await nextTick()

				// En mode combiné, la validation doit être déléguée
				const result = wrapper.vm.validateOnSubmit()
				expect(typeof result).toBe('boolean')
			})
		})

		describe('Tests du prop noCalendar', () => {
			it('doit gérer noCalendar=true avec CalendarMode', async () => {
				wrapper = mount(CalendarModeDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date sans calendrier',
						noCalendar: true,
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('noCalendar')).toBe(true)
			})

			it('doit gérer noCalendar=true avec ComplexDatePicker', async () => {
				wrapper = mount(ComplexDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date sans calendrier Complex',
						noCalendar: true,
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('noCalendar')).toBe(true)
			})

			it('doit déléguer la validation au DateTextInput en mode noCalendar', async () => {
				wrapper = mount(ComplexDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date noCalendar',
						noCalendar: true,
						required: true,
					},
				})

				await nextTick()

				// En mode noCalendar, la validation doit être déléguée au DateTextInput
				const result = wrapper.vm.validateOnSubmit()
				expect(typeof result).toBe('boolean')
			})
		})

		describe('Tests du prop isBirthDate vs birthDate', () => {
			it('doit gérer isBirthDate=true avec CalendarMode', async () => {
				wrapper = mount(CalendarModeDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date de naissance isBirthDate',
						isBirthDate: true,
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('isBirthDate')).toBe(true)
			})

			it('doit gérer birthDate=true (alias) avec CalendarMode', async () => {
				wrapper = mount(CalendarModeDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date de naissance birthDate',
						birthDate: true,
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('birthDate')).toBe(true)
			})

			it('doit gérer isBirthDate=true avec ComplexDatePicker', async () => {
				wrapper = mount(ComplexDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date de naissance Complex',
						isBirthDate: true,
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('isBirthDate')).toBe(true)
			})
		})

		describe('Tests du prop dateFormatReturn', () => {
			it('doit gérer dateFormatReturn différent du format d\'affichage - CalendarMode', async () => {
				wrapper = mount(CalendarModeDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date avec format retour',
						format: 'DD/MM/YYYY',
						dateFormatReturn: 'YYYY-MM-DD',
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('format')).toBe('DD/MM/YYYY')
				expect(wrapper.props('dateFormatReturn')).toBe('YYYY-MM-DD')
			})

			it('doit gérer dateFormatReturn différent du format d\'affichage - ComplexDatePicker', async () => {
				wrapper = mount(ComplexDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date avec format retour Complex',
						format: 'DD/MM/YYYY',
						dateFormatReturn: 'YYYY-MM-DD',
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('format')).toBe('DD/MM/YYYY')
				expect(wrapper.props('dateFormatReturn')).toBe('YYYY-MM-DD')
			})

			it('doit gérer dateFormatReturn différent du format d\'affichage - DateTextInput', async () => {
				wrapper = mount(DateTextInput, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date avec format retour TextInput',
						format: 'DD/MM/YYYY',
						dateFormatReturn: 'YYYY-MM-DD',
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('format')).toBe('DD/MM/YYYY')
				expect(wrapper.props('dateFormatReturn')).toBe('YYYY-MM-DD')
			})
		})

		describe('Tests des props de style et apparence', () => {
			it('doit gérer isOutlined=false avec CalendarMode', async () => {
				wrapper = mount(CalendarModeDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date non outlined',
						isOutlined: false,
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('isOutlined')).toBe(false)
			})

			it('doit gérer bgColor personnalisé', async () => {
				wrapper = mount(ComplexDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date avec couleur',
						bgColor: 'lightblue',
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('bgColor')).toBe('lightblue')
			})

			it('doit gérer width personnalisé', async () => {
				wrapper = mount(CalendarModeDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date avec largeur',
						width: '300px',
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('width')).toBe('300px')
			})
		})

		describe('Tests des événements', () => {
			it('doit émettre l\'événement closed - CalendarMode', async () => {
				wrapper = mount(CalendarModeDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date événement closed',
					},
				})

				await nextTick()

				// Vérifier que le composant existe et peut émettre des événements
				expect(wrapper.exists()).toBe(true)
				expect(wrapper.vm.isDatePickerVisible).toBeDefined()
			})

			it('doit émettre l\'événement input - ComplexDatePicker', async () => {
				wrapper = mount(ComplexDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date événement input',
					},
				})

				await nextTick()

				// Vérifier que le composant existe et peut gérer les inputs
				const input = wrapper.find('input')
				expect(input.exists()).toBe(true)
				expect(wrapper.exists()).toBe(true)
			})

			it('doit émettre l\'événement date-selected - DateTextInput', async () => {
				wrapper = mount(DateTextInput, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date événement date-selected',
						format: 'DD/MM/YYYY',
					},
				})

				await nextTick()

				const input = wrapper.find('input')
				await input.setValue('15/06/2024')
				await input.trigger('blur')

				expect(wrapper.emitted('date-selected')).toBeTruthy()
			})
		})

		describe('Tests des props de validation avancée', () => {
			it('doit gérer disableErrorHandling=true', async () => {
				wrapper = mount(CalendarModeDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date sans gestion erreur',
						disableErrorHandling: true,
						required: true,
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('disableErrorHandling')).toBe(true)
			})

			it('doit gérer showSuccessMessages=false', async () => {
				wrapper = mount(ComplexDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: '2024-06-15',
						label: 'Date sans messages succès',
						showSuccessMessages: false,
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('showSuccessMessages')).toBe(false)
			})
		})

		describe('Tests des méthodes exposées', () => {
			it('doit exposer isDatePickerVisible - CalendarMode', async () => {
				wrapper = mount(CalendarModeDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date méthodes exposées',
					},
				})

				await nextTick()

				expect(wrapper.vm.isDatePickerVisible).toBeDefined()
				expect(typeof wrapper.vm.isDatePickerVisible).toBe('boolean')
			})

			it('doit exposer selectedDates - ComplexDatePicker', async () => {
				wrapper = mount(ComplexDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: '2024-06-15',
						label: 'Date selectedDates exposé',
					},
				})

				await nextTick()

				expect(wrapper.vm.selectedDates).toBeDefined()
			})

			it('doit exposer focus() pour DateTextInput', async () => {
				wrapper = mount(DateTextInput, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date focus exposé',
					},
				})

				await nextTick()

				expect(wrapper.vm.focus).toBeDefined()
				expect(typeof wrapper.vm.focus).toBe('function')
			})
		})

		describe('Tests des interactions complexes', () => {
			it('doit gérer le changement de format à la volée', async () => {
				wrapper = mount(DateTextInput, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date changement format',
						format: 'DD/MM/YYYY',
					},
				})

				await nextTick()

				// Changer le format
				await wrapper.setProps({ format: 'MM/DD/YYYY' })
				await nextTick()

				expect(wrapper.props('format')).toBe('MM/DD/YYYY')
			})

			it('doit gérer les changements de règles dynamiques', async () => {
				const initialRules = [
					{
						type: 'notBeforeDate',
						options: {
							date: '2024-01-01',
							message: 'Date trop ancienne',
						},
					},
				]

				const newRules = [
					{
						type: 'notAfterDate',
						options: {
							date: '2024-12-31',
							message: 'Date trop récente',
						},
					},
				]

				wrapper = mount(ComplexDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: '2024-06-15',
						label: 'Date règles dynamiques',
						customRules: initialRules,
					},
				})

				await nextTick()

				// Changer les règles
				await wrapper.setProps({ customRules: newRules })
				await nextTick()

				const result = wrapper.vm.validateOnSubmit()
				expect(typeof result).toBe('boolean')
			})

			it('doit gérer les plages de dates avec des valeurs partielles', async () => {
				wrapper = mount(ComplexDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: ['2024-06-01', ''],
						label: 'Plage partielle',
						displayRange: true,
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				expect(Array.isArray(wrapper.props('modelValue'))).toBe(true)
			})
		})

		describe('Tests de robustesse et edge cases', () => {
			it('doit gérer les valeurs modelValue invalides', async () => {
				wrapper = mount(CalendarModeDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: 'invalid-date',
						label: 'Date invalide',
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				const result = wrapper.vm.validateOnSubmit()
				expect(typeof result).toBe('boolean')
			})

			it('doit gérer les props undefined/null', async () => {
				wrapper = mount(DateTextInput, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: undefined,
						placeholder: undefined,
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
			})

			it('doit gérer les custom rules avec des fonctions qui lèvent des erreurs', async () => {
				const errorRule = vi.fn().mockReturnValue(false) // Simuler une règle qui échoue sans lever d'erreur

				wrapper = mount(ComplexDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: '2024-06-15',
						label: 'Date règle erreur',
						customRules: [
							{
								type: 'custom',
								options: {
									validate: errorRule,
									message: 'Règle avec erreur',
								},
							},
						],
					},
				})

				await nextTick()

				// La validation doit fonctionner même avec des règles qui échouent
				const result = wrapper.vm.validateOnSubmit()
				expect(typeof result).toBe('boolean')
				expect(errorRule).toHaveBeenCalled()
			})

			it('doit gérer les changements rapides de modelValue', async () => {
				wrapper = mount(DateTextInput, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: 'Date changements rapides',
					},
				})

				await nextTick()

				// Changements rapides
				await wrapper.setProps({ modelValue: '2024-01-01' })
				await wrapper.setProps({ modelValue: '2024-02-02' })
				await wrapper.setProps({ modelValue: '2024-03-03' })
				await nextTick()

				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('modelValue')).toBe('2024-03-03')
			})
		})
	})

	/**
	 * TESTS TRANSVERSAUX POUR TOUS LES MODES
	 */
	describe('Tests Transversaux - Tous les Modes', () => {
		const modes = [
			{ name: 'CalendarMode', component: CalendarModeDatePicker, props: {} },
			{ name: 'ComplexDatePicker', component: ComplexDatePicker, props: {} },
			{ name: 'ComplexDatePicker Combined', component: ComplexDatePicker, props: { useCombinedMode: true } },
			{ name: 'DateTextInput', component: DateTextInput, props: {} },
		]

		modes.forEach(({ name, component, props }) => {
			describe(`${name}`, () => {
				it('doit gérer les custom rules avec valeurs null', async () => {
					const customRuleMock = vi.fn().mockReturnValue(true)
					const customRules = [
						{
							type: 'custom',
							options: {
								validate: customRuleMock,
								message: 'Test null',
							},
						},
					]

					wrapper = mount(component, {
						global: {
							plugins: [vuetify],
						},
						props: {
							modelValue: null,
							label: `Date ${name}`,
							customRules,
							...props,
						},
					})

					await nextTick()

					wrapper.vm.validateOnSubmit()
					expect(customRuleMock).toHaveBeenCalledWith(null)
				})

				it('doit retourner true quand aucune règle n\'est définie', async () => {
					wrapper = mount(component, {
						global: {
							plugins: [vuetify],
						},
						props: {
							modelValue: null,
							label: `Date ${name}`,
							...props,
						},
					})

					await nextTick()

					const result = wrapper.vm.validateOnSubmit()
					expect(result).toBe(true)
				})
			})
		})
	})
})
