import { VueWrapper, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import type { PropType } from 'vue'
import type { Service } from '../../ServiceBtn/types'
import ServiceBtn from '../../ServiceBtn/ServiceBtn.vue'
import ServiceList from '../ServiceList.vue'
import TestHelper from '@tests/helpers/TestHelper'

const expectedPropOptions: ExpectedPropOptions<typeof ServiceList> = {
	items: {
		type: Array as PropType<Service[]>,
		required: true,
	},
	serviceContact: {
		type: Boolean,
		default: false,
	},
	servicePatient: {
		type: Boolean,
		default: false,
	},
	uniqueId: {
		type: String,
		required: true,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof ServiceList> => ({
	items: [],
	uniqueId: 'required-unique-id',
})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof ServiceList> => ({
	items: [
		{
			icon: 'modified-item-icon-1',
			label: 'Modified item label 1',
		},
		{
			icon: 'modified-item-icon-2',
			label: 'Modified item label 2',
		},
	] as Service[],
	serviceContact: true,
	servicePatient: true,
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(ServiceList)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('ServiceList', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof ServiceList>>
		beforeEach(() => {
			vueWrapper = shallowMount(ServiceList, { props: requiredPropValues() })
		})

		it('prop uniqueId sets id attribute on root ul', async () => {
			expect(vueWrapper.find('ul').attributes('id')).toBe(testHelper.default('uniqueId'))
			const { uniqueId } = modifiedPropValues()
			await vueWrapper.setProps({ uniqueId })
			expect(vueWrapper.find('ul').attributes('id')).toBe(testHelper.modified('uniqueId'))
		})
	})

	describe('Setting props should update props or attributes of inner components', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof ServiceList>>
		beforeEach(() => {
			vueWrapper = shallowMount(ServiceList, { props: modifiedPropValues(), global: { stubs: { ServiceBtn } } })
		})

		it('prop items sets item prop on ServiceBtn', () => {
			const serviceBtns = vueWrapper.findAllComponents(ServiceBtn)
			expect(serviceBtns.length).toBe(modifiedPropValues().items.length)
			serviceBtns.forEach((btn, idx) => {
				expect(btn.props('item')).toEqual(modifiedPropValues().items[idx])
			})
		})

		it('prop uniqueId sets unique-id prop on ServiceBtn', () => {
			const serviceBtns = vueWrapper.findAllComponents(ServiceBtn)
			serviceBtns.forEach((btn, idx) => {
				expect(btn.props('uniqueId')).toBe(`modified-unique-id-service-patient-btn-${idx}`)
			})
		})
	})

	describe('Other', () => {
		it('renders correct number of ServiceBtn', () => {
			const vueWrapper = shallowMount(ServiceList, { props: modifiedPropValues(), global: { stubs: { ServiceBtn } } })
			expect(vueWrapper.findAllComponents(ServiceBtn).length).toBe(modifiedPropValues().items.length)
		})

		it('renders correct li ids', () => {
			const vueWrapper = shallowMount(ServiceList, { props: modifiedPropValues(), global: { stubs: { ServiceBtn } } })
			modifiedPropValues().items.forEach((_, idx) => {
				expect(vueWrapper.find(`#${testHelper.modified('uniqueId')}-item-${idx}`).exists()).toBe(true)
			})
		})
	})
})
