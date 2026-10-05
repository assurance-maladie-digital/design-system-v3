import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { defineComponent, nextTick, ref, type Ref } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { useCustomValidation, type UseCustomValidationOptions } from '../useCustomValidation'
import type { ValidationRule } from '@/composables/validation/useValidation'

// Helper pour tester useCustomValidation dans un contexte Vue
function useCustomValidationInComponent(
	modelValue: Ref<unknown>,
	customRules: Ref<ValidationRule[]> | undefined,
	customWarningRules: Ref<ValidationRule[]> | undefined = undefined,
	customSuccessRules: Ref<ValidationRule[]> | undefined = undefined,
	errors: Ref<string[]> = ref([]),
	warnings: Ref<string[]> = ref([]),
	successes: Ref<string[]> = ref([]),
	showSuccessMessages: Ref<boolean> = ref(false),
	label: Ref<string | undefined> = ref(undefined),
	focused: Ref<boolean> = ref(false),
	isValidateOnBlur: Ref<boolean> = ref(true),
	disableErrorHandling: Ref<boolean> = ref(false),
	readonly?: Ref<boolean>,
	disabled?: Ref<boolean>,
	options: UseCustomValidationOptions = {},
) {
	const TestComponent = defineComponent({
		setup() {
			const result = useCustomValidation(
				modelValue,
				customRules,
				customWarningRules,
				customSuccessRules,
				errors,
				warnings,
				successes,
				showSuccessMessages,
				label,
				focused,
				isValidateOnBlur,
				disableErrorHandling,
				readonly,
				disabled,
				options,
			)
			return { ...result }
		},
		render: () => null,
	})
	return mount(TestComponent)
}

describe('useCustomValidation - État pristine et comportement du formulaire', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	afterEach(async () => {
		await flushPromises()
	})

	describe('Validation explicite', () => {
		it('invalide un champ requis vide', async () => {
			const rules: ValidationRule[] = [
				{ type: 'required', options: { message: 'Champ obligatoire' } },
			]

			const modelValue = ref('')
			const customRules = ref(rules)
			const errors = ref<string[]>([])
			const warnings = ref<string[]>([])
			const successes = ref<string[]>([])

			const wrapper = useCustomValidationInComponent(
				modelValue,
				customRules,
				undefined,
				undefined,
				errors,
				warnings,
				successes,
				ref(false),
				ref('Test field'),
				ref(false),
				ref(true),
				ref(false),
				undefined,
				undefined,
				{},
			)

			// Appeler validate pour déclencher la validation
			const validate = wrapper.vm.validate as () => Promise<{ state: { errors: string[] } }>
			const result = await validate()

			// Vérifier que la validation a détecté une erreur
			expect(result.state.errors).toContain('Champ obligatoire')
			expect(errors.value).toContain('Champ obligatoire')
		})
	})

	describe('Règles custom (ex: SyCheckbox)', () => {
		it('détecte correctement une règle custom pour SyCheckbox quand non coché', async () => {
			const rules: ValidationRule[] = [
				{
					type: 'custom',
					options: {
						validate: (value: unknown) => value === true,
						message: 'Vous devez accepter les conditions',
						fieldIdentifier: 'consent',
					},
				},
			]

			const modelValue = ref(false) // Non coché
			const customRules = ref(rules)
			const errors = ref<string[]>([])

			const wrapper = useCustomValidationInComponent(
				modelValue,
				customRules,
				undefined,
				undefined,
				errors,
				ref<string[]>([]),
				ref<string[]>([]),
				ref(false),
				ref('Consentement'),
				ref(false),
				ref(true),
				ref(false),
				undefined,
				undefined,
				{},
			)

			// Appeler validate pour déclencher la validation
			const validate = wrapper.vm.validate as () => Promise<{ state: { errors: string[] } }>
			const result = await validate()

			// Vérifier que la validation a détecté une erreur
			expect(result.state.errors).toContain('Vous devez accepter les conditions')
			expect(errors.value).toContain('Vous devez accepter les conditions')
		})

		it('détecte correctement une règle custom pour SyCheckbox quand coché', async () => {
			const rules: ValidationRule[] = [
				{
					type: 'custom',
					options: {
						validate: (value: unknown) => value === true,
						message: 'Vous devez accepter les conditions',
						fieldIdentifier: 'consent',
					},
				},
			]

			const modelValue = ref(true) // Coché
			const customRules = ref(rules)
			const errors = ref<string[]>([])

			const wrapper = useCustomValidationInComponent(
				modelValue,
				customRules,
				undefined,
				undefined,
				errors,
				ref<string[]>([]),
				ref<string[]>([]),
				ref(false),
				ref('Consentement'),
				ref(false),
				ref(true),
				ref(false),
				undefined,
				undefined,
				{},
			)

			// Appeler validate pour déclencher la validation
			const validate = wrapper.vm.validate as () => Promise<{ state: { errors: string[] } }>
			const result = await validate()

			// Vérifier que la validation n'a pas détecté d'erreur
			expect(result.state.errors).toHaveLength(0)
			expect(errors.value).toHaveLength(0)
		})
	})

	describe('Réinitialisation du formulaire', () => {
		it('reset réinitialise modelValue', async () => {
			const modelValue = ref('test')
			const customRules = ref<ValidationRule[]>([
				{ type: 'required', options: { message: 'Requis' } },
			])
			const errors = ref<string[]>(['Erreur'])

			const wrapper = useCustomValidationInComponent(
				modelValue,
				customRules,
				undefined,
				undefined,
				errors,
				ref<string[]>([]),
				ref<string[]>([]),
				ref(false),
				ref('Champ'),
				ref(false),
				ref(true),
				ref(false),
				undefined,
				undefined,
				{},
			)

			// Appeler reset
			const reset = wrapper.vm.reset as () => void
			reset()

			// Attendre le nextTick pour que la réinitialisation soit effective
			await nextTick()

			// Vérifier que modelValue est réinitialisé
			expect(modelValue.value).toBeUndefined()
		})

		it('clearValidation nettoie les erreurs', async () => {
			const modelValue = ref('test')
			const customRules = ref<ValidationRule[]>([
				{ type: 'required', options: { message: 'Requis' } },
			])
			const errors = ref<string[]>(['Erreur'])

			const wrapper = useCustomValidationInComponent(
				modelValue,
				customRules,
				undefined,
				undefined,
				errors,
				ref<string[]>([]),
				ref<string[]>([]),
				ref(false),
				ref('Champ'),
				ref(false),
				ref(true),
				ref(false),
				undefined,
				undefined,
				{},
			)

			// Appeler clearValidation
			const clearValidation = wrapper.vm.clearValidation as () => void
			clearValidation()

			// Vérifier que les erreurs sont nettoyées
			expect(errors.value).toHaveLength(0)
		})
	})

	describe('Comportement de fieldValide', () => {
		it('garde un champ obligatoire vide pristine sans SyForm', async () => {
			const modelValue = ref('')
			const customRules = ref<ValidationRule[]>([
				{ type: 'required', options: { message: 'Requis' } },
			])
			const errors = ref<string[]>([])
			const warnings = ref<string[]>([])
			const successes = ref<string[]>([])

			const wrapper = useCustomValidationInComponent(
				modelValue,
				customRules,
				undefined,
				undefined,
				errors,
				warnings,
				successes,
				ref(false),
				ref('Champ'),
				ref(false),
				ref(false),
				ref(false),
				undefined,
				undefined,
				{ registerWithForm: false },
			)

			expect(errors.value).toHaveLength(0)
			expect(wrapper.vm.isPristine).toBe(true)
		})

		it('fieldValide est true pour un champ optionnel vide', async () => {
			const modelValue = ref('')
			const customRules = ref<ValidationRule[]>([]) // Pas de règle required
			const errors = ref<string[]>([])

			const wrapper = useCustomValidationInComponent(
				modelValue,
				customRules,
				undefined,
				undefined,
				errors,
				ref<string[]>([]),
				ref<string[]>([]),
				ref(false),
				ref('Champ'),
				ref(false),
				ref(false),
				ref(false),
				undefined,
				undefined,
				{ registerWithForm: false },
			)

			// Appeler validate pour déclencher la validation
			const validate = wrapper.vm.validate as () => Promise<{ state: { errors: string[] } }>
			const result = await validate()

			// Un champ optionnel vide ne devrait pas avoir d'erreur
			expect(result.state.errors).toHaveLength(0)
			expect(errors.value).toHaveLength(0)
		})

		it('fieldValide est true pour un champ pré-rempli valide', async () => {
			const modelValue = ref('valeur valide')
			const customRules = ref<ValidationRule[]>([
				{ type: 'required', options: { message: 'Requis' } },
			])
			const errors = ref<string[]>([])

			const wrapper = useCustomValidationInComponent(
				modelValue,
				customRules,
				undefined,
				undefined,
				errors,
				ref<string[]>([]),
				ref<string[]>([]),
				ref(false),
				ref('Champ'),
				ref(false),
				ref(false),
				ref(false),
				undefined,
				undefined,
				{ registerWithForm: false },
			)

			// Appeler validate pour déclencher la validation
			const validate = wrapper.vm.validate as () => Promise<{ state: { errors: string[] } }>
			const result = await validate()

			// Un champ pré-rempli valide ne devrait pas avoir d'erreur
			expect(result.state.errors).toHaveLength(0)
			expect(errors.value).toHaveLength(0)
		})
	})
})
