import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import DateTextInput from '../DateTextInput/DateTextInput.vue'

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

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		expect(typeof (wrapper.vm as any).focus).toBe('function')
		// Appel réel pour couvrir le corps de la méthode (ligne 1139)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		expect(() => (wrapper.vm as any).focus()).not.toThrow()

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

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		expect(typeof (wrapper.vm as any).blur).toBe('function')
		// Appel réel pour couvrir le corps de la méthode (ligne 1142-1143)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		expect(() => (wrapper.vm as any).blur()).not.toThrow()

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
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		expect((wrapper.vm as any).validateOnSubmit).toBeDefined()

		wrapper.unmount()
	})
})
