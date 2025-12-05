import { shallowMount, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, it, expect } from 'vitest'
import AmeliproContentLayout from '../AmeliproContentLayout.vue'
import TestHelper from '@tests/helpers/TestHelper'
import { convertToHex } from '@/utils/functions/convertToHex'

const expectedPropOptions = {
	bgColor: {
		type: String,
		default: 'ap-white',
	},
	uniqueId: {
		type: String,
		default: undefined,
	},
}

const requiredPropValues = () => ({})

const modifiedPropValues = () => ({
	bgColor: '#123456',
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(AmeliproContentLayout)
testHelper
	.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproContentLayout', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let wrapper: VueWrapper<InstanceType<typeof AmeliproContentLayout>>

		beforeEach(() => {
			wrapper = shallowMount(AmeliproContentLayout, { props: requiredPropValues() })
		})

		describe('main container', () => {
			it('prop uniqueId sets id attribute', async () => {
				expect(wrapper.attributes('id')).toBeUndefined()

				const { uniqueId } = modifiedPropValues()
				await wrapper.setProps({ uniqueId })
				expect(wrapper.attributes('id')).toBe(`${testHelper.modified('uniqueId')}-container`)
			})
			it('prop bgColor sets backgroundColor style', async () => {
				const expectedDefault = `background-color: ${convertToHex(testHelper.default('bgColor'))};`
				expect(wrapper.attributes('style')).toContain(expectedDefault)

				const { bgColor } = modifiedPropValues()
				await wrapper.setProps({ bgColor })
				const expectedModified = `background-color: ${convertToHex(testHelper.modified('bgColor'))};`
				expect(wrapper.attributes('style')).toContain(expectedModified)
			})
		})

		describe('main content', () => {
			it('prop uniqueId sets id attribute', async () => {
				const contentDiv = wrapper.find('.amelipro-content-layout__content')
				expect(contentDiv.attributes('id')).toBeUndefined()

				const { uniqueId } = modifiedPropValues()
				await wrapper.setProps({ uniqueId })
				expect(contentDiv.attributes('id')).toBe(`${testHelper.modified('uniqueId')}-content`)
			})
		})
	})

	describe('Slots', () => {
		it('displays slot content', () => {
			const wrapper = shallowMount(AmeliproContentLayout, {
				props: requiredPropValues(),
				slots: { default: '<div id="slot-content">Slot Content</div>' },
			})
			expect(wrapper.find('#slot-content').text()).toBe('Slot Content')
		})
	})
})
