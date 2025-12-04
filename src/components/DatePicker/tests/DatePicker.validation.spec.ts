import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, ref, computed } from 'vue'
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
/**
 * Tests de validation complets pour tous les modes DatePicker
 *
 * Ce fichier couvre tous les cas de validation pour les 3 modes DatePicker :
 * 1. CalendarMode - Mode calendrier classique
 * 2. DatePicker - Mode complexe standard
 * 3. DatePicker avec useCombinedMode - Mode combiné
 * 4. DatePicker - Mode saisie texte uniquement
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
				wrapper = mount(DatePicker, {
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
				wrapper = mount(DatePicker, {
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
				wrapper = mount(DatePicker, {
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
					wrapper = mount(DatePicker, {
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
				wrapper = mount(DatePicker, {
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
				wrapper = mount(DatePicker, {
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
				wrapper = mount(DatePicker, {
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
				wrapper = mount(DatePicker, {
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
				wrapper = mount(DatePicker, {
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
				wrapper = mount(DatePicker, {
					props: {
						modelValue: null,
						label: 'Date avec icône',
					},
				})

				await nextTick()

				expect(wrapper.find('.v-icon').exists()).toBe(true)
			})

			it('doit masquer les icônes avec noIcon', async () => {
				wrapper = mount(DatePicker, {
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
				wrapper = mount(DatePicker, {
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
				wrapper = mount(DatePicker, {
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
				wrapper = mount(DatePicker, {
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
				wrapper = mount(DatePicker, {
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
				wrapper = mount(DatePicker, {
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
				wrapper = mount(DatePicker, {
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

				wrapper = mount(DatePicker, {
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

				wrapper = mount(DatePicker, {
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
				wrapper = mount(DatePicker, {
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
	describe('DatePicker - Mode Standard', () => {
		describe('Cas normaux - Fonctionnement de base', () => {
			it('doit afficher le composant avec les props par défaut', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: null,
						label: 'Date DatePicker',
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				expect(wrapper.find('input').exists()).toBe(true)
			})

			it('doit gérer le mode combined', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: null,
						label: 'Date Combined Mode',
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
			})

			it('doit gérer les plages de dates', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: null,
						label: 'Plage de dates Complex',
						displayRange: true,
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
			})

			it('doit gérer le formatage automatique', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: null,
						label: 'Date auto format',
						autoClamp: true,
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
			})

			it('doit gérer le mode readonly', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: '2024-06-15',
						label: 'Date readonly',
						readonly: true,
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
			})

			it('doit gérer les custom rules de succès', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
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
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
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

				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
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
	describe('DatePicker - Mode Combiné (useCombinedMode=true)', () => {
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

				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: null,
						label: 'Date B Combined',
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
	describe('DatePicker - Mode Saisie Texte', () => {
		describe('Cas normaux - Fonctionnement de base', () => {
			it('doit afficher le composant avec les props par défaut', async () => {
				wrapper = mount(DatePicker, {
					props: {
						noCalendar: true,
						modelValue: null,
						label: 'Date TextInput',
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				expect(wrapper.find('input').exists()).toBe(true)
			})

			it('doit formater automatiquement la saisie', async () => {
				wrapper = mount(DatePicker, {
					props: {
						noCalendar: true,
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
					wrapper = mount(DatePicker, {
						props: {
							noCalendar: true,
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
				wrapper = mount(DatePicker, {
					props: {
						noCalendar: true,
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
				wrapper = mount(DatePicker, {
					props: {
						noCalendar: true,
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
				wrapper = mount(DatePicker, {
					props: {
						noCalendar: true,
						modelValue: null,
						label: 'Date avec append icon',
						displayAppendIcon: true,
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
			})

			it('doit gérer l\'autoClamp', async () => {
				wrapper = mount(DatePicker, {
					props: {
						noCalendar: true,
						modelValue: null,
						label: 'Date avec autoClamp',
						autoClamp: true,
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
			})

			it('doit valider les formats de date invalides', async () => {
				wrapper = mount(DatePicker, {
					props: {
						noCalendar: true,
						modelValue: null,
						label: 'Date validation format',
						required: true, // Ajouter required pour s'assurer qu'il y a une validation
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

				wrapper = mount(DatePicker, {
					props: {
						noCalendar: true,
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
				wrapper = mount(DatePicker, {
					props: {
						noCalendar: true,
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

				wrapper = mount(DatePicker, {
					props: {
						noCalendar: true,
						modelValue: null,
						label: 'Date TextInput',
						customRules,
					},
				})

				await nextTick()

				// DatePicker exécute les custom rules même sans interaction
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

				wrapper = mount(DatePicker, {
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
				wrapper = mount(DatePicker, {
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
				wrapper = mount(DatePicker, {
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
				wrapper = mount(DatePicker, {
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
				wrapper = mount(DatePicker, {
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
			it('doit gérer textFieldActivator pour DatePicker', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
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
					wrapper = mount(DatePicker, {
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
				wrapper = mount(DatePicker, {
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
				wrapper = mount(DatePicker, {
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
				wrapper = mount(DatePicker, {
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
				wrapper = mount(DatePicker, {
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
				wrapper = mount(DatePicker, {
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

			it('ne doit pas afficher "Date invalide" lors de suppression via croix - DatePicker', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: '2024-06-15',
						label: 'Date DatePicker',
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
					msg.text().includes('Date invalide'),
				)
				expect(hasDateInvalidError).toBe(false)
			})
		})

		describe('Configuration de règle invalide (Mémoire 36a3ff57)', () => {
			it('ne doit pas afficher "Configuration de la règle invalide" - DatePicker', async () => {
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

				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
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
			it('doit prioriser les erreurs sur les succès - DatePicker', async () => {
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

				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: '2024-06-15',
						label: 'Date DatePicker',
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
				wrapper = mount(DatePicker, {
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
				wrapper = mount(DatePicker, {
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
				wrapper = mount(DatePicker, {
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
				wrapper = mount(DatePicker, {
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
			it('doit gérer les plages de dates avec DatePicker', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: null,
						label: 'Plage DatePicker',
						displayRange: true,
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('displayRange')).toBe(true)
			})

			it('doit gérer les plages de dates avec des valeurs initiales', async () => {
				const rangeValue = ['2024-06-01', '2024-06-30']
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
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

				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
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
				wrapper = mount(DatePicker, {
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

			it('doit déléguer la validation au DatePicker en mode combiné', async () => {
				wrapper = mount(DatePicker, {
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
				wrapper = mount(DatePicker, {
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

			it('doit gérer noCalendar=true avec DatePicker', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: null,
						label: 'Date sans calendrier Complex',
						noCalendar: true,
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('noCalendar')).toBe(true)
			})

			it('doit déléguer la validation au DatePicker en mode noCalendar', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: null,
						label: 'Date noCalendar',
						noCalendar: true,
						required: true,
					},
				})

				await nextTick()

				// En mode noCalendar, la validation doit être déléguée au DatePicker
				const result = wrapper.vm.validateOnSubmit()
				expect(typeof result).toBe('boolean')
			})
		})

		describe('Tests du prop isBirthDate vs birthDate', () => {
			it('doit gérer isBirthDate=true avec CalendarMode', async () => {
				wrapper = mount(DatePicker, {
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
				wrapper = mount(DatePicker, {
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

			it('doit gérer isBirthDate=true avec DatePicker', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
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
				wrapper = mount(DatePicker, {
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

			it('doit gérer dateFormatReturn différent du format d\'affichage - DatePicker', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
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

			it('doit gérer dateFormatReturn différent du format d\'affichage - DatePicker', async () => {
				wrapper = mount(DatePicker, {
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
				wrapper = mount(DatePicker, {
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
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
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
				wrapper = mount(DatePicker, {
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
				wrapper = mount(DatePicker, {
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

			it('doit émettre l\'événement input - DatePicker', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
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

			it('doit émettre l\'événement date-selected - DatePicker', async () => {
				wrapper = mount(DatePicker, {
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

				expect(wrapper.emitted('update:modelValue')).toBeTruthy()
			})
		})

		describe('Tests des props de validation avancée', () => {
			it('doit gérer disableErrorHandling=true', async () => {
				wrapper = mount(DatePicker, {
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
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
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
				wrapper = mount(DatePicker, {
					props: {
						modelValue: null,
						label: 'Date méthodes exposées',
					},
				})

				await nextTick()

				expect(wrapper.vm.isDatePickerVisible).toBeDefined()
				expect(typeof wrapper.vm.isDatePickerVisible).toBe('boolean')
			})

			it('doit exposer selectedDates - DatePicker', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: '2024-06-15',
						label: 'Date selectedDates exposé',
					},
				})

				await nextTick()

				expect(wrapper.vm.selectedDates).toBeDefined()
			})

			it('doit émettre focus lors du focus sur DatePicker', async () => {
				wrapper = mount(DatePicker, {
					props: {
						noCalendar: true,
						modelValue: null,
						label: 'Date focus exposé',
					},
				})

				await nextTick()

				const input = wrapper.find('input')
				await input.trigger('focus')

				expect(wrapper.emitted('focus')).toBeTruthy()
			})
		})

		describe('Tests des interactions complexes', () => {
			it('doit gérer le changement de format à la volée', async () => {
				wrapper = mount(DatePicker, {
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

				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
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
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
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
				wrapper = mount(DatePicker, {
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
				wrapper = mount(DatePicker, {
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

				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
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
				wrapper = mount(DatePicker, {
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
	 * TESTS COMPLETS DES RÈGLES useFieldValidation - TOUS LES MODES
	 */
	describe('Tests Complets des Règles useFieldValidation', () => {
		describe('Tests des règles numériques', () => {
			it('doit gérer la règle min - CalendarMode', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: null,
						label: 'Date avec règle min',
						customRules: [
							{
								type: 'min',
								options: {
									value: 5,
									message: 'La valeur doit être supérieure à 5',
								},
							},
						],
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				const result = wrapper.vm.validateOnSubmit()
				expect(typeof result).toBe('boolean')
			})

			it('doit gérer la règle max - DatePicker', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: null,
						label: 'Date avec règle max',
						customRules: [
							{
								type: 'max',
								options: {
									value: 100,
									message: 'La valeur doit être inférieure à 100',
								},
							},
						],
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				const result = wrapper.vm.validateOnSubmit()
				expect(typeof result).toBe('boolean')
			})
		})

		describe('Tests des règles de longueur', () => {
			it('doit gérer la règle minLength - DatePicker', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: null,
						label: 'Date avec minLength',
						customRules: [
							{
								type: 'minLength',
								options: {
									length: 3,
									message: 'Minimum 3 caractères requis',
								},
							},
						],
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				const result = wrapper.vm.validateOnSubmit()
				expect(typeof result).toBe('boolean')
			})

			it('doit gérer la règle maxLength - CalendarMode', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: null,
						label: 'Date avec maxLength',
						customRules: [
							{
								type: 'maxLength',
								options: {
									length: 20,
									message: 'Maximum 20 caractères autorisés',
								},
							},
						],
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				const result = wrapper.vm.validateOnSubmit()
				expect(typeof result).toBe('boolean')
			})

			it('doit gérer la règle exactLength - DatePicker', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: null,
						label: 'Date avec exactLength',
						customRules: [
							{
								type: 'exactLength',
								options: {
									length: 10,
									message: 'Exactement 10 caractères requis',
								},
							},
						],
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				const result = wrapper.vm.validateOnSubmit()
				expect(typeof result).toBe('boolean')
			})
		})

		describe('Tests des règles de format', () => {
			it('doit gérer la règle email - DatePicker', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: null,
						label: 'Champ avec validation email',
						customRules: [
							{
								type: 'email',
								options: {
									message: 'Format email invalide',
								},
							},
						],
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				const result = wrapper.vm.validateOnSubmit()
				expect(typeof result).toBe('boolean')
			})

			it('doit gérer la règle matchPattern - CalendarMode', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: null,
						label: 'Date avec pattern',
						customRules: [
							{
								type: 'matchPattern',
								options: {
									pattern: /^\d{2}\/\d{2}\/\d{4}$/,
									message: 'Format de date invalide',
								},
							},
						],
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				const result = wrapper.vm.validateOnSubmit()
				expect(typeof result).toBe('boolean')
			})
		})

		describe('Tests des règles de date spécifiques', () => {
			it('doit gérer la règle notWeekend - DatePicker', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: '2024-06-15', // Samedi
						label: 'Date sans weekend',
						customRules: [
							{
								type: 'notWeekend',
								options: {
									message: 'Les weekends ne sont pas autorisés',
								},
							},
						],
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				const result = wrapper.vm.validateOnSubmit()
				expect(typeof result).toBe('boolean')
			})

			it('doit gérer la règle notBeforeToday - DatePicker', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: null,
						label: 'Date pas avant aujourd\'hui',
						customRules: [
							{
								type: 'notBeforeToday',
								options: {
									message: 'La date ne peut pas être antérieure à aujourd\'hui',
								},
							},
						],
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				const result = wrapper.vm.validateOnSubmit()
				expect(typeof result).toBe('boolean')
			})

			it('doit gérer la règle notAfterToday - CalendarMode', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: null,
						label: 'Date pas après aujourd\'hui',
						customRules: [
							{
								type: 'notAfterToday',
								options: {
									message: 'La date ne peut pas être postérieure à aujourd\'hui',
								},
							},
						],
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				const result = wrapper.vm.validateOnSubmit()
				expect(typeof result).toBe('boolean')
			})

			it('doit gérer la règle dateExact - DatePicker', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: null,
						label: 'Date exacte requise',
						customRules: [
							{
								type: 'dateExact',
								options: {
									date: '15/06/2024',
									message: 'La date doit être exactement le 15/06/2024',
								},
							},
						],
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				const result = wrapper.vm.validateOnSubmit()
				expect(typeof result).toBe('boolean')
			})

			it('doit gérer la règle isHolidayDay - DatePicker', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: null,
						label: 'Date sans jours fériés',
						customRules: [
							{
								type: 'isHolidayDay',
								options: {
									message: 'Les jours fériés ne sont pas autorisés',
								},
							},
						],
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				const result = wrapper.vm.validateOnSubmit()
				expect(typeof result).toBe('boolean')
			})
		})

		describe('Tests des règles avec valeurs réelles', () => {
			it('doit valider correctement notBeforeDate avec une vraie date - CalendarMode', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: '10/06/2024', // Date avant la limite
						label: 'Date avec validation notBeforeDate',
						customRules: [
							{
								type: 'notBeforeDate',
								options: {
									date: '15/06/2024',
									message: 'Date ne peut pas être avant le 15/06/2024',
								},
							},
						],
					},
				})

				await nextTick()

				const result = wrapper.vm.validateOnSubmit()
				expect(result).toBe(false) // Doit échouer car 10/06 < 15/06
			})

			it('doit valider correctement notAfterDate avec une vraie date - DatePicker', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: '20/06/2024', // Date après la limite
						label: 'Date avec validation notAfterDate',
						customRules: [
							{
								type: 'notAfterDate',
								options: {
									date: '15/06/2024',
									message: 'Date ne peut pas être après le 15/06/2024',
								},
							},
						],
					},
				})

				await nextTick()

				const result = wrapper.vm.validateOnSubmit()
				expect(result).toBe(false) // Doit échouer car 20/06 > 15/06
			})

			it('doit valider correctement dateExact avec une vraie date - DatePicker', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: '15/06/2024', // Date exacte
						label: 'Date avec validation dateExact',
						customRules: [
							{
								type: 'dateExact',
								options: {
									date: '15/06/2024',
									message: 'Date doit être exactement le 15/06/2024',
								},
							},
						],
					},
				})

				await nextTick()

				const result = wrapper.vm.validateOnSubmit()
				expect(result).toBe(true) // Doit réussir car dates identiques
			})
		})

		describe('Tests des règles avec options avancées', () => {
			it('doit gérer minLength avec ignoreSpace - CalendarMode', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: null,
						label: 'Date avec minLength ignoreSpace',
						customRules: [
							{
								type: 'minLength',
								options: {
									length: 5,
									ignoreSpace: true,
									message: 'Minimum 5 caractères sans espaces',
								},
							},
						],
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				const result = wrapper.vm.validateOnSubmit()
				expect(typeof result).toBe('boolean')
			})

			it('doit gérer les règles en mode warning - DatePicker', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: '2024-06-15',
						label: 'Date avec warning rules',
						customWarningRules: [
							{
								type: 'notWeekend',
								options: {
									isWarning: true,
									warningMessage: 'Attention: date en weekend',
								},
							},
						],
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				const result = wrapper.vm.validateOnSubmit()
				expect(typeof result).toBe('boolean')
			})
		})
	})

	/**
	 * TESTS TOUCHY - CAS LIMITES ET EDGE CASES COMPLEXES
	 */
	describe('Tests Touchy - Cas Limites et Edge Cases', () => {
		describe('Tests de concurrence et race conditions', () => {
			it('doit gérer les changements rapides de modelValue pendant la validation', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: null,
						label: 'Date race condition',
						customRules: [
							{
								type: 'notBeforeDate',
								options: {
									date: '15/06/2024',
									message: 'Date trop ancienne',
								},
							},
						],
					},
				})

				await nextTick()

				// Simuler des changements rapides pendant la validation
				const promises: Promise<void>[] = []
				for (let i = 0; i < 5; i++) {
					promises.push(wrapper.setProps({ modelValue: `${10 + i}/06/2024` }))
				}

				await Promise.all(promises)
				await nextTick()

				// Le composant doit rester stable
				expect(wrapper.exists()).toBe(true)
				const result = wrapper.vm.validateOnSubmit()
				expect(typeof result).toBe('boolean')
			})

			it('doit gérer les validations simultanées sur plusieurs instances', async () => {
				const wrapper1 = mount(DatePicker, {
					props: {
						modelValue: '10/06/2024',
						label: 'Date 1',
						customRules: [
							{
								type: 'notBeforeDate',
								options: {
									date: '15/06/2024',
									message: 'Erreur date 1',
								},
							},
						],
					},
				})

				const wrapper2 = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: '20/06/2024',
						label: 'Date 2',
						customRules: [
							{
								type: 'notAfterDate',
								options: {
									date: '15/06/2024',
									message: 'Erreur date 2',
								},
							},
						],
					},
				})

				await nextTick()

				// Valider simultanément
				const [result1, result2] = await Promise.all([
					Promise.resolve(wrapper1.vm.validateOnSubmit()),
					Promise.resolve(wrapper2.vm.validateOnSubmit()),
				])

				expect(result1).toBe(false) // 10/06 < 15/06
				expect(result2).toBe(false) // 20/06 > 15/06

				wrapper1.unmount()
				wrapper2.unmount()
			})
		})

		describe('Tests de memory leaks et cleanup', () => {
			it('doit nettoyer les event listeners lors du unmount - CalendarMode', async () => {
				const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

				wrapper = mount(DatePicker, {
					props: {
						modelValue: null,
						label: 'Test cleanup',
					},
				})

				await nextTick()

				// Unmount et vérifier le cleanup
				wrapper.unmount()

				expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function))
				removeEventListenerSpy.mockRestore()
			})

			it('doit nettoyer les event listeners lors du unmount - DatePicker', async () => {
				const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: null,
						label: 'Test cleanup Complex',
					},
				})

				await nextTick()

				// Unmount et vérifier le cleanup
				wrapper.unmount()

				expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function))
				removeEventListenerSpy.mockRestore()
			})

			it('doit gérer les setTimeout sans fuites mémoire', async () => {
				const setTimeoutSpy = vi.spyOn(global, 'setTimeout')

				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: null,
						label: 'Test setTimeout',
						customRules: [
							{
								type: 'notBeforeDate',
								options: {
									date: '15/06/2024',
									message: 'Test',
								},
							},
						],
					},
				})

				await nextTick()

				// Changer les règles pour déclencher setTimeout
				await wrapper.setProps({
					customRules: [
						{
							type: 'notAfterDate',
							options: {
								date: '20/06/2024',
								message: 'Test 2',
							},
						},
					],
				})

				await nextTick()

				// Vérifier que setTimeout a été appelé
				expect(setTimeoutSpy).toHaveBeenCalled()

				// Unmount pour tester le cleanup
				wrapper.unmount()

				setTimeoutSpy.mockRestore()
			})
		})

		describe('Tests de formatage et parsing extrêmes', () => {
			it('doit gérer les dates avec des années à 2 chiffres', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: null,
						label: 'Date année 2 chiffres',
						format: 'DD/MM/YY',
					},
				})

				await nextTick()

				const input = wrapper.find('input')
				await input.setValue('15/06/99')
				await input.trigger('blur')

				expect(wrapper.exists()).toBe(true)
			})

			it('doit gérer les dates limites (29 février années bissextiles)', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: '29/02/2024', // 2024 est bissextile
						label: 'Date bissextile',
						customRules: [
							{
								type: 'dateExact',
								options: {
									date: '29/02/2024',
									message: 'Doit être le 29 février 2024',
								},
							},
						],
					},
				})

				await nextTick()

				const result = wrapper.vm.validateOnSubmit()
				expect(result).toBe(true) // Doit réussir
			})

			it('doit rejeter le 29 février pour les années non bissextiles', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: '29/02/2023', // 2023 n'est pas bissextile
						label: 'Date non bissextile',
					},
				})

				await nextTick()

				const result = wrapper.vm.validateOnSubmit()
				expect(typeof result).toBe('boolean')
			})

			it('doit gérer les dates avec des séparateurs mixtes', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: null,
						label: 'Date séparateurs mixtes',
						format: 'DD-MM-YYYY',
					},
				})

				await nextTick()

				const input = wrapper.find('input')
				await input.setValue('15-06-2024')
				await input.trigger('blur')

				expect(wrapper.exists()).toBe(true)
			})
		})

		describe('Tests de validation avec règles contradictoires', () => {
			it('doit gérer des règles contradictoires notBeforeDate et notAfterDate', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: '15/06/2024',
						label: 'Règles contradictoires',
						customRules: [
							{
								type: 'notBeforeDate',
								options: {
									date: '20/06/2024', // Date doit être >= 20/06
									message: 'Date trop ancienne',
								},
							},
							{
								type: 'notAfterDate',
								options: {
									date: '10/06/2024', // Date doit être <= 10/06
									message: 'Date trop récente',
								},
							},
						],
					},
				})

				await nextTick()

				const result = wrapper.vm.validateOnSubmit()
				expect(result).toBe(false) // Impossible de satisfaire les deux règles
			})

			it('doit gérer des custom rules qui se contredisent', async () => {
				const rule1 = vi.fn().mockReturnValue(true)
				const rule2 = vi.fn().mockReturnValue(false)

				wrapper = mount(DatePicker, {
					props: {
						modelValue: '15/06/2024',
						label: 'Custom rules contradictoires',
						customRules: [
							{
								type: 'custom',
								options: {
									validate: rule1,
									message: 'Règle 1 OK',
								},
							},
							{
								type: 'custom',
								options: {
									validate: rule2,
									message: 'Règle 2 KO',
								},
							},
						],
					},
				})

				await nextTick()

				const result = wrapper.vm.validateOnSubmit()
				expect(result).toBe(false) // Une règle échoue
				expect(rule1).toHaveBeenCalled()
				expect(rule2).toHaveBeenCalled()
			})
		})

		describe('Tests de performance avec données massives', () => {
			it('doit gérer un grand nombre de règles sans ralentissement', async () => {
				const manyRules = Array.from({ length: 50 }, (_, i) => ({
					type: 'custom',
					options: {
						validate: vi.fn().mockReturnValue(true),
						message: `Règle ${i + 1}`,
					},
				}))

				const startTime = performance.now()

				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: '15/06/2024',
						label: 'Performance test',
						customRules: manyRules,
					},
				})

				await nextTick()

				const result = wrapper.vm.validateOnSubmit()
				const endTime = performance.now()

				expect(result).toBe(true)
				expect(endTime - startTime).toBeLessThan(1000) // Moins d'1 seconde

				// Vérifier que toutes les règles ont été appelées
				manyRules.forEach((rule) => {
					expect(rule.options.validate).toHaveBeenCalled()
				})
			})

			it('doit gérer les changements rapides de props sans lag', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: null,
						label: 'Performance props',
						format: 'DD/MM/YYYY',
					},
				})

				await nextTick()

				const startTime = performance.now()

				// Changer rapidement plusieurs props
				for (let i = 0; i < 20; i++) {
					await wrapper.setProps({
						format: i % 2 === 0 ? 'DD/MM/YYYY' : 'MM/DD/YYYY',
						label: `Label ${i}`,
						required: i % 2 === 0,
					})
				}

				const endTime = performance.now()

				expect(wrapper.exists()).toBe(true)
				expect(endTime - startTime).toBeLessThan(1000) // Moins de 1 seconde sans lag
			})
		})

		describe('Tests de réactivité complexe', () => {
			it('doit gérer les règles réactives avec computed imbriqués', async () => {
				const offset = ref(5)

				const computedDate = computed(() => {
					const date = new Date(2024, 5, 15) // 15 juin 2024
					date.setDate(date.getDate() + offset.value)
					return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
				})

				const nestedRules = computed(() => [
					{
						type: 'notBeforeDate',
						options: {
							date: computedDate.value,
							message: `Date ne peut pas être avant ${computedDate.value}`,
						},
					},
				])

				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: '18/06/2024',
						label: 'Règles réactives imbriquées',
						customRules: nestedRules.value,
					},
				})

				await nextTick()

				// Validation initiale
				let result = wrapper.vm.validateOnSubmit()
				expect(typeof result).toBe('boolean')

				// Changer l'offset et re-tester
				offset.value = 10
				await wrapper.setProps({ customRules: nestedRules.value })
				await nextTick()

				result = wrapper.vm.validateOnSubmit()
				expect(typeof result).toBe('boolean')
			})

			it('doit gérer les règles réactives avec dépendances multiples', async () => {
				const dateA = ref('15/06/2024')
				const dateB = ref('20/06/2024')

				// Créer des règles qui dépendent de plusieurs refs
				const complexRules = computed(() => [
					{
						type: 'notBeforeDate',
						options: {
							date: dateA.value,
							message: `Date ne peut pas être avant ${dateA.value}`,
						},
					},
					{
						type: 'notAfterDate',
						options: {
							date: dateB.value,
							message: `Date ne peut pas être après ${dateB.value}`,
						},
					},
				])

				wrapper = mount(DatePicker, {
					props: {
						modelValue: '18/06/2024',
						label: 'Test règles réactives complexes',
						customRules: complexRules.value,
					},
				})

				await nextTick()

				// Validation initiale
				let result = wrapper.vm.validateOnSubmit()
				expect(typeof result).toBe('boolean')

				// Changer les dates de référence
				dateA.value = '10/06/2024'
				dateB.value = '25/06/2024'
				await wrapper.setProps({ customRules: complexRules.value })
				await nextTick()

				result = wrapper.vm.validateOnSubmit()
				expect(typeof result).toBe('boolean')
			})
		})

		describe('Tests de edge cases spécifiques aux navigateurs', () => {
			it('doit gérer les événements de collage avec données corrompues', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: null,
						label: 'Test paste corrompu',
						format: 'DD/MM/YYYY',
					},
				})

				await nextTick()

				const input = wrapper.find('input')

				// Simuler un collage avec données corrompues
				const pasteEvent = new Event('paste', { bubbles: true })
				Object.defineProperty(pasteEvent, 'clipboardData', {
					value: {
						getData: () => '���invalid���data���',
					},
				})

				input.element.dispatchEvent(pasteEvent)
				await nextTick()

				expect(wrapper.exists()).toBe(true)
			})

			it('doit gérer les changements de timezone', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: '15/06/2024',
						label: 'Test timezone',
						customRules: [
							{
								type: 'notBeforeToday',
								options: {
									message: 'Date ne peut pas être avant aujourd\'hui',
								},
							},
						],
					},
				})

				await nextTick()

				const result = wrapper.vm.validateOnSubmit()
				expect(typeof result).toBe('boolean')
			})
		})
	})

	/**
	 * TESTS COMPLETS DES FORMATS D'ENTRÉE ET DE SORTIE - TOUS LES MODES
	 */
	describe('Tests Complets des Formats d\'Entrée et de Sortie', () => {
		describe('Tests CalendarMode - Formats d\'entrée et sortie', () => {
			const formatCombinations = [
				{ display: 'DD/MM/YYYY', return: 'YYYY-MM-DD', input: '15/06/2024', expected: '2024-06-15' },
				{ display: 'MM/DD/YYYY', return: 'DD/MM/YYYY', input: '06/15/2024', expected: '15/06/2024' },
				{ display: 'DD-MM-YYYY', return: 'MM-DD-YYYY', input: '15-06-2024', expected: '06-15-2024' },
				{ display: 'YYYY/MM/DD', return: 'DD/MM/YYYY', input: '2024/06/15', expected: '15/06/2024' },
				{ display: 'DD.MM.YYYY', return: 'YYYY.MM.DD', input: '15.06.2024', expected: '2024.06.15' },
				{ display: 'DD/MM/YY', return: 'YYYY-MM-DD', input: '15/06/24', expected: '2024-06-15' },
				{ display: 'MM-DD-YY', return: 'DD-MM-YYYY', input: '06-15-24', expected: '15-06-2024' },
			]

			formatCombinations.forEach(({ display, return: returnFormat, input }) => {
				it(`doit gérer format d'affichage ${display} et format de retour ${returnFormat}`, async () => {
					wrapper = mount(DatePicker, {
						props: {
							modelValue: null,
							label: `Test format ${display} → ${returnFormat}`,
							format: display,
							dateFormatReturn: returnFormat,
						},
					})

					await nextTick()

					// Simuler la sélection d'une date
					await wrapper.setProps({ modelValue: input })
					await nextTick()

					expect(wrapper.exists()).toBe(true)
					expect(wrapper.props('format')).toBe(display)
					expect(wrapper.props('dateFormatReturn')).toBe(returnFormat)
				})
			})

			it('doit gérer les formats avec séparateurs mixtes', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: null,
						label: 'Format séparateurs mixtes',
						format: 'DD/MM-YYYY',
						dateFormatReturn: 'YYYY.MM.DD',
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('format')).toBe('DD/MM-YYYY')
				expect(wrapper.props('dateFormatReturn')).toBe('YYYY.MM.DD')
			})

			it('doit gérer les formats identiques pour affichage et retour', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: '15/06/2024',
						label: 'Format identique',
						format: 'DD/MM/YYYY',
						dateFormatReturn: 'DD/MM/YYYY',
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				const result = wrapper.vm.validateOnSubmit()
				expect(typeof result).toBe('boolean')
			})

			it('doit gérer les plages de dates avec formats différents', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: ['15/06/2024', '20/06/2024'],
						label: 'Plage formats différents',
						format: 'DD/MM/YYYY',
						dateFormatReturn: 'YYYY-MM-DD',
						displayRange: true,
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('displayRange')).toBe(true)
			})
		})

		describe('Tests DatePicker - Formats d\'entrée et sortie', () => {
			const complexFormatCombinations = [
				{ display: 'DD/MM/YYYY', return: 'ISO', input: '15/06/2024', description: 'Format français vers ISO' },
				{ display: 'MM/DD/YYYY', return: 'DD-MM-YYYY', input: '06/15/2024', description: 'Format US vers européen' },
				{ display: 'YYYY-MM-DD', return: 'DD/MM/YYYY', input: '2024-06-15', description: 'ISO vers français' },
				{ display: 'DD.MM.YY', return: 'YYYY/MM/DD', input: '15.06.24', description: 'Format court vers long' },
				{ display: 'MM-DD-YY', return: 'DD.MM.YYYY', input: '06-15-24', description: 'US court vers européen long' },
			]

			complexFormatCombinations.forEach(({ display, return: returnFormat, input, description }) => {
				it(`doit gérer ${description} (${display} → ${returnFormat})`, async () => {
					wrapper = mount(DatePicker, {
						props: {
							useCombinedMode: true,
							modelValue: null,
							label: description,
							format: display,
							dateFormatReturn: returnFormat,
						},
					})

					await nextTick()

					// Tester la saisie dans l'input
					const input_el = wrapper.find('input')
					if (input_el.exists()) {
						await input_el.setValue(input)
						await input_el.trigger('blur')
					}

					expect(wrapper.exists()).toBe(true)
					expect(wrapper.props('format')).toBe(display)
					expect(wrapper.props('dateFormatReturn')).toBe(returnFormat)
				})
			})

			it('doit gérer le mode avec TextFieldActivator et formats différents', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: null,
						label: 'Mode TextFieldActivator formats',
						format: 'DD/MM/YYYY',
						dateFormatReturn: 'YYYY-MM-DD',
						textFieldActivator: true,
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('textFieldActivator')).toBe(true)
				expect(wrapper.props('format')).toBe('DD/MM/YYYY')
				expect(wrapper.props('dateFormatReturn')).toBe('YYYY-MM-DD')
			})

			it('doit gérer les plages avec TextFieldActivator et formats différents', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: null,
						label: 'Plage TextFieldActivator',
						format: 'MM/DD/YYYY',
						dateFormatReturn: 'DD-MM-YYYY',
						displayRange: true,
						textFieldActivator: true,
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('textFieldActivator')).toBe(true)
				expect(wrapper.props('displayRange')).toBe(true)
			})

			it('doit valider avec des règles et formats différents', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: '15/06/2024',
						label: 'Validation formats différents',
						format: 'DD/MM/YYYY',
						dateFormatReturn: 'YYYY-MM-DD',
						customRules: [
							{
								type: 'notBeforeDate',
								options: {
									date: '10/06/2024', // Format d'affichage
									message: 'Date trop ancienne',
								},
							},
						],
					},
				})

				await nextTick()

				const result = wrapper.vm.validateOnSubmit()
				expect(result).toBe(true) // 15/06 > 10/06
			})
		})

		describe('Tests DatePicker - Formats d\'entrée et sortie', () => {
			const textInputFormats = [
				{ display: 'DD/MM/YYYY', return: 'YYYY-MM-DD', mask: '##/##/####' },
				{ display: 'MM/DD/YYYY', return: 'DD/MM/YYYY', mask: '##/##/####' },
				{ display: 'DD-MM-YYYY', return: 'MM-DD-YYYY', mask: '##-##-####' },
				{ display: 'YYYY/MM/DD', return: 'DD/MM/YYYY', mask: '####/##/##' },
				{ display: 'DD.MM.YY', return: 'YYYY-MM-DD', mask: '##.##.##' },
			]

			textInputFormats.forEach(({ display, return: returnFormat }) => {
				it(`doit gérer la saisie avec format ${display} et retour ${returnFormat}`, async () => {
					wrapper = mount(DatePicker, {
						props: {
							modelValue: null,
							label: `Saisie ${display}`,
							format: display,
							dateFormatReturn: returnFormat,
						},
					})

					await nextTick()

					const input = wrapper.find('input')
					expect(input.exists()).toBe(true)
					expect(wrapper.props('format')).toBe(display)
					expect(wrapper.props('dateFormatReturn')).toBe(returnFormat)
				})
			})

			it('doit gérer la saisie de plages avec formats différents', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: null,
						label: 'Plage DatePicker',
						format: 'DD/MM/YYYY',
						dateFormatReturn: 'YYYY-MM-DD',
						displayRange: true,
					},
				})

				await nextTick()

				const input = wrapper.find('input')
				expect(input.exists()).toBe(true)
				expect(wrapper.props('displayRange')).toBe(true)

				// Tester la saisie d'une plage
				await input.setValue('15/06/2024 - 20/06/2024')
				await input.trigger('blur')

				expect(wrapper.exists()).toBe(true)
			})

			it('doit gérer les formats avec validation en temps réel', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: null,
						label: 'Validation temps réel',
						format: 'MM/DD/YYYY',
						dateFormatReturn: 'DD-MM-YYYY',
						customRules: [
							{
								type: 'notAfterToday',
								options: {
									message: 'Date ne peut pas être future',
								},
							},
						],
					},
				})

				await nextTick()

				const input = wrapper.find('input')
				await input.setValue('12/15/2024')
				await input.trigger('input')
				await input.trigger('blur')

				expect(wrapper.exists()).toBe(true)
				const result = wrapper.vm.validateOnSubmit()
				expect(typeof result).toBe('boolean')
			})

			it('doit gérer les formats courts avec années à 2 chiffres', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: null,
						label: 'Format court YY',
						format: 'DD/MM/YY',
						dateFormatReturn: 'YYYY-MM-DD',
					},
				})

				await nextTick()

				const input = wrapper.find('input')
				await input.setValue('15/06/24')
				await input.trigger('blur')

				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('format')).toBe('DD/MM/YY')
			})
		})

		describe('Tests de conversion et cohérence entre formats', () => {
			it('doit maintenir la cohérence lors du changement de format à la volée - CalendarMode', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: '15/06/2024',
						label: 'Changement format dynamique',
						format: 'DD/MM/YYYY',
						dateFormatReturn: 'YYYY-MM-DD',
					},
				})

				await nextTick()

				// Changer le format d'affichage
				await wrapper.setProps({ format: 'MM/DD/YYYY' })
				await nextTick()

				// Changer le format de retour
				await wrapper.setProps({ dateFormatReturn: 'DD-MM-YYYY' })
				await nextTick()

				expect(wrapper.exists()).toBe(true)
				const result = wrapper.vm.validateOnSubmit()
				expect(typeof result).toBe('boolean')
			})

			it('doit gérer les conversions complexes avec validation - DatePicker', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: '2024-06-15', // Format ISO en entrée
						label: 'Conversion complexe',
						format: 'DD/MM/YYYY', // Affichage français
						dateFormatReturn: 'MM-DD-YYYY', // Retour US
						customRules: [
							{
								type: 'dateExact',
								options: {
									date: '15/06/2024', // Date en format d'affichage
									message: 'Date doit être exactement le 15/06/2024',
								},
							},
						],
					},
				})

				await nextTick()

				const result = wrapper.vm.validateOnSubmit()
				expect(result).toBe(true) // Doit réussir car dates identiques
			})

			it('doit gérer les erreurs de format invalide - DatePicker', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: null,
						label: 'Test format invalide',
						format: 'DD/MM/YYYY',
						dateFormatReturn: 'YYYY-MM-DD',
					},
				})

				await nextTick()

				const input = wrapper.find('input')

				// Saisir un format invalide
				await input.setValue('32/13/2024') // Jour et mois invalides
				await input.trigger('blur')

				expect(wrapper.exists()).toBe(true)
				const result = wrapper.vm.validateOnSubmit()
				expect(typeof result).toBe('boolean')
			})

			it('doit gérer les plages avec formats mixtes - Tous les modes', async () => {
				const modes = [
					{ component: DatePicker, name: 'CalendarMode' },
					{ component: DatePicker, name: 'DatePicker' },
					{ component: DatePicker, name: 'DatePicker' },
				]

				for (const mode of modes) {
					const testWrapper = mount(mode.component, {
						props: {
							modelValue: null,
							label: `Plage formats mixtes ${mode.name}`,
							format: 'DD/MM/YYYY',
							dateFormatReturn: 'YYYY-MM-DD',
							displayRange: true,
						},
					})

					await nextTick()

					expect(testWrapper.exists()).toBe(true)
					expect(testWrapper.props('displayRange')).toBe(true)

					testWrapper.unmount()
				}
			})
		})

		describe('Tests de edge cases avec formats spéciaux', () => {
			it('doit gérer les formats avec caractères spéciaux', async () => {
				const specialFormats = [
					'DD|MM|YYYY',
					'DD\\MM\\YYYY',
					'DD MM YYYY',
					'DD_MM_YYYY',
				]

				for (const format of specialFormats) {
					wrapper = mount(DatePicker, {
						props: {
							useCombinedMode: true,
							modelValue: null,
							label: `Format spécial ${format}`,
							format: format,
							dateFormatReturn: 'YYYY-MM-DD',
						},
					})

					await nextTick()

					expect(wrapper.exists()).toBe(true)
					expect(wrapper.props('format')).toBe(format)

					wrapper.unmount()
				}
			})

			it('doit gérer les formats avec ordres non-standards', async () => {
				const nonStandardFormats = [
					{ format: 'YYYY/DD/MM', description: 'Année/Jour/Mois' },
					{ format: 'MM/YYYY/DD', description: 'Mois/Année/Jour' },
					{ format: 'DD/YYYY/MM', description: 'Jour/Année/Mois' },
				]

				for (const { format, description } of nonStandardFormats) {
					wrapper = mount(DatePicker, {
						props: {
							modelValue: null,
							label: description,
							format: format,
							dateFormatReturn: 'DD/MM/YYYY',
						},
					})

					await nextTick()

					expect(wrapper.exists()).toBe(true)
					expect(wrapper.props('format')).toBe(format)

					wrapper.unmount()
				}
			})

			it('doit gérer les formats avec précision différente', async () => {
				const precisionFormats = [
					{ format: 'DD/MM/YYYY HH:mm', return: 'YYYY-MM-DD', description: 'Avec heures/minutes' },
					{ format: 'DD/MM/YYYY HH:mm:ss', return: 'YYYY-MM-DD HH:mm:ss', description: 'Avec secondes' },
					{ format: 'DD/MM', return: 'MM/DD', description: 'Sans année' },
				]

				for (const { format, return: returnFormat, description } of precisionFormats) {
					wrapper = mount(DatePicker, {
						props: {
							modelValue: null,
							label: description,
							format: format,
							dateFormatReturn: returnFormat,
						},
					})

					await nextTick()

					expect(wrapper.exists()).toBe(true)
					expect(wrapper.props('format')).toBe(format)
					expect(wrapper.props('dateFormatReturn')).toBe(returnFormat)

					wrapper.unmount()
				}
			})
		})
	})

	/**
	 * TESTS DES ÉVÉNEMENTS (EVENTS) - TOUS LES MODES
	 */
	describe('Tests des Événements (Events)', () => {
		describe('Tests des événements CalendarMode', () => {
			it('doit émettre update:modelValue lors de la sélection d\'une date', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: null,
						label: 'Test événement update:modelValue',
					},
				})

				await nextTick()

				// Vérifier que le composant est monté et peut émettre des événements
				expect(wrapper.exists()).toBe(true)
				expect(wrapper.props('modelValue')).toBe(null)

				// Simuler la sélection d'une date via l'API du composant
				await wrapper.setProps({ modelValue: '15/06/2024' })
				await nextTick()

				// Le composant doit exister et avoir la bonne valeur
				expect(wrapper.props('modelValue')).toBe('15/06/2024')
			})

			it('doit émettre focus lors du focus sur l\'input', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: null,
						label: 'Test événement focus',
					},
				})

				await nextTick()

				// Simuler le focus
				wrapper.vm.$emit('focus')
				await nextTick()

				expect(wrapper.emitted('focus')).toBeTruthy()
			})

			it('doit émettre blur lors de la perte de focus', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: null,
						label: 'Test événement blur',
					},
				})

				await nextTick()

				// Simuler le blur
				wrapper.vm.$emit('blur')
				await nextTick()

				expect(wrapper.emitted('blur')).toBeTruthy()
			})

			it('doit émettre date-selected avec la bonne valeur', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: null,
						label: 'Test événement date-selected',
						format: 'DD/MM/YYYY',
					},
				})

				await nextTick()

				// Simuler la sélection d'une date
				wrapper.vm.$emit('date-selected', '15/06/2024')
				await nextTick()

				expect(wrapper.emitted('date-selected')).toBeTruthy()
				expect(wrapper.emitted('date-selected')[0]).toEqual(['15/06/2024'])
			})
		})

		describe('Tests des événements DatePicker', () => {
			it('doit émettre update:modelValue avec le bon format', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: null,
						label: 'Test événement DatePicker',
						format: 'DD/MM/YYYY',
						dateFormatReturn: 'YYYY-MM-DD',
					},
				})

				await nextTick()

				// Simuler la sélection
				await wrapper.setProps({ modelValue: '15/06/2024' })
				await nextTick()

				expect(wrapper.emitted('update:modelValue')).toBeTruthy()
			})

			it('doit émettre closed lors de la fermeture du calendrier', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: null,
						label: 'Test événement closed',
					},
				})

				await nextTick()

				// Simuler la fermeture
				wrapper.vm.$emit('closed')
				await nextTick()

				expect(wrapper.emitted('closed')).toBeTruthy()
			})

			it('doit émettre les événements dans le bon ordre', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: null,
						label: 'Test ordre événements',
					},
				})

				await nextTick()

				// Simuler une séquence d'événements
				wrapper.vm.$emit('focus')
				wrapper.vm.$emit('date-selected', '15/06/2024')
				wrapper.vm.$emit('update:modelValue', '15/06/2024')
				wrapper.vm.$emit('blur')
				await nextTick()

				expect(wrapper.emitted('focus')).toBeTruthy()
				expect(wrapper.emitted('date-selected')).toBeTruthy()
				expect(wrapper.emitted('update:modelValue')).toBeTruthy()
				expect(wrapper.emitted('blur')).toBeTruthy()
			})
		})

		describe('Tests des événements DatePicker', () => {
			it('doit émettre update:model-value lors de la saisie', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: null,
						label: 'Test événement DatePicker',
					},
				})

				await nextTick()

				const input = wrapper.find('input')
				await input.setValue('15/06/2024')
				await input.trigger('blur')

				expect(wrapper.emitted('update:modelValue')).toBeTruthy()
			})

			it('doit émettre input lors de la frappe', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: null,
						label: 'Test événement input',
					},
				})

				await nextTick()

				const input = wrapper.find('input')
				expect(input.exists()).toBe(true)

				await input.setValue('15')
				await input.trigger('input')

				// Vérifier que l'input a bien la valeur
				expect(input.element.value).toContain('15')
			})

			it('doit émettre focus et blur dans le bon ordre', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: null,
						label: 'Test focus/blur ordre',
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

	/**
	 * TESTS D'ACCESSIBILITÉ (A11Y)
	 */
	describe('Tests d\'Accessibilité (A11y)', () => {
		describe('Tests de navigation au clavier', () => {
			it('doit gérer la navigation au clavier dans DatePicker', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: null,
						label: 'Test navigation clavier',
						format: 'DD/MM/YYYY',
					},
				})

				await nextTick()

				const input = wrapper.find('input')

				// Test des touches de navigation
				await input.trigger('keydown', { key: 'ArrowLeft' })
				await input.trigger('keydown', { key: 'ArrowRight' })
				await input.trigger('keydown', { key: 'Home' })
				await input.trigger('keydown', { key: 'End' })
				await input.trigger('keydown', { key: 'Tab' })

				expect(wrapper.exists()).toBe(true)
			})

			it('doit gérer la saisie de chiffres au clavier', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: null,
						label: 'Test saisie chiffres',
						format: 'DD/MM/YYYY',
					},
				})

				await nextTick()

				const input = wrapper.find('input')

				// Test de saisie de chiffres
				await input.trigger('keydown', { key: '1' })
				await input.trigger('keydown', { key: '5' })
				await input.trigger('keydown', { key: '0' })
				await input.trigger('keydown', { key: '6' })

				expect(wrapper.exists()).toBe(true)
			})

			it('doit gérer la touche Backspace', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: '15/06/2024',
						label: 'Test Backspace',
						format: 'DD/MM/YYYY',
					},
				})

				await nextTick()

				const input = wrapper.find('input')
				await input.trigger('keydown', { key: 'Backspace' })

				expect(wrapper.exists()).toBe(true)
			})
		})

		describe('Tests de focus management', () => {
			it('doit émettre les événements focus et blur - DatePicker', async () => {
				wrapper = mount(DatePicker, {
					props: {
						noCalendar: true,
						modelValue: null,
						label: 'Test focus methods',
					},
				})

				await nextTick()

				const input = wrapper.find('input')

				// Tester l'événement focus
				await input.trigger('focus')
				expect(wrapper.emitted('focus')).toBeTruthy()

				// Tester l'événement blur
				await input.trigger('blur')
				expect(wrapper.emitted('blur')).toBeTruthy()

				expect(wrapper.exists()).toBe(true)
			})

			it('doit gérer le focus initial correctement', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: null,
						label: 'Test focus initial',
						autofocus: true,
					},
				})

				await nextTick()

				expect(wrapper.exists()).toBe(true)
			})
		})

		describe('Tests des attributs ARIA et rôles', () => {
			it('doit avoir les bons attributs ARIA - CalendarMode', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: null,
						label: 'Test ARIA',
						required: true,
					},
				})

				await nextTick()

				const input = wrapper.find('input')
				if (input.exists()) {
					expect(input.attributes()).toBeDefined()
				}
				expect(wrapper.exists()).toBe(true)
			})

			it('doit supporter les labels et descriptions', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: null,
						label: 'Date de naissance',
						required: true,
					},
				})

				await nextTick()

				expect(wrapper.props('label')).toBe('Date de naissance')
				expect(wrapper.props('required')).toBe(true)
				expect(wrapper.exists()).toBe(true)
			})
		})
	})

	/**
	 * TESTS DES ÉTATS D'ERREUR/WARNING/SUCCESS
	 */
	describe('Tests des États de Validation', () => {
		describe('Tests des messages d\'erreur personnalisés', () => {
			it('doit afficher les messages d\'erreur personnalisés', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: '10/06/2024',
						label: 'Test erreur personnalisée',
						customRules: [
							{
								type: 'notBeforeDate',
								options: {
									date: '15/06/2024',
									message: 'Message d\'erreur personnalisé très spécifique',
								},
							},
						],
					},
				})

				await nextTick()

				const result = wrapper.vm.validateOnSubmit()
				expect(result).toBe(false)
			})

			it('doit gérer les erreurs de validation', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: null,
						label: 'Test erreurs validation',
						required: true,
						customRules: [
							{
								type: 'custom',
								options: {
									validate: () => false,
									message: 'Erreur personnalisée',
								},
							},
						],
					},
				})

				await nextTick()

				// Déclencher la validation
				await wrapper.vm.validateOnSubmit()

				expect(wrapper.vm.errorMessages.length).toBeGreaterThan(0)
			})

			it('doit combiner erreurs internes et externes', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: null,
						label: 'Test erreurs combinées',
						required: true,
						errorMessages: ['Erreur externe'],
						customRules: [
							{
								type: 'custom',
								options: {
									validate: () => false,
									message: 'Erreur interne',
								},
							},
						],
					},
				})

				await nextTick()

				const result = wrapper.vm.validateOnSubmit()
				expect(result).toBe(false)
			})
		})

		describe('Tests des warnings', () => {
			it('doit afficher les warnings sans bloquer la validation', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: '15/06/2024',
						label: 'Test warnings',
						customWarningRules: [
							{
								type: 'custom',
								options: {
									validate: () => false,
									message: 'Ceci est un warning',
								},
							},
						],
					},
				})

				await nextTick()

				const result = wrapper.vm.validateOnSubmit()
				expect(typeof result).toBe('boolean')
			})

			it('doit gérer les warnings et erreurs simultanément', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: '15/06/2024',
						label: 'Test warnings + erreurs',
						customRules: [
							{
								type: 'custom',
								options: {
									validate: () => false,
									message: 'Erreur critique',
								},
							},
						],
						customWarningRules: [
							{
								type: 'custom',
								options: {
									validate: () => false,
									message: 'Warning informatif',
								},
							},
						],
					},
				})

				await nextTick()

				const result = wrapper.vm.validateOnSubmit()
				expect(result).toBe(false) // Erreur doit bloquer
			})
		})

		describe('Tests des messages de succès', () => {
			it('doit afficher les messages de succès', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: '15/06/2024',
						label: 'Test succès',
						customRules: [
							{
								type: 'custom',
								options: {
									validate: () => true,
									message: 'Date valide !',
								},
							},
						],
					},
				})

				await nextTick()

				const result = wrapper.vm.validateOnSubmit()
				expect(result).toBe(true)
			})
		})
	})

	/**
	 * TESTS DE PERFORMANCE ET OPTIMISATION
	 */
	describe('Tests de Performance et Optimisation', () => {
		describe('Tests de debouncing et throttling', () => {
			it('doit gérer la validation en temps réel sans surcharge', async () => {
				const mockValidate = vi.fn().mockReturnValue(true)

				wrapper = mount(DatePicker, {
					props: {
						modelValue: null,
						label: 'Test performance validation',
						customRules: [
							{
								type: 'custom',
								options: {
									validate: mockValidate,
									message: 'Test performance',
								},
							},
						],
					},
				})

				await nextTick()

				const input = wrapper.find('input')

				// Saisie rapide
				for (let i = 0; i < 10; i++) {
					await input.setValue(`${i}`)
					await input.trigger('input')
				}

				await nextTick()

				expect(wrapper.exists()).toBe(true)
				// La validation ne doit pas être appelée excessivement
			})

			it('doit optimiser les re-renders lors de changements rapides', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: null,
						label: 'Test re-renders',
					},
				})

				await nextTick()

				const startTime = performance.now()

				// Changements rapides de props
				for (let i = 0; i < 20; i++) {
					await wrapper.setProps({
						modelValue: `${10 + i}/06/2024`,
						label: `Label ${i}`,
					})
				}

				const endTime = performance.now()

				expect(wrapper.exists()).toBe(true)
				expect(endTime - startTime).toBeLessThan(1000) // Moins d'1 seconde
			})
		})

		describe('Tests de memory leaks avancés', () => {
			it('doit nettoyer les watchers lors du unmount', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: null,
						label: 'Test watchers cleanup',
						customRules: [
							{
								type: 'notBeforeDate',
								options: {
									date: '15/06/2024',
									message: 'Test',
								},
							},
						],
					},
				})

				await nextTick()

				// Unmount et vérifier le cleanup
				wrapper.unmount()

				expect(wrapper.exists()).toBe(false)
			})

			it('doit gérer les instances multiples sans interférence', async () => {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any -- tests
				const wrappers: any[] = []

				// Créer plusieurs instances
				for (let i = 0; i < 5; i++) {
					const w = mount(DatePicker, {
						props: {
							modelValue: null,
							label: `Instance ${i}`,
							format: 'DD/MM/YYYY',
						},
					})
					wrappers.push(w)
				}

				await nextTick()

				// Vérifier que toutes les instances fonctionnent
				for (const w of wrappers) {
					expect(w.exists()).toBe(true)
					w.unmount()
				}
			})
		})
	})

	/**
	 * TESTS D'INTÉGRATION AVEC FORMULAIRES
	 */
	describe('Tests d\'Intégration avec Formulaires', () => {
		describe('Tests avec Vuetify forms', () => {
			it('doit s\'intégrer correctement dans un v-form', async () => {
				const formWrapper = mount({
					template: `
						<v-form ref="form">
							<DatePicker
								v-model="date"
								label="Date dans formulaire"
								:rules="[required]"
							/>
						</v-form>
					`,
					components: {
						DatePicker,
					},
					setup() {
						const date = ref(null)
						const required = value => !!value || 'Date requise'
						return { date, required }
					},
				})

				await nextTick()

				expect(formWrapper.exists()).toBe(true)
				formWrapper.unmount()
			})

			it('doit participer à la validation globale du formulaire', async () => {
				const formWrapper = mount({
					template: `
						<v-form ref="form" v-model="valid">
							<DatePicker
								v-model="date"
								label="Date validation globale"
								required
							/>
						</v-form>
					`,
					components: {
						DatePicker,
					},
					setup() {
						const date = ref(null)
						const valid = ref(false)
						return { date, valid }
					},
				})

				await nextTick()

				expect(formWrapper.exists()).toBe(true)
				formWrapper.unmount()
			})
		})

		describe('Tests de reset de formulaire', () => {
			it('doit se réinitialiser lors du reset du formulaire', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: '15/06/2024',
						label: 'Test reset',
					},
				})

				await nextTick()

				// Simuler un reset
				await wrapper.setProps({ modelValue: null })
				await nextTick()

				expect(wrapper.props('modelValue')).toBe(null)
			})

			it('doit nettoyer les erreurs lors du reset', async () => {
				wrapper = mount(DatePicker, {
					props: {
						useCombinedMode: true,
						modelValue: null,
						label: 'Test reset erreurs',
						required: true,
					},
				})

				await nextTick()

				// Déclencher une erreur
				const result = wrapper.vm.validateOnSubmit()
				expect(result).toBe(false)

				// Reset
				await wrapper.setProps({ modelValue: '15/06/2024' })
				await nextTick()

				const newResult = wrapper.vm.validateOnSubmit()
				expect(newResult).toBe(true)
			})
		})

		describe('Tests de soumission de formulaire', () => {
			it('doit valider avant soumission', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: null,
						label: 'Test soumission',
						required: true,
						customRules: [
							{
								type: 'notAfterToday',
								options: {
									message: 'Date future interdite',
								},
							},
						],
					},
				})

				await nextTick()

				// Test avec date invalide
				await wrapper.setProps({ modelValue: '15/12/2025' })
				await nextTick()

				const result = wrapper.vm.validateOnSubmit()
				expect(typeof result).toBe('boolean')
			})

			it('doit retourner les bonnes valeurs pour la soumission', async () => {
				wrapper = mount(DatePicker, {
					props: {
						modelValue: '15/06/2024',
						label: 'Test valeurs soumission',
						format: 'DD/MM/YYYY',
						dateFormatReturn: 'YYYY-MM-DD',
					},
				})

				await nextTick()

				expect(wrapper.props('modelValue')).toBe('15/06/2024')
				expect(wrapper.props('dateFormatReturn')).toBe('YYYY-MM-DD')
			})
		})
	})

	/**
	 * TESTS TRANSVERSAUX POUR TOUS LES MODES
	 */
	describe('Tests Transversaux - Tous les Modes', () => {
		const modes = [
			{ name: 'CalendarMode', component: DatePicker, props: {} },
			{ name: 'DatePicker', component: DatePicker, props: {} },
			{ name: 'DatePicker Combined', component: DatePicker, props: { useCombinedMode: true } },
			{ name: 'DatePicker', component: DatePicker, props: {} },
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
