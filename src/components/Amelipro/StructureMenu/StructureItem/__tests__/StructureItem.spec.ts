import { VueWrapper, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import type { PropType } from 'vue'
import type { Structure } from '../types'
import StructureItem from '../StructureItem.vue'
import TestHelper from '@tests/helpers/TestHelper'

const expectedPropOptions: ExpectedPropOptions<typeof StructureItem> = {
	checked: {
		type: Boolean,
		default: false,
	},
	groupName: {
		type: String,
		required: true,
	},
	item: {
		type: Object as PropType<Structure>,
		required: true,
	},
	outlineColor: {
		type: String,
		default: 'ap-black',
	},
	uniqueId: {
		type: String,
		required: true,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof StructureItem> => ({
	groupName: 'Required group name',
	item: {
		address: 'required-address',
		idNumber: 'required-unique-id-number',
		value: 'required-value',
	},
	uniqueId: 'required-unique-id',
})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof StructureItem> => ({
	checked: true,
	groupName: 'Modified group name',
	item: {
		address: 'modified-address',
		idNumber: 'modified-unique-id-number',
		value: 'modified-value',
	},
	outlineColor: 'ap-blue',
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(StructureItem)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('StructureItem', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof StructureItem>>
		beforeEach(() => {
			vueWrapper = shallowMount(StructureItem, { props: requiredPropValues() })
		})

		it('prop uniqueId sets id attribute on label', async () => {
			expect(vueWrapper.find('label').attributes('id')).toBe(`${testHelper.default('uniqueId')}-label`)
			const { uniqueId } = modifiedPropValues()
			await vueWrapper.setProps({ uniqueId })
			expect(vueWrapper.find('label').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-label`)
		})

		it('prop uniqueId sets id attribute on input', async () => {
			expect(vueWrapper.find('input').attributes('id')).toBe(testHelper.default('uniqueId'))
			const { uniqueId } = modifiedPropValues()
			await vueWrapper.setProps({ uniqueId })
			expect(vueWrapper.find('input').attributes('id')).toBe(testHelper.modified('uniqueId'))
		})

		it('prop groupName sets name attribute on input', async () => {
			expect(vueWrapper.find('input').attributes('name')).toBe(testHelper.default('groupName'))
			const { groupName } = modifiedPropValues()
			await vueWrapper.setProps({ groupName })
			expect(vueWrapper.find('input').attributes('name')).toBe(testHelper.modified('groupName'))
		})

		it('prop checked sets checked attribute on input', async () => {
			expect(vueWrapper.find('input').element.checked).toBe(testHelper.default('checked'))
			const { checked } = modifiedPropValues()
			await vueWrapper.setProps({ checked })
			expect(vueWrapper.find('input').element.checked).toBe(testHelper.modified('checked'))
		})

		it('prop outlineColor sets outline color on focus', async () => {
			const { outlineColor } = modifiedPropValues()
			await vueWrapper.setProps({ outlineColor })
			await vueWrapper.find('input').trigger('focus')
			await vueWrapper.vm.$nextTick()
			expect(vueWrapper.find('input+span').attributes('style')).toContain('outline-style: dotted; outline-width: 1px;')
		})
	})

	describe('Events', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof StructureItem>>
		beforeEach(() => {
			vueWrapper = shallowMount(StructureItem, { props: modifiedPropValues() })
		})

		it('emits select event on click', async () => {
			expect(vueWrapper.emitted('select')).toBeUndefined()
			await vueWrapper.find('input').trigger('click')
			await vueWrapper.vm.$nextTick()
			expect(vueWrapper.emitted('select')).toStrictEqual([[testHelper.modified('item').value]])
		})

		it('emits select event on keyup.space', async () => {
			await vueWrapper.find('input').trigger('keyup.space')
			await vueWrapper.vm.$nextTick()
			expect(vueWrapper.emitted('select')).toContainEqual([testHelper.modified('item').value])
		})
	})
})
