import { type VueWrapper, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import AmeliproDisclosure from '../AmeliproDisclosure.vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import TestHelper from '@tests/helpers/TestHelper'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproDisclosure> = {
	isOpen: {
		type: Boolean,
		default: false,
	},
	title: {
		type: String,
		required: true,
	},
	uniqueId: {
		type: String,
		required: true,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproDisclosure> => ({
	title: 'required-title',
	uniqueId: 'required-unique-id',
})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproDisclosure> => ({
	isOpen: false,
	title: 'Modified title',
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(AmeliproDisclosure)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproDisclosure', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproDisclosure>>

		describe('root', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproDisclosure, { props: requiredPropValues() })
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.attributes('id')).toBe(`${testHelper.default('uniqueId')}-container`)

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.attributes('id')).toBe(`${testHelper.modified('uniqueId')}-container`)
			})
		})
	})

	describe('Setting props should update props or attributes of inner components', () => {
		describe.todo('AmeliproBtn')
	})

	describe('Slots', () => {
		describe.todo('#default')
	})
})
