import { VueWrapper, mount, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AmeliproHeader from '../AmeliproHeader.vue'
import AmeliproHeaderBar from '../AmeliproHeaderBar/AmeliproHeaderBar.vue'
import type { AmeliproHeaderInfos } from '../types'
import type { AmeliproMenuItem } from '@/components/Amelipro/AmeliproMenu/types'
import type { ComponentProps } from 'vue-component-type-helpers'
import { DisplayTestComponent } from '@tests/helpers/utils'
import type { ExpectedPropOptions } from '@tests/types'
import type { IServiceMenuInfos } from '@/components/Amelipro/ServiceMenu/types'
import type { PropType } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import type { StructureMenuInfosForHeader } from '@/components/Amelipro/StructureMenu/types'
import TestHelper from '@tests/helpers/TestHelper'
import type { UserInformationSummaryInfos } from '@/components/Amelipro/UserInformationSummary/types'
import UserMenu from '@/components/Amelipro/UserMenu/UserMenu.vue'
import type { UserMenuInfos } from '@/components/Amelipro/UserMenu/types'

// TODO: corriger le warning "[Vue warn]: Unable to locate target #service-menu-infos-unique-id-service-menu at <VOverlay ref=Ref< undefined > id="v-menu-10" class="v-menu"  ... > "

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproHeader> = {
	ameliproHeaderInfos: {
		type: Object as PropType<AmeliproHeaderInfos>,
		default: undefined,
	},
	backBtnHref: {
		type: String,
		default: undefined,
	},
	backBtnLabel: {
		type: String,
		default: 'Retour',
	},
	backBtnTo: {
		type: [Array, Object, String] as PropType<RouteLocationRaw>,
		default: undefined,
	},
	backoffice: {
		type: Boolean,
		default: false,
	},
	headerTitle: {
		type: String,
		default: undefined,
	},
	homeHref: {
		type: String,
		default: undefined,
	},
	homeLink: {
		type: [Array, Object, String] as PropType<RouteLocationRaw>,
		default: undefined,
	},
	noRightPart: {
		type: Boolean,
		default: false,
	},
	noSubPart: {
		type: Boolean,
		default: false,
	},
	serviceHomeHref: {
		type: String,
		default: undefined,
	},
	serviceHomeTo: {
		type: [Array, Object, String] as PropType<RouteLocationRaw>,
		default: undefined,
	},
	serviceName: {
		type: String,
		default: undefined,
	},
	serviceSubTitle: {
		type: String,
		default: undefined,
	},
	subMenu: {
		type: Boolean,
		default: false,
	},
	subMenuItems: {
		type: Array as PropType<AmeliproMenuItem[]>,
		default: () => [],
	},
	uniqueId: {
		type: String,
		default: undefined,
	},
	unlogged: {
		type: Boolean,
		default: false,
	},
}

const serviceMenuInfosData = (): IServiceMenuInfos => ({
	icon: 'service-menu-infos-icon',
	messageToDisplay: 'Service menu infos message to display',
	servicesContact: [],
	servicesPatient: [],
	servicesPs: [],
	uniqueId: 'service-menu-infos-unique-id',
})

const structureMenuInfosData = (): StructureMenuInfosForHeader => ({
	structuresTabs: [],
	uniqueId: 'structure-menu-infos-unique-id',
	userAdeli: 'structure-menu-infos-user-adeli',
	userName: 'structure-menu-infos-user-name',
	userProfession: 'structure-menu-infos-user-profession',
	userRpps: 'structure-menu-infos-user-rpps',
})

const userInformationSummaryInfosData = (): UserInformationSummaryInfos => ({
	adresseLigne2: '01630 SAINT GENIS POUILLY',
	categorieSpecialite: 'Médecin Radiologue',
	nomCabinet: 'Cabinet : 110 R GERMAINE TILLION',
	userName: 'SAN SOPHIE LE BERQUIER',
})

const userMenuInfosData = (): UserMenuInfos => ({
	userMenuDetailsInfos: {
		adeli: '011006277',
		email: 'sophieberquier@cpam.fr',
		userName: 'SAN SOPHIE LE BERQUIER',
	},
})

const ameliproHeaderInfosData = (): AmeliproHeaderInfos => ({
	backoffice: true,
	headerTitle: 'Amelipro header infos header title',
	homeHref: '/amelipro-header-infos/home-href',
	homeLink: '/amelipro-header-infos/home-link',
	serviceMenuInfos: serviceMenuInfosData(),
	signatureInfos: {
		clickFn: vi.fn(),
		href: '/amelipro-header-infos/signature-href',
		to: '/amelipro-header-infos/signature-to',
	},
	structureMenuInfos: structureMenuInfosData(),
	userInformationSummaryInfos: userInformationSummaryInfosData(),
	userMenuInfos: userMenuInfosData(),
})

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproHeader> => ({})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproHeader> => ({
	ameliproHeaderInfos: ameliproHeaderInfosData(),
	backBtnHref: '#modified-back-btn-href',
	backBtnLabel: 'Modified back btn label',
	backBtnTo: '/modified-back-btn-to',
	backoffice: true,
	headerTitle: 'Modified header title',
	homeHref: '#modified-home-href',
	homeLink: '/modified-home-link',
	noRightPart: true,
	noSubPart: true,
	serviceHomeHref: '#modified-service-home-href',
	serviceHomeTo: '/modified-service-home-to',
	serviceName: 'Modified service name',
	serviceSubTitle: 'Modified service sub title',
	subMenu: true,
	subMenuItems: [
		{
			id: 'modified-sub-menu-items-id-1',
			name: 'Modified sub menu items 1',
		},
	],
	uniqueId: 'modified-unique-id',
	unlogged: true,

})

const testHelper = new TestHelper(AmeliproHeader)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

const displayWrapper = mount(DisplayTestComponent)

describe('AmeliproHeader', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update props of inner components', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproHeader>>

		describe('AmeliproHeaderBar', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproHeader, { props: requiredPropValues() })
			})

			it('prop uniqueId sets prop uniqueId', async () => {
				expect(vueWrapper.findComponent(AmeliproHeaderBar).props('uniqueId')).toBe(testHelper.default('uniqueId'))

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.findComponent(AmeliproHeaderBar).props('uniqueId')).toBe(testHelper.modified('uniqueId'))
			})

			it('prop homeHref & ameliproHeaderInfos.homeHref sets prop homeHref', async () => {
				expect(vueWrapper.findComponent(AmeliproHeaderBar).props('homeHref')).toBe(testHelper.default('homeHref'))

				const { homeHref, ameliproHeaderInfos } = modifiedPropValues()
				await vueWrapper.setProps({ homeHref })
				expect(vueWrapper.findComponent(AmeliproHeaderBar).props('homeHref')).toBe(testHelper.modified('homeHref'))

				await vueWrapper.setProps({ ameliproHeaderInfos })
				expect(vueWrapper.findComponent(AmeliproHeaderBar).props('homeHref')).toBe('/amelipro-header-infos/home-href')
			})

			it('prop homeLink & ameliproHeaderInfos.homeLink sets prop homeLink', async () => {
				expect(vueWrapper.findComponent(AmeliproHeaderBar).props('homeLink')).toBe(testHelper.default('homeLink'))

				const { homeLink, ameliproHeaderInfos } = modifiedPropValues()
				await vueWrapper.setProps({ homeLink })
				expect(vueWrapper.findComponent(AmeliproHeaderBar).props('homeLink')).toBe(testHelper.modified('homeLink'))

				await vueWrapper.setProps({ ameliproHeaderInfos })
				expect(vueWrapper.findComponent(AmeliproHeaderBar).props('homeLink')).toBe('/amelipro-header-infos/home-link')
			})

			it('display width sets prop innerWidth', async () => {
				displayWrapper.vm.setWidth(1)
				await vueWrapper.vm.$nextTick()
				expect(vueWrapper.findComponent(AmeliproHeaderBar).props('innerWidth')).toBe('100%')

				displayWrapper.vm.setWidth(1072)
				await vueWrapper.vm.$nextTick()
				expect(vueWrapper.findComponent(AmeliproHeaderBar).props('innerWidth')).toBe('980px')

				displayWrapper.vm.setWidth(1240)
				await vueWrapper.vm.$nextTick()
				expect(vueWrapper.findComponent(AmeliproHeaderBar).props('innerWidth')).toBe('1144px')
			})

			it('prop serviceSubTitle sets prop serviceSubTitle', async () => {
				expect(vueWrapper.findComponent(AmeliproHeaderBar).props('serviceSubTitle')).toBe(testHelper.default('serviceSubTitle'))

				const { serviceSubTitle } = modifiedPropValues()
				await vueWrapper.setProps({ serviceSubTitle })
				expect(vueWrapper.findComponent(AmeliproHeaderBar).props('serviceSubTitle')).toBe(testHelper.modified('serviceSubTitle'))
			})

			it('prop headerTitle & ameliproHeaderInfos.headerTitle sets prop serviceTitle', async () => {
				expect(vueWrapper.findComponent(AmeliproHeaderBar).props('serviceTitle')).toBe(testHelper.default('headerTitle'))

				const { headerTitle, ameliproHeaderInfos } = modifiedPropValues()
				await vueWrapper.setProps({ headerTitle })
				expect(vueWrapper.findComponent(AmeliproHeaderBar).props('serviceTitle')).toBe(testHelper.modified('headerTitle'))

				await vueWrapper.setProps({ ameliproHeaderInfos })
				expect(vueWrapper.findComponent(AmeliproHeaderBar).props('serviceTitle')).toBe('Amelipro header infos header title')
			})

			it('prop headerTitle & ameliproHeaderInfos.headerTitle sets prop themeAmelipro', async () => {
				expect(vueWrapper.findComponent(AmeliproHeaderBar).props('themeAmelipro')).toBe(true)

				const { headerTitle, ameliproHeaderInfos } = modifiedPropValues()
				await vueWrapper.setProps({ headerTitle })
				expect(vueWrapper.findComponent(AmeliproHeaderBar).props('themeAmelipro')).toBe(false)

				await vueWrapper.setProps({ ameliproHeaderInfos })
				expect(vueWrapper.findComponent(AmeliproHeaderBar).props('themeAmelipro')).toBe(false)
			})
		})
	})

	describe('Events', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproHeader>>
		const buttonFinder = () => vueWrapper.find('.navigation-bar-left-btn')

		beforeEach(() => {
			vueWrapper = mount(AmeliproHeader, { props: requiredPropValues() })
		})

		it('test backBtnEvent', async () => {
			expect(vueWrapper.emitted('back-btn-click')).toStrictEqual(undefined)
			await buttonFinder().trigger('click')
			expect(vueWrapper.emitted('back-btn-click')).toStrictEqual([[]])
		})
	})

	describe.skip('Slots', () => {
		describe.todo('#default #rightPart AmeliproIconBtn')
		describe.todo('#default #rightPart AmeliproIconBtn #prepend')
		describe.todo('#default #rightPart nav')
		describe.todo('#default #rightPart nav infos')
		describe.todo('#default #rightPart nav infos #userInformationSummary UserInformationSummary')
		describe.todo('#default #rightPart nav list')
		describe.todo('#default #rightPart nav list item')
		describe.todo('#default #rightPart nav list item #userMenu')
		describe.todo('#default #rightPart nav list item #userMenu UserMenu')
		describe.todo('#default #rightPart nav list item #userMenu UserMenu #complementaryInfo')
		describe.todo('#default #rightPart nav list item #userMenu UserMenu #complementaryInfo')

		describe.todo('#default ')
		describe.todo('#default ')
		describe.todo('#default ')
		describe.todo('#default ')
	})

	describe('Computed', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproHeader>>
		let slotWrapper: VueWrapper<InstanceType<typeof AmeliproHeader>>

		beforeEach(() => {
			vueWrapper = mount(AmeliproHeader, { props: requiredPropValues() })
			slotWrapper = mount(AmeliproHeader, {
				props: requiredPropValues(),
				slots: {
					notificationMenu: '<span id="notif-slot">Test notification slot</span>',
					serviceMenu: '<span id="service-slot">Test service slot</span>',
					structureMenu: '<span id="structure-slot">Test structure menu slot</span>',
					userMenu: '<span id="usermenu-slot">Test user menu slot</span>',
				},
				stubs: { AmeliproHeaderBar },
			})
		})

		it('Tests innerWidth', async () => {
			displayWrapper.vm.setWidth(1072)
			await vueWrapper.vm.$nextTick()
			expect(vueWrapper.find('.header-bar-content__container').attributes('style')).toStrictEqual('width: 980px; max-width: 980px;')
			displayWrapper.vm.setWidth(1071)
			await vueWrapper.vm.$nextTick()
			expect(vueWrapper.find('.header-bar-content__container').attributes('style')).toStrictEqual('width: 100%; max-width: 100%;')
			displayWrapper.vm.setWidth(1240)
			await vueWrapper.vm.$nextTick()
			expect(vueWrapper.find('.header-bar-content__container').attributes('style')).toStrictEqual('width: 1144px; max-width: 1144px;')
			displayWrapper.vm.setWidth(1072)
		})

		it('Tests hasUserMenu', async () => {
			// Default slot content
			expect(vueWrapper.findComponent(UserMenu).exists()).toBeFalsy()

			const { ameliproHeaderInfos } = modifiedPropValues()
			await vueWrapper.setProps({ ameliproHeaderInfos })
			expect(vueWrapper.findComponent(UserMenu).exists()).toBeTruthy()

			// Custom slot content
			expect(slotWrapper.find('#usermenu-slot').exists()).toBeTruthy()
		})

		it('Tests hasStructureMenu', () => {
			expect(slotWrapper.find('#structure-slot').exists()).toBeTruthy()
		})

		it('Tests hasServiceMenu', () => {
			expect(slotWrapper.find('#service-slot').exists()).toBeTruthy()
		})

		it('Tests hasNotificationMenu', () => {
			expect(vueWrapper.find('#notif-slot').exists()).toBeFalsy()
			expect(slotWrapper.find('#notif-slot').exists()).toBeTruthy()
		})
	})
})
