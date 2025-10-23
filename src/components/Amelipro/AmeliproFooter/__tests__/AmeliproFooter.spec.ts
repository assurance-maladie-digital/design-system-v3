import { A11Y_COMPLIANCE_ENUM_VALUES, A11yComplianceEnum } from '../A11yComplianceEnum'
import { VueWrapper, mount, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { AmeliproBtn } from '@/components'
import AmeliproFooter from '../AmeliproFooter.vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import { DisplayTestComponent } from '@tests/helpers/utils'
import type { ExpectedPropOptions } from '@tests/types'
import type { PropType } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import TestHelper from '@tests/helpers/TestHelper'
import { propValidator } from '@/utils/propValidator'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproFooter> = {
	a11yCompliance: {
		default: A11yComplianceEnum.NON_COMPLIANT,
		type: String,
		validator: (value: string) => propValidator('a11yCompliance', A11Y_COMPLIANCE_ENUM_VALUES, value),
	},
	a11yHref: {
		type: String,
		default: undefined,
	},
	a11yTarget: {
		type: String,
		default: undefined,
	},
	a11yTo: {
		type: [Array, Object, String] as PropType<RouteLocationRaw>,
		default: undefined,
	},
	aboutHref: {
		type: String,
		default: undefined,
	},
	aboutTarget: {
		type: String,
		default: undefined,
	},
	aboutTo: {
		type: [Array, Object, String] as PropType<RouteLocationRaw>,
		default: undefined,
	},
	backOffice: {
		type: Boolean,
		default: false,
	},
	backOfficeText: {
		type: String,
		default: undefined,
	},
	cguHref: {
		type: String,
		default: undefined,
	},
	cguTarget: {
		type: String,
		default: undefined,
	},
	cguTo: {
		type: [Array, Object, String] as PropType<RouteLocationRaw>,
		default: undefined,
	},
	configurationHref: {
		type: String,
		default: undefined,
	},
	configurationLabel: {
		type: String,
		default: 'Configuration',
	},
	configurationTarget: {
		type: String,
		default: undefined,
	},
	configurationTo: {
		type: [Array, Object, String] as PropType<RouteLocationRaw>,
		default: undefined,
	},
	legalNoticeHref: {
		type: String,
		default: undefined,
	},
	legalNoticeTarget: {
		type: String,
		default: undefined,
	},
	legalNoticeTo: {
		type: [Array, Object, String] as PropType<RouteLocationRaw>,
		default: undefined,
	},
	noA11y: {
		type: Boolean,
		default: false,
	},
	noAbout: {
		type: Boolean,
		default: false,
	},
	noCgu: {
		type: Boolean,
		default: false,
	},
	noConfiguration: {
		type: Boolean,
		default: false,
	},
	noLegalNotice: {
		type: Boolean,
		default: false,
	},
	noLinkA11y: {
		type: Boolean,
		default: false,
	},
	noPhone: {
		type: Boolean,
		default: false,
	},
	noSiteMap: {
		type: Boolean,
		default: false,
	},
	phoneLink: {
		type: Boolean,
		default: true,
	},
	siteMapHref: {
		type: String,
		default: undefined,
	},
	siteMapTarget: {
		type: String,
		default: undefined,
	},
	siteMapTo: {
		type: [Array, Object, String] as PropType<RouteLocationRaw>,
		default: undefined,
	},
	uniqueId: {
		type: String,
		default: undefined,
	},
	version: {
		type: String,
		default: 'X.X.X',
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproFooter> => ({})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproFooter> => ({
	a11yCompliance: 'partiellement-conforme',
	a11yHref: '#modified-a11y-href',
	a11yTarget: 'modified-a11y-target',
	a11yTo: '/modified-a11y-to',
	aboutHref: '#modified-about-href',
	aboutTarget: 'modified-about-target',
	aboutTo: '/modified-about-to',
	backOffice: true,
	backOfficeText: 'Modified back office text',
	cguHref: '#modified-cgu-href',
	cguTarget: 'modified-cgu-target',
	cguTo: '/modified-cgu-to',
	configurationHref: '#modified-configuration-href',
	configurationLabel: 'Modified configuration label',
	configurationTarget: 'modified-configuration-target',
	configurationTo: '/modified-configuration-to',
	legalNoticeHref: '#modified-legal-notice-href',
	legalNoticeTarget: 'modified-legal-notice-target',
	legalNoticeTo: '/modified-legal-notice-to',
	noA11y: true,
	noAbout: true,
	noCgu: true,
	noConfiguration: true,
	noLegalNotice: true,
	noLinkA11y: true,
	noPhone: true,
	noSiteMap: true,
	phoneLink: false,
	siteMapHref: '#modified-site-map-href',
	siteMapTarget: 'modified-site-map-target',
	siteMapTo: '/modified-site-map-to',
	uniqueId: 'modified-unique-id',
	version: 'Modified version',
})

const testHelper = new TestHelper(AmeliproFooter)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

const displayWrapper = mount(DisplayTestComponent)

describe('AmeliproFooter', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update props of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproFooter>>

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproFooter, { props: requiredPropValues() })
		})

		describe('footer root', () => {
			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.attributes('id')).toBeUndefined()

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.attributes('id')).toBe('modified-unique-id-container')
			})

			it('display width sets attribute class', async () => {
				displayWrapper.vm.setWidth(1170)
				await vueWrapper.vm.$nextTick()
				expect(vueWrapper.find('.amelipro-footer').classes('d-flex')).toBe(true)

				displayWrapper.vm.setWidth(1169)
				await vueWrapper.vm.$nextTick()
				expect(vueWrapper.find('.amelipro-footer').classes('d-block')).toBe(true)

				displayWrapper.vm.resetDefaults()
			})
		})

		describe('footer content', () => {
			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.find('.amelipro-footer__content').attributes('id')).toBeUndefined()

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.amelipro-footer__content').attributes('id')).toBe('modified-unique-id-content')
			})

			it('display width & prop backOffice set attribute class', async () => {
				displayWrapper.vm.setMdAndUp(true)
				await vueWrapper.vm.$nextTick()
				expect(vueWrapper.find('.amelipro-footer__content').classes('flex-column')).toBe(false)
				expect(vueWrapper.find('.amelipro-footer__content').classes('flex-row')).toBe(true)
				expect(vueWrapper.find('.amelipro-footer__content').classes('justify-center')).toBe(false)
				expect(vueWrapper.find('.amelipro-footer__content').classes('justify-space-between')).toBe(true)

				displayWrapper.vm.setMdAndUp(false)
				await vueWrapper.vm.$nextTick()
				expect(vueWrapper.find('.amelipro-footer__content').classes('flex-column')).toBe(true)
				expect(vueWrapper.find('.amelipro-footer__content').classes('flex-row')).toBe(false)
				expect(vueWrapper.find('.amelipro-footer__content').classes('justify-center')).toBe(false)
				expect(vueWrapper.find('.amelipro-footer__content').classes('justify-space-between')).toBe(false)

				const { backOffice } = modifiedPropValues()
				await vueWrapper.setProps({ backOffice })
				expect(vueWrapper.find('.amelipro-footer__content').classes('flex-column')).toBe(false)
				expect(vueWrapper.find('.amelipro-footer__content').classes('flex-row')).toBe(false)
				expect(vueWrapper.find('.amelipro-footer__content').classes('justify-center')).toBe(true)
				expect(vueWrapper.find('.amelipro-footer__content').classes('justify-space-between')).toBe(false)

				displayWrapper.vm.resetDefaults()
			})

			it('display width sets attribute style', async () => {
				displayWrapper.vm.setWidth(1000)
				await vueWrapper.vm.$nextTick()
				expect(vueWrapper.find('.amelipro-footer__content').attributes('style')).toBe('width: 100%;')

				displayWrapper.vm.setWidth(1072)
				await vueWrapper.vm.$nextTick()
				expect(vueWrapper.find('.amelipro-footer__content').attributes('style')).toBe('width: 980px;')

				displayWrapper.vm.setWidth(1240)
				await vueWrapper.vm.$nextTick()
				expect(vueWrapper.find('.amelipro-footer__content').attributes('style')).toBe('width: 1144px;')

				displayWrapper.vm.resetDefaults()
			})
		})

		describe('footer version', () => {
			it('prop backoffice sets footer version visibility', async () => {
				expect(vueWrapper.find('.footer-version').exists()).toBe(true)

				const { backOffice } = modifiedPropValues()
				await vueWrapper.setProps({ backOffice })
				expect(vueWrapper.find('.footer-version').exists()).toBe(false)
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.find('.footer-version').attributes('id')).toBeUndefined()

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.footer-version').attributes('id')).toBe('modified-unique-id-version')
			})

			it('display width sets attribute class', async () => {
				displayWrapper.vm.setMdAndUp(true)
				await vueWrapper.vm.$nextTick()
				expect(vueWrapper.find('.footer-version').classes('d-none')).toBe(false)

				displayWrapper.vm.setMdAndUp(false)
				await vueWrapper.vm.$nextTick()
				expect(vueWrapper.find('.footer-version').classes('d-none')).toBe(true)

				displayWrapper.vm.resetDefaults()
			})

			it('prop version sets version content', async () => {
				expect(vueWrapper.find('.footer-version').text()).toBe('X.X.X')

				const { version } = modifiedPropValues()
				await vueWrapper.setProps({ version })
				expect(vueWrapper.find('.footer-version').text()).toBe('Modified version')
			})
		})

		describe('footer contact', () => {
			it('prop backoffice sets footer contact visibility', async () => {
				expect(vueWrapper.find('.amelipro-footer__contact').exists()).toBe(true)

				const { backOffice } = modifiedPropValues()
				await vueWrapper.setProps({ backOffice })
				expect(vueWrapper.find('.amelipro-footer__contact').exists()).toBe(false)
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.find('.amelipro-footer__contact').attributes('id')).toBeUndefined()

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.amelipro-footer__contact').attributes('id')).toBe('modified-unique-id-contact')
			})

			it('display width & prop backOffice set attribute class', async () => {
				displayWrapper.vm.setMdAndUp(true)
				await vueWrapper.vm.$nextTick()
				expect(vueWrapper.find('.amelipro-footer__contact').classes('mt-1')).toBe(true)
				expect(vueWrapper.find('.amelipro-footer__contact').classes('mr-4')).toBe(true)

				displayWrapper.vm.setMdAndUp(false)
				await vueWrapper.vm.$nextTick()
				expect(vueWrapper.find('.amelipro-footer__contact').classes('mt-1')).toBe(false)
				expect(vueWrapper.find('.amelipro-footer__contact').classes('mr-4')).toBe(false)

				displayWrapper.vm.resetDefaults()
			})
		})

		describe('footer list', () => {
			it('prop backoffice sets footer list visibility', async () => {
				expect(vueWrapper.find('.amelipro-footer__list').exists()).toBe(true)

				const { backOffice } = modifiedPropValues()
				await vueWrapper.setProps({ backOffice })
				expect(vueWrapper.find('.amelipro-footer__list').exists()).toBe(false)
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.find('.amelipro-footer__list').attributes('id')).toBeUndefined()

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.amelipro-footer__list').attributes('id')).toBe('modified-unique-id-list')
			})

			it('display width & prop backOffice set attribute class', async () => {
				displayWrapper.vm.setMdAndUp(true)
				await vueWrapper.vm.$nextTick()
				expect(vueWrapper.find('.amelipro-footer__list').classes('justify-end')).toBe(true)
				expect(vueWrapper.find('.amelipro-footer__list').classes('justify-center')).toBe(false)

				displayWrapper.vm.setMdAndUp(false)
				await vueWrapper.vm.$nextTick()
				expect(vueWrapper.find('.amelipro-footer__list').classes('justify-end')).toBe(false)
				expect(vueWrapper.find('.amelipro-footer__list').classes('justify-center')).toBe(true)

				displayWrapper.vm.resetDefaults()
			})
		})

		describe('footer a11y text', () => {
			it('props noA11y & noLinkA11y set a11y text visibility', async () => {
				expect(vueWrapper.find('.a11y-text').exists()).toBe(false)

				const { noA11y, noLinkA11y } = modifiedPropValues()
				await vueWrapper.setProps({ noLinkA11y })
				expect(vueWrapper.find('.a11y-text').exists()).toBe(true)

				await vueWrapper.setProps({ noA11y })
				expect(vueWrapper.find('.a11y-text').exists()).toBe(false)
			})

			it('prop uniqueId sets attribute id', async () => {
				const { noLinkA11y } = modifiedPropValues()
				await vueWrapper.setProps({ noLinkA11y })
				expect(vueWrapper.find('.a11y-text').attributes('id')).toBeUndefined()

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.a11y-text').attributes('id')).toBe('modified-unique-id-a11y-text')
			})

			it('prop a11yCompliance sets a11y text content', async () => {
				const { noLinkA11y } = modifiedPropValues()
				await vueWrapper.setProps({ noLinkA11y })

				expect(vueWrapper.find('.a11y-text').element.textContent).toContain('Accessibilité\xa0: non conforme')

				await vueWrapper.setProps({ a11yCompliance: 'partiellement-conforme' })
				expect(vueWrapper.find('.a11y-text').element.textContent).toContain('Accessibilité\xa0: partiellement conforme')

				await vueWrapper.setProps({ a11yCompliance: 'conforme' })
				expect(vueWrapper.find('.a11y-text').element.textContent).toContain('Accessibilité\xa0: conforme')
			})
		})
		describe('footer backoffice text', () => {
			it('prop backoffice sets footer list visibility', async () => {
				expect(vueWrapper.find('.amelipro-footer__backoffice-text').exists()).toBe(false)

				const { backOffice } = modifiedPropValues()
				await vueWrapper.setProps({ backOffice })
				expect(vueWrapper.find('.amelipro-footer__backoffice-text').exists()).toBe(true)
			})

			it('prop uniqueId sets attribute id', async () => {
				const { backOffice, uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ backOffice })

				expect(vueWrapper.find('.amelipro-footer__backoffice-text').attributes('id')).toBeUndefined()

				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.amelipro-footer__backoffice-text').attributes('id')).toBe('modified-unique-id-backoffice-text')
			})

			it('props backOfficeText & version set backoffice text content', async () => {
				const { backOffice, backOfficeText, version } = modifiedPropValues()
				await vueWrapper.setProps({ backOffice })

				expect(vueWrapper.find('.amelipro-footer__backoffice-text').text()).toBe('CNAM -  - Version X.X.X')

				await vueWrapper.setProps({ backOfficeText })
				expect(vueWrapper.find('.amelipro-footer__backoffice-text').text()).toBe('CNAM - Modified back office text - Version X.X.X')

				await vueWrapper.setProps({ version })
				expect(vueWrapper.find('.amelipro-footer__backoffice-text').text()).toBe('CNAM - Modified back office text - Version Modified version')
			})
		})

		describe('footer version mobile', () => {
			it('prop backoffice sets footer version visibility', async () => {
				expect(vueWrapper.find('.footer-version--mobile').exists()).toBe(true)

				const { backOffice } = modifiedPropValues()
				await vueWrapper.setProps({ backOffice })
				expect(vueWrapper.find('.footer-version--mobile').exists()).toBe(false)
			})

			it('display width sets attribute class', async () => {
				displayWrapper.vm.setMdAndUp(true)
				await vueWrapper.vm.$nextTick()
				expect(vueWrapper.find('.footer-version--mobile').classes('d-none')).toBe(true)
				expect(vueWrapper.find('.footer-version--mobile').classes('d-flex')).toBe(false)

				displayWrapper.vm.setMdAndUp(false)
				await vueWrapper.vm.$nextTick()
				expect(vueWrapper.find('.footer-version--mobile').classes('d-none')).toBe(false)
				expect(vueWrapper.find('.footer-version--mobile').classes('d-flex')).toBe(true)

				displayWrapper.vm.resetDefaults()
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.find('.footer-version--mobile p').attributes('id')).toBeUndefined()

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.footer-version--mobile p').attributes('id')).toBe('modified-unique-id-version-mobile')
			})

			it('prop version sets version content', async () => {
				expect(vueWrapper.find('.footer-version--mobile p').text()).toBe('X.X.X')

				const { version } = modifiedPropValues()
				await vueWrapper.setProps({ version })
				expect(vueWrapper.find('.footer-version--mobile p').text()).toBe('Modified version')
			})
		})
	})

	describe('Setting props should update props or attributes of inner components', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproFooter>>

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproFooter, { props: requiredPropValues() })
		})

		describe('AmeliproBtn site map', () => {
			const findBtn = () => vueWrapper.findComponent<typeof AmeliproBtn>('.amelipro-footer__site-map-btn')
			it('prop noSiteMap sets btn visibility', async () => {
				expect(findBtn().exists()).toBe(true)

				const { noSiteMap } = modifiedPropValues()
				await vueWrapper.setProps({ noSiteMap })
				expect(findBtn().exists()).toBe(false)
			})

			it('prop uniqueId sets prop uniqueId', async () => {
				expect(findBtn().props('uniqueId')).toBe(testHelper.default('uniqueId'))

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(findBtn().props('uniqueId')).toBe(`${testHelper.modified('uniqueId')}-site-map-btn`)
			})

			it('prop siteMapHref sets attribute href', async () => {
				expect(findBtn().attributes('href')).toBe(testHelper.default('siteMapHref'))

				const { siteMapHref } = modifiedPropValues()
				await vueWrapper.setProps({ siteMapHref })
				expect(findBtn().attributes('href')).toBe(testHelper.modified('siteMapHref'))
			})

			it('prop siteMapTarget sets attribute target', async () => {
				expect(findBtn().attributes('target')).toBe(testHelper.default('siteMapTarget'))

				const { siteMapTarget } = modifiedPropValues()
				await vueWrapper.setProps({ siteMapTarget })
				expect(findBtn().attributes('target')).toBe(testHelper.modified('siteMapTarget'))
			})

			it('prop siteMapTo sets attribute to', async () => {
				expect(findBtn().attributes('to')).toBe(testHelper.default('siteMapTo'))

				const { siteMapTo } = modifiedPropValues()
				await vueWrapper.setProps({ siteMapTo })
				expect(findBtn().attributes('to')).toBe(testHelper.modified('siteMapTo'))
			})
		})

		describe('AmeliproBtn configuration', () => {
			const findBtn = () => vueWrapper.findComponent<typeof AmeliproBtn>('.amelipro-footer__config-btn')
			it('prop noConfiguration sets btn visibility', async () => {
				expect(findBtn().exists()).toBe(true)

				const { noConfiguration } = modifiedPropValues()
				await vueWrapper.setProps({ noConfiguration })
				expect(findBtn().exists()).toBe(false)
			})

			it('prop uniqueId sets prop id', async () => {
				expect(findBtn().props('uniqueId')).toBe(testHelper.default('uniqueId'))

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(findBtn().props('uniqueId')).toBe(`${testHelper.modified('uniqueId')}-config-btn`)
			})

			it('prop configurationHref sets attribute href', async () => {
				expect(findBtn().attributes('href')).toBe(testHelper.default('configurationHref'))

				const { configurationHref } = modifiedPropValues()
				await vueWrapper.setProps({ configurationHref })
				expect(findBtn().attributes('href')).toBe(testHelper.modified('configurationHref'))
			})

			// TODO: pourquoi ce test ne passe-t-il pas ?
			it.skip('prop configurationLabel sets label text', async () => {
				expect(findBtn().text()).toBe(testHelper.default('configurationLabel'))

				const { configurationLabel } = modifiedPropValues()
				await vueWrapper.setProps({ configurationLabel })
				expect(findBtn().text()).toBe(testHelper.modified('configurationLabel'))
			})

			it('prop configurationTarget sets attribute target', async () => {
				expect(findBtn().attributes('target')).toBe(testHelper.default('configurationTarget'))

				const { configurationTarget } = modifiedPropValues()
				await vueWrapper.setProps({ configurationTarget })
				expect(findBtn().attributes('target')).toBe(testHelper.modified('configurationTarget'))
			})

			it('prop configurationTo sets attribute to', async () => {
				expect(findBtn().attributes('to')).toBe(testHelper.default('configurationTo'))

				const { configurationTo } = modifiedPropValues()
				await vueWrapper.setProps({ configurationTo })
				expect(findBtn().attributes('to')).toBe(testHelper.modified('configurationTo'))
			})
		})

		describe('AmeliproBtn legal notice', () => {
			const findBtn = () => vueWrapper.findComponent<typeof AmeliproBtn>('.amelipro-footer__legal-notice-btn')
			it('prop noLegalNotice sets btn visibility', async () => {
				expect(findBtn().exists()).toBe(true)

				const { noLegalNotice } = modifiedPropValues()
				await vueWrapper.setProps({ noLegalNotice })
				expect(findBtn().exists()).toBe(false)
			})

			it('prop uniqueId sets prop id', async () => {
				expect(findBtn().props('uniqueId')).toBe(testHelper.default('uniqueId'))

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(findBtn().props('uniqueId')).toBe(`${testHelper.modified('uniqueId')}-legal-notice-btn`)
			})

			it('prop legalNoticeHref sets attribute href', async () => {
				expect(findBtn().attributes('href')).toBe(testHelper.default('legalNoticeHref'))

				const { legalNoticeHref } = modifiedPropValues()
				await vueWrapper.setProps({ legalNoticeHref })
				expect(findBtn().attributes('href')).toBe(testHelper.modified('legalNoticeHref'))
			})

			it('prop legalNoticeTarget sets attribute target', async () => {
				expect(findBtn().attributes('target')).toBe(testHelper.default('legalNoticeTarget'))

				const { legalNoticeTarget } = modifiedPropValues()
				await vueWrapper.setProps({ legalNoticeTarget })
				expect(findBtn().attributes('target')).toBe(testHelper.modified('legalNoticeTarget'))
			})

			it('prop legalNoticeTo sets attribute to', async () => {
				expect(findBtn().attributes('to')).toBe(testHelper.default('legalNoticeTo'))

				const { legalNoticeTo } = modifiedPropValues()
				await vueWrapper.setProps({ legalNoticeTo })
				expect(findBtn().attributes('to')).toBe(testHelper.modified('legalNoticeTo'))
			})
		})

		describe('AmeliproBtn CGU', () => {
			const findBtn = () => vueWrapper.findComponent<typeof AmeliproBtn>('.amelipro-footer__cgu-btn')
			it('prop noCgu sets btn visibility', async () => {
				expect(findBtn().exists()).toBe(true)

				const { noCgu } = modifiedPropValues()
				await vueWrapper.setProps({ noCgu })
				expect(findBtn().exists()).toBe(false)
			})

			it('prop uniqueId sets prop id', async () => {
				expect(findBtn().props('uniqueId')).toBe(testHelper.default('uniqueId'))

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(findBtn().props('uniqueId')).toBe(`${testHelper.modified('uniqueId')}-cgu-btn`)
			})

			it('prop cguHref sets attribute href', async () => {
				expect(findBtn().attributes('href')).toBe(testHelper.default('cguHref'))

				const { cguHref } = modifiedPropValues()
				await vueWrapper.setProps({ cguHref })
				expect(findBtn().attributes('href')).toBe(testHelper.modified('cguHref'))
			})

			it('prop cguTarget sets attribute target', async () => {
				expect(findBtn().attributes('target')).toBe(testHelper.default('cguTarget'))

				const { cguTarget } = modifiedPropValues()
				await vueWrapper.setProps({ cguTarget })
				expect(findBtn().attributes('target')).toBe(testHelper.modified('cguTarget'))
			})

			it('prop cguTo sets attribute to', async () => {
				expect(findBtn().attributes('to')).toBe(testHelper.default('cguTo'))

				const { cguTo } = modifiedPropValues()
				await vueWrapper.setProps({ cguTo })
				expect(findBtn().attributes('to')).toBe(testHelper.modified('cguTo'))
			})
		})

		describe('AmeliproBtn a11y link', () => {
			const findBtn = () => vueWrapper.findComponent<typeof AmeliproBtn>('.amelipro-footer__a11y-btn')
			it('props noA11y & noLinkA11y set btn visibility', async () => {
				expect(findBtn().exists()).toBe(true)

				const { noA11y, noLinkA11y } = modifiedPropValues()
				await vueWrapper.setProps({ noLinkA11y })
				expect(findBtn().exists()).toBe(false)

				await vueWrapper.setProps({ noA11y, noLinkA11y: false })
				expect(findBtn().exists()).toBe(false)
			})

			it('prop uniqueId sets prop id', async () => {
				expect(findBtn().props('uniqueId')).toBe(testHelper.default('uniqueId'))

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(findBtn().props('uniqueId')).toBe(`${testHelper.modified('uniqueId')}-a11y-btn`)
			})

			it('prop a11yHref sets attribute href', async () => {
				expect(findBtn().attributes('href')).toBe(testHelper.default('a11yHref'))

				const { a11yHref } = modifiedPropValues()
				await vueWrapper.setProps({ a11yHref })
				expect(findBtn().attributes('href')).toBe(testHelper.modified('a11yHref'))
			})

			it('prop a11yTarget sets attribute target', async () => {
				expect(findBtn().attributes('target')).toBe(testHelper.default('a11yTarget'))

				const { a11yTarget } = modifiedPropValues()
				await vueWrapper.setProps({ a11yTarget })
				expect(findBtn().attributes('target')).toBe(testHelper.modified('a11yTarget'))
			})

			it('prop a11yTo sets attribute to', async () => {
				expect(findBtn().attributes('to')).toBe(testHelper.default('a11yTo'))

				const { a11yTo } = modifiedPropValues()
				await vueWrapper.setProps({ a11yTo })
				expect(findBtn().attributes('to')).toBe(testHelper.modified('a11yTo'))
			})
		})
	})

	// TODO: réparer ces tests
	describe.skip('Events', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproFooter>>

		const buttonFinder = (n: number) => vueWrapper.findAllComponents(AmeliproBtn).at(n)

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproFooter, { props: requiredPropValues() })
		})

		it('test siteMapEvent', async () => {
			expect(vueWrapper.emitted('site-map-event')).toStrictEqual(undefined)
			expect(buttonFinder(0)?.exists()).toBe(true)
			await buttonFinder(0)?.trigger('click')
			expect(vueWrapper.emitted('site-map-event')).toStrictEqual([[]])
		})

		it('test aboutEvent', async () => {
			expect(vueWrapper.emitted('about-event')).toStrictEqual(undefined)
			await buttonFinder(1)?.trigger('click')
			expect(vueWrapper.emitted('about-event')).toStrictEqual([[]])
		})

		it('test configEvent', async () => {
			expect(vueWrapper.emitted('config-event')).toStrictEqual(undefined)
			await buttonFinder(2)?.trigger('click')
			expect(vueWrapper.emitted('config-event')).toStrictEqual([[]])
		})

		it('test legalNoticeEvent', async () => {
			expect(vueWrapper.emitted('legal-notice-event')).toStrictEqual(undefined)
			await buttonFinder(3)?.trigger('click')
			expect(vueWrapper.emitted('legal-notice-event')).toStrictEqual([[]])
		})

		it('test cguEvent', async () => {
			expect(vueWrapper.emitted('cgu-event')).toStrictEqual(undefined)
			await buttonFinder(4)?.trigger('click')
			expect(vueWrapper.emitted('cgu-event')).toStrictEqual([[]])
		})

		it('test a11yEvent', async () => {
			expect(vueWrapper.emitted('a11y-event')).toStrictEqual(undefined)
			await buttonFinder(5)?.trigger('click')
			expect(vueWrapper.emitted('a11y-event')).toStrictEqual([[]])
		})
	})

	describe('Slots', () => {
		describe.todo('AmeliproBtn site map #default')
		describe.todo('AmeliproBtn configuration #default')
		describe.todo('AmeliproBtn legal notice #default')
		describe.todo('AmeliproBtn CGU #default')
		describe.todo('AmeliproBtn a11y link #default')
	})
})
