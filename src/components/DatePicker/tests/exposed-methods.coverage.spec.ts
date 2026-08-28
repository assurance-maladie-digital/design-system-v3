import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import DateTextInput from '../DateTextInput/DateTextInput.vue'
import type { DateTextInputPublicApi } from '../types'

type DateTextInputVM = InstanceType<typeof DateTextInput> & DateTextInputPublicApi

/**
 * Tests pour couvrir les méthodes exposées (focus, blur)
 * Zones non couvertes : DateTextInput.vue lignes 1138-1144
 */
describe('Exposed Methods Coverage Tests', () => {
	/**
	 * Test 1 : Méthode focus() exposée
	 * Couvre ligne 1138-1140
	 */
	it('expose la méthode focus() pour le focus programmatique', async () => {
		const wrapper = mount(DateTextInput, {
			props: {
				modelValue: '',
				label: 'Date',
				format: 'DD/MM/YYYY',
			},
			attachTo: document.body,
		})

		expect(typeof (wrapper.vm as unknown as DateTextInputVM).focus).toBe('function')
		// Appel réel pour couvrir le corps de la méthode (ligne 1139)
		expect(() => (wrapper.vm as unknown as DateTextInputVM).focus()).not.toThrow()

		wrapper.unmount()
	})

	/**
	 * Test 2 : Méthode blur() exposée
	 * Couvre ligne 1142-1144
	 */
	it('expose la méthode blur() pour le blur programmatique', async () => {
		const wrapper = mount(DateTextInput, {
			props: {
				modelValue: '',
				label: 'Date',
				format: 'DD/MM/YYYY',
			},
			attachTo: document.body,
		})

		expect(typeof (wrapper.vm as unknown as DateTextInputVM).blur).toBe('function')
		// Appel réel pour couvrir le corps de la méthode (ligne 1142-1143)
		expect(() => (wrapper.vm as unknown as DateTextInputVM).blur()).not.toThrow()

		wrapper.unmount()
	})

	/**
	 * Test 3 : validateOnSubmit exposé
	 */
	it('expose validateOnSubmit pour validation externe', async () => {
		const wrapper = mount(DateTextInput, {
			props: {
				modelValue: '',
				label: 'Date',
				format: 'DD/MM/YYYY',
				required: true,
			},
		})

		// La méthode doit exister
		expect((wrapper.vm as DateTextInputVM).validateOnSubmit).toBeDefined()

		wrapper.unmount()
	})

	it('exposes the expected public API contract', () => {
		const wrapper = mount(DateTextInput, {
			props: {
				modelValue: '',
				label: 'Date',
				format: 'DD/MM/YYYY',
			},
		})

		const vm = wrapper.vm as DateTextInputVM
		expect(typeof vm.validateOnSubmit).toBe('function')
		expect(typeof vm.validate).toBe('function')
		expect(typeof vm.reset).toBe('function')
		expect(typeof vm.focus).toBe('function')
		expect(typeof vm.blur).toBe('function')
		expect(Array.isArray(vm.errors)).toBe(true)
		expect(Array.isArray(vm.warnings)).toBe(true)
		expect(Array.isArray(vm.successes)).toBe(true)

		wrapper.unmount()
	})

	it('removes focus from the native input when the exposed blur method is called', async () => {
		const wrapper = mount(DateTextInput, {
			props: {
				modelValue: '',
				label: 'Date',
				format: 'DD/MM/YYYY',
			},
			attachTo: document.body,
		})

		const input = wrapper.find('input')
		const nativeInput = input.element as HTMLInputElement
		nativeInput.focus()

		;(wrapper.vm as DateTextInputVM).blur()

		expect(document.activeElement).not.toBe(nativeInput)

		wrapper.unmount()
	})
})
