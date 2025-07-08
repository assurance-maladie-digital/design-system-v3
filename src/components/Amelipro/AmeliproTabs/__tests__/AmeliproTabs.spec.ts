import { describe, expect, it } from 'vitest'
import AmeliproSelect from '@/components/Amelipro/AmeliproSelect/AmeliproSelect.vue'
import type { AmeliproTab } from '../types'
import AmeliproTabs from '../AmeliproTabs.vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import { DisplayTestComponent } from '@tests/helpers/utils'
import type { ExpectedPropOptions } from '@tests/types'
import type { PropType } from 'vue'
import TestHelper from '@tests/helpers/TestHelper'
import { mount } from '@vue/test-utils'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproTabs> = {
	ariaLabel: {
		type: String,
		default: undefined,
	},
	ariaLabelledby: {
		type: String,
		default: undefined,
	},
	btnGroupClasses: {
		type: String,
		default: undefined,
	},
	items: {
		type: Array as PropType<AmeliproTab[]>,
		default: () => [],
	},
	noTabDefaultStyle: {
		type: Boolean,
		default: false,
	},
	pills: {
		type: Boolean,
		default: false,
	},
	uniqueId: {
		type: String,
		required: true,
	},
	value: {
		type: Number,
		default: 0,
	},
}

const requiredPropValues = (): ComponentProps<typeof AmeliproTabs> => ({ uniqueId: 'required-unique-id' })

const modifiedPropValues = (): ComponentProps<typeof AmeliproTabs> => ({
	ariaLabel: 'Modified aria label',
	ariaLabelledby: 'modified-aria-labelledby',
	btnGroupClasses: 'modified-btn-group-classes',
	items: [
		{ disabled: false, label: 'Modified tab label 1' },
		{ disabled: false, label: 'Modified tab label 2' },
		{ disabled: false, label: 'Modified tab label 3', notification: 1 },
	],
	noTabDefaultStyle: true,
	pills: true,
	uniqueId: 'modified-unique-id',
	value: 1,
})

const testHelper = new TestHelper(AmeliproTabs)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproTabs', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	const vueWrapper = mount(AmeliproTabs, {
		autoAttach: true,
		props: modifiedPropValues(),
		stubs: { AmeliproSelect },
	})

	const displayWrapper = mount(DisplayTestComponent)

	describe.skip('getters', () => {
		it('test mobileItems', async () => {
			displayWrapper.vm.setMdAndUp(false)
			await vueWrapper.setProps({ pills: false })
			await vueWrapper.find('#test-id-select-label').trigger('click')
			expect(vueWrapper.findAll('[role="option"]').length).toStrictEqual(testHelper.modified('items').length)
			displayWrapper.vm.setMdAndUp(true)
		})
	})

	describe.skip('functions', () => {
		it('test hideSelectLabel', async () => {
			displayWrapper.vm.setMdAndUp(false)
			await vueWrapper.setProps({ pills: false })
			await vueWrapper.vm.$nextTick()
			expect(vueWrapper.find('#test-id-select-label').classes('d-sr-only')).toBeTruthy()
			displayWrapper.vm.setMdAndUp(true)
		})

		it('test setDefaultValues', async () => {
			expect(vueWrapper.find('button[aria-controls="test-id-tab-panel-0"]').attributes('tabindex')).toStrictEqual('-1')
			expect(vueWrapper.find('button[aria-controls="test-id-tab-panel-1"]').attributes('tabindex')).toStrictEqual('0')
			expect(vueWrapper.find('button[aria-controls="test-id-tab-panel-2"]').attributes('tabindex')).toStrictEqual('-1')

			expect(vueWrapper.find('#test-id-tab-panel-0').attributes('tabindex')).toStrictEqual('-1')
			expect(vueWrapper.find('#test-id-tab-panel-1').attributes('tabindex')).toStrictEqual('0')
			expect(vueWrapper.find('#test-id-tab-panel-2').attributes('tabindex')).toStrictEqual('-1')

			await vueWrapper.setProps({ value: 0 })
			await vueWrapper.vm.$nextTick()

			expect(vueWrapper.find('button[aria-controls="test-id-tab-panel-0"]').attributes('tabindex')).toStrictEqual('0')
			expect(vueWrapper.find('button[aria-controls="test-id-tab-panel-1"]').attributes('tabindex')).toStrictEqual('-1')
			expect(vueWrapper.find('button[aria-controls="test-id-tab-panel-2"]').attributes('tabindex')).toStrictEqual('-1')

			expect(vueWrapper.find('#test-id-tab-panel-0').attributes('tabindex')).toStrictEqual('0')
			expect(vueWrapper.find('#test-id-tab-panel-1').attributes('tabindex')).toStrictEqual('-1')
			expect(vueWrapper.find('#test-id-tab-panel-2').attributes('tabindex')).toStrictEqual('-1')
		})

		it('test onClick', async () => {
			await vueWrapper.setProps({ value: testHelper.modified('value') })
			await vueWrapper.vm.$nextTick()
			const btn1 = vueWrapper.find('button[aria-controls="test-id-tab-panel-0"]')
			const btn2 = vueWrapper.find('button[aria-controls="test-id-tab-panel-1"]')
			expect(btn1.attributes('tabindex')).toStrictEqual('-1')
			expect(btn2.attributes('tabindex')).toStrictEqual('0')
			expect(vueWrapper.emitted('change-tab')).toBeUndefined()
			await btn1.trigger('click')
			expect(btn1.attributes('tabindex')).toStrictEqual('0')
			expect(btn2.attributes('tabindex')).toStrictEqual('-1')
			expect(vueWrapper.emitted('change-tab')).toStrictEqual([[0]])
		})

		it('test pressLeft', async () => {
			const wrapper2 = mount(AmeliproTabs, {
				autoAttach: true,
				props: {
					...modifiedPropValues(),
					value: 0,
				},
				stubs: { AmeliproSelect },
			})
			const btn1 = wrapper2.find('button[aria-controls="test-id-tab-panel-0"]')
			const btn2 = wrapper2.find('button[aria-controls="test-id-tab-panel-1"]')
			const btn3 = wrapper2.find('button[aria-controls="test-id-tab-panel-2"]')
			expect(btn1.attributes('tabindex')).toStrictEqual('0')
			expect(btn2.attributes('tabindex')).toStrictEqual('-1')
			expect(btn3.attributes('tabindex')).toStrictEqual('-1')
			expect(wrapper2.emitted('change-tab')).toBeUndefined()
			await btn1.trigger('keyup.left')
			expect(btn1.attributes('tabindex')).toStrictEqual('-1')
			expect(btn2.attributes('tabindex')).toStrictEqual('-1')
			expect(btn3.attributes('tabindex')).toStrictEqual('0')
			expect(wrapper2.emitted('change-tab')).toStrictEqual([[2]])
			expect(document.activeElement?.getAttribute('aria-controls')).toStrictEqual('test-id-tab-panel-2')
			wrapper2.unmount()
		})

		it('test pressRight', async () => {
			const wrapper3 = mount(AmeliproTabs, {
				autoAttach: true,
				props: {
					...modifiedPropValues(),
					value: 0,
				},
				stubs: { AmeliproSelect },
			})
			const btn1 = wrapper3.find('button[aria-controls="test-id-tab-panel-0"]')
			const btn2 = wrapper3.find('button[aria-controls="test-id-tab-panel-1"]')
			const btn3 = wrapper3.find('button[aria-controls="test-id-tab-panel-2"]')
			expect(btn1.attributes('tabindex')).toStrictEqual('0')
			expect(btn2.attributes('tabindex')).toStrictEqual('-1')
			expect(btn3.attributes('tabindex')).toStrictEqual('-1')
			expect(wrapper3.emitted('change-tab')).toBeUndefined()
			await btn1.trigger('keyup.right')
			expect(btn1.attributes('tabindex')).toStrictEqual('-1')
			expect(btn2.attributes('tabindex')).toStrictEqual('0')
			expect(btn3.attributes('tabindex')).toStrictEqual('-1')
			expect(wrapper3.emitted('change-tab')).toStrictEqual([[1]])
			expect(document.activeElement?.getAttribute('aria-controls')).toStrictEqual('test-id-tab-panel-1')
			wrapper3.unmount()
		})

		it('test pressHome', async () => {
			const wrapper4 = mount(AmeliproTabs, {
				autoAttach: true,
				props: modifiedPropValues(),
				stubs: { AmeliproSelect },
			})
			const btn1 = wrapper4.find('button[aria-controls="test-id-tab-panel-0"]')
			const btn2 = wrapper4.find('button[aria-controls="test-id-tab-panel-1"]')
			const btn3 = wrapper4.find('button[aria-controls="test-id-tab-panel-2"]')
			expect(btn1.attributes('tabindex')).toStrictEqual('-1')
			expect(btn2.attributes('tabindex')).toStrictEqual('0')
			expect(btn3.attributes('tabindex')).toStrictEqual('-1')
			expect(wrapper4.emitted('change-tab')).toBeUndefined()
			await btn1.trigger('keyup.home')
			expect(btn1.attributes('tabindex')).toStrictEqual('0')
			expect(btn2.attributes('tabindex')).toStrictEqual('-1')
			expect(btn3.attributes('tabindex')).toStrictEqual('-1')
			expect(wrapper4.emitted('change-tab')).toStrictEqual([[0]])
			expect(document.activeElement?.getAttribute('aria-controls')).toStrictEqual('test-id-tab-panel-0')
			wrapper4.unmount()
		})

		it('test pressEnd', async () => {
			const wrapper5 = mount(AmeliproTabs, {
				autoAttach: true,
				props: modifiedPropValues(),
				stubs: { AmeliproSelect },
			})
			const btn1 = wrapper5.find('button[aria-controls="test-id-tab-panel-0"]')
			const btn2 = wrapper5.find('button[aria-controls="test-id-tab-panel-1"]')
			const btn3 = wrapper5.find('button[aria-controls="test-id-tab-panel-2"]')
			expect(btn1.attributes('tabindex')).toStrictEqual('-1')
			expect(btn2.attributes('tabindex')).toStrictEqual('0')
			expect(btn3.attributes('tabindex')).toStrictEqual('-1')
			expect(wrapper5.emitted('change-tab')).toBeUndefined()
			await btn1.trigger('keyup.end')
			expect(btn1.attributes('tabindex')).toStrictEqual('-1')
			expect(btn2.attributes('tabindex')).toStrictEqual('-1')
			expect(btn3.attributes('tabindex')).toStrictEqual('0')
			expect(wrapper5.emitted('change-tab')).toStrictEqual([[2]])
			expect(document.activeElement?.getAttribute('aria-controls')).toStrictEqual('test-id-tab-panel-2')
			wrapper5.unmount()
		})
	})
})
