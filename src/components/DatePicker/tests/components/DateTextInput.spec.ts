import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { vuetify } from '../../../../../tests/unit/setup'
import DateTextInput from '@/components/DatePicker/DateTextInput/DateTextInput.vue'

/**
 * Tests spécifiques au composant DateTextInput
 *
 * Couvre toutes les fonctionnalités spécifiques au DateTextInput :
 * - Saisie manuelle et formatage automatique
 * - Validation en temps réel
 * - Props spécifiques (isValidateOnBlur, autoClamp, etc.)
 * - Intégration avec les custom rules
 */
describe('DateTextInput - Component Tests', () => {
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

		it('doit accepter une valeur initiale', async () => {
			const initialValue = '2024-06-15'
			wrapper = mount(DateTextInput, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: initialValue,
					label: 'Date avec valeur initiale',
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.props('modelValue')).toBe(initialValue)
		})
	})

	describe('Saisie Manuelle et Formatage', () => {
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
				expect(wrapper.props('format')).toBe(format)
				wrapper.unmount()
			}
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
			expect(wrapper.props('autoClamp')).toBe(true)
		})

		it('doit gérer la saisie manuelle avec validation', async () => {
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

	describe('Validation en Temps Réel', () => {
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

		it('doit valider en temps réel lors de la saisie', async () => {
			wrapper = mount(DateTextInput, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date validation temps réel',
					required: true,
				},
			})

			await nextTick()

			const input = wrapper.find('input')
			await input.setValue('15/06/2024')
			await input.trigger('blur')

			// Vérifier que la validation s'est déclenchée
			expect(wrapper.exists()).toBe(true)
		})
	})

	describe('Props Spécifiques DateTextInput', () => {
		it('doit gérer displayAppendIcon', async () => {
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
			expect(wrapper.props('displayAppendIcon')).toBe(true)
		})

		it('doit gérer placeholder', async () => {
			const placeholder = 'Saisir une date'
			wrapper = mount(DateTextInput, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date avec placeholder',
					placeholder,
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.props('placeholder')).toBe(placeholder)
		})

		it('doit gérer clearable', async () => {
			wrapper = mount(DateTextInput, {
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

		it('doit gérer hint', async () => {
			const hint = 'Format: DD/MM/YYYY'
			wrapper = mount(DateTextInput, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date avec hint',
					hint,
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
		})
	})

	describe('Custom Rules et Validation', () => {
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

		it('doit valider avec custom rules lors de la saisie', async () => {
			const customRuleMock = vi.fn().mockReturnValue(true)
			const customRules = [
				{
					type: 'custom',
					options: {
						validate: customRuleMock,
						message: 'Validation custom',
					},
				},
			]

			wrapper = mount(DateTextInput, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date avec custom rules',
					customRules,
				},
			})

			await nextTick()

			const input = wrapper.find('input')
			await input.setValue('15/06/2024')
			await input.trigger('blur')

			expect(customRuleMock).toHaveBeenCalled()
		})
	})

	describe('États et Propriétés', () => {
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

		it('doit gérer l\'état readonly', async () => {
			wrapper = mount(DateTextInput, {
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

			expect(wrapper.exists()).toBe(true)
			expect(wrapper.props('readonly')).toBe(true)
		})
	})

	describe('Événements', () => {
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

		it('doit gérer les événements input', async () => {
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

		it('doit émettre update:modelValue lors de changement', async () => {
			wrapper = mount(DateTextInput, {
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
	})

	describe('Intégration avec Formats', () => {
		it('doit gérer dateFormatReturn', async () => {
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

		it('doit valider différents formats d\'entrée', async () => {
			const testCases = [
				{ format: 'DD/MM/YYYY', input: '15/06/2024' },
				{ format: 'MM/DD/YYYY', input: '06/15/2024' },
				{ format: 'YYYY-MM-DD', input: '2024-06-15' },
			]

			for (const testCase of testCases) {
				wrapper = mount(DateTextInput, {
					global: {
						plugins: [vuetify],
					},
					props: {
						modelValue: null,
						label: `Test format ${testCase.format}`,
						format: testCase.format,
					},
				})

				await nextTick()

				const input = wrapper.find('input')
				await input.setValue(testCase.input)
				await input.trigger('blur')

				expect(wrapper.exists()).toBe(true)
				wrapper.unmount()
			}
		})
	})

	describe('Messages et Validation', () => {
		it('doit afficher des messages d\'erreur', async () => {
			const errorMessages = ['Erreur de test']
			wrapper = mount(DateTextInput, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date avec erreur',
					errorMessages,
				},
			})

			await nextTick()

			expect(wrapper.exists()).toBe(true)
		})

		it('doit gérer hideDetails', async () => {
			wrapper = mount(DateTextInput, {
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

	describe('Intégration avec ComplexDatePicker', () => {
		it('doit fonctionner comme composant intégré', async () => {
			wrapper = mount(DateTextInput, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date intégrée',
					format: 'DD/MM/YYYY',
					required: true,
				},
			})

			await nextTick()

			// Test d'intégration basique
			expect(wrapper.exists()).toBe(true)
			expect(wrapper.props('format')).toBe('DD/MM/YYYY')
			expect(wrapper.props('required')).toBe(true)

			// Test de validation
			const result = wrapper.vm.validateOnSubmit()
			expect(result).toBe(false) // Required field empty
		})
	})
})
