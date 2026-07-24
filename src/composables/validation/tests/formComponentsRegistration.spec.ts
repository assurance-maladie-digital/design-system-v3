/* eslint-disable vue/one-component-per-file */
import { describe, it, expect, vi } from 'vitest'
import { defineComponent, h, provide, ref, type Component } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { ValidatableComponentsKey, useFormValidation } from '../useFormValidation'
import {
	SyTextField,
	SyTextArea,
	SyCheckbox,
	SyRadioGroup,
	SyCheckBoxGroup,
	SySelect,
	SyAutocomplete,
	SelectBtnField,
	NirField,
	Captcha,
	PasswordField,
	PhoneField,
	MonthPicker,
	LunarCalendar,
} from '@/components'

// Note: les composants de type DatePicker (DatePicker/ComplexDatePicker/DateTextInput)
// et PeriodField (qui s'appuie sur DatePicker) sont volontairement exclus de ce
// test : leur système de validation est en cours de refonte (a11y) et ils
// s'enregistrent via un chemin distinct. À réintégrer une fois la refonte stabilisée.

/**
 * Mounts a single field component as a child of a parent that provides a form
 * registry whose `register` function is a spy. Returns the spy so the test can
 * count how many times the field ATTEMPTED to register — regardless of any
 * de-duplication the registry might apply. A field should attempt to register
 * exactly once (no auto-register + explicit double call, no internal building
 * block leaking to the form).
 */
function mountFieldAndCountRegisterAttempts(Component: Component, props: Record<string, unknown>) {
	const register = vi.fn()
	const unregister = vi.fn()

	const Parent = defineComponent({
		name: 'FormProviderForRegistrationAttemptTest',
		setup() {
			provide(ValidatableComponentsKey, {
				register,
				unregister,
				clearAll: () => {},
				resetAll: () => {},
				components: ref([]),
			})
			return () => h(Component as never, props)
		},
	})

	const wrapper = mount(Parent)
	return { wrapper, register, unregister }
}

describe('form field components attempt to register the expected number of times', () => {
	// La plupart des champs doivent tenter de s'enregistrer exactement 1 fois
	// (auto-register via useValidation, ou appel explicite pour SyInputSelect qui
	// utilise l'ancien useValidation). NirField est l'exception acceptée : c'est
	// un champ composite dont les validations interne « nombre » et « clé »
	// s'auto-enregistrent séparément (2 tentatives).
	const cases: Array<{ name: string, component: Component, expectedAttempts?: number, props?: Record<string, unknown> }> = [
		{ name: 'SyTextField', component: SyTextField, props: { label: 'Test', modelValue: '' } },
		{ name: 'SyTextArea', component: SyTextArea, props: { label: 'Test', modelValue: '' } },
		{ name: 'SyCheckbox', component: SyCheckbox, props: { label: 'Test', modelValue: false } },
		{ name: 'SyRadioGroup', component: SyRadioGroup, props: { label: 'Test', items: [{ label: 'A', value: 'a' }] } },
		{ name: 'SyCheckBoxGroup', component: SyCheckBoxGroup, props: { label: 'Test', items: [{ label: 'A', value: 'a' }] } },
		{ name: 'SySelect', component: SySelect, props: { label: 'Test', items: [{ title: 'A', value: 'a' }] } },
		{ name: 'SyAutocomplete', component: SyAutocomplete, props: { label: 'Test', items: [{ title: 'A', value: 'a' }] } },
		{ name: 'SelectBtnField', component: SelectBtnField, props: { label: 'Test', items: [{ title: 'A', value: 'a' }] } },
		{ name: 'NirField', component: NirField, expectedAttempts: 2, props: { label: 'Test' } },
		{ name: 'Captcha', component: Captcha, props: {} },
		{ name: 'PasswordField', component: PasswordField, props: { label: 'Test', modelValue: '' } },
		{ name: 'PhoneField', component: PhoneField, props: { label: 'Test', modelValue: '' } },
		{ name: 'MonthPicker', component: MonthPicker, props: { label: 'Test' } },
		{ name: 'LunarCalendar', component: LunarCalendar, props: { label: 'Test' } },
	]

	it.each(cases)('$name attempts the expected number of registrations with the form', async (caseItem) => {
		const expected = caseItem.expectedAttempts ?? 1
		const { wrapper, register, unregister } = mountFieldAndCountRegisterAttempts(caseItem.component, caseItem.props ?? {})
		await flushPromises()

		expect(
			register,
			`${caseItem.name} should attempt to register ${expected} time(s) but attempted ${register.mock.calls.length} time(s)`,
		).toHaveBeenCalledTimes(expected)

		wrapper.unmount()
		await flushPromises()
		expect(unregister).toHaveBeenCalledTimes(expected)
	})
})

describe('multiple instances of the same component register independently', () => {
	it('two sibling SyTextField instances each register exactly once with the form', async () => {
		const Parent = defineComponent({
			name: 'FormProviderForMultipleInstances',
			setup() {
				const form = useFormValidation()
				return { form }
			},
			render() {
				// Two sibling instances of the same component. Neither is an ancestor
				// of the other, so the field-nesting guard must NOT suppress either:
				// both must register as independent entries.
				return h('div', [
					h(SyTextField, { label: 'Field A', modelValue: '' }),
					h(SyTextField, { label: 'Field B', modelValue: '' }),
				])
			},
		})

		const wrapper = mount(Parent)
		const form = (wrapper.vm as { form: ReturnType<typeof useFormValidation> }).form
		await flushPromises()

		expect(form.validatableComponents.value).toHaveLength(2)
		// Two distinct registration objects (one per instance, not the same reference).
		expect(form.validatableComponents.value[0]).not.toBe(form.validatableComponents.value[1])
		// Each keeps its own label so the form can tell them apart.
		expect(form.validatableComponents.value[0]?.$props?.label).toBe('Field A')
		expect(form.validatableComponents.value[1]?.$props?.label).toBe('Field B')

		wrapper.unmount()
		await flushPromises()
		expect(form.validatableComponents.value).toHaveLength(0)
	})
})
