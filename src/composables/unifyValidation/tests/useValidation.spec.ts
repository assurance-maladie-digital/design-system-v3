/* eslint-disable vue/one-component-per-file */
import { describe, it, expect } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useValidation } from '../useValidation'
import SyForm from '@/components/Customs/SyForm/SyForm.vue'
import type { ValidationRule } from '@/composables/validation/useValidation'

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
		customRules: ref<ValidationRule[]>([]),
		customWarningRules: ref<ValidationRule[]>([]),
		customSuccessRules: ref<ValidationRule[]>([]),
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

		it('combines rule validation errors with external errorMessages', async () => {
			const errorMessages = ref<string[] | null>(['Erreur par défaut'])
			const params = makeParams({
				modelValue: ref(''),
				errorMessages,
				customRules: ref([{ type: 'required', options: { message: 'Erreur règle' } }]),
			})
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			const valid = await result.validate()
			expect(valid).toBe(false)
			expect(result.errors.value).toEqual(['Erreur règle', 'Erreur par défaut'])
			expect(result.hasError.value).toBe(true)
		})

		it('combines Vuetify rule errors with external errorMessages when useVuetifyValidation is true', async () => {
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
				rules: ref([(v: unknown) => !!v || 'Erreur règle vuetify']),
				errorMessages: ref<string[] | null>(['Erreur par défaut']),
				maxErrors: ref(2),
			}
			const { result } = withSetup(() => useValidation(params))

			const valid = await result.validate()
			expect(valid).toBe(false)
			expect(result.errors.value).toContain('Erreur règle vuetify')
			expect(result.errors.value).toContain('Erreur par défaut')
			expect(result.hasError.value).toBe(true)
		})
	})

	describe('validate()', () => {
		describe('when useVuetifyValidation = false', () => {
			it('returns true and clears state when readonly is true', async () => {
				const params = makeParams({
					readonly: ref(false),
					customRules: ref([{ type: 'required', options: { message: 'Requis readonly' } }]),
					modelValue: ref(''),
				})
				const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

				const invalid = await result.validate()
				expect(invalid).toBe(false)
				expect(result.errors.value).toContain('Requis readonly')

				params.readonly.value = true
				const valid = await result.validate()

				expect(valid).toBe(true)
				expect(result.errors.value).toEqual([])
			})

			it('returns true and clears state when disabled is true', async () => {
				const params = makeParams({
					disabled: ref(false),
					customRules: ref([{ type: 'required', options: { message: 'Requis disabled' } }]),
					modelValue: ref(''),
				})
				const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

				const invalid = await result.validate()
				expect(invalid).toBe(false)
				expect(result.errors.value).toContain('Requis disabled')

				params.disabled.value = true
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

			it('supports custom rules with validate function in options (sync)', async () => {
				const params = makeParams({
					useVuetifyValidation: false as const,
					customRules: ref([
						{
							type: 'custom',
							options: {
								validate: (value: unknown) => value === 'ok',
								message: 'Valeur personnalisée invalide',
							},
						},
					]),
					modelValue: ref('ko'),
				})
				const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

				const valid = await result.validate()
				expect(valid).toBe(false)
				expect(result.errors.value).toContain('Valeur personnalisée invalide')
			})

			it('supports custom rules with validate function in options (async)', async () => {
				const params = makeParams({
					useVuetifyValidation: false as const,
					customRules: ref([
						{
							type: 'custom',
							options: {
								validate: async (value: unknown) => value === 'ok',
								message: 'Erreur async',
							},
						},
					]),
					modelValue: ref('ko'),
				})
				const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

				const valid = await result.validate()
				expect(valid).toBe(false)
				expect(result.errors.value).toContain('Erreur async')
			})

			it('populates warnings from custom warning rules', async () => {
				const params = makeParams({
					useVuetifyValidation: false as const,
					customRules: ref([]),
					customWarningRules: ref([
						{
							type: 'custom',
							options: {
								validate: (value: unknown) => value === 'ok',
								warningMessage: 'Warning custom',
								isWarning: true,
							},
						},
					]),
					modelValue: ref('ko'),
				})
				const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

				const valid = await result.validate()
				expect(valid).toBe(true)
				expect(result.warnings.value).toContain('Warning custom')
			})

			it('populates successes from custom success rules', async () => {
				const params = makeParams({
					useVuetifyValidation: false as const,
					customRules: ref([]),
					customSuccessRules: ref([
						{
							type: 'custom',
							options: {
								validate: (value: unknown) => value === 'ok',
								successMessage: 'Succès custom',
							},
						},
					]),
					modelValue: ref('ok'),
				})
				const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

				const valid = await result.validate()
				expect(valid).toBe(true)
				expect(result.successes.value).toContain('Succès custom')
			})

			describe('blur vs input validation triggers', () => {
				it('with isValidateOnBlur=true, does not validate while focused then validates on blur', async () => {
					const params = makeParams({
						useVuetifyValidation: false as const,
						isValidateOnBlur: ref(true),
						focused: ref(true),
						modelValue: ref(''),
						customRules: ref([{ type: 'required', options: { message: 'Requis blur' } }]),
					})
					const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

					await nextTick()
					expect(result.errors.value).toEqual([])

					params.focused.value = false
					await nextTick()
					expect(result.errors.value).toContain('Requis blur')
				})

				it('with isValidateOnBlur=false, does not validate on blur (validates on input change instead)', async () => {
					const params = makeParams({
						useVuetifyValidation: false as const,
						isValidateOnBlur: ref(false),
						focused: ref(true),
						modelValue: ref('valeur initiale'),
						customRules: ref([{ type: 'required', options: { message: 'Requis blur input-mode' } }]),
					})
					const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

					await nextTick()
					expect(result.errors.value).toEqual([])

					params.focused.value = false
					await nextTick()
					expect(result.errors.value).toEqual([])

					params.modelValue.value = ''
					await nextTick()
					expect(result.errors.value).toContain('Requis blur input-mode')
				})
			})

			describe('input events', () => {
				it('with isValidateOnBlur=false, validates automatically on input change', async () => {
					const params = makeParams({
						useVuetifyValidation: false as const,
						isValidateOnBlur: ref(false),
						modelValue: ref('valeur initiale'),
						customRules: ref([{ type: 'required', options: { message: 'Requis input event' } }]),
					})
					let result!: ReturnType<typeof useValidation>
					const wrapper = mount(defineComponent({
						setup() {
							result = useValidation(params as Parameters<typeof useValidation>[0])
							const onInput = (event: Event) => {
								params.modelValue.value = (event.target as HTMLInputElement).value
							}

							return {
								modelValue: params.modelValue,
								onInput,
							}
						},
						template: `<input data-test="field" :value="modelValue" @input="onInput">`,
					}))

					await nextTick()
					expect(result.errors.value).toEqual([])

					await wrapper.get('[data-test="field"]').setValue('')
					await nextTick()
					expect(result.errors.value).toContain('Requis input event')

					wrapper.unmount()
				})

				it('with isValidateOnBlur=true, does not validate automatically on input change', async () => {
					const params = makeParams({
						useVuetifyValidation: false as const,
						isValidateOnBlur: ref(true),
						modelValue: ref('valeur initiale'),
						focused: ref(false),
						customRules: ref([{ type: 'required', options: { message: 'Requis on blur only' } }]),
					})
					let result!: ReturnType<typeof useValidation>
					const wrapper = mount(defineComponent({
						setup() {
							result = useValidation(params as Parameters<typeof useValidation>[0])
							const onInput = (event: Event) => {
								params.modelValue.value = (event.target as HTMLInputElement).value
							}
							const onFocus = () => {
								params.focused.value = true
							}
							const onBlur = () => {
								params.focused.value = false
							}

							return {
								modelValue: params.modelValue,
								onInput,
								onFocus,
								onBlur,
							}
						},
						template: `<input data-test="field" :value="modelValue" @input="onInput" @focus="onFocus" @blur="onBlur">`,
					}))

					await wrapper.get('[data-test="field"]').trigger('focus')
					await wrapper.get('[data-test="field"]').setValue('')
					await nextTick()
					expect(result.errors.value).toEqual([])

					await wrapper.get('[data-test="field"]').trigger('blur')
					await nextTick()
					expect(result.errors.value).toContain('Requis on blur only')

					wrapper.unmount()
				})
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

			it('returns false when Vuetify custom sync rule fails', async () => {
				const params = {
					modelValue: ref<unknown>('ko'),
					readonly: ref(false),
					disabled: ref(false),
					required: ref(false),
					isValidateOnBlur: ref(true),
					showSuccessMessages: ref(true),
					disableErrorHandling: ref(false),
					label: ref('Mon champ'),
					focused: ref(false),
					useVuetifyValidation: true as const,
					rules: ref([(v: unknown) => v === 'ok' || 'Erreur sync Vuetify']),
					maxErrors: ref(1),
				}
				const { result } = withSetup(() => useValidation(params))

				const valid = await result.validate()
				expect(valid).toBe(false)
				expect(result.errors.value).toContain('Erreur sync Vuetify')
			})

			it('returns true when Vuetify custom sync rule passes', async () => {
				const params = {
					modelValue: ref<unknown>('ok'),
					readonly: ref(false),
					disabled: ref(false),
					required: ref(false),
					isValidateOnBlur: ref(true),
					showSuccessMessages: ref(true),
					disableErrorHandling: ref(false),
					label: ref('Mon champ'),
					focused: ref(false),
					useVuetifyValidation: true as const,
					rules: ref([(v: unknown) => v === 'ok' || 'Erreur sync Vuetify']),
					maxErrors: ref(1),
				}
				const { result } = withSetup(() => useValidation(params))

				const valid = await result.validate()
				expect(valid).toBe(true)
				expect(result.errors.value).toEqual([])
			})

			it('returns false when Vuetify custom async rule fails', async () => {
				const params = {
					modelValue: ref<unknown>('ko'),
					readonly: ref(false),
					disabled: ref(false),
					required: ref(false),
					isValidateOnBlur: ref(true),
					showSuccessMessages: ref(true),
					disableErrorHandling: ref(false),
					label: ref('Mon champ'),
					focused: ref(false),
					useVuetifyValidation: true as const,
					rules: ref([async (v: unknown) => v === 'ok' || 'Erreur async Vuetify']),
					maxErrors: ref(1),
				}
				const { result } = withSetup(() => useValidation(params))

				const valid = await result.validate()
				expect(valid).toBe(false)
				expect(result.errors.value).toContain('Erreur async Vuetify')
			})

			it('returns true when Vuetify custom async rule passes', async () => {
				const params = {
					modelValue: ref<unknown>('ok'),
					readonly: ref(false),
					disabled: ref(false),
					required: ref(false),
					isValidateOnBlur: ref(true),
					showSuccessMessages: ref(true),
					disableErrorHandling: ref(false),
					label: ref('Mon champ'),
					focused: ref(false),
					useVuetifyValidation: true as const,
					rules: ref([async (v: unknown) => v === 'ok' || 'Erreur async Vuetify']),
					maxErrors: ref(1),
				}
				const { result } = withSetup(() => useValidation(params))

				const valid = await result.validate()
				expect(valid).toBe(true)
				expect(result.errors.value).toEqual([])
			})

			describe('input events', () => {
				it('with isValidateOnBlur=false, validates automatically on input change', async () => {
					const params = {
						modelValue: ref<unknown>('valeur initiale'),
						readonly: ref(false),
						disabled: ref(false),
						required: ref(false),
						isValidateOnBlur: ref(false),
						showSuccessMessages: ref(true),
						disableErrorHandling: ref(false),
						label: ref('Mon champ'),
						focused: ref(false),
						useVuetifyValidation: true as const,
						rules: ref([(v: unknown) => !!v || 'Requis Vuetify input event']),
						maxErrors: ref(1),
					}
					let result!: ReturnType<typeof useValidation>
					const wrapper = mount(defineComponent({
						setup() {
							result = useValidation(params)
							const onInput = (event: Event) => {
								params.modelValue.value = (event.target as HTMLInputElement).value
							}

							return {
								modelValue: params.modelValue,
								onInput,
							}
						},
						template: `<input data-test="vuetify-field" :value="modelValue" @input="onInput">`,
					}))

					await nextTick()
					expect(result.errors.value).toEqual([])

					await wrapper.get('[data-test="vuetify-field"]').setValue('')
					await nextTick()
					expect(result.errors.value).toContain('Requis Vuetify input event')

					wrapper.unmount()
				})

				it('with isValidateOnBlur=true, does not validate automatically on input change but validates on blur', async () => {
					const params = {
						modelValue: ref<unknown>('valeur initiale'),
						readonly: ref(false),
						disabled: ref(false),
						required: ref(false),
						isValidateOnBlur: ref(true),
						showSuccessMessages: ref(true),
						disableErrorHandling: ref(false),
						label: ref('Mon champ'),
						focused: ref(false),
						useVuetifyValidation: true as const,
						rules: ref([(v: unknown) => !!v || 'Requis Vuetify blur event']),
						maxErrors: ref(1),
					}
					let result!: ReturnType<typeof useValidation>
					const wrapper = mount(defineComponent({
						setup() {
							result = useValidation(params)
							const onInput = (event: Event) => {
								params.modelValue.value = (event.target as HTMLInputElement).value
							}
							const onFocus = () => {
								params.focused.value = true
							}
							const onBlur = () => {
								params.focused.value = false
							}

							return {
								modelValue: params.modelValue,
								onInput,
								onFocus,
								onBlur,
							}
						},
						template: `<input data-test="vuetify-field" :value="modelValue" @input="onInput" @focus="onFocus" @blur="onBlur">`,
					}))

					await wrapper.get('[data-test="vuetify-field"]').trigger('focus')
					await wrapper.get('[data-test="vuetify-field"]').setValue('')
					await nextTick()
					expect(result.errors.value).toEqual([])

					await wrapper.get('[data-test="vuetify-field"]').trigger('blur')
					await nextTick()
					expect(result.errors.value).toContain('Requis Vuetify blur event')

					wrapper.unmount()
				})
			})
		})
	})

	describe('additional coverage', () => {
		it('clears warnings and successes when validate() short-circuits on readonly', async () => {
			const params = makeParams({
				readonly: ref(false),
				customRules: ref([{ type: 'required', options: { message: 'Requis readonly short-circuit' } }]),
				modelValue: ref(''),
			})
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			const invalid = await result.validate()
			expect(invalid).toBe(false)
			expect(result.errors.value).toContain('Requis readonly short-circuit')

			params.readonly.value = true

			const valid = await result.validate()
			expect(valid).toBe(true)
			expect(result.errors.value).toEqual([])
			expect(result.warnings.value).toEqual([])
			expect(result.successes.value).toEqual([])
		})

		it('hasSuccess is false when successes exist but warnings also exist', async () => {
			const params = makeParams({
				modelValue: ref('ok'),
				hasWarningProp: ref(true),
				customRules: ref([]),
				customSuccessRules: ref([
					{
						type: 'custom',
						options: {
							validate: (value: unknown) => value === 'ok',
							successMessage: 'ok',
						},
					},
				]),
			})
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			await result.validate()
			expect(result.successes.value).toContain('ok')
			expect(result.hasWarning.value).toBe(true)
			expect(result.hasSuccess.value).toBeFalsy()
		})

		it('supports reactive switch between custom and Vuetify validation modes', async () => {
			const params = {
				modelValue: ref<unknown>(''),
				readonly: ref(false),
				disabled: ref(false),
				required: ref(false),
				isValidateOnBlur: ref(true),
				showSuccessMessages: ref(true),
				disableErrorHandling: ref(false),
				label: ref('Champ hybride'),
				focused: ref(false),
				useVuetifyValidation: ref(false),
				customRules: ref([{ type: 'required', options: { message: 'Erreur custom' } }]),
				customWarningRules: ref([]),
				customSuccessRules: ref([]),
				rules: ref([(v: unknown) => !!v || 'Erreur vuetify']),
				maxErrors: ref(1),
			}
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			let valid = await result.validate()
			expect(valid).toBe(false)
			expect(result.errors.value).toContain('Erreur custom')

			params.useVuetifyValidation.value = true
			valid = await result.validate()
			expect(valid).toBe(false)
			expect(result.errors.value).toContain('Erreur vuetify')
		})

		it('respects maxErrors in Vuetify mode', async () => {
			const params = {
				modelValue: ref<unknown>('x'),
				readonly: ref(false),
				disabled: ref(false),
				required: ref(false),
				isValidateOnBlur: ref(true),
				showSuccessMessages: ref(true),
				disableErrorHandling: ref(false),
				label: ref('Mon champ'),
				focused: ref(false),
				useVuetifyValidation: true as const,
				rules: ref([
					() => 'E1',
					() => 'E2',
					() => 'E3',
				]),
				maxErrors: ref(2),
			}
			const { result } = withSetup(() => useValidation(params))

			const valid = await result.validate()
			expect(valid).toBe(false)
			expect(result.errors.value).toHaveLength(2)
			expect(result.errors.value).toEqual(['E1', 'E2'])
		})
	})

	describe('vform integration', () => {
		const VForm = defineComponent({
			emits: ['submit'],
			template: `<form data-test="vform" @submit="$emit('submit', $event)"><slot /></form>`,
		})

		it('validates custom rules on VForm submit and blocks invalid state', async () => {
			const params = makeParams({
				useVuetifyValidation: false as const,
				modelValue: ref(''),
				customRules: ref([{ type: 'required', options: { message: 'Requis VForm custom' } }]),
			})

			let isValid = true
			let result!: ReturnType<typeof useValidation>

			const wrapper = mount(defineComponent({
				components: { VForm },
				setup() {
					result = useValidation(params as Parameters<typeof useValidation>[0])
					const onSubmit = async (e: Event) => {
						e.preventDefault()
						isValid = await result.validate()
					}
					const onInput = (event: Event) => {
						params.modelValue.value = (event.target as HTMLInputElement).value
					}

					return { onSubmit, modelValue: params.modelValue, onInput }
				},
				template: `
					<VForm @submit="onSubmit">
						<input data-test="field" :value="modelValue" @input="onInput">
					</VForm>
				`,
			}))

			await wrapper.get('[data-test="vform"]').trigger('submit')
			await nextTick()

			expect(isValid).toBe(false)
			expect(result.errors.value).toContain('Requis VForm custom')

			await wrapper.get('[data-test="field"]').setValue('ok')
			await wrapper.get('[data-test="vform"]').trigger('submit')
			await nextTick()

			expect(isValid).toBe(true)
			expect(result.errors.value).toEqual([])

			wrapper.unmount()
		})

		it('validates Vuetify rules on VForm submit', async () => {
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
				rules: ref([(v: unknown) => !!v || 'Requis VForm Vuetify']),
				maxErrors: ref(1),
			}

			let isValid = true
			let result!: ReturnType<typeof useValidation>

			const wrapper = mount(defineComponent({
				components: { VForm },
				setup() {
					result = useValidation(params)
					const onSubmit = async (e: Event) => {
						e.preventDefault()
						isValid = await result.validate()
					}
					const onInput = (event: Event) => {
						params.modelValue.value = (event.target as HTMLInputElement).value
					}

					return { onSubmit, modelValue: params.modelValue, onInput }
				},
				template: `
					<VForm @submit="onSubmit">
						<input data-test="field" :value="modelValue" @input="onInput">
					</VForm>
				`,
			}))

			await wrapper.get('[data-test="vform"]').trigger('submit')
			await nextTick()
			expect(isValid).toBe(false)
			expect(result.errors.value).toContain('Requis VForm Vuetify')

			await wrapper.get('[data-test="field"]').setValue('ok')
			await wrapper.get('[data-test="vform"]').trigger('submit')
			await nextTick()
			expect(isValid).toBe(true)

			wrapper.unmount()
		})
	})

	describe('syform integration', () => {
		it('uses SyForm validate() with a registered validatable child', async () => {
			const params = makeParams({
				useVuetifyValidation: false as const,
				modelValue: ref(''),
				customRules: ref([{ type: 'required', options: { message: 'Requis SyForm fnc' } }]),
			})

			let result!: ReturnType<typeof useValidation>

			const FieldUnderTest = defineComponent({
				setup() {
					result = useValidation(params as Parameters<typeof useValidation>[0])
					const onInput = (event: Event) => {
						params.modelValue.value = (event.target as HTMLInputElement).value
					}

					return { modelValue: params.modelValue, onInput }
				},
				template: `<input data-test="field" :value="modelValue" @input="onInput">`,
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
			expect(result.errors.value).toEqual([])

			const syFormVm = wrapper.getComponent(SyForm).vm as {
				validate: () => Promise<boolean>
				clearValidation: () => void
			}

			const invalid = await syFormVm.validate()
			expect(invalid).toBe(false)
			expect(result.errors.value).toContain('Requis SyForm fnc')

			await wrapper.get('[data-test="field"]').setValue('ok')
			const valid = await syFormVm.validate()
			expect(valid).toBe(true)

			wrapper.unmount()
		})

		it('uses SyForm clearValidation() with a registered validatable child', async () => {
			const params = makeParams({
				useVuetifyValidation: false as const,
				modelValue: ref(''),
				customRules: ref([{ type: 'required', options: { message: 'Requis SyForm clear' } }]),
			})

			let result!: ReturnType<typeof useValidation>

			const FieldUnderTest = defineComponent({
				setup() {
					result = useValidation(params as Parameters<typeof useValidation>[0])
					const onInput = (event: Event) => {
						params.modelValue.value = (event.target as HTMLInputElement).value
					}

					return { modelValue: params.modelValue, onInput }
				},
				template: `<input data-test="field" :value="modelValue" @input="onInput">`,
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
			}

			await syFormVm.validate()
			expect(result.errors.value).toContain('Requis SyForm clear')

			syFormVm.clearValidation()
			await nextTick()
			expect(result.errors.value).toEqual([])

			wrapper.unmount()
		})

		it('uses SyForm reset() with a registered validatable child — clears errors, resets modelValue and emits reset', async () => {
			const params = makeParams({
				useVuetifyValidation: false as const,
				modelValue: ref(''),
				customRules: ref([{ type: 'required', options: { message: 'Requis SyForm reset' } }]),
			})

			let result!: ReturnType<typeof useValidation>

			const FieldUnderTest = defineComponent({
				setup() {
					result = useValidation(params as Parameters<typeof useValidation>[0])
					const onInput = (event: Event) => {
						params.modelValue.value = (event.target as HTMLInputElement).value
					}

					return { modelValue: params.modelValue, onInput }
				},
				template: `<input data-test="field" :value="modelValue" @input="onInput">`,
			})

			const wrapper = mount(defineComponent({
				components: { SyForm, FieldUnderTest },
				setup() {
					const onReset = () => {
						params.modelValue.value = ''
					}

					return { onReset }
				},
				template: `
					<SyForm data-test="syform" @reset="onReset">
						<FieldUnderTest />
					</SyForm>
				`,
			}))

			await nextTick()

			const syFormVm = wrapper.getComponent(SyForm).vm as {
				validate: () => Promise<boolean>
				reset: () => void
			}

			// Fill the field then validate so errors are empty
			await wrapper.get('[data-test="field"]').setValue('filled')
			await syFormVm.validate()
			expect(result.errors.value).toEqual([])
			expect(params.modelValue.value).toBe('filled')

			// Reset: clears errors, resets modelValue via @reset handler, emits reset
			syFormVm.reset()
			await nextTick()

			expect(result.errors.value).toEqual([])
			expect(params.modelValue.value).toBe('')
			expect(wrapper.getComponent(SyForm).emitted('reset')).toHaveLength(1)

			wrapper.unmount()
		})

		it('uses SyForm reset() with useVuetifyValidation — clears errors, resets modelValue and emits reset', async () => {
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
				rules: ref([(v: unknown) => !!v || 'Requis SyForm Vuetify reset']),
				maxErrors: ref(1),
			}

			let result!: ReturnType<typeof useValidation>

			const FieldUnderTest = defineComponent({
				setup() {
					result = useValidation(params)
					const onInput = (event: Event) => {
						params.modelValue.value = (event.target as HTMLInputElement).value
					}

					return { modelValue: params.modelValue, onInput }
				},
				template: `<input data-test="field" :value="modelValue" @input="onInput">`,
			})

			const wrapper = mount(defineComponent({
				components: { SyForm, FieldUnderTest },
				setup() {
					const onReset = () => {
						params.modelValue.value = ''
					}

					return { onReset }
				},
				template: `
					<SyForm data-test="syform" @reset="onReset">
						<FieldUnderTest />
					</SyForm>
				`,
			}))

			await nextTick()

			const syFormVm = wrapper.getComponent(SyForm).vm as {
				validate: () => Promise<boolean>
				reset: () => void
			}

			// Fill the field then validate so errors are empty
			await wrapper.get('[data-test="field"]').setValue('filled')
			await syFormVm.validate()
			expect(result.errors.value).toEqual([])
			expect(params.modelValue.value).toBe('filled')

			// Reset: clears errors, resets modelValue via @reset handler, emits reset
			syFormVm.reset()
			await nextTick()

			expect(result.errors.value).toEqual([])
			expect(params.modelValue.value).toBe('')
			expect(wrapper.getComponent(SyForm).emitted('reset')).toHaveLength(1)

			wrapper.unmount()
		})

		it('validates custom rules when SyForm emits submit', async () => {
			const params = makeParams({
				useVuetifyValidation: false as const,
				modelValue: ref(''),
				customRules: ref([{ type: 'required', options: { message: 'Requis SyForm custom' } }]),
			})

			let isValid = true
			let result!: ReturnType<typeof useValidation>

			const wrapper = mount(defineComponent({
				components: { SyForm },
				setup() {
					result = useValidation(params as Parameters<typeof useValidation>[0])
					const onSubmit = async () => {
						isValid = await result.validate()
					}
					const onInput = (event: Event) => {
						params.modelValue.value = (event.target as HTMLInputElement).value
					}

					return { onSubmit, modelValue: params.modelValue, onInput }
				},
				template: `
					<SyForm data-test="syform" :validate-on-submit="false" @submit="onSubmit">
						<input data-test="field" :value="modelValue" @input="onInput">
					</SyForm>
				`,
			}))

			await wrapper.get('[data-test="syform"]').trigger('submit')
			await nextTick()

			expect(isValid).toBe(false)
			expect(result.errors.value).toContain('Requis SyForm custom')

			await wrapper.get('[data-test="field"]').setValue('ok')
			await wrapper.get('[data-test="syform"]').trigger('submit')
			await nextTick()

			expect(isValid).toBe(true)
			expect(result.errors.value).toEqual([])

			wrapper.unmount()
		})

		it('validates Vuetify rules when SyForm emits submit', async () => {
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
				rules: ref([(v: unknown) => !!v || 'Requis SyForm Vuetify']),
				maxErrors: ref(1),
			}

			let isValid = true
			let result!: ReturnType<typeof useValidation>

			const wrapper = mount(defineComponent({
				components: { SyForm },
				setup() {
					result = useValidation(params)
					const onSubmit = async () => {
						isValid = await result.validate()
					}
					const onInput = (event: Event) => {
						params.modelValue.value = (event.target as HTMLInputElement).value
					}

					return { onSubmit, modelValue: params.modelValue, onInput }
				},
				template: `
					<SyForm data-test="syform" :validate-on-submit="false" @submit="onSubmit">
						<input data-test="field" :value="modelValue" @input="onInput">
					</SyForm>
				`,
			}))

			await wrapper.get('[data-test="syform"]').trigger('submit')
			await nextTick()
			expect(isValid).toBe(false)
			expect(result.errors.value).toContain('Requis SyForm Vuetify')

			await wrapper.get('[data-test="field"]').setValue('ok')
			await wrapper.get('[data-test="syform"]').trigger('submit')
			await nextTick()
			expect(isValid).toBe(true)

			wrapper.unmount()
		})

		it('emits reset and allows parent side effects from reset handler', async () => {
			const params = makeParams({
				useVuetifyValidation: false as const,
				modelValue: ref(''),
				customRules: ref([{ type: 'required', options: { message: 'Requis SyForm reset' } }]),
			})

			let result!: ReturnType<typeof useValidation>
			const resetCount = ref(0)

			const wrapper = mount(defineComponent({
				components: { SyForm },
				setup() {
					result = useValidation(params as Parameters<typeof useValidation>[0])
					const onSubmit = async () => {
						await result.validate()
					}
					const onInput = (event: Event) => {
						params.modelValue.value = (event.target as HTMLInputElement).value
					}
					const onReset = () => {
						resetCount.value += 1
						params.modelValue.value = ''
					}

					return { onSubmit, onReset, modelValue: params.modelValue, onInput }
				},
				template: `
					<SyForm data-test="syform" :validate-on-submit="false" @submit="onSubmit" @reset="onReset">
						<input data-test="field" :value="modelValue" @input="onInput">
					</SyForm>
				`,
			}))

			await wrapper.get('[data-test="syform"]').trigger('submit')
			await nextTick()
			expect(result.errors.value).toContain('Requis SyForm reset')

			await wrapper.get('[data-test="syform"]').trigger('reset')
			await nextTick()

			expect(resetCount.value).toBe(1)
			expect(params.modelValue.value).toBe('')
			expect(result.errors.value).toContain('Requis SyForm reset')

			wrapper.unmount()
		})
	})

	describe('computed hasError / hasWarning / hasSuccess', () => {
		it('hasError is true when errors array is non-empty', async () => {
			const params = makeParams({
				modelValue: ref(''),
				customRules: ref([{ type: 'required', options: { message: 'Une erreur' } }]),
			})
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			await result.validate()
			expect(result.errors.value).toContain('Une erreur')
			expect(result.hasError.value).toBe(true)
		})

		it('hasError is true when hasErrorProp is true', async () => {
			const params = makeParams({ hasErrorProp: ref(true) })
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			expect(result.hasError.value).toBe(true)
		})

		it('hasWarning is true when warnings array is non-empty', async () => {
			const params = makeParams({
				modelValue: ref('ko'),
				customRules: ref([]),
				customWarningRules: ref([
					{
						type: 'custom',
						options: {
							validate: (value: unknown) => value === 'ok',
							warningMessage: 'Un avertissement',
							isWarning: true,
						},
					},
				]),
			})
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			await result.validate()
			expect(result.warnings.value).toContain('Un avertissement')
			expect(result.hasWarning.value).toBe(true)
		})

		it('hasWarning is true when hasWarningProp is true', async () => {
			const params = makeParams({ hasWarningProp: ref(true) })
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			expect(result.hasWarning.value).toBe(true)
		})

		it('hasSuccess is true when successes are non-empty and no errors or warnings', async () => {
			const params = makeParams({
				modelValue: ref('ok'),
				customRules: ref([]),
				customSuccessRules: ref([
					{
						type: 'custom',
						options: {
							validate: (value: unknown) => value === 'ok',
							successMessage: 'Succès',
						},
					},
				]),
			})
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			await result.validate()
			expect(result.successes.value).toContain('Succès')
			expect(result.hasSuccess.value).toBe(true)
		})

		it('hasSuccess is falsy when there are both successes and errors', async () => {
			const params = makeParams({
				modelValue: ref('ok'),
				hasErrorProp: ref(true),
				customRules: ref([]),
				customSuccessRules: ref([
					{
						type: 'custom',
						options: {
							validate: (value: unknown) => value === 'ok',
							successMessage: 'Succès',
						},
					},
				]),
			})
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			await result.validate()
			expect(result.successes.value).toContain('Succès')
			expect(result.hasError.value).toBe(true)
			expect(result.hasSuccess.value).toBeFalsy()
		})

		it('hasSuccess is true when hasSuccessProp is true and no errors/warnings', async () => {
			const params = makeParams({ hasSuccessProp: ref(true) })
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			expect(result.hasSuccess.value).toBe(true)
		})
	})

	describe('auto-revalidation on config change', () => {
		it('auto-revalidates when customRules change and field is dirty', async () => {
			const params = makeParams({
				modelValue: ref('hello'),
				customRules: ref<ValidationRule[]>([{ type: 'required', options: { message: 'Requis' } }]),
			})
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			// Make the field dirty
			await result.validate()
			expect(result.errors.value).toEqual([])

			// Change rules to one the value doesn't satisfy
			params.customRules.value = [{
				type: 'minLength',
				options: { length: 20, message: 'Trop court' },
			}]
			await nextTick()

			// Should auto-validate since the field was dirty
			expect(result.errors.value.length).toBeGreaterThan(0)
		})

		it('auto-revalidates when disableErrorHandling changes and field is dirty', async () => {
			const params = makeParams({
				modelValue: ref(''),
				customRules: ref([{ type: 'required', options: { message: 'Requis' } }]),
			})
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			await result.validate()
			expect(result.errors.value).toContain('Requis')

			params.disableErrorHandling.value = true
			await nextTick()

			// Should auto-clear errors
			expect(result.errors.value).toEqual([])
		})

		it('auto-revalidates when showSuccessMessages changes and field is dirty', async () => {
			const params = makeParams({
				modelValue: ref('valid'),
				customRules: ref([]),
			})
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			await result.validate()
			expect(result.successes.value.length).toBeGreaterThan(0)

			params.showSuccessMessages.value = false
			await nextTick()

			expect(result.successes.value).toEqual([])
		})

		it('does not auto-revalidate when field is not dirty', async () => {
			const params = makeParams({
				modelValue: ref(''),
				customRules: ref([{ type: 'required', options: { message: 'Requis' } }]),
			})
			withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			// Don't validate — field is pristine
			expect(result => result).toBeDefined()

			params.customRules.value = [{
				type: 'minLength',
				options: { length: 20, message: 'Trop court' },
			}]
			await nextTick()

			// Should NOT auto-validate
			expect(params.modelValue.value).toBe('')
		})

		it('auto-revalidates when label changes and field is dirty', async () => {
			const params = makeParams({
				modelValue: ref('valid'),
				customRules: ref([]),
			})
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			await result.validate()
			expect(result.successes.value.some((s: string) => s.includes('Mon champ'))).toBe(true)

			params.label.value = 'Nouveau label'
			await nextTick()

			expect(result.successes.value.some((s: string) => s.includes('Nouveau label'))).toBe(true)
		})
	})

	describe('deduplication and message merging', () => {
		it('deduplicates errors when same message comes from rules and errorMessages', async () => {
			const params = makeParams({
				modelValue: ref(''),
				customRules: ref([{ type: 'required', options: { message: 'Requis' } }]),
				errorMessages: ref<string[] | null>(['Requis']),
			})
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			await result.validate()
			const requis = result.errors.value.filter((e: string) => e === 'Requis')
			expect(requis).toHaveLength(1)
		})

		it('merges distinct errors from rules and errorMessages', async () => {
			const params = makeParams({
				modelValue: ref(''),
				customRules: ref([{ type: 'required', options: { message: 'Champ requis' } }]),
				errorMessages: ref<string[] | null>(['Erreur externe']),
			})
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			await result.validate()
			expect(result.errors.value).toContain('Champ requis')
			expect(result.errors.value).toContain('Erreur externe')
		})

		it('merges distinct warnings from rules and warningMessages', async () => {
			const params = makeParams({
				modelValue: ref('ko'),
				customRules: ref([]),
				customWarningRules: ref([{
					type: 'custom',
					options: {
						validate: (value: unknown) => value === 'ok',
						warningMessage: 'Warning interne',
						isWarning: true,
					},
				}]),
				warningMessages: ref<string[] | null>(['Warning externe']),
			})
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			await result.validate()
			expect(result.warnings.value).toContain('Warning interne')
			expect(result.warnings.value).toContain('Warning externe')
		})

		it('keeps external successMessages even when showSuccessMessages is false', async () => {
			const params = makeParams({
				modelValue: ref('valid'),
				showSuccessMessages: ref(false),
				customRules: ref([]),
				successMessages: ref<string[] | null>(['Succès externe']),
			})
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			await result.validate()
			expect(result.hasSuccess.value).toBe(true)
			expect(result.successes.value).toContain('Succès externe')
		})

		it('hides inner successes but keeps external successMessages when showSuccessMessages is false', async () => {
			const params = makeParams({
				modelValue: ref('ok'),
				showSuccessMessages: ref(false),
				customRules: ref([]),
				customSuccessRules: ref([{
					type: 'custom',
					options: {
						validate: (value: unknown) => value === 'ok',
						successMessage: 'Succès interne',
					},
				}]),
				successMessages: ref<string[] | null>(['Succès externe']),
			})
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			await result.validate()
			expect(result.hasSuccess.value).toBe(true)
			expect(result.successes.value).not.toContain('Succès interne')
			expect(result.successes.value).toContain('Succès externe')
		})

		it('keeps hasSuccess true when inner success messages are hidden', async () => {
			const params = makeParams({
				modelValue: ref('ok'),
				showSuccessMessages: ref(false),
				customRules: ref([]),
				customSuccessRules: ref([{
					type: 'custom',
					options: {
						validate: (value: unknown) => value === 'ok',
						successMessage: 'Succès interne',
					},
				}]),
			})
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			await result.validate()
			expect(result.hasSuccess.value).toBe(true)
			expect(result.successes.value).toEqual([])
		})
	})

	describe('rules concurrences', () => {
		it('last validate() call wins when multiple calls are made rapidly', async () => {
			let resolveFirst!: (v: boolean) => void
			let resolveSecond!: (v: boolean) => void

			const firstRule = {
				type: 'custom',
				options: {
					validate: () => new Promise<boolean>((resolve) => { resolveFirst = resolve }),
					message: 'Erreur première',
				},
			}
			const secondRule = {
				type: 'custom',
				options: {
					validate: () => new Promise<boolean>((resolve) => { resolveSecond = resolve }),
					message: 'Erreur seconde',
				},
			}

			const customRules = ref<ValidationRule[]>([firstRule])
			const params = makeParams({
				modelValue: ref('test'),
				customRules,
			})
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			// First validation call (with slow-resolving rule)
			const firstPromise = result.validate()

			// Swap to a different rule and trigger second validation before first resolves
			customRules.value = [secondRule]
			const secondPromise = result.validate()

			// Resolve second first with failure (it should be the one that matters)
			resolveSecond(false)
			await secondPromise

			expect(result.errors.value).toContain('Erreur seconde')

			// Now resolve first with failure (stale — should be discarded)
			resolveFirst(false)
			await firstPromise

			// The stale first result should NOT overwrite the second
			expect(result.errors.value).toContain('Erreur seconde')
			expect(result.errors.value).not.toContain('Erreur première')
		})

		it('concurrent validate() calls with different model values keep only the latest result', async () => {
			const resolvers: Array<(v: boolean) => void> = []
			let callIndex = 0

			const params = makeParams({
				modelValue: ref<unknown>('a'),
				customRules: ref<ValidationRule[]>([{
					type: 'custom',
					options: {
						validate: () => {
							const idx = callIndex++
							return new Promise<boolean>((resolve) => {
								resolvers[idx] = resolve
							})
						},
						message: 'Erreur validation',
					},
				}]),
			})
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			// Trigger first validation with modelValue 'a'
			const p1 = result.validate()

			// Change model value and trigger second validation
			params.modelValue.value = 'b'
			const p2 = result.validate()

			// Change model value again and trigger third validation
			params.modelValue.value = 'c'
			const p3 = result.validate()

			// Resolve out of order: third fails, first fails, second fails
			resolvers[2]!(false)
			resolvers[0]!(false)
			resolvers[1]!(false)

			await Promise.all([p1, p2, p3])

			// Only the last validation (third) should populate errors
			expect(result.errors.value).toContain('Erreur validation')
			// Stale results should have been discarded (only 1 error from the latest call)
			expect(result.errors.value).toHaveLength(1)
		})

		it('multiple async error rules on the same validation collect all errors', async () => {
			const params = makeParams({
				modelValue: ref('bad'),
				customRules: ref<ValidationRule[]>([
					{
						type: 'custom',
						options: {
							validate: async () => false,
							message: 'Erreur async 1',
						},
					},
					{
						type: 'custom',
						options: {
							validate: async () => false,
							message: 'Erreur async 2',
						},
					},
					{
						type: 'custom',
						options: {
							validate: async () => false,
							message: 'Erreur async 3',
						},
					},
				]),
			})
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			const valid = await result.validate()
			expect(valid).toBe(false)
			expect(result.errors.value).toContain('Erreur async 1')
			expect(result.errors.value).toContain('Erreur async 2')
			expect(result.errors.value).toContain('Erreur async 3')
		})

		it('concurrent error, warning, and success rules resolve without interference', async () => {
			const params = makeParams({
				modelValue: ref('ok'),
				customRules: ref<ValidationRule[]>([
					{
						type: 'custom',
						options: {
							validate: async (v: unknown) => v === 'ok',
							message: 'Erreur concurrente',
						},
					},
				]),
				customWarningRules: ref<ValidationRule[]>([
					{
						type: 'custom',
						options: {
							validate: async () => false,
							warningMessage: 'Warning concurrent',
							isWarning: true,
						},
					},
				]),
				customSuccessRules: ref<ValidationRule[]>([
					{
						type: 'custom',
						options: {
							validate: async (v: unknown) => v === 'ok',
							successMessage: 'Succès concurrent',
						},
					},
				]),
			})
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			const valid = await result.validate()

			// No error since value is 'ok'
			expect(valid).toBe(true)
			expect(result.errors.value).toEqual([])

			// Warnings are populated independently
			expect(result.warnings.value).toContain('Warning concurrent')

			// Success is suppressed because warnings exist
			expect(result.hasSuccess.value).toBeFalsy()
		})

		it('mixed sync and async rules on the same field work correctly together', async () => {
			const params = makeParams({
				modelValue: ref('ab'),
				customRules: ref<ValidationRule[]>([
					{
						type: 'minLength',
						options: { length: 5, message: 'Trop court sync' },
					},
					{
						type: 'custom',
						options: {
							validate: async (v: unknown) => String(v).length >= 10,
							message: 'Trop court async',
						},
					},
					{
						type: 'custom',
						options: {
							validate: async (v: unknown) => String(v).length >= 1,
							message: 'Pas d\'erreur async',
						},
					},
				]),
			})
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			const valid = await result.validate()
			expect(valid).toBe(false)
			expect(result.errors.value).toContain('Trop court sync')
			expect(result.errors.value).toContain('Trop court async')
		})

		it('rapid re-validations on input change discard intermediate stale results', async () => {
			const resolverQueue: Array<(v: boolean) => void> = []

			const params = makeParams({
				modelValue: ref<unknown>(''),
				isValidateOnBlur: ref(false),
				customRules: ref<ValidationRule[]>([{
					type: 'custom',
					options: {
						validate: () => new Promise<boolean>((resolve) => { resolverQueue.push(resolve) }),
						message: 'Erreur stale',
					},
				}]),
			})

			let result!: ReturnType<typeof useValidation>
			const wrapper = mount(defineComponent({
				setup() {
					result = useValidation(params as Parameters<typeof useValidation>[0])
					const onInput = (event: Event) => {
						params.modelValue.value = (event.target as HTMLInputElement).value
					}

					return { modelValue: params.modelValue, onInput }
				},
				template: `<input data-test="field" :value="modelValue" @input="onInput">`,
			}))

			// Rapid sequential input changes
			await wrapper.get('[data-test="field"]').setValue('a')
			await nextTick()
			await wrapper.get('[data-test="field"]').setValue('ab')
			await nextTick()
			await wrapper.get('[data-test="field"]').setValue('abc')
			await nextTick()

			// Resolve all pending validators
			resolverQueue.forEach((resolve, i) => {
				if (i < resolverQueue.length - 1) {
					resolve(false) // Stale intermediate results fail
				}
				else {
					resolve(true) // Last one passes
				}
			})

			await nextTick()
			await nextTick()

			// Only the latest validation result should matter
			expect(result.errors.value).toEqual([])

			wrapper.unmount()
		})

		it('validate() called while previous async validation is pending replaces its results', async () => {
			let slowResolve!: (v: boolean) => void

			const params = makeParams({
				modelValue: ref('test'),
				customRules: ref<ValidationRule[]>([{
					type: 'custom',
					options: {
						validate: () => new Promise<boolean>((resolve) => { slowResolve = resolve }),
						message: 'Erreur lente obsolète',
					},
				}]),
			})
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			// Start slow async validation
			const slowPromise = result.validate()

			// Immediately swap to a sync rule and re-validate
			params.customRules.value = [{
				type: 'custom',
				options: {
					validate: () => false,
					message: 'Erreur sync immédiate',
				},
			}]
			const fastResult = await result.validate()

			expect(fastResult).toBe(false)
			expect(result.errors.value).toContain('Erreur sync immédiate')

			// Resolve slow async — should be discarded
			slowResolve(false)
			await slowPromise

			expect(result.errors.value).toContain('Erreur sync immédiate')
			expect(result.errors.value).not.toContain('Erreur lente obsolète')
		})

		it('concurrent Vuetify validations with rapid calls keep only the latest model state', async () => {
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
				rules: ref([(v: unknown) => !!v || 'Requis Vuetify concurrent']),
				maxErrors: ref(1),
			}
			const { result } = withSetup(() => useValidation(params))

			// First call — modelValue is empty, should fail
			const p1 = result.validate()
			await p1
			expect(result.errors.value).toContain('Requis Vuetify concurrent')

			// Update model value and validate again
			params.modelValue.value = 'ok'
			const p2 = result.validate()
			await p2

			// Latest result should reflect the valid state
			expect(result.errors.value).toEqual([])
			expect(result.hasError.value).toBeFalsy()
		})

		it('async error rules with varying delays all contribute to the same validation', async () => {
			const params = makeParams({
				modelValue: ref('bad'),
				customRules: ref<ValidationRule[]>([
					{
						type: 'custom',
						options: {
							validate: () => new Promise<boolean>(resolve => setTimeout(() => resolve(false), 10)),
							message: 'Erreur rapide',
						},
					},
					{
						type: 'custom',
						options: {
							validate: () => new Promise<boolean>(resolve => setTimeout(() => resolve(false), 50)),
							message: 'Erreur lente',
						},
					},
				]),
			})
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			const valid = await result.validate()
			expect(valid).toBe(false)
			expect(result.errors.value).toContain('Erreur rapide')
			expect(result.errors.value).toContain('Erreur lente')
		})

		it('concurrent async warning and success rules resolve correctly when no errors', async () => {
			const params = makeParams({
				modelValue: ref('ok'),
				customRules: ref<ValidationRule[]>([]),
				customWarningRules: ref<ValidationRule[]>([
					{
						type: 'custom',
						options: {
							validate: async (v: unknown) => v === 'perfect',
							warningMessage: 'Attention',
							isWarning: true,
						},
					},
				]),
				customSuccessRules: ref<ValidationRule[]>([
					{
						type: 'custom',
						options: {
							validate: async (v: unknown) => v === 'ok',
							successMessage: 'Bravo',
						},
					},
				]),
			})
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			await result.validate()

			expect(result.errors.value).toEqual([])
			expect(result.warnings.value).toContain('Attention')
			// Success suppressed by warning presence
			expect(result.hasSuccess.value).toBeFalsy()
		})

		it('validate() returns true immediately when readonly is toggled, even with a pending async rule', async () => {
			let resolve!: (v: boolean) => void

			const params = makeParams({
				modelValue: ref('some value'),
				customRules: ref<ValidationRule[]>([{
					type: 'custom',
					options: {
						validate: () => new Promise<boolean>((r) => { resolve = r }),
						message: 'Erreur obsolète readonly',
					},
				}]),
			})
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			// Start async validation (modelValue is non-empty so the custom rule runs)
			const p1 = result.validate()

			// Toggle readonly — next validate() should short-circuit and return true immediately
			params.readonly.value = true
			const valid = await result.validate()
			expect(valid).toBe(true)
			// Errors are cleared by the readonly short-circuit
			expect(result.errors.value).toEqual([])

			// Resolve stale async — since the readonly short-circuit does not
			// invalidate the pending token, the resolved result still writes errors
			resolve(false)
			await p1
			expect(result.errors.value).toContain('Erreur obsolète readonly')
		})
	})

	describe('async validation rules that throw errors', () => {
		it('handles thrown error in async custom rules and uses the custom message', async () => {
			const params = makeParams({
				modelValue: ref('test'),
				customRules: ref([{
					type: 'custom',
					options: {
						validate: async () => {
							throw new Error('Network error')
						},
						message: 'Erreur personnalisée',
					},
				}]),
			})
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			const valid = await result.validate()
			expect(valid).toBe(false)
			expect(result.errors.value).toContain('Erreur personnalisée')
			expect(result.hasError.value).toBe(true)
		})

		it('uses the thrown error message when no custom message is provided', async () => {
			const params = makeParams({
				modelValue: ref('test'),
				customRules: ref([{
					type: 'custom',
					options: {
						validate: async () => {
							throw new Error('Service unavailable')
						},
					},
				}]),
			})
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			const valid = await result.validate()
			expect(valid).toBe(false)
			expect(result.errors.value).toContain('Service unavailable')
			expect(result.hasError.value).toBe(true)
		})

		it('handles thrown error in async warning rules', async () => {
			const params = makeParams({
				modelValue: ref('test'),
				customWarningRules: ref([{
					type: 'custom',
					options: {
						validate: async () => {
							throw new Error('Warning service failed')
						},
						isWarning: true,
					},
				}]),
			})
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			await result.validate()
			expect(result.warnings.value).toContain('Warning service failed')
			expect(result.hasWarning.value).toBe(true)
		})

		it('handles thrown error in async success rules gracefully', async () => {
			const params = makeParams({
				modelValue: ref('test'),
				customSuccessRules: ref([{
					type: 'custom',
					options: {
						validate: async () => {
							throw new Error('Success check failed')
						},
					},
				}]),
			})
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			await result.validate()
			// The thrown error is caught and does not crash — no validation errors are surfaced
			expect(result.errors.value).toEqual([])
		})

		it('handles non-Error thrown values in async rules', async () => {
			const params = makeParams({
				modelValue: ref('test'),
				customRules: ref([{
					type: 'custom',
					options: {
						validate: async () => {
							throw 'string error'
						},
					},
				}]),
			})
			const { result } = withSetup(() => useValidation(params as Parameters<typeof useValidation>[0]))

			const valid = await result.validate()
			expect(valid).toBe(false)
			expect(result.errors.value).toContain('string error')
		})
	})
})
