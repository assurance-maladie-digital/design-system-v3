import { VueWrapper, mount, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import AmeliproTileBtn from '../AmeliproTileBtn.vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import type { PropType } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import TestHelper from '@tests/helpers/TestHelper'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproTileBtn> = {
	alignTopStyle: {
		type: Boolean,
		default: false,
	},
	borderDash: {
		type: Boolean,
		default: false,
	},
	complementaryInfoLine1: {
		type: String,
		default: undefined,
	},
	complementaryInfoLine2: {
		type: String,
		default: undefined,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	href: {
		type: String,
		default: undefined,
	},
	imgMaxWidth: {
		type: String,
		default: undefined,
	},
	imgMinWidth: {
		type: String,
		default: undefined,
	},
	imgSrc: {
		type: String,
		required: true,
	},
	imgWidth: {
		type: String,
		default: '100px',
	},
	invalid: {
		type: Boolean,
		default: false,
	},
	label: {
		type: String,
		required: true,
	},
	labelBottom: {
		type: String,
		default: undefined,
	},
	message: {
		type: String,
		default: undefined,
	},
	messageType: {
		default: 'info',
		type: String,
		validator(value: string): boolean {
			return ['info', 'error', 'warning'].includes(value.toLowerCase())
		},
	},
	tileMinHeight: {
		type: String,
		default: undefined,
	},
	tilePadding: {
		type: String,
		default: '2rem 1.5rem',
	},
	tileWidth: {
		type: String,
		default: '100%',
	},
	to: {
		type: [Array, Object, String] as PropType<RouteLocationRaw>,
		default: undefined,
	},
	uniqueId: {
		type: String,
		default: undefined,
	},
	valid: {
		type: Boolean,
		default: false,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproTileBtn> => ({
	imgSrc: 'required-img-src',
	label: 'Required label',
})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproTileBtn> => ({
	alignTopStyle: true,
	borderDash: true,
	complementaryInfoLine1: 'Modified complementary info line 1',
	complementaryInfoLine2: 'Modified complementary info line 2',
	disabled: true,
	href: 'modified-href',
	imgMaxWidth: 'modified-img-max-width',
	imgMinWidth: 'modified-img-min-width',
	imgSrc: 'modified-img-src',
	imgWidth: 'modified-img-width',
	invalid: true,
	label: 'Modified label',
	labelBottom: 'Modified label bottom',
	message: 'Modified message',
	messageType: 'warning',
	tileMinHeight: 'modified-tile-min-height',
	tilePadding: 'modified-tile-padding',
	tileWidth: 'modified-tile-width',
	to: 'modified-to',
	uniqueId: 'modified-unique-id',
	valid: true,
})

const testHelper = new TestHelper(AmeliproTileBtn)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproTileBtn', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe.skip('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproTileBtn>>

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproTileBtn, { props: requiredPropValues() })
		})

		it('prop borderDash sets button style', async () => {
			expect(vueWrapper.attributes().style).toBe('background-color: rgb(255, 255, 255); color: rgb(26, 27, 27); padding: 2rem 1.5rem; border: 2px solid #ffffff !important;')
			await vueWrapper.setProps({ borderDash: testHelper.modified('borderDash') })
			expect(vueWrapper.attributes().style).toBe('background-color: rgb(255, 255, 255); color: rgb(26, 27, 27); padding: 2rem 1.5rem; border: 2px dashed #99dbf2;')
		})

		it('props imgMaxWidth, imgMinWidth, imgWidth set img style', async () => {
			const element = vueWrapper.find('img')
			expect(element.exists()).toBe(true)
			expect(element.attributes().style).toBe('width: 100px;')
			await vueWrapper.setProps({
				imgMaxWidth: testHelper.modified('imgMaxWidth'),
				imgMinWidth: testHelper.modified('imgMinWidth'),
				imgWidth: testHelper.modified('imgWidth'),
			})
			expect(element.attributes().style).toBe('width: 100px;')
		})
	})

	describe('Setting props should update props or attributes of inner components', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproTileBtn>>

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproTileBtn, { props: requiredPropValues() })
		})

		it('prop label sets label text', async () => {
			expect(vueWrapper.props('label')).toBe(testHelper.default('label'))
			await vueWrapper.setProps({ label: testHelper.modified('label') })
			expect(vueWrapper.props('label')).toBe(testHelper.modified('label'))
		})

		it('prop labelBottom sets labelBottom prop', async () => {
			expect(vueWrapper.props('labelBottom')).toBe(testHelper.default('labelBottom'))
			await vueWrapper.setProps({ labelBottom: testHelper.modified('labelBottom') })
			expect(vueWrapper.props('labelBottom')).toBe(testHelper.modified('labelBottom'))
		})

		it('prop complementaryInfoLine1 sets complementaryInfoLine1 prop', async () => {
			expect(vueWrapper.props('complementaryInfoLine1')).toBe(testHelper.default('complementaryInfoLine1'))
			await vueWrapper.setProps({ complementaryInfoLine1: testHelper.modified('complementaryInfoLine1') })
			expect(vueWrapper.props('complementaryInfoLine1')).toBe(testHelper.modified('complementaryInfoLine1'))
		})

		it('prop complementaryInfoLine2 sets complementaryInfoLine2 prop', async () => {
			expect(vueWrapper.props('complementaryInfoLine2')).toBe(testHelper.default('complementaryInfoLine2'))
			await vueWrapper.setProps({ complementaryInfoLine2: testHelper.modified('complementaryInfoLine2') })
			expect(vueWrapper.props('complementaryInfoLine2')).toBe(testHelper.modified('complementaryInfoLine2'))
		})

		it('prop disabled sets disabled prop', async () => {
			expect(vueWrapper.props('disabled')).toBe(testHelper.default('disabled'))
			await vueWrapper.setProps({ disabled: testHelper.modified('disabled') })
			expect(vueWrapper.props('disabled')).toBe(testHelper.modified('disabled'))
		})

		it('prop href sets href prop', async () => {
			expect(vueWrapper.props('href')).toBe(testHelper.default('href'))
			await vueWrapper.setProps({ href: testHelper.modified('href') })
			expect(vueWrapper.props('href')).toBe(testHelper.modified('href'))
		})

		it('prop to sets to prop', async () => {
			expect(vueWrapper.props('to')).toBe(testHelper.default('to'))
			await vueWrapper.setProps({ to: testHelper.modified('to') })
			expect(vueWrapper.props('to')).toBe(testHelper.modified('to'))
		})

		it('prop uniqueId sets uniqueId prop', async () => {
			expect(vueWrapper.props('uniqueId')).toBe(testHelper.default('uniqueId'))
			await vueWrapper.setProps({ uniqueId: testHelper.modified('uniqueId') })
			expect(vueWrapper.props('uniqueId')).toBe(testHelper.modified('uniqueId'))
		})
	})

	describe('Events', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproTileBtn>>

		beforeEach(() => {
			vueWrapper = mount(AmeliproTileBtn, { props: modifiedPropValues() })
		})

		it('emits a click event when button is clicked', async () => {
			expect(vueWrapper.exists()).toBe(true)
			expect(vueWrapper.emitted('click')).toBeUndefined()
			await vueWrapper.trigger('click')
			expect(vueWrapper.emitted('click')).toStrictEqual([['modified-unique-id']])
		})
	})
})
