import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import IntegrationTestForm from './IntegrationTestForm.vue'
import SyForm from '../SyForm.vue'

describe('SyForm integration with Synapse and Vuetify fields', () => {
	const mountForm = () => mount(IntegrationTestForm)
	const getFormValidity = (wrapper: ReturnType<typeof mount>) =>
		wrapper.get('[data-testid="form-validity"]').text()
	const expectFormValidity = (wrapper: ReturnType<typeof mount>, value: 'null' | 'true' | 'false') =>
		expect(getFormValidity(wrapper)).toBe(value)

	const validateForm = async (wrapper: ReturnType<typeof mount>) => {
		const form = wrapper.findComponent(SyForm)
		await form.vm.validate()
		await flushPromises()
		await nextTick()
	}

	const mountValidForm = async () => {
		const wrapper = mountForm()
		wrapper.vm.setValidValues()
		await nextTick()
		await validateForm(wrapper)
		expectFormValidity(wrapper, 'true')
		return wrapper
	}

	describe('Initial state', () => {
		it('keeps the v-model neutral before validation', () => {
			const wrapper = mountForm()

			expectFormValidity(wrapper, 'null')
		})

		it('sets the v-model to true when all fields are initially valid without interaction', async () => {
			const wrapper = mount(IntegrationTestForm, {
				props: { initiallyValid: true },
			})

			await flushPromises()
			await nextTick()

			expectFormValidity(wrapper, 'true')
		})

		it('sets the v-model to null for an invalid initial value without displaying an error', async () => {
			const wrapper = mount(IntegrationTestForm, {
				props: {
					initiallyValid: true,
					initialPhone: 'numero-invalide',
				},
			})

			await flushPromises()
			await nextTick()

			// Le formulaire connaît l'invalidité (validation silencieuse) mais l'erreur
			// n'est pas encore affichée : validité inconnue côté consommateur.
			expectFormValidity(wrapper, 'null')
			expect(wrapper.text()).not.toContain('Le numéro de téléphone est invalide.')
		})
	})

	describe('Imperative aggregate validation', () => {
		it('sets the v-model to false when required Synapse and Vuetify fields are empty', async () => {
			const wrapper = mountForm()

			await validateForm(wrapper)

			expectFormValidity(wrapper, 'false')
		})

		it('sets the v-model to true when all registered Synapse and Vuetify fields are valid', async () => {
			await mountValidForm()
		})

		it('transitions the v-model from true to false when a native Vuetify field becomes invalid', async () => {
			const wrapper = await mountValidForm()
			wrapper.vm.setNativeInvalidValue()
			await nextTick()

			await validateForm(wrapper)

			expectFormValidity(wrapper, 'false')
		})

		it('transitions the v-model from true to false when a registered Synapse field becomes invalid', async () => {
			const wrapper = await mountValidForm()
			wrapper.vm.setSynapseInvalidValue()
			await nextTick()

			await validateForm(wrapper)

			expectFormValidity(wrapper, 'false')
		})
	})
})
