import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import DateTextInput from '../DateTextInput.vue'

enableAutoUnmount(afterEach)

const validRange = '10/01/2024 - 20/01/2024'

describe('DateTextInput synchronization', () => {
	it('preserves partial text until the parent supplies a replacement', async () => {
		const wrapper = mount(DateTextInput, { props: { label: 'Période', displayRange: true } })
		await wrapper.get('input').setValue('10/01/2024 - 2')
		await flushPromises()
		expect(wrapper.get('input').element.value).toContain('10/01/2024')

		await wrapper.setProps({ modelValue: ['11/01/2024', '21/01/2024'] })
		await flushPromises()
		expect(wrapper.get('input').element.value).toBe('11/01/2024 - 21/01/2024')
		wrapper.unmount()
	})

	it('validates each range boundary once on blur after typing has settled', async () => {
		const validate = vi.fn(async () => true)
		const wrapper = mount(DateTextInput, { props: {
			label: 'Période', displayRange: true,
			customRules: [{ type: 'custom', options: { validate, message: 'Date indisponible' } }],
		} })
		await wrapper.get('input').setValue(validRange)
		await flushPromises()
		validate.mockClear()
		await wrapper.get('input').trigger('blur')
		await flushPromises()
		expect(validate).toHaveBeenCalledTimes(2)
		expect(wrapper.text()).not.toContain('Date indisponible')
		wrapper.unmount()
	})

	it('keeps a newer parent value valid when an older async rule resolves', async () => {
		let resolveOld: (valid: boolean) => void = () => {}
		const pending = new Promise<boolean>((resolve) => {
			resolveOld = resolve
		})
		const validate = vi.fn((value: unknown) => value === '10/01/2024' ? pending : true)
		const wrapper = mount(DateTextInput, { props: {
			label: 'Date',
			customRules: [{ type: 'custom', options: { validate, message: 'Ancienne date invalide' } }],
		} })
		await wrapper.setProps({ modelValue: '10/01/2024' })
		await flushPromises()
		expect(validate).toHaveBeenCalledWith('10/01/2024')
		await wrapper.setProps({ modelValue: '20/01/2024' })
		await flushPromises()
		resolveOld(false)
		await flushPromises()
		expect(wrapper.get('input').element.value).toBe('20/01/2024')
		expect(wrapper.text()).not.toContain('Ancienne date invalide')
		wrapper.unmount()
	})

	it.each([false, true])('uses replacement rules while validation is pending (Vuetify: %s)', async (useVuetifyValidation) => {
		let resolveRule: (valid: boolean) => void = () => {}
		const pending = new Promise<boolean>((resolve) => {
			resolveRule = resolve
		})
		const wrapper = mount(DateTextInput, { props: {
			label: 'Date', modelValue: '10/01/2024', useVuetifyValidation,
			customRules: [{ type: 'custom', options: { validate: () => pending, message: 'Ancienne règle' } }],
			rules: [async () => await pending ? true : 'Ancienne règle'],
		} })
		const submission = wrapper.vm.validateOnSubmit()
		await flushPromises()
		await wrapper.setProps({
			customRules: [{ type: 'custom', options: { validate: () => false, message: 'Nouvelle règle' } }],
			rules: [() => 'Nouvelle règle'],
		})
		await flushPromises()
		expect(wrapper.text()).toContain('Nouvelle règle')
		resolveRule(false)
		await submission
		await flushPromises()
		expect(wrapper.text()).toContain('Nouvelle règle')
		expect(wrapper.text()).not.toContain('Ancienne règle')
	})

	it.each([
		{ displayRange: false, useVuetifyValidation: false },
		{ displayRange: true, useVuetifyValidation: false },
		{ displayRange: false, useVuetifyValidation: true },
		{ displayRange: true, useVuetifyValidation: true },
	].flatMap(mode => (['reset', 'readonly', 'disabled', 'disableErrorHandling'] as const).map(action => ({ ...mode, action }))))('does not restore async errors after $action ($displayRange, $useVuetifyValidation)', async ({ displayRange, useVuetifyValidation, action }) => {
		let resolveRule: (valid: boolean) => void = () => {}
		const pending = new Promise<boolean>((resolve) => {
			resolveRule = resolve
		})
		const validate = vi.fn(() => pending)
		const vuetifyRule = vi.fn(async () => await pending ? true : 'Validation obsolète')
		const wrapper = mount(DateTextInput, { props: {
			label: 'Date', displayRange, useVuetifyValidation,
			rules: [vuetifyRule],
			customRules: [{ type: 'custom', options: { validate, message: 'Validation obsolète' } }],
		} })
		await wrapper.setProps({ modelValue: displayRange ? ['10/01/2024', '20/01/2024'] : '10/01/2024' })
		await flushPromises()
		const submission = wrapper.vm.validateOnSubmit()
		await flushPromises()
		if (useVuetifyValidation) expect(vuetifyRule).toHaveBeenCalled()
		else expect(validate).toHaveBeenCalledWith('10/01/2024')
		if (action === 'reset') wrapper.vm.reset()
		else await wrapper.setProps({ [action]: true })
		await flushPromises()
		resolveRule(false)
		await submission
		await flushPromises()
		if (action === 'reset') expect(wrapper.get('input').element.value).toBe('')
		expect(wrapper.text()).not.toContain('Validation obsolète')
		wrapper.unmount()
	})
})
