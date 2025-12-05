import { mount, shallowMount, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { AmeliproMessage } from '@/components'
import AmeliproRadioGroup from '../AmeliproRadioGroup.vue'
import type { AmeliproRadioGroupItem } from '../types'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import { type PropType } from 'vue'
import TestHelper from '@tests/helpers/TestHelper'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproRadioGroup> = {
	required: {
		type: Boolean,
		default: false,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	error: {
		type: Boolean,
		default: false,
	},
	fullHorizontal: {
		type: Boolean,
		default: false,
	},
	groupLabel: {
		type: String,
		default: '',
	},
	hiddenLabel: {
		type: Boolean,
		default: false,
	},
	horizontal: {
		type: Boolean,
		default: false,
	},
	horizontalLabel: {
		type: Boolean,
		default: false,
	},
	modelValue: {
		type: Array as PropType<AmeliproRadioGroupItem[]>,
		required: true,
	},
	pills: {
		type: Boolean,
		default: false,
	},
	requiredErrorMessage: {
		type: String,
		default: 'Ce champ est obligatoire',
	},
	uniqueId: {
		type: String,
		required: true,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproRadioGroup> => ({
	modelValue: [],
	uniqueId: 'required-unique-id',
})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproRadioGroup> => ({
	required: true,
	disabled: true,
	error: true,
	fullHorizontal: true,
	groupLabel: 'Modified group label',
	hiddenLabel: true,
	horizontal: true,
	horizontalLabel: false,
	modelValue: [
		{
			isChecked: false,
			label: 'Modified item label 1',
			value: 'modified-item-value-1',
		},
		{
			isChecked: true,
			label: 'Modified item label 2',
			value: 'modified-item-value-2',
		},
		{
			isChecked: false,
			label: 'Modified item label 3',
			value: 'modified-item-value-3',
		},
	] as AmeliproRadioGroupItem[],
	pills: true,
	requiredErrorMessage: 'Modified required error message',
	uniqueId: 'modified-unique-id',
})

const reset = [
	{
		isChecked: false,
		label: 'Modified item label 1',
		value: 'modified-item-value-1',
	},
	{
		isChecked: false,
		label: 'Modified item label 2',
		value: 'modified-item-value-2',
	},
	{
		isChecked: false,
		label: 'Modified item label 3',
		value: 'modified-item-value-3',
	},
] as AmeliproRadioGroupItem[]

const testHelper = new TestHelper(AmeliproRadioGroup)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproRadioGroup', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Events', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproRadioGroup>>
		const inputFinder = () => vueWrapper.findAll('.radio-group__item__label input')

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproRadioGroup, { props: { ...requiredPropValues(), modelValue: testHelper.modified('modelValue') } })
		})

		it('should test the input vueWrapper', () => {
			expect(inputFinder().length).toBe(3)
		})

		it('should react to change:selected event', async () => {
			expect(vueWrapper.emitted('change:selected')).toBeUndefined()

			await inputFinder().at(0)?.trigger('input')
			expect(vueWrapper.emitted('change:selected')).toStrictEqual([[
				'modified-item-value-1',
			]])

			await inputFinder().at(1)?.trigger('input')
			expect(vueWrapper.emitted('change:selected')).toStrictEqual([
				[
					'modified-item-value-1',
				],
				[
					'modified-item-value-2',
				],
			])
		})
	})

	describe('classes', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproRadioGroup>>

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproRadioGroup, { props: { ...requiredPropValues(), modelValue: testHelper.modified('modelValue') } })
		})

		// group Classes
		it('should update radio-group classes', async () => {
			const elementWrapper = vueWrapper.find('.radio-group')
			expect(elementWrapper.attributes('class')).toBe('d-flex flex-column radio-group')

			await vueWrapper.setProps({ horizontal: true })
			expect(elementWrapper.attributes('class')).toBe('d-flex flex-column radio-group')

			await vueWrapper.setProps({ horizontal: false, fullHorizontal: true })
			expect(elementWrapper.attributes('class')).toBe('d-flex flex-column radio-group flex-md-row align-md-center')

			await vueWrapper.setProps({ fullHorizontal: false, horizontal: false, horizontalLabel: true })
			expect(elementWrapper.attributes('class')).toBe('d-flex flex-column radio-group flex-md-row align-md-start')
		})

		// radioGroupClasses
		it('should update radio-group__list classes', async () => {
			const elementWrapper = vueWrapper.find('.radio-group__list')
			expect(elementWrapper.attributes('class')).toBe('d-flex flex-wrap list-style-none radio-group__list flex-column')

			await vueWrapper.setProps({ horizontal: true })
			expect(elementWrapper.attributes('class')).toBe('d-flex flex-wrap list-style-none radio-group__list flex-column flex-md-row align-md-center')

			await vueWrapper.setProps({ horizontal: false, fullHorizontal: true })
			expect(elementWrapper.attributes('class')).toBe('d-flex flex-wrap list-style-none radio-group__list flex-column flex-md-row align-md-center')
		})

		// radio Group Classes for pills version
		it('should update radio-group__list classes for pills version', async () => {
			await vueWrapper.setProps({ pills: true })
			const elementWrapper = vueWrapper.find('.radio-group__list')
			expect(elementWrapper.attributes('class')).toBe('d-flex flex-wrap list-style-none radio-group__list')

			await vueWrapper.setProps({ horizontal: true })
			expect(elementWrapper.attributes('class')).toBe('d-flex flex-wrap list-style-none radio-group__list flex-md-row align-md-center')

			await vueWrapper.setProps({ horizontal: false, fullHorizontal: true })
			expect(elementWrapper.attributes('class')).toBe('d-flex flex-wrap list-style-none radio-group__list flex-md-row align-md-center')
		})

		// label Color Classes
		it('should update radio label classes', async () => {
			const spanWrappers = vueWrapper.findAll('input + span')
			expect(spanWrappers.at(0)?.attributes('class')).toBe('text-ap-grey-darken-1')

			await vueWrapper.setProps({ disabled: true })
			expect(spanWrappers.at(0)?.attributes('class')).toBe('text-ap-grey')

			await vueWrapper.setProps({ required: true, disabled: false, error: true, modelValue: reset })
			expect(spanWrappers.at(0)?.attributes('class')).toBe('text-ap-red radio-group__item-label-span-error')
		})

		// label Color Classes for pills version
		it('should update radio label classes for pills version', async () => {
			await vueWrapper.setProps({ pills: true })
			const spanWrappers = vueWrapper.findAll('.radio-group__item__label > span')
			expect(spanWrappers.at(0)?.attributes('class')).toBe('text-ap-blue-darken-1')

			await vueWrapper.setProps({ disabled: true })
			expect(spanWrappers.at(0)?.attributes('class')).toBe('text-ap-grey-darken-1')

			await vueWrapper.setProps({ required: true, disabled: false, error: true, modelValue: reset })
			expect(spanWrappers.at(0)?.attributes('class')).toBe('text-ap-red radio-group__item-label-span-error')
		})
	})

	// TODO: réparer ces tests
	describe.skip('Slots', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproRadioGroup>>
		const inputFinder = () => vueWrapper.findAll('.radio-group__item__label input')
		const subItemsWrapper = (index: number) => vueWrapper.find(`#${modifiedPropValues().uniqueId}-subitem-${index}`)

		beforeEach(() => {
			vueWrapper = mount(AmeliproRadioGroup, {
				props: { ...requiredPropValues(), modelValue: testHelper.modified('modelValue') },
				slots: {
					'subItem-0': '<p>subItem 0</p>',
					'subItem-1': '<p>subItem 1</p>',
				},
				stubs: { AmeliproMessage },
			})
		})

		it('should test slots and aria-controls', async () => {
			// test case for item with slot but fullHorizontal or Horizontal is true
			await inputFinder().at(0)?.trigger('input')
			await vueWrapper.setProps({ fullHorizontal: true })
			expect(subItemsWrapper(0).exists()).toBe(false)
			expect(inputFinder().at(0)?.attributes('aria-controls')).toBeUndefined()

			// test case for checked item with slot
			await vueWrapper.setProps({ fullHorizontal: false })
			expect(subItemsWrapper(0).exists()).toBe(true)
			expect(inputFinder().at(0)?.attributes('aria-controls')).toBe('the-group-id-subitem-0')
			// test case for item which is not checked
			expect(subItemsWrapper(1).exists()).toBe(false)
			expect(inputFinder().at(1)?.attributes('aria-controls')).toBe('the-group-id-subitem-1')
			// test case for item without slot
			expect(subItemsWrapper(2).exists()).toBe(false)
			expect(inputFinder().at(2)?.attributes('aria-controls')).toBeUndefined()
		})
	})

	// TODO: réparer ces tests
	describe.skip('attributes', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproRadioGroup>>
		const inputFinder = () => vueWrapper.findAll('.radio-group__item__label input')

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproRadioGroup, {
				props: modifiedPropValues(),
				slots: {
					'subItem-0': '<p>subItem 0</p>',
					'subItem-1': '<p>subItem 1</p>',
				},
			})
		})

		it('should test the input vueWrapper', () => {
			expect(inputFinder().length).toBe(3)
		})

		it('should test aria-expanded value', async () => {
			await inputFinder().at(0)?.trigger('input')
			await vueWrapper.vm.$nextTick()

			// test case for item slot opened
			expect(inputFinder().at(0)?.attributes('aria-expanded')).toBe('true')
			// test case for item slot closed
			expect(inputFinder().at(1)?.attributes('aria-expanded')).toBe('false')
			// test case for item without slot
			expect(inputFinder().at(2)?.attributes('aria-expanded')).toBe(undefined)
		})
	})

	describe('errors', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproRadioGroup>>
		const inputFinder = () => vueWrapper.findAll('.radio-group__item__label input')

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproRadioGroup, { props: requiredPropValues() })
		})

		it('should display error message', async () => {
			let componentWrapper = vueWrapper.findComponent(AmeliproMessage)
			expect(componentWrapper.exists()).toBe(false)

			await vueWrapper.setProps({ required: true, error: true, modelValue: reset })
			await vueWrapper.vm.$nextTick()

			expect(inputFinder().at(0)?.attributes('aria-describedby')).toBe('required-unique-id-error')
			expect(inputFinder().at(1)?.attributes('aria-describedby')).toBe('required-unique-id-error')
			expect(inputFinder().at(2)?.attributes('aria-describedby')).toBe('required-unique-id-error')

			componentWrapper = vueWrapper.findComponent(AmeliproMessage)
			expect(componentWrapper.exists()).toBe(true)

			// TODO: ce test ne marche plus car le contenu de AmeliproMessage est vide (slot non rendu)
			// expect(componentWrapper.find('.mb-0').text()).toBe('Ce champ est obligatoire');
		})
	})
})
