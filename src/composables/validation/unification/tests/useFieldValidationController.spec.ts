import { ref } from 'vue'
import { describe, it, expect, vi } from 'vitest'
import { useFieldValidationController, type FieldValidationProps } from '../FieldValidationController'

describe('useFieldValidationController', () => {
	it('reacts when validationOptions change (showSuccessMessages & fieldIdentifier)', () => {
		const value = ref('ok')
		const props = ref<FieldValidationProps>({ label: 'Nom', showSuccessMessages: true })
		const validationOptions = ref({ showSuccessMessages: false, fieldIdentifier: 'Email' })
		const baseRules = ref([
			{
				type: 'required',
				options: {
					message: 'Ce champ est requis',
				},
			},
		])

		const { validateOnChange, successes, errors } = useFieldValidationController({
			value,
			props,
			baseRules,
			validationOptions,
		})

		// initial: showSuccessMessages false -> aucun succès
		const firstRun = validateOnChange()
		expect(firstRun).toBe(true)
		expect(successes.value).toEqual([])
		expect(errors.value).toEqual([])

		// update reactive options
		validationOptions.value.showSuccessMessages = true
		validationOptions.value.fieldIdentifier = 'Email'

		const secondRun = validateOnChange()
		expect(secondRun).toBe(true)
		expect(successes.value).toContain('Le champ Email est valide.')
	})

	it('respects reactive disableErrorHandling from validationOptions', () => {
		const value = ref('')
		const props = ref<FieldValidationProps>({ required: true })
		const validationOptions = ref({ disableErrorHandling: true })
		const baseRules = ref([
			{
				type: 'required',
				options: {
					message: 'Ce champ est requis',
				},
			},
		])

		const { validateOnChange, errors } = useFieldValidationController({
			value,
			props,
			baseRules,
			validationOptions,
		})

		const firstRun = validateOnChange()
		expect(firstRun).toBe(true)
		expect(errors.value).toEqual([])

		validationOptions.value.disableErrorHandling = false

		const secondRun = validateOnChange()
		expect(secondRun).toBe(false)
		expect(errors.value).toContain('Ce champ est requis')
	})

	it('warns when useVuetifyValidation is combined with custom rules', () => {
		const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
		const value = ref('ok')
		const props = ref<FieldValidationProps>({
			useVuetifyValidation: true,
			customRules: [{ type: 'required', options: { message: 'Ce champ est requis' } }],
		})

		useFieldValidationController({ value, props })

		expect(spy).toHaveBeenCalledWith(
			'[FieldValidationController] `useVuetifyValidation` est actif : les règles personnalisées (customRules/warning/success) seront ignorées pour éviter des comportements ambigus.',
		)

		spy.mockRestore()
	})
})
