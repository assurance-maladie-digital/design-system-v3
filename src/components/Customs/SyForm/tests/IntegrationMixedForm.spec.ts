import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { VCheckbox, VTextField, VTextarea } from 'vuetify/components'
import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
import SyForm from '../SyForm.vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
import IntegrationMixedForm from './IntegrationMixedForm.vue'

describe('SyForm integration with mixed Synapse and Vuetify fields', () => {
	const getFormValidity = (wrapper: ReturnType<typeof mount>) =>
		wrapper.get('[data-testid="form-validity"]').text()
	const expectFormValidity = (wrapper: ReturnType<typeof mount>, value: 'null' | 'true' | 'false') =>
		expect(getFormValidity(wrapper)).toBe(value)

	const settle = async () => {
		await flushPromises()
		await nextTick()
	}

	const submit = async (wrapper: ReturnType<typeof mount>) => {
		await wrapper.find('form').trigger('submit')
		await flushPromises()
		await nextTick()
	}

	const fillRequiredFields = async (wrapper: ReturnType<typeof mount>) => {
		await wrapper.findComponent(SyTextField).find('input').setValue('Jean Dupont')
		await wrapper.findComponent(SyCheckbox).find('input').setValue(true)
		const email = wrapper.findAllComponents(VTextField)[2]!.find('input')
		await email.setValue('jean.dupont@example.com')
		await email.trigger('blur')
		const message = wrapper.findComponent(VTextarea).find('textarea')
		await message.setValue('Bonjour')
		await message.trigger('blur')
		await wrapper.findAllComponents(VCheckbox)[1]!.find('input').setValue(true)
		await settle()
	}

	describe('Live v-model', () => {
		it('transitions from null to true, false, then true as fields change', async () => {
			const wrapper = mount(IntegrationMixedForm)

			await settle()
			expectFormValidity(wrapper, 'null')

			await wrapper.findComponent(SyTextField).find('input').setValue('Jean Dupont')
			await settle()
			expectFormValidity(wrapper, 'null')

			await fillRequiredFields(wrapper)
			expectFormValidity(wrapper, 'true')

			await wrapper.findAllComponents(VTextField)[2]!.find('input').setValue('email-invalide')
			await settle()
			expectFormValidity(wrapper, 'false')

			await wrapper.findAllComponents(VTextField)[2]!.find('input').setValue('jean.dupont@example.com')
			await settle()
			expectFormValidity(wrapper, 'true')
		})

		it('ignores untouched optional fields, including prefilled valid values', async () => {
			const wrapper = mount(IntegrationMixedForm, {
				props: { initialOptionalComment: 'Commentaire charge' },
			})

			await fillRequiredFields(wrapper)

			expectFormValidity(wrapper, 'true')
		})
	})

	describe('Submission', () => {
		it('emits valid after required fields are completed', async () => {
			const wrapper = mount(IntegrationMixedForm)
			const form = wrapper.findComponent(SyForm)

			await fillRequiredFields(wrapper)
			await submit(wrapper)

			expect(form.emitted('submit')).toEqual([[{ isValid: true }]])
			expectFormValidity(wrapper, 'true')
		})

		it('emits invalid for an invalid initial field value', async () => {
			const wrapper = mount(IntegrationMixedForm, {
				props: { initialEmail: 'email-invalide' },
			})
			const form = wrapper.findComponent(SyForm)

			await wrapper.findComponent(SyTextField).find('input').setValue('Jean Dupont')
			await wrapper.findComponent(SyCheckbox).find('input').setValue(true)
			await wrapper.findComponent(VTextarea).find('textarea').setValue('Bonjour')
			await wrapper.findAllComponents(VCheckbox)[1]!.find('input').setValue(true)

			await submit(wrapper)

			expect(form.emitted('submit')).toEqual([[{ isValid: false }]])
			expectFormValidity(wrapper, 'false')
		})
	})
})
