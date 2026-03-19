import { describe, it, expect } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useValidation } from '../useValidation'

/** Run a composable inside a mounted Vue component to support lifecycle hooks. */
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

describe('useValidation (unifyValidation)', () => {
	const makeParams = (overrides = {}) => ({
		modelValue: ref<unknown>(''),
		readonly: ref(false),
		disabled: ref(false),
		required: ref(false),
		isValidateOnBlur: ref(true),
		showSuccessMessages: ref(true),
		disableErrorHandling: ref(false),
		label: ref('Mon champ'),
		focused: ref(false),
		useVuetifyValidation: false as const,
		customRules: ref([]),
		customWarningRules: ref([]),
		customSuccessRules: ref([]),
		...overrides,
	})

	describe('disableErrorHandling', () => {
		it('returns a stub with empty refs and false computed values when disableErrorHandling is true', () => {
			const params = makeParams({ disableErrorHandling: ref(true) })
			const result = useValidation(params as Parameters<typeof useValidation>[0])

			expect(result.errors.value).toEqual([])
			expect(result.warnings.value).toEqual([])
			expect(result.successes.value).toEqual([])
			expect(result.hasError.value).toBe(false)
			expect(result.hasWarning.value).toBe(false)
			expect(result.hasSuccess.value).toBe(false)
		})

		it('stub validate() always returns true when disableErrorHandling is true', async () => {
			const params = makeParams({ disableErrorHandling: ref(true) })
			const result = useValidation(params as Parameters<typeof useValidation>[0])

			const valid = await result.validate()
			expect(valid).toBe(true)
		})
	})

	describe('errorMessages / warningMessages / successMessages props', () => {
		it('syncs errorMessages to errors ref immediately via watch', async () => {
			const errorMessages = ref<string[] | null>(['Une erreur externe'])
			const params = makeParams({ errorMessages })
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			await nextTick()
			expect(result.errors.value).toContain('Une erreur externe')
		})

		it('syncs warningMessages to warnings ref immediately', async () => {
			const warningMessages = ref<string[] | null>(['Un avertissement'])
			const params = makeParams({ warningMessages })
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			await nextTick()
			expect(result.warnings.value).toContain('Un avertissement')
		})

		it('syncs successMessages to successes ref immediately', async () => {
			const successMessages = ref<string[] | null>(['Succès !'])
			const params = makeParams({ successMessages })
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			await nextTick()
			expect(result.successes.value).toContain('Succès !')
		})

		it('clears errors when errorMessages is set to null', async () => {
			const errorMessages = ref<string[] | null>(['Erreur'])
			const params = makeParams({ errorMessages })
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			await nextTick()
			expect(result.errors.value).toContain('Erreur')

			errorMessages.value = null
			await nextTick()
			expect(result.errors.value).toEqual([])
		})

		it('updates errors when errorMessages change reactively', async () => {
			const errorMessages = ref<string[] | null>(null)
			const params = makeParams({ errorMessages })
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			await nextTick()
			expect(result.errors.value).toEqual([])

			errorMessages.value = ['Nouvelle erreur']
			await nextTick()
			expect(result.errors.value).toContain('Nouvelle erreur')
		})
	})

	describe('validate()', () => {
		describe('when useVuetifyValidation = false', () => {
			it('returns true and clears state when readonly is true', async () => {
				const params = makeParams({ readonly: ref(true) })
				const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

				result.errors.value = ['Une erreur']
				const valid = await result.validate()

				expect(valid).toBe(true)
				expect(result.errors.value).toEqual([])
			})

			it('returns true and clears state when disabled is true', async () => {
				const params = makeParams({ disabled: ref(true) })
				const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

				result.errors.value = ['Une erreur']
				const valid = await result.validate()

				expect(valid).toBe(true)
				expect(result.errors.value).toEqual([])
			})

			it('returns true when custom required rule passes (non-empty value)', async () => {
				const params = makeParams({
					useVuetifyValidation: false as const,
					customRules: ref([{ type: 'required', options: { message: 'Requis' } }]),
					modelValue: ref('bonjour'),
				})
				const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

				const valid = await result.validate()
				expect(valid).toBe(true)
				expect(result.errors.value).toEqual([])
			})

			it('returns false and populates errors when custom required rule fails (empty value)', async () => {
				const params = makeParams({
					useVuetifyValidation: false as const,
					customRules: ref([{ type: 'required', options: { message: 'Requis' } }]),
					modelValue: ref(''),
				})
				const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

				const valid = await result.validate()
				expect(valid).toBe(false)
				expect(result.errors.value).toContain('Requis')
			})
		})

		describe('when useVuetifyValidation = true', () => {
			it('returns true when Vuetify required rule passes (non-empty value)', async () => {
				const params = {
					modelValue: ref<unknown>('bonjour'),
					readonly: ref(false),
					disabled: ref(false),
					required: ref(false),
					isValidateOnBlur: ref(true),
					showSuccessMessages: ref(true),
					disableErrorHandling: ref(false),
					label: ref('Mon champ'),
					focused: ref(false),
					useVuetifyValidation: true as const,
					rules: ref([(v: unknown) => !!v || 'Requis Vuetify']),
					maxErrors: ref(1),
				}
				const { result } = withSetup(() => useValidation(params))

				const valid = await result.validate()
				expect(valid).toBe(true)
			})

			it('returns false when Vuetify required rule fails (empty value)', async () => {
				const params = {
					modelValue: ref<unknown>(''),
					readonly: ref(false),
					disabled: ref(false),
					required: ref(false),
					isValidateOnBlur: ref(true),
					showSuccessMessages: ref(true),
					disableErrorHandling: ref(false),
					label: ref('Mon champ'),
					focused: ref(false),
					useVuetifyValidation: true as const,
					rules: ref([(v: unknown) => !!v || 'Requis Vuetify']),
					maxErrors: ref(1),
				}
				const { result } = withSetup(() => useValidation(params))

				const valid = await result.validate()
				expect(valid).toBe(false)
			})
		})
	})

	describe('computed hasError / hasWarning / hasSuccess', () => {
		it('hasError is true when errors array is non-empty', async () => {
			const params = makeParams()
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			result.errors.value = ['Une erreur']
			expect(result.hasError.value).toBe(true)
		})

		it('hasError is true when hasErrorProp is true', async () => {
			const params = makeParams({ hasErrorProp: ref(true) })
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			expect(result.hasError.value).toBe(true)
		})

		it('hasWarning is true when warnings array is non-empty', async () => {
			const params = makeParams()
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			result.warnings.value = ['Un avertissement']
			expect(result.hasWarning.value).toBe(true)
		})

		it('hasWarning is true when hasWarningProp is true', async () => {
			const params = makeParams({ hasWarningProp: ref(true) })
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			expect(result.hasWarning.value).toBe(true)
		})

		it('hasSuccess is true when successes are non-empty and no errors or warnings', async () => {
			const params = makeParams()
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			result.successes.value = ['Succès']
			expect(result.hasSuccess.value).toBe(true)
		})

		it('hasSuccess is falsy when there are both successes and errors', async () => {
			const params = makeParams()
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			result.successes.value = ['Succès']
			result.errors.value = ['Erreur']
			expect(result.hasSuccess.value).toBeFalsy()
		})

		it('hasSuccess is true when hasSuccessProp is true and no errors/warnings', async () => {
			const params = makeParams({ hasSuccessProp: ref(true) })
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			expect(result.hasSuccess.value).toBe(true)
		})
	})
})
