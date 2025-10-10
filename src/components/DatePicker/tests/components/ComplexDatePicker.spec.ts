import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, ref, computed } from 'vue'
import { vuetify } from '../../../../../tests/unit/setup'
import ComplexDatePicker from '@/components/DatePicker/ComplexDatePicker/ComplexDatePicker.vue'

/**
 * Tests spécifiques au composant ComplexDatePicker
 *
 * Couvre toutes les fonctionnalités spécifiques au ComplexDatePicker :
 * - Mode standard et combined
 * - Props spécifiques (useCombinedMode, textFieldActivator, etc.)
 * - Gestion des custom rules et warning rules
 * - Intégration avec DateTextInput et CalendarMode
 */
describe('ComplexDatePicker - Component Tests', () => {
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
			expect(wrapper.props('displayRange')).toBe(true)
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
			expect(wrapper.props('autoClamp')).toBe(true)
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
			expect(wrapper.props('readonly')).toBe(true)
		})
	})

	describe('Props Spécifiques ComplexDatePicker', () => {
		it('doit gérer textFieldActivator', async () => {
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

		it('doit gérer useCombinedMode avec différentes configurations', async () => {
			const configs = [
				{ useCombinedMode: true, label: 'Combined Mode True' },
				{ useCombinedMode: false, label: 'Combined Mode False' },
			]

			for (const config of configs) {
				wrapper = mount(ComplexDatePicker, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						...config,
					},
				})

				await nextTick()
				expect(wrapper.exists()).toBe(true)
				wrapper.unmount()
			}
		})
	})

	describe('Custom Rules et Warning Rules', () => {
		it('doit gérer les custom rules de succès', async () => {
			const customRules = [
				{
					type: 'custom',
					options: {
						validate: () => true,
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
					label: 'Date avec succès',
					customRules,
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.find('input').exists()).toBe(true)
		})

		it('doit gérer les custom warning rules', async () => {
			const customWarningRules = [
				{
					type: 'custom',
					options: {
						validate: () => false,
						message: 'Avertissement test',
					},
				},
			]

			wrapper = mount(ComplexDatePicker, {
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

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.props('customWarningRules')).toEqual(customWarningRules)
		})

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

	describe('Mode Combined Spécifique', () => {
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

		it('doit gérer les événements en combined mode', async () => {
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

	describe('Intégration avec Formats', () => {
		it('doit gérer les différents formats', async () => {
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

		it('doit gérer dateFormatReturn', async () => {
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

		it('doit gérer les formats avec combined mode', async () => {
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

	describe('États et Propriétés', () => {
		it('doit gérer l\'état required', async () => {
			wrapper = mount(ComplexDatePicker, {
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
			wrapper = mount(ComplexDatePicker, {
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

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.props('disabled')).toBe(true)
		})

		it('doit gérer clearable', async () => {
			wrapper = mount(ComplexDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: '2024-06-15',
					label: 'Date clearable',
					clearable: true,
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
		})

		it('doit gérer persistentHint', async () => {
			wrapper = mount(ComplexDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date avec hint persistant',
					persistentHint: true,
					hint: 'Hint persistant',
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
		})
	})

	describe('Messages et Validation', () => {
		it('doit gérer les messages externes', async () => {
			const errorMessages = ['Erreur externe']
			const successMessages = ['Succès externe']

			wrapper = mount(ComplexDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date avec messages externes',
					errorMessages,
					successMessages,
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
		})

		it('doit gérer hideDetails', async () => {
			wrapper = mount(ComplexDatePicker, {
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
		})
	})

	describe('Régression - Suppression via croix', () => {
		it('ne doit pas afficher "Date invalide" lors de suppression via croix', async () => {
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
				msg.text().includes('Date invalide'),
			)
			expect(hasDateInvalidError).toBe(false)
		})
	})

	describe('Régression - Configuration de règle invalide', () => {
		it('ne doit pas afficher "Configuration de la règle invalide"', async () => {
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

			// Vérifier qu'il n'y a pas d'erreur de configuration
			const errorMessages = wrapper.findAll('.v-messages__message')
			const hasConfigError = errorMessages.some(msg =>
				msg.text().includes('Configuration de la règle invalide'),
			)
			expect(hasConfigError).toBe(false)
		})
	})
})
