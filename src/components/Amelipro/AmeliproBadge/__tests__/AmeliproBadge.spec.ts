import { type VueWrapper, mount, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import AmeliproBadge from '../AmeliproBadge.vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import TestHelper from '@tests/helpers/TestHelper'
import { VBadge } from 'vuetify/components'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproBadge> = {
	badgeColor: {
		type: String,
		default: 'ap-blue-darken-1',
	},
	badgeContent: {
		type: String,
		default: undefined,
	},
	badgeTextColor: {
		type: String,
		default: 'ap-white',
	},
	isSpan: {
		type: Boolean,
		default: false,
	},
	roundedRight: {
		type: Boolean,
		default: false,
	},
	uniqueId: {
		type: String,
		default: undefined,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproBadge> => ({})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproBadge> => ({
	badgeColor: 'ap-white',
	badgeContent: 'modified badge content',
	badgeTextColor: 'ap-blue',
	isSpan: true,
	roundedRight: true,
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(AmeliproBadge)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproBadge', () => {
	let vueWrapper: VueWrapper<InstanceType<typeof AmeliproBadge>>

	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('setting props should update inner attribute and tags', () => {
		describe('Main', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproBadge, { props: requiredPropValues() })
			})

			it('prop isSpan sets tag', async () => {
				expect(vueWrapper.element.tagName).toBe('P')

				const { isSpan } = modifiedPropValues()
				await vueWrapper.setProps({ isSpan })
				expect(vueWrapper.element.tagName).toBe('SPAN')
			})

			it('prop badgeColor sets attribute style', async () => {
				expect(vueWrapper.attributes('style')).toBe('background-color: #00749C;')

				const { badgeColor } = modifiedPropValues()
				await vueWrapper.setProps({ badgeColor })
				expect(vueWrapper.attributes('style')).toBe('background-color: #FFFFFF;')
			})

			it('prop roundedRight sets attribute class', async () => {
				expect(vueWrapper.classes('round-classic')).toBe(true)
				expect(vueWrapper.classes('round-custom')).toBe(false)

				const { roundedRight } = modifiedPropValues()
				await vueWrapper.setProps({ roundedRight })
				expect(vueWrapper.classes('round-classic')).toBe(false)
				expect(vueWrapper.classes('round-custom')).toBe(true)
			})
		})
	})

	describe('setting props should update attributes and props of inner tags', () => {
		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproBadge, { props: requiredPropValues() })
		})

		describe('badge content', () => {
			it('prop badgeTextColor sets attribute style', async () => {
				expect(vueWrapper.find('.amelipro-badge__content').attributes('style')).toBe('color: #FFFFFF;')

				const { badgeTextColor } = modifiedPropValues()
				await vueWrapper.setProps({ badgeTextColor })
				expect(vueWrapper.find('.amelipro-badge__content').attributes('style')).toBe('color: #0C419A;')
			})

			it('prop badgeContent sets badge content', async () => {
				expect(vueWrapper.find('.amelipro-badge__content').text()).toBe('')

				const { badgeContent } = modifiedPropValues()
				await vueWrapper.setProps({ badgeContent })
				expect(vueWrapper.find('.amelipro-badge__content').text()).toBe('modified badge content')
			})
		})
	})

	describe('Slots', () => {
		beforeEach(() => {
			vueWrapper = mount(AmeliproBadge, {
				props: requiredPropValues(),
				stubs: { VBadge },
			})
		})

		describe('VBadge slot #badge', () => {
			it('prop badgeTextColor sets attribute style', async () => {
				expect(vueWrapper.find('.amelipro-badge__content').exists()).toBe(true)
				expect(vueWrapper.find('.amelipro-badge__content').attributes('style')).toBe('color: #FFFFFF;')

				const { badgeTextColor } = modifiedPropValues()
				await vueWrapper.setProps({ badgeTextColor })
				expect(vueWrapper.find('.amelipro-badge__content').attributes('style')).toBe('color: #0C419A;')
			})
		})
	})
})
