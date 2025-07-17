import { VueWrapper, mount, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import type { PropType } from 'vue'
import type { Service } from '../../ServiceBtn/types'
import ServiceMenuContent from '../ServiceMenuContent.vue'
import TestHelper from '@tests/helpers/TestHelper'

const expectedPropOptions: ExpectedPropOptions<typeof ServiceMenuContent> = {
	messageToDisplay: {
		type: String,
		default: undefined,
	},
	servicesContact: {
		type: Array as PropType<Service[]>,
		default: () => [],
	},
	servicesPatient: {
		type: Array as PropType<Service[]>,
		default: () => [],
	},
	servicesPs: {
		type: Array as PropType<Service[]>,
		required: true,
	},
	uniqueId: {
		type: String,
		required: true,
	},
}

const serviceList = (): Service[] => ([
	{
		href: '#',
		icon: 'modified-item-icon-1',
		label: 'Modified item label 1',
	},
	{
		href: '#',
		icon: 'modified-item-icon-2',
		label: 'Modified item label 2',
	},
])

const requiredPropValues = (): ComponentProps<typeof ServiceMenuContent> => ({
	servicesPs: [],
	uniqueId: 'required-unique-id',
})

const modifiedPropValues = (): ComponentProps<typeof ServiceMenuContent> => ({
	messageToDisplay: 'Modified message to display',
	servicesContact: serviceList(),
	servicesPatient: serviceList(),
	servicesPs: serviceList(),
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(ServiceMenuContent)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('ServiceMenuContent', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof ServiceMenuContent>>
		beforeEach(() => {
			vueWrapper = shallowMount(ServiceMenuContent, { props: requiredPropValues() })
		})

		it('prop uniqueId sets id attribute on nav', async () => {
			expect(vueWrapper.find('nav').attributes('id')).toBe(testHelper.default('uniqueId'))
			const { uniqueId } = modifiedPropValues()
			await vueWrapper.setProps({ uniqueId })
			expect(vueWrapper.find('nav').attributes('id')).toBe(testHelper.modified('uniqueId'))
		})
	})

	describe('Setting props should update props or attributes of inner components', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof ServiceMenuContent>>
		beforeEach(() => {
			vueWrapper = shallowMount(ServiceMenuContent, { props: requiredPropValues() })
		})

		it('prop servicesPs sets items prop on ServiceList', async () => {
			expect(vueWrapper.findComponent({ name: 'ServiceList' }).props('items')).toStrictEqual(testHelper.default('servicesPs'))
			const { servicesPs } = modifiedPropValues()
			await vueWrapper.setProps({ servicesPs })
			expect(vueWrapper.findComponent({ name: 'ServiceList' }).props('items')).toStrictEqual(testHelper.modified('servicesPs'))
		})

		it('prop uniqueId sets unique-id prop on ServiceList', async () => {
			expect(vueWrapper.findComponent({ name: 'ServiceList' }).props('uniqueId')).toBe(`${testHelper.default('uniqueId')}-ps-service-list`)
			const { uniqueId } = modifiedPropValues()
			await vueWrapper.setProps({ uniqueId })
			expect(vueWrapper.findComponent({ name: 'ServiceList' }).props('uniqueId')).toBe(`${testHelper.modified('uniqueId')}-ps-service-list`)
		})
	})

	describe('Slots', () => {
		it('displays slot content in message', async () => {
			const vueWrapper = mount(ServiceMenuContent, {
				props: requiredPropValues(),
				slots: { message: '<div id="slot-message">Slot Message</div>' },
			})
			await vueWrapper.vm.$nextTick()
			expect(vueWrapper.find('#slot-message').text()).toBe('Slot Message')
		})
	})
})
