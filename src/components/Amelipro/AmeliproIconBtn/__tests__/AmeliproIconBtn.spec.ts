import { VueWrapper, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AmeliproIcon } from '@/components'
import AmeliproIconBtn from '../AmeliproIconBtn.vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import { defineComponent, h, type PropType } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import TestHelper from '@tests/helpers/TestHelper'
import { VBtn } from 'vuetify/components'

vi.mock('@/composables/useError', () => ({ useError: () => ({ propError: vi.fn() }) }))

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproIconBtn> = {
	badge: {
		type: [Boolean, Number, String],
		default: false,
	},
	badgeBgColor: {
		type: String,
		default: undefined,
	},
	badgeColor: {
		type: String,
		default: undefined,
	},
	bordered: {
		type: Boolean,
		default: false,
	},
	btnLabel: {
		type: String,
		default: undefined,
	},
	btnTitle: {
		type: String,
		default: undefined,
	},
	href: {
		type: String,
		default: undefined,
	},
	icon: {
		type: String,
		default: undefined,
	},
	iconBgColor: {
		type: String,
		default: 'transparent',
	},
	iconBorderColor: {
		type: String,
		default: undefined,
	},
	iconColor: {
		type: String,
		required: true,
	},
	iconFocusBgColor: {
		type: String,
		default: undefined,
	},
	iconFocusBorderColor: {
		type: String,
		default: undefined,
	},
	iconFocusColor: {
		type: String,
		default: undefined,
	},
	iconHoverBgColor: {
		type: String,
		default: 'transparent',
	},
	iconHoverBorderColor: {
		type: String,
		default: undefined,
	},
	iconHoverColor: {
		type: String,
		required: true,
	},
	large: {
		type: Boolean,
		default: false,
	},
	medium: {
		type: Boolean,
		default: false,
	},
	size: {
		type: String,
		default: undefined,
	},
	small: {
		type: Boolean,
		default: false,
	},
	to: {
		type: [Array, Object, String] as PropType<RouteLocationRaw>,
		default: undefined,
	},
	uniqueId: {
		type: String,
		default: undefined,
	},
	xLarge: {
		type: Boolean,
		default: false,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproIconBtn> => ({
	iconColor: 'required-icon-color',
	iconHoverColor: 'required-icon-hover-color',
})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproIconBtn> => ({
	badge: true,
	badgeBgColor: 'ap-blue',
	badgeColor: 'ap-yellow',
	bordered: true,
	btnLabel: 'Modified btn label',
	href: '#modified-href',
	icon: 'modified-icon',
	iconBgColor: '#123456',
	iconBorderColor: 'ap-grey',
	iconColor: 'modified-icon-color',
	iconFocusBgColor: '#abcdef',
	iconFocusBorderColor: 'ap-orange',
	iconFocusColor: 'modified-icon-focus-color',
	iconHoverBgColor: '#654321',
	iconHoverBorderColor: 'ap-red',
	iconHoverColor: 'modified-icon-hover-color',
	large: true,
	medium: true,
	size: 'modified-size',
	small: true,
	to: '#modified-to',
	uniqueId: 'modified-unique-id',
	xLarge: true,
})

// Mock VBtn de Vuetify
const VBtnMock = defineComponent({
	name: 'VBtn',
	emits: ['focus', 'mouseenter', 'mouseleave'],
	setup(props, { slots }) {
		return () => h('v-btn-stub', props, slots.default ? slots.default() : [])
	},
})

const testHelper = new TestHelper(AmeliproIconBtn)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproIconBtn', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproIconBtn>>
		describe('label', () => {
			beforeEach(() => {
				// Par défaut, btnLabel est undefined donc le label ne s'affiche pas
				vueWrapper = shallowMount(AmeliproIconBtn, {
					props: { ...requiredPropValues(), badge: true },
					global: {
						stubs: {
							AmeliproIcon,
							VBtn: VBtnMock,
						},
					},
				})
			})

			it('prop uniqueId sets attribute id', async () => {
				// Le label n'existe pas par défaut car btnLabel est undefined
				expect(vueWrapper.find('.amelipro-btn__label').exists()).toBe(false)

				const { btnLabel, uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ btnLabel })
				expect(vueWrapper.find('.amelipro-btn__label').attributes('id')).toBeUndefined()

				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.amelipro-btn__label').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-btn-label`)
			})

			it('prop btnLabel sets label content', async () => {
				expect(vueWrapper.find('.amelipro-btn__label').exists()).toBe(false)

				const { btnLabel } = modifiedPropValues()
				await vueWrapper.setProps({ btnLabel })
				expect(vueWrapper.find('.amelipro-btn__label').text()).toBe(testHelper.modified('btnLabel'))

				// Si btnLabel est retiré, le label ne doit plus exister
				await vueWrapper.setProps({ btnLabel: undefined })
				expect(vueWrapper.find('.amelipro-btn__label').exists()).toBe(false)
			})
		})

		describe('badge wrapper', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproIconBtn, {
					props: { ...requiredPropValues(), badge: true },
					global: {
						stubs: {
							AmeliproIcon,
							VBtn: VBtnMock,
						},
					},
				})
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.find('.amelipro-btn__badge-wrapper').attributes('id')).toBe(testHelper.default('uniqueId'))

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.amelipro-btn__badge-wrapper').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-badge`)
			})
		})

		describe('badge', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproIconBtn, {
					props: { ...requiredPropValues(), badge: true },
					global: {
						stubs: {
							AmeliproIcon,
							VBtn: VBtnMock,
						},
					},
				})
			})

			it('props badgeBgColor & badgeColor set attribute style', async () => {
				expect(vueWrapper.find('.amelipro-btn__badge').attributes('style')).toBe('background-color: #000; color: #000;')

				const { badgeBgColor, badgeColor } = modifiedPropValues()
				await vueWrapper.setProps({ badgeBgColor })
				expect(vueWrapper.find('.amelipro-btn__badge').attributes('style')).toBe('background-color: #0C419A; color: #000;')

				await vueWrapper.setProps({ badgeColor })
				expect(vueWrapper.find('.amelipro-btn__badge').attributes('style')).toBe('background-color: #0C419A; color: #F0B323;')
			})

			it('prop badge set badge content', async () => {
				// badge est booléen par défaut, donc testHelper.default('badge') retourne false.
				// Selon la règle 2.6, il ne faut PAS utiliser testHelper pour vérifier le texte dans ce cas.
				expect(vueWrapper.find('.amelipro-btn__badge').text()).toBe('')

				const { badge } = modifiedPropValues()
				await vueWrapper.setProps({ badge })
				// badge = true (booléen), donc toujours pas de texte attendu
				expect(vueWrapper.find('.amelipro-btn__badge').text()).toBe('')

				await vueWrapper.setProps({ badge: 'Badge text' })
				expect(vueWrapper.find('.amelipro-btn__badge').text()).toBe('Badge text')
			})
		})
	})

	describe('Setting props should update props or attributes of inner components', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproIconBtn>>
		describe('VBtn', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproIconBtn, { props: requiredPropValues() })
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.findComponent(VBtn).attributes('id')).toBeUndefined()

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.findComponent(VBtn).attributes('id')).toBe('modified-unique-id')
			})

			it('prop href sets prop href', async () => {
				expect(vueWrapper.findComponent(VBtn).props('href')).toBeUndefined()

				const { href } = modifiedPropValues()
				await vueWrapper.setProps({ href })
				expect(vueWrapper.findComponent(VBtn).props('href')).toBe('#modified-href')
			})

			it('prop to sets prop to', async () => {
				expect(vueWrapper.findComponent(VBtn).props('to')).toBeUndefined()

				const { to } = modifiedPropValues()
				await vueWrapper.setProps({ to })
				expect(vueWrapper.findComponent(VBtn).props('to')).toBe('#modified-to')
			})
		})

		describe('AmeliproIcon', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproIconBtn, {
					props: requiredPropValues(),
					slots: { icon: '<span>The icon</span>' },
					global: {
						stubs: { AmeliproIcon, VBtn: VBtnMock },
					},
				})
			})

			it('should exists', () => {
				expect(vueWrapper.findComponent(AmeliproIcon).exists()).toBe(true)
				expect(vueWrapper.props('btnLabel')).toBeUndefined()
			})

			it('props iconHoverBorderColor & iconBorderColor sets prop borderColor', async () => {
				const { iconBorderColor, iconHoverBorderColor } = modifiedPropValues()
				expect(vueWrapper.findComponent(AmeliproIcon).props('borderColor')).toBeUndefined()

				await vueWrapper.setProps({ iconBorderColor })
				expect(vueWrapper.findComponent(AmeliproIcon).props('borderColor')).toBe(testHelper.modified('iconBorderColor'))

				await vueWrapper.findComponent(VBtn).vm.$emit('mouseenter')
				expect(vueWrapper.findComponent(AmeliproIcon).props('borderColor')).toBeUndefined()

				await vueWrapper.setProps({ iconHoverBorderColor })
				expect(vueWrapper.findComponent(AmeliproIcon).props('borderColor')).toBe(testHelper.modified('iconHoverBorderColor'))
			})

			// --- AJOUT TESTS FOCUS ---
			it('props iconFocusBorderColor & iconBorderColor sets prop borderColor on focus', async () => {
				const { iconBorderColor, iconFocusBorderColor } = modifiedPropValues()
				expect(vueWrapper.findComponent(AmeliproIcon).props('borderColor')).toBeUndefined()

				await vueWrapper.setProps({ iconBorderColor })
				expect(vueWrapper.findComponent(AmeliproIcon).props('borderColor')).toBe(testHelper.modified('iconBorderColor'))

				await vueWrapper.findComponent(VBtn).vm.$emit('focus')
				expect(vueWrapper.findComponent(AmeliproIcon).props('borderColor')).toBeUndefined()

				await vueWrapper.setProps({ iconFocusBorderColor })
				expect(vueWrapper.findComponent(AmeliproIcon).props('borderColor')).toBe(testHelper.modified('iconFocusBorderColor'))
			})

			it('prop iconFocusBgColor sets prop iconBgColor on focus', async () => {
				const { iconFocusBgColor } = modifiedPropValues()
				expect(vueWrapper.findComponent(AmeliproIcon).props('iconBgColor')).toBe('transparent')

				await vueWrapper.findComponent(VBtn).vm.$emit('focus')
				expect(vueWrapper.findComponent(AmeliproIcon).props('iconBgColor')).toBe('transparent')

				await vueWrapper.setProps({ iconFocusBgColor })
				expect(vueWrapper.findComponent(AmeliproIcon).props('iconBgColor')).toBe(testHelper.modified('iconFocusBgColor'))
			})

			it('prop iconFocusColor sets prop iconColor on focus', async () => {
				const { iconFocusColor } = modifiedPropValues()
				expect(vueWrapper.findComponent(AmeliproIcon).props('iconColor')).toBe(testHelper.default('iconColor'))

				await vueWrapper.findComponent(VBtn).vm.$emit('focus')
				// iconFocusColor est par défaut undefined => utiliser iconHoverColor
				expect(vueWrapper.findComponent(AmeliproIcon).props('iconColor')).toBe(testHelper.default('iconHoverColor'))

				await vueWrapper.setProps({ iconFocusColor })
				expect(vueWrapper.findComponent(AmeliproIcon).props('iconColor')).toBe(testHelper.modified('iconFocusColor'))
			})

			it('prop bordered sets prop bordered', async () => {
				expect(vueWrapper.findComponent(AmeliproIcon).props('bordered')).toBe(false)

				await vueWrapper.setProps({ bordered: true })
				expect(vueWrapper.findComponent(AmeliproIcon).props('bordered')).toBe(true)
			})

			it('slots prepend & append sets attribute class', () => {
				expect(vueWrapper.findComponent(AmeliproIcon).attributes('class')).toBe('amelipro-icon icon-custom')

				vueWrapper = shallowMount(AmeliproIconBtn, {
					props: requiredPropValues(),
					slots: { prepend: '<span>Slot #prepend content</span>' },
					global: {
						stubs: {
							AmeliproIcon,
							VBtn: VBtnMock,
						},
					},
				})
				expect(vueWrapper.findComponent(AmeliproIcon).attributes('class')).toBe('amelipro-icon icon-custom ml-2')

				vueWrapper = shallowMount(AmeliproIconBtn, {
					props: requiredPropValues(),
					slots: { append: '<span>Slot #append content</span>' },
					global: {
						stubs: {
							AmeliproIcon,
							VBtn: VBtnMock,
						},
					},
				})
				expect(vueWrapper.findComponent(AmeliproIcon).attributes('class')).toBe('amelipro-icon icon-custom mr-2')

				vueWrapper = shallowMount(AmeliproIconBtn, {
					props: requiredPropValues(),
					slots: {
						append: '<span>Slot #append content</span>',
						prepend: '<span>Slot #prepend content</span>',
					},
					global: {
						stubs: {
							AmeliproIcon,
							VBtn: VBtnMock,
						},
					},
				})
				expect(vueWrapper.findComponent(AmeliproIcon).attributes('class')).toBe('amelipro-icon icon-custom ml-2 mr-2')
			})

			it('prop icon sets prop icon', async () => {
				const { icon } = modifiedPropValues()
				expect(vueWrapper.findComponent(AmeliproIcon).props('icon')).toBeUndefined()

				await vueWrapper.setProps({ icon })
				expect(vueWrapper.findComponent(AmeliproIcon).props('icon')).toBe(testHelper.modified('icon'))
			})

			it('prop iconBgColor sets prop iconBgColor', async () => {
				const { iconBgColor, iconHoverBgColor } = modifiedPropValues()
				expect(vueWrapper.findComponent(AmeliproIcon).props('iconBgColor')).toBe('transparent')

				await vueWrapper.setProps({ iconBgColor })
				expect(vueWrapper.findComponent(AmeliproIcon).props('iconBgColor')).toBe(testHelper.modified('iconBgColor'))

				await vueWrapper.findComponent(VBtn).vm.$emit('mouseenter')
				expect(vueWrapper.findComponent(AmeliproIcon).props('iconBgColor')).toBe('transparent')

				await vueWrapper.setProps({ iconHoverBgColor })
				expect(vueWrapper.findComponent(AmeliproIcon).props('iconBgColor')).toBe(testHelper.modified('iconHoverBgColor'))
			})

			it('prop disabled, iconHoverColor, infoBlock, iconColor & text sets prop iconColor', async () => {
				expect(vueWrapper.findComponent(AmeliproIcon).props('iconColor')).toBe(testHelper.default('iconColor'))

				const { iconColor, iconHoverColor } = modifiedPropValues()
				await vueWrapper.setProps({ iconColor })
				expect(vueWrapper.findComponent(AmeliproIcon).props('iconColor')).toBe(testHelper.modified('iconColor'))

				await vueWrapper.findComponent(VBtn).vm.$emit('mouseenter')
				expect(vueWrapper.findComponent(AmeliproIcon).props('iconColor')).toBe(testHelper.default('iconHoverColor'))

				await vueWrapper.setProps({ iconHoverColor })
				expect(vueWrapper.findComponent(AmeliproIcon).props('iconColor')).toBe(testHelper.modified('iconHoverColor'))
			})
		})
	})
})
