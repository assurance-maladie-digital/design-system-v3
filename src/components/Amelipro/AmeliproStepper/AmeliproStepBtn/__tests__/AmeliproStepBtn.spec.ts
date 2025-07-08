import { VueWrapper, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import AmeliproStepBtn from '../AmeliproStepBtn.vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import TestHelper from '@tests/helpers/TestHelper'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproStepBtn> = {
	disabled: {
		type: Boolean,
		default: false,
	},
	isActive: {
		type: Boolean,
		default: false,
	},
	uniqueId: {
		type: String,
		default: undefined,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproStepBtn> => ({})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproStepBtn> => ({
	disabled: true,
	isActive: true,
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(AmeliproStepBtn)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproStepBtn', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update props or attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproStepBtn>>

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproStepBtn, { props: requiredPropValues() })
		})

		it('prop isActive sets aria current', async () => {
			expect(vueWrapper.find('.amelipro-step-btn').attributes('aria-current')).toBeUndefined()

			const { isActive } = modifiedPropValues()
			await vueWrapper.setProps({ isActive })
			expect(vueWrapper.find('.amelipro-step-btn').attributes('aria-current')).toBe('step')
		})

		it('prop disabled sets attribute disabled', async () => {
			expect(vueWrapper.find('.amelipro-step-btn').attributes('disabled')).toBeUndefined()

			const { disabled } = modifiedPropValues()
			await vueWrapper.setProps({ disabled })
			expect(vueWrapper.find('.amelipro-step-btn').attributes('disabled')).toBe('')
		})

		it('props disabled && isActive sets button style', async () => {
			expect(vueWrapper.find('.amelipro-step-btn').attributes('style')).toBe('background-color: #E6F6FC; border: 1px solid #DDDEDE; color: #00749C; position: relative; z-index: 1;')

			await vueWrapper.setProps({ disabled: true, isActive: true })
			expect(vueWrapper.find('.amelipro-step-btn').attributes('style')).toBe('background-color: #E6F6FC; border: 1px solid #DDDEDE; color: #00749C; position: relative; z-index: 1;')

			await vueWrapper.setProps({ disabled: false, isActive: true })
			expect(vueWrapper.find('.amelipro-step-btn').attributes('style')).toBe('background-color: #00749C; border: 1px solid #00749C; color: #FFFFFF; position: relative; z-index: 1;')

			await vueWrapper.setProps({ disabled: true, isActive: false })
			expect(vueWrapper.find('.amelipro-step-btn').attributes('style')).toBe('background-color: #DDDEDE; border: 1px solid #DDDEDE; color: #1A1B1B; position: relative; z-index: 1; cursor: default;')
		})
	})

	describe('Events', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproStepBtn>>

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproStepBtn, { props: requiredPropValues() })
		})

		it('emits an event when the button is clicked', () => {
			expect(vueWrapper.emitted('click')).toBeUndefined()
			vueWrapper.find('button').trigger('click')
			expect(vueWrapper.emitted('click')).toEqual([[]])
		})
	})
})
