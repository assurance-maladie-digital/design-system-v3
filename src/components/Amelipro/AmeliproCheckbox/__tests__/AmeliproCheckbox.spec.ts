import { mount, shallowMount, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import AmeliproCheckbox from '../AmeliproCheckbox.vue'
import type { AmeliproCheckboxItem } from '../types'
import { AmeliproMessage } from '@/components'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import { type PropType } from 'vue'
import TestHelper from '@tests/helpers/TestHelper'
import { attachToApp } from '@tests/helpers/utils'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproCheckbox> = {
	required: {
		type: Boolean,
		default: false,
	},
	checkbox: {
		type: Object as PropType<AmeliproCheckboxItem>,
		required: true,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	errorDefault: {
		type: Boolean,
		default: false,
	},
	isSwitch: {
		type: Boolean,
		default: false,
	},
	labelLeft: {
		type: Boolean,
		default: false,
	},
	modelValue: {
		type: Boolean,
		default: false,
	},
	requiredErrorMessage: {
		type: String,
		default: 'Sélection obligatoire',
	},
	uniqueId: {
		type: String,
		required: true,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproCheckbox> => ({
	checkbox: {
		label: 'Required checkbox label',
		value: 'required-checkbox-value',
	},
	uniqueId: 'required-unique-id',
})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproCheckbox> => ({
	required: true,
	checkbox: {
		description: 'Modified checkbox description',
		label: 'Modified checkbox label',
		value: 'modified-checkbox-value',
	} as AmeliproCheckboxItem,
	disabled: true,
	errorDefault: true,
	modelValue: true,
	requiredErrorMessage: 'Modified required error message',
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(AmeliproCheckbox)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproCheckbox', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe.todo('Setting props should update attributes of inner tags')

	describe.todo('Setting props should update props or attributes of inner components')

	describe('Events', () => {
		let wrapper: VueWrapper<InstanceType<typeof AmeliproCheckbox>>
		const inputWrapper = () => wrapper.find('[role="checkbox"]')

		beforeEach(() => {
			wrapper = mount(AmeliproCheckbox, {
				attachTo: attachToApp(),
				props: {
					...requiredPropValues(),
					checkbox: {
						label: 'Exemple',
						value: 'Valeur de la checkbox',
					},
				},
			})
		})

		it('should test the input wrapper', () => {
			expect(inputWrapper().attributes()).toMatchObject({
				'aria-checked': 'false',
				'aria-disabled': 'false',
				'class': expect.stringContaining('amelipro-checkbox-input'),
				'id': testHelper.default('uniqueId'),
				'role': 'checkbox',
				'tabindex': '0',
			})
		})

		// TODO: Le contenu de emitted() semble buggé (non conforme à la doc)
		it.skip('should react to input event', async () => {
			expect(wrapper.emitted('input')).toBeUndefined()
			await inputWrapper().trigger('input')
			expect(wrapper.emitted('input')).toEqual([[true, 'Valeur de la checkbox']])
		})
	})

	describe('errors', () => {
		let wrapper: VueWrapper<InstanceType<typeof AmeliproCheckbox>>

		beforeEach(() => {
			wrapper = shallowMount(AmeliproCheckbox, {
				props: {
					...requiredPropValues(),
					checkbox: {
						description: 'The checkbox description',
						label: 'the checkbox label',
						value: 'the-checkbox-value',
					} as AmeliproCheckboxItem,
				},
			})
		})

		it.skip('should display error message', async () => {
			let componentWrapper = wrapper.findComponent(AmeliproMessage)
			expect(componentWrapper.exists()).toBe(false)

			await wrapper.setProps({ required: true })
			await wrapper.find('[role="checkbox"]').trigger('click')
			await wrapper.find('[role="checkbox"]').trigger('click')
			componentWrapper = wrapper.findComponent(AmeliproMessage)

			expect(wrapper.find('[role="checkbox"]').attributes('aria-describedby')).toBe('the-id-error The checkbox description')
			expect(componentWrapper.exists()).toBe(true)
			expect(componentWrapper.find('.mb-0').text()).toBe('Sélection obligatoire')
		})

		it('should update label color classes', async () => {
			const elementWrapper = wrapper.find('.checkbox-label')
			expect(elementWrapper.exists()).toBe(true)
			expect(elementWrapper.attributes('class')).toContain('text-ap-grey-darken-1')

			await wrapper.setProps({ disabled: true })
			expect(elementWrapper.exists()).toBe(true)
			expect(elementWrapper.attributes('class')).toContain('text-ap-grey')

			await wrapper.setProps({ disabled: false, required: true })
			await wrapper.find('[role="checkbox"]').trigger('click')
			await wrapper.find('[role="checkbox"]').trigger('click')
			expect(elementWrapper.exists()).toBe(true)
			expect(elementWrapper.attributes('class')).toContain('checkbox-label text-ap-error')
		})
	})
})
