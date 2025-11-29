import { VueWrapper, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import StructureBtn from '../StructureBtn.vue'
import TestHelper from '@tests/helpers/TestHelper'

const expectedPropOptions: ExpectedPropOptions<typeof StructureBtn> = {
	controls: {
		type: String,
		required: true,
	},
	selected: {
		type: Boolean,
		default: false,
	},
	tabindex: {
		type: Number,
		required: true,
	},
	uniqueId: {
		type: String,
		required: true,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof StructureBtn> => ({
	controls: 'required-controls',
	tabindex: 1,
	uniqueId: 'required-unique-id',
})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof StructureBtn> => ({
	controls: 'test-id',
	selected: true,
	tabindex: 0,
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(StructureBtn)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('StructureBtn', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof StructureBtn>>
		beforeEach(() => {
			vueWrapper = shallowMount(StructureBtn, { props: requiredPropValues() })
		})

		it('prop uniqueId sets id attribute on root button', async () => {
			expect(vueWrapper.attributes('id')).toBe(testHelper.default('uniqueId'))
			const { uniqueId } = modifiedPropValues()
			await vueWrapper.setProps({ uniqueId })
			expect(vueWrapper.attributes('id')).toBe(testHelper.modified('uniqueId'))
		})

		it('prop controls sets aria-controls attribute on root button', async () => {
			expect(vueWrapper.attributes('aria-controls')).toBe(testHelper.default('controls'))
			const { controls } = modifiedPropValues()
			await vueWrapper.setProps({ controls })
			expect(vueWrapper.attributes('aria-controls')).toBe(testHelper.modified('controls'))
		})

		it('prop selected sets aria-selected attribute on root button', async () => {
			expect(vueWrapper.attributes('aria-selected')).toBe(String(testHelper.default('selected')))
			const { selected } = modifiedPropValues()
			await vueWrapper.setProps({ selected })
			expect(vueWrapper.attributes('aria-selected')).toBe(String(testHelper.modified('selected')))
		})

		it('prop tabindex sets tabindex attribute on root button', async () => {
			expect(vueWrapper.attributes('tabindex')).toBe(String(testHelper.default('tabindex')))
			const { tabindex } = modifiedPropValues()
			await vueWrapper.setProps({ tabindex })
			expect(vueWrapper.attributes('tabindex')).toBe(String(testHelper.modified('tabindex')))
		})
	})
})
