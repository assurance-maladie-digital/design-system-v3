import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import DateTextInput from '../DateTextInput/DateTextInput.vue'

type DateTextInputInstance = InstanceType<typeof DateTextInput>
type DateTextInputVM = DateTextInputInstance & { focus: () => void, blur: () => void }

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
		expect((wrapper.vm as DateTextInputInstance).validateOnSubmit).toBeDefined()

		wrapper.unmount()
	})
})
