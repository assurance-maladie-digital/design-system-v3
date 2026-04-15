import { describe, it, expect } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import type { ValidationRule } from 'vuetify'
import { useVuetifyValidation } from '../useVuetifyValidation'

/** Run a composable inside a mounted Vue component (needed for Vuetify's internal composable). */
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

describe('useVuetifyValidation', () => {
	const defaultArgs = () => ({
		modelValue: ref<unknown>(''),
		rules: ref<ValidationRule[]>([]),
		disabled: ref(false),
		errors: ref<string[]>([]),
		error: ref(false),
		errorMessages: ref<string[]>([]),
		focused: ref(false),
		maxErrors: ref(1),
		name: ref('fieldName'),
		label: ref('Mon label'),
		readonly: ref(false),
		validateOn: ref<'input' | 'blur' | 'submit'>('blur'),
	})

	it('returns a vuetify validator with a validate function', () => {
		const args = defaultArgs()
		const { result } = withSetup(() =>
			useVuetifyValidation(
				args.modelValue,
				args.rules,
				args.disabled,
				args.errors,
				args.error,
				args.errorMessages,
				args.focused,
				args.maxErrors,
				args.name,
				args.label,
				args.readonly,
				args.validateOn,
			),
		)
		expect(result).toBeDefined()
		expect(typeof result.validate).toBe('function')
	})

	it('isPristine is true before any validate() call', () => {
		const args = defaultArgs()
		args.rules.value = [(v: unknown) => !!v || 'Ce champ est requis']
		const { result } = withSetup(() =>
			useVuetifyValidation(
				args.modelValue,
				args.rules,
				args.disabled,
				args.errors,
				args.error,
				args.errorMessages,
				args.focused,
				args.maxErrors,
				args.name,
				args.label,
				args.readonly,
				args.validateOn,
			),
		)
		expect(result.isPristine.value).toBe(true)
	})

	it('errors are empty before validate() is called (isPristine guard)', async () => {
		const args = defaultArgs()
		args.rules.value = [(v: unknown) => !!v || 'Ce champ est requis']
		withSetup(() =>
			useVuetifyValidation(
				args.modelValue,
				args.rules,
				args.disabled,
				args.errors,
				args.error,
				args.errorMessages,
				args.focused,
				args.maxErrors,
				args.name,
				args.label,
				args.readonly,
				args.validateOn,
			),
		)
		await nextTick()
		expect(args.errors.value).toEqual([])
	})

	it('validate() with failing required rule populates errors', async () => {
		const args = defaultArgs()
		args.modelValue.value = ''
		args.rules.value = [(v: unknown) => !!v || 'Ce champ est requis']
		const { result } = withSetup(() =>
			useVuetifyValidation(
				args.modelValue,
				args.rules,
				args.disabled,
				args.errors,
				args.error,
				args.errorMessages,
				args.focused,
				args.maxErrors,
				args.name,
				args.label,
				args.readonly,
				args.validateOn,
			),
		)
		await result.validate()
		await nextTick()
		expect(args.errors.value).toContain('Ce champ est requis')
	})

	it('validate() with passing required rule keeps errors empty', async () => {
		const args = defaultArgs()
		args.modelValue.value = 'valid'
		args.rules.value = [(v: unknown) => !!v || 'Ce champ est requis']
		const { result } = withSetup(() =>
			useVuetifyValidation(
				args.modelValue,
				args.rules,
				args.disabled,
				args.errors,
				args.error,
				args.errorMessages,
				args.focused,
				args.maxErrors,
				args.name,
				args.label,
				args.readonly,
				args.validateOn,
			),
		)
		await result.validate()
		await nextTick()
		expect(args.errors.value).toEqual([])
	})

	it('validate() then fix value: errors are cleared on next validate()', async () => {
		const args = defaultArgs()
		args.modelValue.value = ''
		args.rules.value = [(v: unknown) => !!v || 'Ce champ est requis']
		const { result } = withSetup(() =>
			useVuetifyValidation(
				args.modelValue,
				args.rules,
				args.disabled,
				args.errors,
				args.error,
				args.errorMessages,
				args.focused,
				args.maxErrors,
				args.name,
				args.label,
				args.readonly,
				args.validateOn,
			),
		)

		await result.validate()
		await nextTick()
		expect(args.errors.value).toContain('Ce champ est requis')

		args.modelValue.value = 'some input'
		await result.validate()
		await nextTick()
		expect(args.errors.value).toEqual([])
	})
})
