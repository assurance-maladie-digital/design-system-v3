import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, ref, computed } from 'vue'
import { vuetify } from '../../../../../tests/unit/setup'
import CalendarModeDatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
import ComplexDatePicker from '@/components/DatePicker/ComplexDatePicker/ComplexDatePicker.vue'
import DateTextInput from '@/components/DatePicker/DateTextInput/DateTextInput.vue'

/**
 * Tests de validation core pour DatePicker
 *
 * Couvre les fonctionnalités de validation de base :
 * - Validation required
 * - Custom rules
 * - Validation sur champs vides
 * - Règles réactives
 */
describe('DatePicker - Core Validation Tests', () => {
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

	describe('Required Validation', () => {
		it('doit valider required sur CalendarMode', async () => {
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

		it('doit valider required sur ComplexDatePicker', async () => {
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

		it('doit valider required sur DateTextInput', async () => {
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

		it('doit afficher erreur required après interaction utilisateur', async () => {
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

	describe('Custom Rules Validation', () => {
		it('doit exécuter custom rules sur CalendarMode', async () => {
			const customRuleMock = vi.fn().mockReturnValue(true)
			const customRules = [
				{
					type: 'custom',
					options: {
						validate: customRuleMock,
						message: 'Custom rule test',
					},
				},
			]

			wrapper = mount(CalendarModeDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: '2024-06-15',
					label: 'Date avec custom rule',
					customRules,
				},
			})

			await nextTick()

			wrapper.vm.validateOnSubmit()
			expect(customRuleMock).toHaveBeenCalled()
		})

		it('doit exécuter custom rules sur ComplexDatePicker', async () => {
			const customRuleMock = vi.fn().mockReturnValue(true)
			const customRules = [
				{
					type: 'custom',
					options: {
						validate: customRuleMock,
						message: 'Custom rule test',
					},
				},
			]

			wrapper = mount(ComplexDatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: '2024-06-15',
					label: 'Date avec custom rule',
					customRules,
				},
			})

			await nextTick()

			wrapper.vm.validateOnSubmit()
			expect(customRuleMock).toHaveBeenCalled()
		})

		it('doit exécuter custom warning rules sur DateTextInput', async () => {
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
	})

	describe('Custom Rules sur Champs Vides (Mémoire b5baeb0e)', () => {
		it('doit exécuter les custom rules sur champ vide avec validateOnSubmit() - CalendarMode', async () => {
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

		it('doit exécuter les custom rules après interaction utilisateur - CalendarMode', async () => {
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

		it('doit exécuter les custom rules sur champ vide même sans interaction - DateTextInput', async () => {
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

	describe('Règles Réactives (Mémoire 2196b67a)', () => {
		it('doit gérer les règles réactives correctement - ComplexDatePicker', async () => {
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

		it('doit maintenir la réactivité des règles en combined-mode (Mémoire a60921cf)', async () => {
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

	describe('Validation de Formats Invalides', () => {
		it('doit valider les formats de date invalides - DateTextInput', async () => {
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
	})

	describe('États de Validation', () => {
		it('doit gérer l\'état disabled - CalendarMode', async () => {
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

		it('doit gérer l\'état readonly - CalendarMode', async () => {
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

		it('doit gérer l\'état disabled - DateTextInput', async () => {
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
	})
})
