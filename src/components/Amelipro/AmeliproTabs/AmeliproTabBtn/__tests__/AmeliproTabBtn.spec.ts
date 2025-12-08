import { VueWrapper, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import AmeliproTabBtn from '../AmeliproTabBtn.vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import TestHelper from '@tests/helpers/TestHelper'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproTabBtn> = {
	controls: {
		type: String,
		required: true,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	notification: {
		type: Number,
		default: undefined,
	},
	pills: {
		type: Boolean,
		default: false,
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
const requiredPropValues = (): ComponentProps<typeof AmeliproTabBtn> => ({
	controls: 'required-controls',
	tabindex: 1,
	uniqueId: 'required-unique-id',
})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproTabBtn> => ({
	controls: 'modified-controls',
	disabled: true,
	notification: 1,
	pills: true,
	selected: true,
	tabindex: 0,
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(AmeliproTabBtn)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproTabBtn', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update props or attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproTabBtn>>

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproTabBtn, { props: requiredPropValues() })
		})

		it('prop controls sets attribute aria-controls', async () => {
			expect(vueWrapper.find('.amelipro-tab__btn').attributes('aria-controls')).toBe(testHelper.default('controls'))
			await vueWrapper.setProps({ controls: testHelper.modified('controls') })
			expect(vueWrapper.find('.amelipro-tab__btn').attributes('aria-controls')).toBe(testHelper.modified('controls'))
		})

		it('prop disabled sets attribute & class disabled', async () => {
			expect(vueWrapper.find('.amelipro-tab__btn').attributes('disabled')).toBeUndefined()
			expect(vueWrapper.find('.amelipro-tab__btn').classes('disabled')).toBe(testHelper.default('disabled'))
			await vueWrapper.setProps({ disabled: testHelper.modified('disabled') })
			expect(vueWrapper.find('.amelipro-tab__btn').attributes('disabled')).toBe('')
			expect(vueWrapper.find('.amelipro-tab__btn').classes('disabled')).toBe(testHelper.modified('disabled'))
		})

		it('prop notification sets notification content', async () => {
			expect(vueWrapper.find('.amelipro-tab__btn-notification').exists()).toBe(false)
			await vueWrapper.setProps({ notification: testHelper.modified('notification') })
			expect(vueWrapper.find('.amelipro-tab__btn-notification').exists()).toBe(true)
			expect(vueWrapper.find('.amelipro-tab__btn-notification').text()).toBe(String(testHelper.modified('notification')))
		})

		it('prop pills sets button class & style', async () => {
			expect(vueWrapper.find('.amelipro-tab__btn').classes()).toEqual([
				'amelipro-tab__btn',
				'px-4',
				'py-2',
				'text-uppercase',
			])
			expect(vueWrapper.find('.amelipro-tab__btn').attributes('style')).toBe('background-color: #E6F6FC; border: 1px solid #DDDEDE; color: #00749C;')

			await vueWrapper.setProps({ pills: testHelper.modified('pills') })
			expect(vueWrapper.find('.amelipro-tab__btn').classes()).toEqual([
				'amelipro-tab__btn',
				'mr-2',
				'amelipro-tab__btn--pills',
			])
			expect(vueWrapper.find('.amelipro-tab__btn').attributes('style')).toBe('background-color: #FFFFFF; border: 1px solid #00749C; color: #00749C; margin-bottom: 8px; position: relative;')
		})

		it('prop selected sets button style', async () => {
			expect(vueWrapper.find('.amelipro-tab__btn').attributes('style')).toBe('background-color: #E6F6FC; border: 1px solid #DDDEDE; color: #00749C;')
			await vueWrapper.setProps({ selected: testHelper.modified('selected') })
			expect(vueWrapper.find('.amelipro-tab__btn').attributes('style')).toBe('background-color: #00749C; border: 1px solid #00749C; color: #FFFFFF;')
		})

		it('prop tabindex sets attribute aria-tabindex', async () => {
			expect(vueWrapper.find('.amelipro-tab__btn').attributes('tabindex')).toBe(String(testHelper.default('tabindex')))
			await vueWrapper.setProps({ tabindex: testHelper.modified('tabindex') })
			expect(vueWrapper.find('.amelipro-tab__btn').attributes('tabindex')).toBe(String(testHelper.modified('tabindex')))
		})
	})
})
