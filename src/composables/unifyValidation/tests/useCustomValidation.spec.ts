import { describe, it, expect } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useCustomValidation } from '../useCustomValidation'

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
		customRules: ref([{ type: 'required', options: { message: 'Requis' } }]),
		customWarningRules: ref<Array<{ type: string, options: Record<string, unknown> }>>([]),
		customSuccessRules: ref([]),
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
})
