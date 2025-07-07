import { VueWrapper, mount, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { AmeliproBtn } from '@/components'
import AmeliproDropdownMenuBtn from '../AmeliproDropdownMenuBtn.vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import type { PropType } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import TestHelper from '@tests/helpers/TestHelper'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproDropdownMenuBtn> = {
	href: {
		type: String,
		default: undefined,
	},
	label: {
		type: String,
		required: true,
	},
	to: {
		type: [Array, Object, String] as PropType<RouteLocationRaw>,
		default: undefined,
	},
	uniqueId: {
		type: String,
		required: true,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproDropdownMenuBtn> => ({
	label: 'Required label',
	uniqueId: 'required-unique-id',
})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproDropdownMenuBtn> => ({
	href: 'modified-href',
	label: 'modified label',
	to: 'modified-to',
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(AmeliproDropdownMenuBtn)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproDropdownMenuBtn', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update props & attributes of inner components', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproDropdownMenuBtn>>

		describe('AmeliproBtn', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproDropdownMenuBtn, { props: requiredPropValues() })
			})

			it('prop uniqueId sets prop uniqueId', async () => {
				expect(vueWrapper.findComponent(AmeliproBtn).props('uniqueId')).toBe(testHelper.default('uniqueId'))

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.findComponent(AmeliproBtn).props('uniqueId')).toBe(testHelper.modified('uniqueId'))
			})

			it('prop href sets attribute href', async () => {
				expect(vueWrapper.findComponent(AmeliproBtn).attributes('href')).toBe(testHelper.default('href'))

				const { href } = modifiedPropValues()
				await vueWrapper.setProps({ href })
				expect(vueWrapper.findComponent(AmeliproBtn).attributes('href')).toBe(testHelper.modified('href'))
			})

			it('prop to sets attribute to', async () => {
				expect(vueWrapper.findComponent(AmeliproBtn).attributes('to')).toBe(testHelper.default('to'))

				const { to } = modifiedPropValues()
				await vueWrapper.setProps({ to })
				expect(vueWrapper.findComponent(AmeliproBtn).attributes('to')).toBe(testHelper.modified('to'))
			})
		})
	})

	describe('Events', () => {
		let wrapper: VueWrapper<InstanceType<typeof AmeliproDropdownMenuBtn>>
		const buttonFinder = () => wrapper.findComponent(AmeliproBtn)
		beforeEach(() => {
			wrapper = mount(AmeliproDropdownMenuBtn, { props: modifiedPropValues() })
		})
		it('test emitEvent', async () => {
			expect(wrapper.exists()).toBeTruthy()
			expect(buttonFinder().exists()).toBeTruthy()
			const emitValues = ['down', 'up', 'end', 'home', 'esc']
			await emitValues.forEach(async (element) => {
				expect(wrapper.emitted(element)).toBeUndefined()
				await buttonFinder().trigger(`keyup.${element}`)
				expect(wrapper.emitted(element)).toStrictEqual([[]])
				expect(wrapper.emitted('letters')).toStrictEqual(undefined)
			})
		})

		it('test emitLettersEvent', async () => {
			expect(wrapper.exists()).toBeTruthy()
			expect(buttonFinder().exists()).toBeTruthy()
			await buttonFinder().trigger('keyup', { key: 'a' })
			expect(wrapper.emitted('letters')).toStrictEqual([['a']])
			await buttonFinder().trigger('keyup', { key: 'B' })
			expect(wrapper.emitted('letters')).toStrictEqual([['a'], ['b']])
			await buttonFinder().trigger('keyup', { key: '+' })
			expect(wrapper.emitted('letters')).toStrictEqual([['a'], ['b']])
		})
	})

	describe('Other', () => {
		describe('AmeliproBtn', () => {
			it.todo('focus ? sets attribute color')
			it.todo('focus ? sets attribute tabindex')
		})
	})
})
