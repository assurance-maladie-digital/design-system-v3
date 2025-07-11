import { VueWrapper, mount, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import AmeliproBtn from '../AmeliproBtn.vue'
import { AmeliproIcon } from '@/components'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import TestHelper from '@tests/helpers/TestHelper'
import { VBtn } from 'vuetify/components'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproBtn> = {
	badge: {
		type: [Boolean, Number, String],
		default: false,
	},
	badgeBgColor: {
		type: String,
		default: 'ap-pink',
	},
	badgeColor: {
		type: String,
		default: 'ap-white',
	},
	bordered: {
		type: Boolean,
		default: false,
	},
	classes: {
		type: String,
		default: undefined,
	},
	color: {
		type: String,
		default: 'ap-blue-darken-1',
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	hoverColor: {
		type: String,
		default: 'ap-blue-darken-2',
	},
	hoverUnderline: {
		type: Boolean,
		default: false,
	},
	iconBgColor: {
		type: String,
		default: 'transparent',
	},
	iconBordered: {
		type: Boolean,
		default: false,
	},
	iconColor: {
		type: String,
		default: undefined,
	},
	iconFocusColor: {
		type: String,
		default: undefined,
	},
	iconHoverColor: {
		type: String,
		default: undefined,
	},
	iconLeft: {
		type: Boolean,
		default: false,
	},
	iconName: {
		type: String,
		default: undefined,
	},
	infoBlock: {
		type: Boolean,
		default: false,
	},
	minHeight: {
		type: String,
		default: '3rem',
	},
	size: {
		type: String,
		default: '60px',
	},
	target: {
		type: String,
		default: undefined,
	},
	text: {
		type: Boolean,
		default: false,
	},
	textColor: {
		type: String,
		default: 'ap-white',
	},
	textFocusColor: {
		type: String,
		default: undefined,
	},
	textHoverColor: {
		type: String,
		default: undefined,
	},
	type: {
		type: String,
		default: 'button',
	},
	underline: {
		type: Boolean,
		default: false,
	},
	uniqueId: {
		type: String,
		default: undefined,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproBtn> => ({})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproBtn> => ({
	badge: true,
	badgeBgColor: 'ap-parme-darken-1',
	badgeColor: 'ap-parme',
	bordered: true,
	classes: 'modified-classes',
	color: 'modified-color',
	disabled: true,
	hoverColor: 'modified-hover-color',
	hoverUnderline: true,
	iconBgColor: 'modified-icon-bg-color',
	iconBordered: true,
	iconColor: 'modified-icon-color',
	iconFocusColor: 'modified-icon-focus-color',
	iconHoverColor: 'modified-icon-hover-color',
	iconLeft: true,
	iconName: 'modified-icon-name',
	infoBlock: true,
	minHeight: 'modified-min-height',
	size: 'modified-size',
	target: 'modified-target',
	text: true,
	textColor: 'modified-text-color',
	textFocusColor: 'modified-text-focus-color',
	textHoverColor: 'modified-text-hover-color',
	type: 'modified-type',
	underline: true,
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(AmeliproBtn)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproBtn', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproBtn>>
		const findBadgeWrapperWrapper = () => vueWrapper.find('.amelipro-btn__badge-wrapper')
		const findBadgeWrapper = () => vueWrapper.find('.amelipro-btn__badge')

		beforeEach(() => {
			vueWrapper = mount(AmeliproBtn, { props: { ...requiredPropValues(), badge: true, badgeBgColor: 'ap-black', badgeColor: 'ap-white' } })
		})

		describe('badge wrapper', () => {
			it('prop infoBlock & iconLeft sets attribute class', async () => {
				expect(findBadgeWrapperWrapper().exists()).toBe(true)
				expect(findBadgeWrapperWrapper().attributes('class')).toBe('amelipro-btn__badge-wrapper amelipro-btn__icon--right')

				const { infoBlock } = modifiedPropValues()
				await vueWrapper.setProps({ infoBlock })
				expect(findBadgeWrapperWrapper().attributes('class')).toBe('amelipro-btn__badge-wrapper')

				const { iconLeft } = modifiedPropValues()
				await vueWrapper.setProps({ infoBlock: false, iconLeft })
				expect(findBadgeWrapperWrapper().attributes('class')).toBe('amelipro-btn__badge-wrapper amelipro-btn__icon--left')
			})
		})

		describe('badge', () => {
			it('prop badgeBgColor & badgeColor sets attribute style', async () => {
				expect(findBadgeWrapper().exists()).toBe(true)
				expect(findBadgeWrapper().attributes('style')).toBe('background-color: #000000; color: #FFFFFF;')

				const { badgeBgColor } = modifiedPropValues()
				await vueWrapper.setProps({ badgeBgColor })
				expect(findBadgeWrapper().attributes('style')).toBe('background-color: #4D547D; color: #FFFFFF;')

				const { badgeColor } = modifiedPropValues()
				await vueWrapper.setProps({ badgeColor })
				expect(findBadgeWrapper().attributes('style')).toBe('background-color: #4D547D; color: #C8D1E6;')
			})
		})
	})

	describe('Setting props should update props or attributes of inner components', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproBtn>>

		describe('VBtn', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproBtn, { props: requiredPropValues() })
			})

			// 1. Assertion sur l'attribut id du VBtn
			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.findComponent(VBtn).attributes('id')).toBe(testHelper.default('uniqueId'))

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.findComponent(VBtn).attributes('id')).toBe(testHelper.modified('uniqueId'))
			})

			it.todo('prop ? sets prop class')
			it.todo('prop ? sets prop color')

			it('prop disabled sets prop disabled', async () => {
				expect(vueWrapper.findComponent(VBtn).props('disabled')).toBe(false)

				const { disabled } = modifiedPropValues()
				await vueWrapper.setProps({ disabled })
				expect(vueWrapper.findComponent(VBtn).props('disabled')).toBe(true)
			})

			it('props text & minHeight sets prop minHeight', async () => {
				expect(vueWrapper.findComponent(VBtn).props('minHeight')).toBe('3rem')

				const { minHeight, text } = modifiedPropValues()
				await vueWrapper.setProps({ minHeight })
				expect(vueWrapper.findComponent(VBtn).props('minHeight')).toBe('modified-min-height')

				await vueWrapper.setProps({ text })
				expect(vueWrapper.findComponent(VBtn).props('minHeight')).toBe('auto')
			})

			it('props bordered, color, disabled, text & textColor sets attribute style', async () => {
				expect(vueWrapper.findComponent(VBtn).attributes('style')).toBe('color: #FFFFFF !important;')

				const { bordered, color, disabled, text, textColor } = modifiedPropValues()
				await vueWrapper.setProps({ text })
				expect(vueWrapper.findComponent(VBtn).attributes('style')).toBe('padding: 0px;')

				await vueWrapper.setProps({ bordered })
				expect(vueWrapper.findComponent(VBtn).attributes('style')).toBe('padding: 0px; border: 2px solid #FFFFFF !important; background-color: white;')

				await vueWrapper.setProps({ disabled })
				expect(vueWrapper.findComponent(VBtn).attributes('style')).toBe('padding: 0px; border: 2px solid #FFFFFF !important; background-color: white; opacity: 30%; color: #00749C !important;')

				await vueWrapper.setProps({ color, textColor })
				expect(vueWrapper.findComponent(VBtn).attributes('style')).toBe('padding: 0px; border: 2px solid #000 !important; background-color: white; opacity: 30%; color: #000 !important;')

				await vueWrapper.setProps({ text: undefined })
				expect(vueWrapper.findComponent(VBtn).attributes('style')).toBe('border: 2px solid #000 !important; background-color: #000 !important; opacity: 30%; color: #000 !important;')
			})

			// 2. Assertion sur l'attribut target du VBtn
			it('prop target sets attribute target', async () => {
				expect(vueWrapper.findComponent(VBtn).attributes('target')).toBe(testHelper.default('target'))

				const { target } = modifiedPropValues()
				await vueWrapper.setProps({ target })
				expect(vueWrapper.findComponent(VBtn).attributes('target')).toBe(testHelper.modified('target'))
			})

			// 3. Assertion sur l'attribut type du VBtn
			it('prop type sets attribute type', async () => {
				expect(vueWrapper.findComponent(VBtn).attributes('type')).toBe(testHelper.default('type'))

				const { type } = modifiedPropValues()
				await vueWrapper.setProps({ type })
				expect(vueWrapper.findComponent(VBtn).attributes('type')).toBe(testHelper.modified('type'))
			})
		})

		describe('AmeliproIcon - no badge', () => {
			beforeEach(() => {
				vueWrapper = mount(AmeliproBtn, {
					props: requiredPropValues(),
					slots: { icon: '<span>Slot icon</span>' },
				})
			})

			it('props infoBlock & iconLeft set attribute class', async () => {
				expect(vueWrapper.findComponent(AmeliproIcon).attributes('class')).toBe('amelipro-icon d-block amelipro-btn__icon--right')

				await vueWrapper.setProps({ infoBlock: true, iconLeft: false })
				expect(vueWrapper.findComponent(AmeliproIcon).attributes('class')).toBe('amelipro-icon d-block')

				await vueWrapper.setProps({ infoBlock: true, iconLeft: true })
				expect(vueWrapper.findComponent(AmeliproIcon).attributes('class')).toBe('amelipro-icon d-block')

				await vueWrapper.setProps({ infoBlock: false, iconLeft: true })
				expect(vueWrapper.findComponent(AmeliproIcon).attributes('class')).toBe('amelipro-icon d-block amelipro-btn__icon--left')
			})

			it('prop iconBgColor sets prop iconBgColor', async () => {
				expect(vueWrapper.findComponent(AmeliproIcon).props('iconBgColor')).toBe('transparent')

				const { iconBgColor } = modifiedPropValues()
				await vueWrapper.setProps({ iconBgColor })
				expect(vueWrapper.findComponent(AmeliproIcon).props('iconBgColor')).toBe('modified-icon-bg-color')
			})

			it('prop iconBordered sets prop bordered', async () => {
				expect(vueWrapper.findComponent(AmeliproIcon).props('bordered')).toBe(false)

				const { iconBordered } = modifiedPropValues()
				await vueWrapper.setProps({ iconBordered })
				expect(vueWrapper.findComponent(AmeliproIcon).props('bordered')).toBe(true)
			})

			// 4. Assertion sur la prop icon de AmeliproIcon
			it('prop iconName sets prop icon', async () => {
				expect(vueWrapper.findComponent(AmeliproIcon).props('icon')).toBe(testHelper.default('iconName'))

				const { iconName } = modifiedPropValues()
				await vueWrapper.setProps({ iconName })
				expect(vueWrapper.findComponent(AmeliproIcon).props('icon')).toBe(testHelper.modified('iconName'))
			})

			it('props infoBlock & size set prop size', async () => {
				expect(vueWrapper.findComponent(AmeliproIcon).props('size')).toBe('1.5rem')

				const { infoBlock, size } = modifiedPropValues()
				await vueWrapper.setProps({ infoBlock })
				expect(vueWrapper.findComponent(AmeliproIcon).props('size')).toBe(testHelper.default('size'))

				await vueWrapper.setProps({ size })
				expect(vueWrapper.findComponent(AmeliproIcon).props('size')).toBe(testHelper.modified('size'))

				await vueWrapper.setProps({ infoBlock: false })
				expect(vueWrapper.findComponent(AmeliproIcon).props('size')).toBe('1.5rem')
			})
		})
	})

	describe('Events & setting props should update props or attributes of inner components', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproBtn>>
		describe('VBtn', () => {
			beforeEach(() => {
				vueWrapper = mount(AmeliproBtn, {
					props: requiredPropValues(),
					stubs: { AmeliproIcon, VBtn },
				})
			})

			it('props text, hoverUnderline & classes sets attribute class', async () => {
				expect(vueWrapper.attributes('class')).toBe('v-btn v-btn--flat v-theme--light bg-ap-blue-darken-1 v-btn--density-default elevation-0 v-btn--size-default v-btn--variant-flat amelipro-btn amelipro-btn--style')

				await vueWrapper.setProps({ text: true })
				expect(vueWrapper.attributes('class')).toBe('v-btn v-btn--flat v-theme--light text-ap-blue-darken-1 v-btn--density-default elevation-0 v-btn--size-default v-btn--variant-text amelipro-btn')

				vueWrapper.findComponent(VBtn).vm.$emit('mouseenter')
				await vueWrapper.setProps({ hoverUnderline: true })
				expect(vueWrapper.attributes('class')).toBe('v-btn v-btn--flat v-theme--light text-ap-blue-darken-2 v-btn--density-default elevation-0 v-btn--size-default v-btn--variant-text amelipro-btn text-decoration-underline')

				vueWrapper.findComponent(VBtn).vm.$emit('mouseleave')
				await vueWrapper.setProps({ classes: 'class1 class2' })
				expect(vueWrapper.attributes('class')).toBe('v-btn v-btn--flat v-theme--light text-ap-blue-darken-1 v-btn--density-default elevation-0 v-btn--size-default v-btn--variant-text amelipro-btn class1 class2')
			})

			it('props color & hoverColor sets prop color', async () => {
				const { color, hoverColor } = modifiedPropValues()

				expect(vueWrapper.findComponent(VBtn).props('color')).toBe('ap-blue-darken-1')

				await vueWrapper.setProps({ color })
				expect(vueWrapper.findComponent(VBtn).props('color')).toBe('modified-color')

				vueWrapper.findComponent(VBtn).vm.$emit('mouseenter')
				await vueWrapper.setProps({ hoverColor })
				expect(vueWrapper.findComponent(VBtn).props('color')).toBe('modified-hover-color')
			})

			it('prop bordered, disabled, text, textHoverColor & textColor sets attribute style', async () => {
				expect(vueWrapper.findComponent(VBtn).attributes('style')).toContain('color: #FFFFFF !important;')

				await vueWrapper.setProps({ textColor: 'black' })
				expect(vueWrapper.findComponent(VBtn).attributes('style')).toContain('color: #000 !important;')

				await vueWrapper.findComponent(VBtn).vm.$emit('mouseenter')
				expect(vueWrapper.findComponent(VBtn).attributes('style')).toContain('color: #000 !important;')

				await vueWrapper.setProps({ textHoverColor: 'secondary' })
				expect(vueWrapper.findComponent(VBtn).attributes('style')).toContain('color: #00516D !important;')

				vueWrapper.findComponent(VBtn).vm.$emit('mouseleave')
				await vueWrapper.setProps({ bordered: true })
				expect(vueWrapper.findComponent(VBtn).attributes('style')).toContain('color: #000 !important; border: 2px solid #000 !important; background-color: white;')

				await vueWrapper.setProps({ bordered: false, disabled: true })
				expect(vueWrapper.findComponent(VBtn).attributes('style')).toContain('color: #000 !important; background-color: #00749C !important; opacity: 30%;')

				await vueWrapper.setProps({ text: true, color: 'primary' })
				expect(vueWrapper.findComponent(VBtn).attributes('style')).toContain('color: #00749C !important; opacity: 30%; padding: 0px;')
			})
		})

		describe('AmeliproIcon', () => {
			beforeEach(() => {
				vueWrapper = mount(AmeliproBtn, {
					props: requiredPropValues(),
					slots: { icon: '<span>The icon</span>' },
					stubs: { AmeliproIcon, VBtn },
				})
			})

			it('should exists', () => {
				expect(vueWrapper.findComponent(AmeliproIcon).exists()).toBe(true)
			})

			it('prop disabled, iconHoverColor, infoBlock, iconColor & text sets prop iconColor', async () => {
				const { textColor, hoverColor, iconColor, iconHoverColor } = modifiedPropValues()
				expect(vueWrapper.findComponent(AmeliproIcon).props('iconColor')).toBe('ap-white')

				await vueWrapper.setProps({ disabled: true, textColor })
				expect(vueWrapper.findComponent(AmeliproIcon).props('iconColor')).toBe('modified-text-color')

				await vueWrapper.findComponent(VBtn).vm.$emit('mouseenter')
				await vueWrapper.setProps({ disabled: false, iconHoverColor })
				expect(vueWrapper.findComponent(AmeliproIcon).props('iconColor')).toBe('modified-icon-hover-color')

				await vueWrapper.findComponent(VBtn).vm.$emit('mouseleave')
				await vueWrapper.setProps({ iconColor, infoBlock: true })
				expect(vueWrapper.findComponent(AmeliproIcon).props('iconColor')).toBe('modified-icon-color')

				await vueWrapper.setProps({
					hoverColor,
					iconHoverColor: undefined,
					infoBlock: false,
					text: true,
				})
				expect(vueWrapper.findComponent(AmeliproIcon).props('iconColor')).toBe('modified-icon-color')

				await vueWrapper.findComponent(VBtn).vm.$emit('mouseenter')
				expect(vueWrapper.findComponent(AmeliproIcon).props('iconColor')).toBe('modified-icon-color')
			})
		})
	})

	describe.todo('Slots')
})
