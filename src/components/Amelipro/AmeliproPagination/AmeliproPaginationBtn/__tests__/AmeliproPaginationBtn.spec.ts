import { VueWrapper, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { AmeliproBtn } from '@/components'
import AmeliproPaginationBtn from '../AmeliproPaginationBtn.vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import type { PropType } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import TestHelper from '@tests/helpers/TestHelper'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproPaginationBtn> = {
	href: {
		type: String,
		default: undefined,
	},
	isActive: {
		type: Boolean,
		default: false,
	},
	title: {
		type: String,
		default: undefined,
	},
	to: {
		type: [Array, Object, String] as PropType<RouteLocationRaw>,
		default: undefined,
	},
	uniqueId: {
		type: String,
		default: undefined,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproPaginationBtn> => ({})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproPaginationBtn> => ({
	href: 'modified-href',
	isActive: true,
	title: 'Modified title',
	to: 'modified-to',
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(AmeliproPaginationBtn)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproPaginationBtn', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Events', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproPaginationBtn>>
		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproPaginationBtn, { props: requiredPropValues() })
		})

		it('emits click event when the button is clicked', async () => {
			expect(vueWrapper.emitted('click')).toBeUndefined()
			await vueWrapper.findComponent(AmeliproBtn).trigger('click')
			expect(vueWrapper.emitted('click')).toStrictEqual([[]])
		})
	})

	describe('Setting props should update inner attribute and tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproPaginationBtn>>
		const btnFinder = () => vueWrapper.findComponent(AmeliproBtn)

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproPaginationBtn, { props: requiredPropValues() })
		})

		it('prop isActive sets props & attributes = false', async () => {
			expect(btnFinder().attributes('aria-current')).toBeUndefined()
			expect(btnFinder().props('color')).toBe('ap-white')
			expect(btnFinder().props('textColor')).toBe('ap-blue-darken-1')

			await vueWrapper.setProps({ isActive: testHelper.modified('isActive') })
			expect(btnFinder().attributes('aria-current')).toStrictEqual('page')
			expect(btnFinder().props('color')).toBe('ap-blue-darken-1')
			expect(btnFinder().props('textColor')).toBe('ap-white')
		})
	})
})
