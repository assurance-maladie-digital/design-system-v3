import SyCheckBoxGroup from '../SyCheckBoxGroup.vue'
import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'

describe('SyCheckBoxGroup', () => {
	it('should render correctly', () => {
		const wrapper = mount(SyCheckBoxGroup, {
			props: {
				label: 'Test checkbox group',
				options: [
					{ label: 'A', value: 'A', id: 'opt-a' },
					{ label: 'B', value: 'B', id: 'opt-b' },
				],
			},
		})

		expect(wrapper.find('.sy-checkbox-group').exists()).toBe(true)
		expect(wrapper.text()).toContain('Test checkbox group')
		expect(wrapper.findAll('input[type="checkbox"]').length).toBe(2)
	})

	it('should handle v-model correctly (single)', async () => {
		const wrapper = mount(SyCheckBoxGroup, {
			props: {
				'modelValue': null,
				'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
				'options': [
					{ label: 'Option A', value: 'A', id: 'opt-a' },
					{ label: 'Option B', value: 'B', id: 'opt-b' },
				],
			},
		})

		const checkboxes = wrapper.findAllComponents(SyCheckbox)
		expect(checkboxes.length).toBe(2)

		await checkboxes[0]?.find('input').setValue(true)

		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['A'])
		expect(wrapper.emitted('change')?.[0]).toEqual(['A'])

		// Uncheck
		await checkboxes[0]?.find('input').setValue(false)
		expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([null])
		expect(wrapper.emitted('change')?.[1]).toEqual([null])
	})

	it('should handle v-model correctly (multiple)', async () => {
		const wrapper = mount(SyCheckBoxGroup, {
			props: {
				'multiple': true,
				'modelValue': [],
				'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
				'options': [
					{ label: 'Option A', value: 'A', id: 'opt-a' },
					{ label: 'Option B', value: 'B', id: 'opt-b' },
				],
			},
		})

		const checkboxes = wrapper.findAllComponents(SyCheckbox)
		expect(checkboxes.length).toBe(2)

		await checkboxes[0]?.find('input').setValue(true)
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['A']])

		await checkboxes[1]?.find('input').setValue(true)
		expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([['A', 'B']])
	})

	it('should handle validation correctly (required)', async () => {
		const wrapper = mount(SyCheckBoxGroup, {
			props: {
				'modelValue': null,
				'label': 'Required CheckBoxGroup',
				'required': true,
				'isValidateOnBlur': false,
				'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
				'options': [{ label: 'X', value: 'X', id: 'opt-x' }],
			},
		})

		await wrapper.vm.validateOnSubmit()
		await nextTick()
		expect(wrapper.vm.validation.hasError.value).toBe(true)
		expect(wrapper.vm.validation.errors.value[0]).toContain('est requis')

		await wrapper.find('input').setValue(true)

		await wrapper.vm.validateOnSubmit()
		await nextTick()

		expect(wrapper.vm.validation.hasError.value).toBe(false)
		expect(wrapper.props('modelValue')).toBe('X')
	})

	it('should handle readonly and disabled states', async () => {
		const wrapper = mount(SyCheckBoxGroup, {
			props: {
				modelValue: null,
				readonly: true,
				options: [{ label: 'X', value: 'X', id: 'opt-x' }],
			},
		})

		wrapper.findComponent(SyCheckbox).vm.$emit('update:modelValue', true)
		await nextTick()
		expect(wrapper.emitted('update:modelValue')).toBeFalsy()

		await wrapper.setProps({ readonly: false, disabled: true })
		wrapper.findComponent(SyCheckbox).vm.$emit('update:modelValue', true)
		await nextTick()
		expect(wrapper.emitted('update:modelValue')).toBeFalsy()
	})

	it('should handle custom validation rules', async () => {
		const customRule = {
			type: 'custom',
			options: {
				validate: (value: unknown) => value === 'OK',
				message: 'Vous devez sélectionner une option.',
				fieldIdentifier: 'Custom CheckBoxGroup',
			},
		}

		const wrapper = mount(SyCheckBoxGroup, {
			props: {
				'modelValue': null,
				'required': true,
				'customRules': [customRule],
				'isValidateOnBlur': false,
				'options': [
					{ label: 'Non', value: 'NO', id: 'opt-no' },
					{ label: 'Oui', value: 'OK', id: 'opt-ok' },
				],
				'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
			},
		})

		const isValidInitial = await wrapper.vm.validateOnSubmit()
		expect(isValidInitial).toBe(false)
		expect(wrapper.vm.validation.errors.value).toContain('Vous devez sélectionner une option.')

		await wrapper.setProps({ modelValue: 'OK' })

		const isValidCorrect = await wrapper.vm.validateOnSubmit()
		expect(isValidCorrect).toBe(true)
		expect(wrapper.vm.validation.errors.value).toHaveLength(0)
	})
})
