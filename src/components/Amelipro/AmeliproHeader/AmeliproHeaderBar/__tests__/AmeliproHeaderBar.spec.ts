import { VueWrapper, mount, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import AmeliproHeaderBar from '../AmeliproHeaderBar.vue'
import AmeliproHeaderBrandSection from '../AmeliproHeaderBrandSection/AmeliproHeaderBrandSection.vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import { DisplayTestComponent } from '@tests/helpers/utils'
import type { ExpectedPropOptions } from '@tests/types'
import { type PropType } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import TestHelper from '@tests/helpers/TestHelper'
import { VSpacer } from 'vuetify/components'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproHeaderBar> = {
	homeHref: {
		type: String,
		default: undefined,
	},
	homeLink: {
		type: [String, Boolean, Object] as PropType<RouteLocationRaw>,
		default: undefined,
	},
	innerWidth: {
		type: String,
		default: '100%',
	},
	serviceSubTitle: {
		type: String,
		default: undefined,
	},
	serviceTitle: {
		type: String,
		default: undefined,
	},
	themeAmelipro: {
		type: Boolean,
		default: true,
	},
	uniqueId: {
		type: String,
		default: undefined,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproHeaderBar> => ({})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproHeaderBar> => ({
	homeHref: '#modified-home-href',
	homeLink: '/modified-home-link',
	innerWidth: '1000px',
	serviceSubTitle: 'Modified service sub title',
	serviceTitle: 'Modified service title',
	themeAmelipro: false,
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(AmeliproHeaderBar)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

const displayWrapper = mount(DisplayTestComponent)

describe('AmeliproHeaderBar', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproHeaderBar>>

		describe('root', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproHeaderBar, { props: requiredPropValues() })
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.find('.header-bar-container').exists()).toBe(true)
				expect(vueWrapper.find('.header-bar-container').attributes('id')).toBeUndefined()

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.header-bar-container').attributes('id')).toBe('modified-unique-id-container')
			})
		})

		describe('header bar', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproHeaderBar, { props: requiredPropValues() })
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.find('.header-bar').attributes('id')).toBeUndefined()

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.header-bar').attributes('id')).toBe('modified-unique-id-main-bar')
			})
		})

		describe('header bar content', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproHeaderBar, { props: requiredPropValues() })
			})

			it('xs & smAndDown value set attribute class', async () => {
				displayWrapper.vm.setXs(false)
				displayWrapper.vm.setSmAndDown(false)
				await vueWrapper.vm.$nextTick()
				expect(vueWrapper.find('.header-bar-content').attributes('class')).toBe('header-bar-content d-flex justify-center px-14 py-8')

				displayWrapper.vm.setSmAndDown(true)
				await vueWrapper.vm.$nextTick()
				expect(vueWrapper.find('.header-bar-content').attributes('class')).toBe('header-bar-content d-flex justify-center pa-8')

				displayWrapper.vm.setXs(true)
				await vueWrapper.vm.$nextTick()
				expect(vueWrapper.find('.header-bar-content').attributes('class')).toBe('header-bar-content d-flex justify-center pa-6')

				displayWrapper.vm.resetDefaults()
			})
		})

		describe('header bar content container', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproHeaderBar, { props: requiredPropValues() })
			})

			it('prop innerWidth sets attribute style', async () => {
				expect(vueWrapper.find('.header-bar-content__container').attributes('style')).toBe('width: 100%; max-width: 100%;')

				const { innerWidth } = modifiedPropValues()
				await vueWrapper.setProps({ innerWidth })
				expect(vueWrapper.find('.header-bar-content__container').attributes('style')).toBe('width: 1000px; max-width: 1000px;')
			})
		})

		describe('navigation bar div', () => {
			it('prop innerWidth sets attribute style', async () => {
				vueWrapper = shallowMount(AmeliproHeaderBar, {
					props: requiredPropValues(),
					slots: { 'navigation-bar-content': 'Modified navigation bar content' },
				})
				expect(vueWrapper.find('.navigation-bar > div').attributes('style')).toBe('width: 100%; max-width: 100%;')

				const { innerWidth } = modifiedPropValues()
				await vueWrapper.setProps({ innerWidth })
				expect(vueWrapper.find('.navigation-bar > div').attributes('style')).toBe('width: 1000px; max-width: 1000px;')
			})
		})
	})

	describe('Setting props should update props of inner components', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproHeaderBar>>

		describe('AmeliproHeaderBrandSection', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproHeaderBar, { props: requiredPropValues() })
			})

			it('prop uniqueId sets prop uniqueId', async () => {
				expect(vueWrapper.findComponent(AmeliproHeaderBrandSection).props('uniqueId')).toBeUndefined()

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.findComponent(AmeliproHeaderBrandSection).props('uniqueId')).toBe('modified-unique-id-brand-section')
			})

			it('prop homeHref sets prop homeHref', async () => {
				expect(vueWrapper.findComponent(AmeliproHeaderBrandSection).props('homeHref')).toBeUndefined()

				const { homeHref } = modifiedPropValues()
				await vueWrapper.setProps({ homeHref })
				expect(vueWrapper.findComponent(AmeliproHeaderBrandSection).props('homeHref')).toBe('#modified-home-href')
			})

			it('prop homeLink sets prop homeLink', async () => {
				// TODO: pourquoi on a "/" au lieu de "undefined" ?
				// expect(vueWrapper.findComponent(AmeliproHeaderBrandSection).props('homeLink')).toBeUndefined();
				expect(vueWrapper.findComponent(AmeliproHeaderBrandSection).props('homeLink')).toBe('/')

				const { homeLink } = modifiedPropValues()
				await vueWrapper.setProps({ homeLink })
				expect(vueWrapper.findComponent(AmeliproHeaderBrandSection).props('homeLink')).toBe('/modified-home-link')
			})

			it('displayWidth sets prop mobileVersion', async () => {
				displayWrapper.vm.setSmAndDown(false)
				await vueWrapper.vm.$nextTick()
				expect(vueWrapper.findComponent(AmeliproHeaderBrandSection).props('mobileVersion')).toBe(false)

				displayWrapper.vm.setSmAndDown(true)
				await vueWrapper.vm.$nextTick()
				expect(vueWrapper.findComponent(AmeliproHeaderBrandSection).props('mobileVersion')).toBe(true)

				displayWrapper.vm.resetDefaults()
			})

			it('prop serviceSubTitle sets prop serviceSubTitle', async () => {
				expect(vueWrapper.findComponent(AmeliproHeaderBar).props('serviceSubTitle')).toBeUndefined()

				const { serviceSubTitle } = modifiedPropValues()
				await vueWrapper.setProps({ serviceSubTitle })
				expect(vueWrapper.findComponent(AmeliproHeaderBrandSection).props('serviceSubTitle')).toBe('Modified service sub title')
			})

			it('prop serviceTitle sets prop serviceTitle', async () => {
				expect(vueWrapper.findComponent(AmeliproHeaderBrandSection).props('serviceTitle')).toBeUndefined()

				const { serviceTitle } = modifiedPropValues()
				await vueWrapper.setProps({ serviceTitle })
				expect(vueWrapper.findComponent(AmeliproHeaderBrandSection).props('serviceTitle')).toBe('Modified service title')
			})

			it('prop themeAmelipro sets prop themeAmelipro', async () => {
				expect(vueWrapper.findComponent(AmeliproHeaderBrandSection).props('themeAmelipro')).toBe(true)

				const { themeAmelipro } = modifiedPropValues()
				await vueWrapper.setProps({ themeAmelipro })
				expect(vueWrapper.findComponent(AmeliproHeaderBrandSection).props('themeAmelipro')).toBe(false)
			})
		})

		describe('VSpacer', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproHeaderBar, { props: requiredPropValues() })
			})

			it('slot #default & display width set VSpacer visibility', async () => {
				displayWrapper.vm.setSmAndDown(false)
				await vueWrapper.vm.$nextTick()
				expect(vueWrapper.findComponent(VSpacer).exists()).toBe(false)

				displayWrapper.vm.setSmAndDown(true)
				await vueWrapper.vm.$nextTick()
				expect(vueWrapper.findComponent(VSpacer).exists()).toBe(true)

				displayWrapper.vm.setSmAndDown(false)
				await vueWrapper.vm.$nextTick()
				vueWrapper = shallowMount(AmeliproHeaderBar, {
					props: requiredPropValues(),
					slots: { default: 'Default slot content' },
				})
				expect(vueWrapper.findComponent(VSpacer).exists()).toBe(true)
			})
		})
	})

	describe('Slots', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproHeaderBar>>

		describe('#default', () => {
			it('slot #default without content', () => {
				vueWrapper = shallowMount(AmeliproHeaderBar, { props: requiredPropValues() })
				expect(vueWrapper.find('.header-bar-content__container').text()).toBe('')
			})

			it('slot #default with content', () => {
				vueWrapper = shallowMount(AmeliproHeaderBar, {
					props: requiredPropValues(),
					slots: { default: 'Default slot content' },
				})
				expect(vueWrapper.find('.header-bar-content__container').text()).toBe('Default slot content')
			})
		})

		describe('#navigation-bar-content & navigation bar', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproHeaderBar, {
					props: requiredPropValues(),
					slots: { 'navigation-bar-content': 'Modified navigation bar content' },
				})
			})

			it('slot #navigation-bar-content sets navigation bar visibility', () => {
				expect(vueWrapper.find('.navigation-bar').exists()).toBe(true)

				vueWrapper = shallowMount(AmeliproHeaderBar, { props: requiredPropValues() })
				expect(vueWrapper.find('.navigation-bar').exists()).toBe(false)
			})

			it('slot #navigation-bar-content sets navigation bar content', () => {
				expect(vueWrapper.find('.navigation-bar').text()).toBe('Modified navigation bar content')
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.find('.navigation-bar').attributes('id')).toBeUndefined()

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.navigation-bar').attributes('id')).toBe('modified-unique-id-navigation-bar')
			})

			it('prop smAndDown value sets attribute class', async () => {
				displayWrapper.vm.setSmAndDown(false)
				await vueWrapper.vm.$nextTick()
				expect(vueWrapper.find('.navigation-bar').classes('px-8')).toBe(false)
				expect(vueWrapper.find('.navigation-bar').classes('px-14')).toBe(true)

				displayWrapper.vm.setSmAndDown(true)
				await vueWrapper.vm.$nextTick()
				expect(vueWrapper.find('.navigation-bar').classes('px-8')).toBe(true)
				expect(vueWrapper.find('.navigation-bar').classes('px-14')).toBe(false)

				displayWrapper.vm.resetDefaults()
			})
		})
	})
})
