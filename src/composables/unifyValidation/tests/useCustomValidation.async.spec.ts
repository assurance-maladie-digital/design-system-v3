import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, ref } from 'vue'
import { useCustomValidation } from '../useCustomValidation'
import { locales } from '../locales'
import type { ValidationRule } from '../useValidation'

enableAutoUnmount(afterEach)

function deferred() {
	let resolve: (value: boolean) => void = () => {}
	let reject: (reason: Error) => void = () => {}
	const promise = new Promise<boolean>((res, rej) => {
		resolve = res
		reject = rej
	})
	return { promise, resolve, reject }
}

function setupValidation(useVuetifyValidation = false) {
	const pending = deferred()
	const rule = vi.fn(() => pending.promise)
	const modelValue = ref<unknown>('ancienne')
	const readonly = ref(false)
	const disabled = ref(false)
	const disableErrorHandling = ref(false)
	const customRules = ref<ValidationRule[]>([{ type: 'custom', options: { validate: rule, message: 'Obsolète' } }])
	const errors = ref<string[]>([])
	const warnings = ref<string[]>([])
	const successes = ref<string[]>([])
	let controller: ReturnType<typeof useCustomValidation> | undefined
	const wrapper = mount(defineComponent({
		setup() {
			controller = useCustomValidation(
				modelValue, customRules, ref([]), ref([]), errors, warnings, successes,
				ref(true), ref('Date'), ref(false), ref(true), disableErrorHandling,
				readonly, disabled,
				{ useVuetifyValidation: ref(useVuetifyValidation), rules: ref([async () => await rule() ? true : 'Obsolète']) },
			)
			return () => null
		},
	}))
	if (!controller) throw new Error('Validation non initialisée')
	return { controller, wrapper, pending, rule, modelValue, readonly, disabled, disableErrorHandling, customRules, errors, warnings, successes }
}

describe('async validation lifecycle', () => {
	it.each([false, true])('ignores completion after clearing messages (Vuetify: %s)', async (mode) => {
		const state = setupValidation(mode)
		const result = state.controller.validate()
		state.controller.clearValidation()
		state.pending.resolve(false)
		await result
		expect(state.errors.value).toEqual([])
	})

	it.each([false, true])('ignores completion after unmount (Vuetify: %s)', async (mode) => {
		const state = setupValidation(mode)
		const result = state.controller.validate()
		state.wrapper.unmount()
		state.pending.resolve(false)
		await result
		expect(state.errors.value).toEqual([])
	})

	it.each([
		{ mode: false, flag: 'readonly' }, { mode: true, flag: 'readonly' },
		{ mode: false, flag: 'disabled' }, { mode: true, flag: 'disabled' },
		{ mode: false, flag: 'disableErrorHandling' }, { mode: true, flag: 'disableErrorHandling' },
	] as const)('ignores completion after $flag (Vuetify: $mode)', async ({ mode, flag }) => {
		const state = setupValidation(mode)
		const result = state.controller.validate()
		state[flag].value = true
		await flushPromises()
		state.pending.resolve(false)
		await result
		expect(state.errors.value).toEqual([])
	})

	it('does not attach an old blur validation to a newly edited value', async () => {
		const state = setupValidation()
		const result = state.controller.validate()
		state.modelValue.value = 'nouvelle saisie non validée'
		await flushPromises()
		state.pending.resolve(false)
		await result
		expect(state.errors.value).toEqual([])
	})

	it('revalidates replaced rules while the first validation is still pending', async () => {
		const state = setupValidation()
		const result = state.controller.validate()
		const replacement = vi.fn(() => true)
		state.customRules.value = [{ type: 'custom', options: { validate: replacement, message: 'Nouvelle règle' } }]
		await flushPromises()
		state.pending.resolve(false)
		await result
		expect(replacement).toHaveBeenCalled()
		expect(state.errors.value).toEqual([])
	})

	it.each([false, true])('preserves the newest result when validations finish in reverse order (Vuetify: %s)', async (mode) => {
		const state = setupValidation(mode)
		const first = state.controller.validate()
		state.rule.mockResolvedValueOnce(true)
		await state.controller.validate()
		state.pending.resolve(false)
		await first
		expect(state.errors.value).toEqual([])
	})

	it.each([false, true])('settles a rejected async rule (Vuetify: %s)', async (mode) => {
		const state = setupValidation(mode)
		const result = Promise.resolve(state.controller.validate())
		state.pending.reject(new Error('Service indisponible'))
		await expect(result).resolves.toMatchObject({ hasError: true })
		expect(state.errors.value).toContain(mode ? locales.invalidValue : 'Obsolète')
	})
})
