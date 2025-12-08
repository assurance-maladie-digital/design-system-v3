import { VueWrapper, mount, shallowMount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { AmeliproBtn } from '@/components/'
import AmeliproDropdownMenu from '../AmeliproDropdownMenu/AmeliproDropdownMenu.vue'
import AmeliproMessagingLayout from '../AmeliproMessagingLayout.vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import { DisplayTestComponent } from '@tests/helpers/utils'
import type { ExpectedPropOptions } from '@tests/types'
import type { MessagingMenuTypes } from '../types'
import type { PropType } from 'vue'
import TestHelper from '@tests/helpers/TestHelper'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproMessagingLayout> = {
	items: {
		type: Array as PropType<MessagingMenuTypes[]>,
		default: () => [],
	},
	mainContentBg: {
		type: String,
		default: 'ap-grey-lighten-5',
	},
	menuWidth: {
		type: String,
		default: '255px',
	},
	newMessageDisable: {
		type: Boolean,
		default: false,
	},
	uniqueId: {
		type: String,
		required: true,
	},
}

const itemsData = () => [
	{
		href: '#',
		icon: 'discussion',
		label: 'À traiter',
		unreadNumber: 1,
	},
	{
		active: true,
		href: '#',
		icon: 'horlogeFlecheDroiteNoCircle',
		label: 'En cours',
	},
	{
		href: '#',
		icon: 'ecrire',
		label: 'Brouillons',
		unreadNumber: 1,
	},
	{
		href: '#',
		icon: 'boite',
		label: 'Clos',
		unreadNumber: 1,
	},
]

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproMessagingLayout> => ({ uniqueId: 'required-unique-id' })

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproMessagingLayout> => ({
	items: itemsData(),
	mainContentBg: 'ap-white',
	menuWidth: '300px',
	newMessageDisable: true,
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(AmeliproMessagingLayout)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

const displayWrapper = mount(DisplayTestComponent)

describe('AmeliproMessagingLayout', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproMessagingLayout>>

		describe('root', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproMessagingLayout, { props: requiredPropValues() })
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.attributes('id')).toBe(testHelper.default('uniqueId'))

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.attributes('id')).toBe(testHelper.modified('uniqueId'))
			})
		})

		describe('menu', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproMessagingLayout, { props: requiredPropValues() })
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.find('.messaging-menu').attributes('id')).toBe(`${testHelper.default('uniqueId')}-menu`)

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.messaging-menu').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-menu`)
			})

			it('prop menuWidth & display width set attribute style', async () => {
				displayWrapper.vm.setMdAndUp(true)
				await vueWrapper.vm.$nextTick()
				expect(vueWrapper.find('.messaging-menu').attributes('style')).toBe('min-width: 255px;')

				const { menuWidth } = modifiedPropValues()
				await vueWrapper.setProps({ menuWidth })
				expect(vueWrapper.find('.messaging-menu').attributes('style')).toBe('min-width: 300px;')

				displayWrapper.vm.setMdAndUp(false)
				await vueWrapper.vm.$nextTick()
				expect(vueWrapper.find('.messaging-menu').attributes('style')).toBe('min-width: 100%;')
			})
		})

		describe('menu desktop', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproMessagingLayout, { props: requiredPropValues() })
			})

			afterEach(() => {
				displayWrapper.vm.resetDefaults()
			})

			it('prop display width sets tag visibility', async () => {
				displayWrapper.vm.setMdAndUp(true)
				await vueWrapper.vm.$nextTick()
				expect(vueWrapper.find('.messaging-menu--desktop').exists()).toBe(true)

				displayWrapper.vm.setMdAndUp(false)
				await vueWrapper.vm.$nextTick()
				expect(vueWrapper.find('.messaging-menu--desktop').exists()).toBe(false)
			})

			it('prop uniqueId sets attribute id', async () => {
				displayWrapper.vm.setMdAndUp(true)
				await vueWrapper.vm.$nextTick()
				expect(vueWrapper.find('.messaging-menu--desktop').attributes('id')).toBe(`${testHelper.default('uniqueId')}-messaging-menu-desktop`)

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.messaging-menu--desktop').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-messaging-menu-desktop`)
			})
		})

		describe('menu list', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproMessagingLayout, { props: requiredPropValues() })
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.find('.messaging-menu--desktop .list-style-none').attributes('id')).toBe(`${testHelper.default('uniqueId')}-messaging-menu-list`)

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.messaging-menu--desktop .list-style-none').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-messaging-menu-list`)
			})
		})

		describe('menu list items', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproMessagingLayout, { props: requiredPropValues() })
			})

			it('prop items sets items', async () => {
				expect(vueWrapper.findAll('.messaging-menu--desktop .list-style-none li').length).toBe(0)

				const { items } = modifiedPropValues()
				await vueWrapper.setProps({ items })
				expect(vueWrapper.findAll('.messaging-menu--desktop .list-style-none li').length).toBe(4)
			})
		})

		describe('menu mobile', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproMessagingLayout, { props: requiredPropValues() })
			})

			afterEach(() => {
				displayWrapper.vm.resetDefaults()
			})

			it('prop display width sets tag visibility', async () => {
				displayWrapper.vm.setMdAndUp(true)
				await vueWrapper.vm.$nextTick()
				expect(vueWrapper.find('.messaging-menu__dropdown-menu').exists()).toBe(false)

				displayWrapper.vm.setMdAndUp(false)
				await vueWrapper.vm.$nextTick()
				expect(vueWrapper.find('.messaging-menu__dropdown-menu').exists()).toBe(true)
			})

			it('prop uniqueId sets attribute id', async () => {
				displayWrapper.vm.setMdAndUp(false)
				await vueWrapper.vm.$nextTick()
				expect(vueWrapper.find('.messaging-menu__dropdown-menu').attributes('id')).toBe(`${testHelper.default('uniqueId')}-messaging-menu-mobile`)

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.messaging-menu__dropdown-menu').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-messaging-menu-mobile`)
			})
		})

		describe('content', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproMessagingLayout, { props: requiredPropValues() })
			})

			it('prop uniqueId sets attribute id', async () => {
				await vueWrapper.vm.$nextTick()
				expect(vueWrapper.find('.amelipro-messaging-layout__content').attributes('id')).toBe(`${testHelper.default('uniqueId')}-content`)

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.amelipro-messaging-layout__content').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-content`)
			})

			it('prop mainContentBg sets prop style', async () => {
				expect(vueWrapper.find('.amelipro-messaging-layout__content').attributes('style')).toBe('background-color: #FAFAFA;')

				const { mainContentBg } = modifiedPropValues()
				await vueWrapper.setProps({ mainContentBg })
				expect(vueWrapper.find('.amelipro-messaging-layout__content').attributes('style')).toBe('background-color: #FFFFFF;')
			})
		})
	})

	describe('Computed', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproMessagingLayout>>
		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproMessagingLayout, { props: { ...requiredPropValues(), items: testHelper.modified('items') } })
		})

		afterEach(() => {
			displayWrapper.vm.resetDefaults()
		})

		it('test menuItems', async () => {
			displayWrapper.vm.setMdAndUp(false)
			await vueWrapper.vm.$nextTick()
			expect(vueWrapper.findComponent(AmeliproDropdownMenu).props('items')).toStrictEqual([
				{
					active: undefined,
					href: '#',
					label: 'À traiter',
					to: undefined,
				},
				{
					active: true,
					href: '#',
					label: 'En cours',
					to: undefined,
				},
				{
					active: undefined,
					href: '#',
					label: 'Brouillons',
					to: undefined,
				},
				{
					active: undefined,
					href: '#',
					label: 'Clos',
					to: undefined,
				},
			])
		})
	})

	describe('Events', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproMessagingLayout>>
		it('test emitNewMessageEvent', async () => {
			vueWrapper = shallowMount(AmeliproMessagingLayout, { props: { ...requiredPropValues(), newMessageDisable: false } })
			expect(vueWrapper.emitted('click-new-message')).toStrictEqual(undefined)

			await vueWrapper.findComponent(AmeliproBtn).trigger('click')
			expect(vueWrapper.emitted('click-new-message')).toStrictEqual([[]])
		})
	})
})
