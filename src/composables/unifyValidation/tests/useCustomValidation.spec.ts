/* eslint-disable vue/one-component-per-file */

import { describe, it, expect, vi } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useCustomValidation } from '../useCustomValidation'
import SyForm from '@/components/Customs/SyForm/SyForm.vue'
import type { ValidationRule } from '@/composables/validation/useValidation'

// Helper to run a composable inside a Vue component context
function withSetup<T>(setup: () => T): { result: T, wrapper: ReturnType<typeof mount> } {
	let result: T
	const TestComponent = defineComponent({
		setup() {
			result = setup()
			return {}
		},
		render: () => null,
	})
	const wrapper = mount(TestComponent)
	return { result: result!, wrapper }
}

describe('useCustomValidation', () => {
	const defaultArgs = () => ({
		modelValue: ref<unknown>(''),
		customRules: ref<ValidationRule[]>([{ type: 'required', options: { message: 'Requis' } }]),
		customWarningRules: ref<ValidationRule[]>([]),
		customSuccessRules: ref<ValidationRule[]>([]),
		errors: ref<string[]>([]),
		warnings: ref<string[]>([]),
		successes: ref<string[]>([]),
		showSuccessMessages: ref(true),
		label: ref('Mon champ'),
		focused: ref(false),
		isValidateOnBlur: ref(true),
		disableErrorHandling: ref(false),
	})

	it('returns a validate function', () => {
		const args = defaultArgs()
		const { result } = withSetup(() =>
			useCustomValidation(
				args.modelValue,
				args.customRules,
				args.customWarningRules,
				args.customSuccessRules,
				args.errors,
				args.warnings,
				args.successes,
				args.showSuccessMessages,
				args.label,
				args.focused,
				args.isValidateOnBlur,
				args.disableErrorHandling,
			),
		)
		expect(typeof result.validate).toBe('function')
	})

	it('validate() sets errors when required rule fails on empty value', async () => {
		const args = defaultArgs()
		args.modelValue.value = ''
		const { result } = withSetup(() =>
			useCustomValidation(
				args.modelValue,
				args.customRules,
				args.customWarningRules,
				args.customSuccessRules,
				args.errors,
				args.warnings,
				args.successes,
				args.showSuccessMessages,
				args.label,
				args.focused,
				args.isValidateOnBlur,
				args.disableErrorHandling,
			),
		)
		await result.validate()
		expect(args.errors.value).toContain('Requis')
	})

	it('uses a visible error message when a Vuetify rule returns false', async () => {
		const args = defaultArgs()
		const useVuetifyValidation = ref(true)
		const rules = ref([{ validate: () => false }])
		const { result } = withSetup(() =>
			useCustomValidation(
				args.modelValue,
				args.customRules,
				args.customWarningRules,
				args.customSuccessRules,
				args.errors,
				args.warnings,
				args.successes,
				args.showSuccessMessages,
				args.label,
				args.focused,
				args.isValidateOnBlur,
				args.disableErrorHandling,
				undefined,
				undefined,
				{ useVuetifyValidation, rules },
			),
		)

		const validationResult = await result.validate()

		expect(validationResult.hasError).toBe(true)
		expect(args.errors.value).toEqual(['La valeur est invalide.'])
	})

	it('validate() clears errors when value is valid', async () => {
		const args = defaultArgs()
		args.modelValue.value = 'some value'
		const { result } = withSetup(() =>
			useCustomValidation(
				args.modelValue,
				args.customRules,
				args.customWarningRules,
				args.customSuccessRules,
				args.errors,
				args.warnings,
				args.successes,
				args.showSuccessMessages,
				args.label,
				args.focused,
				args.isValidateOnBlur,
				args.disableErrorHandling,
			),
		)
		await result.validate()
		expect(args.errors.value).toEqual([])
	})

	it('validate() updates warnings from warning rules', async () => {
		const args = defaultArgs()
		args.customRules.value = []
		args.customWarningRules.value = [{
			type: 'minLength',
			options: {
				length: 10,
				warningMessage: 'Trop court',
				isWarning: true,
			},
		}]
		args.modelValue.value = 'abc'
		const { result } = withSetup(() =>
			useCustomValidation(
				args.modelValue,
				args.customRules,
				args.customWarningRules,
				args.customSuccessRules,
				args.errors,
				args.warnings,
				args.successes,
				args.showSuccessMessages,
				args.label,
				args.focused,
				args.isValidateOnBlur,
				args.disableErrorHandling,
			),
		)
		await result.validate()
		expect(args.warnings.value.length).toBeGreaterThan(0)
	})

	it('triggers validation when focused changes from true to false', async () => {
		const args = defaultArgs()
		args.focused.value = true
		args.modelValue.value = ''
		const { result } = withSetup(() =>
			useCustomValidation(
				args.modelValue,
				args.customRules,
				args.customWarningRules,
				args.customSuccessRules,
				args.errors,
				args.warnings,
				args.successes,
				args.showSuccessMessages,
				args.label,
				args.focused,
				args.isValidateOnBlur,
				args.disableErrorHandling,
			),
		)
		expect(result).toBeDefined()

		args.focused.value = false
		await nextTick()

		expect(args.errors.value).toContain('Requis')
	})

	it('does not trigger validation on blur when disableErrorHandling is true', async () => {
		const args = defaultArgs()
		args.focused.value = true
		args.modelValue.value = ''
		args.disableErrorHandling.value = true
		withSetup(() =>
			useCustomValidation(
				args.modelValue,
				args.customRules,
				args.customWarningRules,
				args.customSuccessRules,
				args.errors,
				args.warnings,
				args.successes,
				args.showSuccessMessages,
				args.label,
				args.focused,
				args.isValidateOnBlur,
				args.disableErrorHandling,
			),
		)
		args.focused.value = false
		await nextTick()
		expect(args.errors.value).toEqual([])
	})

	it('does not trigger validation on blur when isValidateOnBlur is false', async () => {
		const args = defaultArgs()
		args.focused.value = true
		args.modelValue.value = ''
		args.isValidateOnBlur.value = false
		withSetup(() =>
			useCustomValidation(
				args.modelValue,
				args.customRules,
				args.customWarningRules,
				args.customSuccessRules,
				args.errors,
				args.warnings,
				args.successes,
				args.showSuccessMessages,
				args.label,
				args.focused,
				args.isValidateOnBlur,
				args.disableErrorHandling,
			),
		)

		args.focused.value = false
		await nextTick()

		expect(args.errors.value).toEqual([])
		expect(args.warnings.value).toEqual([])
		expect(args.successes.value).toEqual([])
	})

	it('triggers validation on modelValue change when isValidateOnBlur is false', async () => {
		const args = defaultArgs()
		args.isValidateOnBlur.value = false
		args.modelValue.value = 'initial'
		withSetup(() =>
			useCustomValidation(
				args.modelValue,
				args.customRules,
				args.customWarningRules,
				args.customSuccessRules,
				args.errors,
				args.warnings,
				args.successes,
				args.showSuccessMessages,
				args.label,
				args.focused,
				args.isValidateOnBlur,
				args.disableErrorHandling,
			),
		)
		// Change to empty value — should trigger error
		args.modelValue.value = ''
		await nextTick()
		expect(args.errors.value).toContain('Requis')
	})

	it('does not trigger validation on modelValue change when isValidateOnBlur is true', async () => {
		const args = defaultArgs()
		args.isValidateOnBlur.value = true
		args.modelValue.value = 'initial'
		withSetup(() =>
			useCustomValidation(
				args.modelValue,
				args.customRules,
				args.customWarningRules,
				args.customSuccessRules,
				args.errors,
				args.warnings,
				args.successes,
				args.showSuccessMessages,
				args.label,
				args.focused,
				args.isValidateOnBlur,
				args.disableErrorHandling,
			),
		)
		args.modelValue.value = ''
		await nextTick()
		// Errors should NOT be populated since we validate on blur
		expect(args.errors.value).toEqual([])
	})

	it('does not trigger validation on modelValue change when disableErrorHandling is true', async () => {
		const args = defaultArgs()
		args.isValidateOnBlur.value = false
		args.disableErrorHandling.value = true
		args.modelValue.value = 'initial'
		withSetup(() =>
			useCustomValidation(
				args.modelValue,
				args.customRules,
				args.customWarningRules,
				args.customSuccessRules,
				args.errors,
				args.warnings,
				args.successes,
				args.showSuccessMessages,
				args.label,
				args.focused,
				args.isValidateOnBlur,
				args.disableErrorHandling,
			),
		)
		args.modelValue.value = ''
		await nextTick()
		expect(args.errors.value).toEqual([])
	})

	it('does not trigger reactive validation when reactiveValidation is false', async () => {
		const args = defaultArgs()
		args.focused.value = true
		args.modelValue.value = 'initial'
		withSetup(() =>
			useCustomValidation(
				args.modelValue,
				args.customRules,
				args.customWarningRules,
				args.customSuccessRules,
				args.errors,
				args.warnings,
				args.successes,
				args.showSuccessMessages,
				args.label,
				args.focused,
				args.isValidateOnBlur,
				args.disableErrorHandling,
				undefined,
				undefined,
				{ reactiveValidation: false },
			),
		)

		args.focused.value = false
		args.modelValue.value = ''
		await nextTick()

		expect(args.errors.value).toEqual([])
		expect(args.warnings.value).toEqual([])
		expect(args.successes.value).toEqual([])
	})

	it('does not register itself in SyForm when registerWithForm is false', async () => {
		const args = defaultArgs()
		args.modelValue.value = ''

		let validation!: ReturnType<typeof useCustomValidation>

		const FieldUnderTest = defineComponent({
			setup() {
				validation = useCustomValidation(
					args.modelValue,
					args.customRules,
					args.customWarningRules,
					args.customSuccessRules,
					args.errors,
					args.warnings,
					args.successes,
					args.showSuccessMessages,
					args.label,
					args.focused,
					args.isValidateOnBlur,
					args.disableErrorHandling,
					undefined,
					undefined,
					{ registerWithForm: false },
				)

				return {}
			},
			template: '<div data-test="field-under-test" />',
		})

		const wrapper = mount(defineComponent({
			components: { SyForm, FieldUnderTest },
			template: `
				<SyForm data-test="syform">
					<FieldUnderTest />
				</SyForm>
			`,
		}))

		await nextTick()

		const syFormVm = wrapper.getComponent(SyForm).vm as {
			validate: () => Promise<boolean>
		}

		const valid = await syFormVm.validate()
		expect(valid).toBe(true)
		expect(args.errors.value).toEqual([])

		const manualResult = await validation.validate()
		expect(manualResult.hasError).toBe(true)
		expect(args.errors.value).toContain('Requis')

		wrapper.unmount()
	})

	it('uses provided SyForm registration callbacks when present', async () => {
		const args = defaultArgs()
		const validateOnSubmit = vi.fn(async () => true)
		const clearValidation = vi.fn()
		const reset = vi.fn()

		const FieldUnderTest = defineComponent({
			setup() {
				useCustomValidation(
					args.modelValue,
					args.customRules,
					args.customWarningRules,
					args.customSuccessRules,
					args.errors,
					args.warnings,
					args.successes,
					args.showSuccessMessages,
					args.label,
					args.focused,
					args.isValidateOnBlur,
					args.disableErrorHandling,
					undefined,
					undefined,
					{
						formRegistration: {
							validateOnSubmit,
							clearValidation,
							reset,
						},
					},
				)

				return {}
			},
			template: '<div data-test="field-under-test" />',
		})

		const wrapper = mount(defineComponent({
			components: { SyForm, FieldUnderTest },
			template: `
				<SyForm data-test="syform">
					<FieldUnderTest />
				</SyForm>
			`,
		}))

		await nextTick()

		const syFormVm = wrapper.getComponent(SyForm).vm as {
			validate: () => Promise<boolean>
			clearValidation: () => void
			reset: () => void
		}

		expect(await syFormVm.validate()).toBe(true)
		syFormVm.clearValidation()
		syFormVm.reset()

		expect(validateOnSubmit).toHaveBeenCalledTimes(1)
		expect(clearValidation).toHaveBeenCalled()
		expect(reset).toHaveBeenCalledTimes(1)

		wrapper.unmount()
	})

	it('re-creates the validator when customRules change and auto-validates when dirty', async () => {
		const args = defaultArgs()
		args.modelValue.value = 'hello'
		const { result } = withSetup(() =>
			useCustomValidation(
				args.modelValue,
				args.customRules,
				args.customWarningRules,
				args.customSuccessRules,
				args.errors,
				args.warnings,
				args.successes,
				args.showSuccessMessages,
				args.label,
				args.focused,
				args.isValidateOnBlur,
				args.disableErrorHandling,
			),
		)
		// Make the field dirty by validating first
		await result.validate()
		expect(args.errors.value).toEqual([])

		// Change rules to minLength that the value doesn't satisfy
		args.customRules.value = [{
			type: 'minLength',
			options: { length: 20, message: 'Trop court' },
		}]
		await nextTick()

		// Should auto-validate since the field was already dirty (had successes)
		expect(args.errors.value.length).toBeGreaterThan(0)
	})

	it('re-creates the validator when label changes and auto-validates when dirty', async () => {
		const args = defaultArgs()
		args.modelValue.value = 'valid'
		args.customRules.value = []
		const { result } = withSetup(() =>
			useCustomValidation(
				args.modelValue,
				args.customRules,
				args.customWarningRules,
				args.customSuccessRules,
				args.errors,
				args.warnings,
				args.successes,
				args.showSuccessMessages,
				args.label,
				args.focused,
				args.isValidateOnBlur,
				args.disableErrorHandling,
			),
		)
		await result.validate()
		const successBefore = [...args.successes.value]
		expect(successBefore.some(s => s.includes('Nouveau champ'))).toBe(false)

		// Change label — validator should be re-created and auto-validate since dirty
		args.label.value = 'Nouveau champ'
		await nextTick()

		// Should have auto-validated with the new label
		expect(args.successes.value.some(s => s.includes('Nouveau champ'))).toBe(true)
	})

	it('re-creates the validator when disableErrorHandling changes and auto-validates when dirty', async () => {
		const args = defaultArgs()
		args.modelValue.value = ''
		const { result } = withSetup(() =>
			useCustomValidation(
				args.modelValue,
				args.customRules,
				args.customWarningRules,
				args.customSuccessRules,
				args.errors,
				args.warnings,
				args.successes,
				args.showSuccessMessages,
				args.label,
				args.focused,
				args.isValidateOnBlur,
				args.disableErrorHandling,
			),
		)
		// Validation should report errors
		await result.validate()
		expect(args.errors.value).toContain('Requis')

		// Toggle disableErrorHandling — validator re-created + auto-validates since dirty
		args.disableErrorHandling.value = true
		await nextTick()

		// Should auto-clear errors since disableErrorHandling is now true
		expect(args.errors.value).toEqual([])
	})

	it('re-creates the validator when showSuccessMessages changes and auto-validates when dirty', async () => {
		const args = defaultArgs()
		args.customRules.value = []
		args.modelValue.value = 'valid'
		const { result } = withSetup(() =>
			useCustomValidation(
				args.modelValue,
				args.customRules,
				args.customWarningRules,
				args.customSuccessRules,
				args.errors,
				args.warnings,
				args.successes,
				args.showSuccessMessages,
				args.label,
				args.focused,
				args.isValidateOnBlur,
				args.disableErrorHandling,
			),
		)

		await result.validate()
		expect(args.successes.value.length).toBeGreaterThan(0)

		// Disable success messages — validator re-created + auto-validates since dirty
		args.showSuccessMessages.value = false
		await nextTick()

		// Should auto-clear successes since showSuccessMessages is now false
		expect(args.successes.value).toEqual([])
	})

	it('validate() returns a result with the correct structure', async () => {
		const args = defaultArgs()
		args.modelValue.value = ''
		const { result } = withSetup(() =>
			useCustomValidation(
				args.modelValue,
				args.customRules,
				args.customWarningRules,
				args.customSuccessRules,
				args.errors,
				args.warnings,
				args.successes,
				args.showSuccessMessages,
				args.label,
				args.focused,
				args.isValidateOnBlur,
				args.disableErrorHandling,
			),
		)
		const validationResult = await result.validate()

		expect(validationResult).toHaveProperty('hasError')
		expect(validationResult).toHaveProperty('hasWarning')
		expect(validationResult).toHaveProperty('hasSuccess')
		expect(validationResult).toHaveProperty('state')
		expect(validationResult.state).toHaveProperty('errors')
		expect(validationResult.state).toHaveProperty('warnings')
		expect(validationResult.state).toHaveProperty('successes')
	})

	it('validate() populates successes when value is valid and showSuccessMessages is true', async () => {
		const args = defaultArgs()
		args.modelValue.value = 'valid value'
		const { result } = withSetup(() =>
			useCustomValidation(
				args.modelValue,
				args.customRules,
				args.customWarningRules,
				args.customSuccessRules,
				args.errors,
				args.warnings,
				args.successes,
				args.showSuccessMessages,
				args.label,
				args.focused,
				args.isValidateOnBlur,
				args.disableErrorHandling,
			),
		)
		await result.validate()
		expect(args.successes.value.length).toBeGreaterThan(0)
		expect(args.errors.value).toEqual([])
	})

	it('validate() does not populate successes when showSuccessMessages is false', async () => {
		const args = defaultArgs()
		args.modelValue.value = 'valid value'
		args.showSuccessMessages.value = false
		const { result } = withSetup(() =>
			useCustomValidation(
				args.modelValue,
				args.customRules,
				args.customWarningRules,
				args.customSuccessRules,
				args.errors,
				args.warnings,
				args.successes,
				args.showSuccessMessages,
				args.label,
				args.focused,
				args.isValidateOnBlur,
				args.disableErrorHandling,
			),
		)
		const validationResult = await result.validate()
		expect(validationResult.hasSuccess).toBe(true)
		expect(args.successes.value).toEqual([])
	})

	it('works with undefined customRules', async () => {
		const args = defaultArgs()
		args.modelValue.value = 'test'
		const { result } = withSetup(() =>
			useCustomValidation(
				args.modelValue,
				undefined,
				args.customWarningRules,
				args.customSuccessRules,
				args.errors,
				args.warnings,
				args.successes,
				args.showSuccessMessages,
				args.label,
				args.focused,
				args.isValidateOnBlur,
				args.disableErrorHandling,
			),
		)
		await result.validate()
		expect(args.errors.value).toEqual([])
	})

	it('does not trigger validation on blur when focused changes to true', async () => {
		const args = defaultArgs()
		args.focused.value = false
		args.modelValue.value = ''
		withSetup(() =>
			useCustomValidation(
				args.modelValue,
				args.customRules,
				args.customWarningRules,
				args.customSuccessRules,
				args.errors,
				args.warnings,
				args.successes,
				args.showSuccessMessages,
				args.label,
				args.focused,
				args.isValidateOnBlur,
				args.disableErrorHandling,
			),
		)
		args.focused.value = true
		await nextTick()
		// Should not trigger validation when gaining focus
		expect(args.errors.value).toEqual([])
	})

	it('does not auto-validate on rule change when field is not dirty', async () => {
		const args = defaultArgs()
		args.modelValue.value = ''
		withSetup(() =>
			useCustomValidation(
				args.modelValue,
				args.customRules,
				args.customWarningRules,
				args.customSuccessRules,
				args.errors,
				args.warnings,
				args.successes,
				args.showSuccessMessages,
				args.label,
				args.focused,
				args.isValidateOnBlur,
				args.disableErrorHandling,
			),
		)
		// Don't validate first — field is pristine
		expect(args.errors.value).toEqual([])

		// Change rules — should NOT trigger validation since field was never validated
		args.customRules.value = [{
			type: 'minLength',
			options: { length: 20, message: 'Trop court' },
		}]
		await nextTick()

		expect(args.errors.value).toEqual([])
	})

	it('validate() returns hasError true when there are errors', async () => {
		const args = defaultArgs()
		args.modelValue.value = ''
		const { result } = withSetup(() =>
			useCustomValidation(
				args.modelValue,
				args.customRules,
				args.customWarningRules,
				args.customSuccessRules,
				args.errors,
				args.warnings,
				args.successes,
				args.showSuccessMessages,
				args.label,
				args.focused,
				args.isValidateOnBlur,
				args.disableErrorHandling,
			),
		)
		const validationResult = await result.validate()
		expect(validationResult.hasError).toBe(true)
	})

	it('validate() returns hasError false when there are no errors', async () => {
		const args = defaultArgs()
		args.modelValue.value = 'valid'
		const { result } = withSetup(() =>
			useCustomValidation(
				args.modelValue,
				args.customRules,
				args.customWarningRules,
				args.customSuccessRules,
				args.errors,
				args.warnings,
				args.successes,
				args.showSuccessMessages,
				args.label,
				args.focused,
				args.isValidateOnBlur,
				args.disableErrorHandling,
			),
		)
		const validationResult = await result.validate()
		expect(validationResult.hasError).toBe(false)
	})

	describe('courses asynchrones', () => {
		it('un résultat async stale n\'écrase pas un résultat sync plus récent', async () => {
			let resolveSlow!: (v: boolean) => void
			const args = defaultArgs()
			args.modelValue.value = 'test'
			args.customRules.value = [{
				type: 'custom',
				options: {
					validate: () => new Promise<boolean>((resolve) => { resolveSlow = resolve }),
					message: 'Erreur async stale',
				},
			}]
			const { result } = withSetup(() =>
				useCustomValidation(
					args.modelValue,
					args.customRules,
					args.customWarningRules,
					args.customSuccessRules,
					args.errors,
					args.warnings,
					args.successes,
					args.showSuccessMessages,
					args.label,
					args.focused,
					args.isValidateOnBlur,
					args.disableErrorHandling,
				),
			)

			// Lance la validation async (lente)
			const slowPromise = result.validate()

			// Remplace immédiatement par une règle sync et revalide
			args.customRules.value = [{
				type: 'custom',
				options: {
					validate: () => false,
					message: 'Erreur sync immédiate',
				},
			}]
			const fastResult = await result.validate()
			expect(fastResult.hasError).toBe(true)
			expect(args.errors.value).toContain('Erreur sync immédiate')

			// Résout la validation stale — ne doit pas écraser le résultat sync
			resolveSlow(false)
			await slowPromise

			expect(args.errors.value).toContain('Erreur sync immédiate')
			expect(args.errors.value).not.toContain('Erreur async stale')
		})

		it('un résultat async stale n\'écrase pas un résultat async plus récent', async () => {
			let resolveFirst!: (v: boolean) => void
			let resolveSecond!: (v: boolean) => void
			const args = defaultArgs()
			args.modelValue.value = 'test'
			args.customRules.value = [{
				type: 'custom',
				options: {
					validate: () => new Promise<boolean>((resolve) => { resolveFirst = resolve }),
					message: 'Erreur première',
				},
			}]
			const { result } = withSetup(() =>
				useCustomValidation(
					args.modelValue,
					args.customRules,
					args.customWarningRules,
					args.customSuccessRules,
					args.errors,
					args.warnings,
					args.successes,
					args.showSuccessMessages,
					args.label,
					args.focused,
					args.isValidateOnBlur,
					args.disableErrorHandling,
				),
			)

			const firstPromise = result.validate()

			args.customRules.value = [{
				type: 'custom',
				options: {
					validate: () => new Promise<boolean>((resolve) => { resolveSecond = resolve }),
					message: 'Erreur seconde',
				},
			}]
			const secondPromise = result.validate()

			resolveSecond(false)
			await secondPromise
			expect(args.errors.value).toContain('Erreur seconde')

			resolveFirst(false)
			await firstPromise

			expect(args.errors.value).toContain('Erreur seconde')
			expect(args.errors.value).not.toContain('Erreur première')
		})

		it('clearValidation() invalide une validation async en cours', async () => {
			let resolveSlow!: (v: boolean) => void
			const args = defaultArgs()
			args.modelValue.value = 'test'
			args.customRules.value = [{
				type: 'custom',
				options: {
					validate: () => new Promise<boolean>((resolve) => { resolveSlow = resolve }),
					message: 'Erreur async après clear',
				},
			}]
			const { result } = withSetup(() =>
				useCustomValidation(
					args.modelValue,
					args.customRules,
					args.customWarningRules,
					args.customSuccessRules,
					args.errors,
					args.warnings,
					args.successes,
					args.showSuccessMessages,
					args.label,
					args.focused,
					args.isValidateOnBlur,
					args.disableErrorHandling,
				),
			)

			const slowPromise = result.validate()

			result.clearValidation()
			expect(args.errors.value).toEqual([])

			resolveSlow(false)
			await slowPromise

			expect(args.errors.value).toEqual([])
		})

		it('le passage en readonly invalide une validation async en cours', async () => {
			let resolveSlow!: (v: boolean) => void
			const readonly = ref(false)
			const args = defaultArgs()
			args.modelValue.value = 'test'
			args.customRules.value = [{
				type: 'custom',
				options: {
					validate: () => new Promise<boolean>((resolve) => { resolveSlow = resolve }),
					message: 'Erreur async après readonly',
				},
			}]
			const { result } = withSetup(() =>
				useCustomValidation(
					args.modelValue,
					args.customRules,
					args.customWarningRules,
					args.customSuccessRules,
					args.errors,
					args.warnings,
					args.successes,
					args.showSuccessMessages,
					args.label,
					args.focused,
					args.isValidateOnBlur,
					args.disableErrorHandling,
					readonly,
				),
			)

			const slowPromise = result.validate()

			readonly.value = true
			await nextTick()

			expect(args.errors.value).toEqual([])

			resolveSlow(false)
			await slowPromise

			expect(args.errors.value).toEqual([])
		})

		it('plusieurs validate() concurrents avec des modelValues différents gardent le dernier résultat', async () => {
			const resolvers: Array<(v: boolean) => void> = []
			let callIndex = 0
			const args = defaultArgs()
			args.modelValue.value = 'a'
			args.customRules.value = [{
				type: 'custom',
				options: {
					validate: () => {
						const idx = callIndex
						callIndex++
						return new Promise<boolean>((resolve) => {
							resolvers[idx] = resolve
						})
					},
					message: 'Erreur concurrente',
				},
			}]
			const { result } = withSetup(() =>
				useCustomValidation(
					args.modelValue,
					args.customRules,
					args.customWarningRules,
					args.customSuccessRules,
					args.errors,
					args.warnings,
					args.successes,
					args.showSuccessMessages,
					args.label,
					args.focused,
					args.isValidateOnBlur,
					args.disableErrorHandling,
				),
			)

			const p1 = result.validate()
			args.modelValue.value = 'b'
			const p2 = result.validate()
			args.modelValue.value = 'c'
			const p3 = result.validate()

			resolvers[2]!(false)
			resolvers[0]!(false)
			resolvers[1]!(false)

			await Promise.all([p1, p2, p3])

			expect(args.errors.value).toContain('Erreur concurrente')
			expect(args.errors.value).toHaveLength(1)
		})
	})
})
