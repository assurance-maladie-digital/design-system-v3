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
})
