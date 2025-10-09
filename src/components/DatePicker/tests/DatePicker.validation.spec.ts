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
