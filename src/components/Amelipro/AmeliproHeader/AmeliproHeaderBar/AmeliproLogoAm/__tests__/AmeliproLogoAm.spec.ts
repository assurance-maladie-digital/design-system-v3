import { VueWrapper, shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AmeliproLogoAm from '../AmeliproLogoAm.vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import { LogoSizeEnum } from '../LogoSizeEnum'
import TestHelper from '@tests/helpers/TestHelper'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproLogoAm> = {
	hideSignature: {
		type: Boolean,
		default: false,
	},
	size: {
		default: LogoSizeEnum.NORMAL,
		type: String,
		validator(value: string): boolean {
			return ['x-small', 'small', 'normal'].includes(value.toLowerCase())
		},
	},
	uniqueId: {
		type: String,
		default: undefined,
	},
}

const requiredPropValues = (): ComponentProps<typeof AmeliproLogoAm> => ({})

const modifiedPropValues = (): ComponentProps<typeof AmeliproLogoAm> => ({
	hideSignature: true,
	size: LogoSizeEnum.SMALL,
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(AmeliproLogoAm)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproLogoAm', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproLogoAm>>

		it('prop uniqueId sets attribute id', async () => {
			vueWrapper = shallowMount(AmeliproLogoAm, { props: {} })
			expect(vueWrapper.attributes('id')).toBeUndefined()

			const { uniqueId } = modifiedPropValues()
			await vueWrapper.setProps({ uniqueId })
			expect(vueWrapper.attributes('id')).toBe(testHelper.modified('uniqueId'))
		})

		it('prop hideSignature sets aria-label', async () => {
			vueWrapper = shallowMount(AmeliproLogoAm, { props: {} })
			const defaultLabel = vueWrapper.attributes('aria-label')
			await vueWrapper.setProps({ hideSignature: true })
			expect(vueWrapper.attributes('aria-label')).not.toBe(defaultLabel)
		})

		it('prop size sets width/height', async () => {
			vueWrapper = shallowMount(AmeliproLogoAm, { props: {} })
			const defaultWidth = vueWrapper.attributes('width')
			const defaultHeight = vueWrapper.attributes('height')
			const { size } = modifiedPropValues()
			await vueWrapper.setProps({ size })
			expect(vueWrapper.attributes('width')).not.toBe(defaultWidth)
			expect(vueWrapper.attributes('height')).not.toBe(defaultHeight)
		})
	})
})
