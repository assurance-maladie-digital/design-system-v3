import { VueWrapper, mount, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import AmeliproChips from '../AmeliproChips.vue'
import { AmeliproIconBtn } from '@/components'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import TestHelper from '@tests/helpers/TestHelper'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproChips> = {
	text: {
		type: String,
		required: true,
	},
	uniqueId: {
		type: String,
		required: true,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproChips> => ({
	text: 'Required text',
	uniqueId: 'required-unique-id',
})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproChips> => ({
	text: 'Modified text',
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(AmeliproChips)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproChips', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproChips>>

		describe('root', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproChips, { props: requiredPropValues() })
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.attributes('id')).toBe(testHelper.default('uniqueId'))

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.attributes('id')).toBe(testHelper.modified('uniqueId'))
			})
		})
	})

	describe('Setting props should update props or attributes of inner components', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproChips>>

		describe('AmeliproIconBtn', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproChips, { props: requiredPropValues() })
			})

			it('prop text sets prop btnLabel & attribute title', async () => {
				expect(vueWrapper.findComponent(AmeliproIconBtn).props('btnLabel')).toBe(`supprimer ${testHelper.default('text')}`)
				expect(vueWrapper.findComponent(AmeliproIconBtn).attributes('title')).toBe(`supprimer ${testHelper.default('text')}`)

				const { text } = modifiedPropValues()
				await vueWrapper.setProps({ text })
				expect(vueWrapper.findComponent(AmeliproIconBtn).props('btnLabel')).toBe(`supprimer ${testHelper.modified('text')}`)
				expect(vueWrapper.findComponent(AmeliproIconBtn).attributes('title')).toBe(`supprimer ${testHelper.modified('text')}`)
			})
		})
	})

	describe('Events', () => {
		it('emit click on click', async () => {
			const wrapper = mount(AmeliproChips, { props: modifiedPropValues() })
			expect(wrapper.emitted('click')).toBeUndefined()
			await wrapper.findComponent(AmeliproIconBtn).trigger('click')
			expect(wrapper.emitted('click')).toStrictEqual([[testHelper.modified('uniqueId')]])
		})
	})
})
