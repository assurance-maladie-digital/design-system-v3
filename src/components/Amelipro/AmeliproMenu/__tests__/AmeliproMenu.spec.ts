import { VueWrapper, mount, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import AmeliproMenu from '../AmeliproMenu.vue'
import type { AmeliproMenuItem } from '../types'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import type { PropType } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import TestHelper from '@tests/helpers/TestHelper'
import { attachToApp } from '@tests/helpers/utils'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproMenu> = {
	homeHref: {
		type: String,
		default: undefined,
	},
	homeTo: {
		type: [Array, Object, String] as PropType<RouteLocationRaw>,
		default: undefined,
	},
	items: {
		type: Array as PropType<AmeliproMenuItem[]>,
		default: () => [],
	},
	menuHeader: {
		type: String,
		default: 'Titre du service',
	},
	uniqueId: {
		type: String,
		required: true,
	},
}

const requiredPropValues = (): ComponentProps<typeof AmeliproMenu> => ({ uniqueId: 'required-unique-id' })

const modifiedPropValues = (): ComponentProps<typeof AmeliproMenu> => ({
	homeHref: 'modified-home-href',
	homeTo: 'modified-home-to',
	items: [
		{
			actif: false,
			children: [
				{
					actif: false,
					children: [
						{
							id: 'modified-subsubmenu-1-1-1',
							name: 'Modified SubSubMenu 1.1.1',
							to: '/modified/test',
						},
					],
					id: 'modified-submenu-1-1',
					name: 'Modified SubMenu 1.1',
				},
			],
			id: 'modified-menu-1',
			name: 'Modified Menu 1',
		},
	],
	menuHeader: 'Modified menu header',
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(AmeliproMenu)
testHelper
	.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)
	.setMountOptions({
		global: {
			stubs: {
				VNavigationDrawer: { template: '<div><slot /></div>' },
				VDivider: true,
			},
		},
	})

describe('AmeliproMenu', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let wrapper: VueWrapper<InstanceType<typeof AmeliproMenu>>

		beforeEach(() => {
			wrapper = shallowMount(AmeliproMenu, {
				autoAttach: attachToApp(),
				global: {
					stubs: {
						VNavigationDrawer: true,
						VDivider: true,
					},
				},
				props: requiredPropValues(),
			})
		})

		it('prop uniqueId sets attribute id on root container', async () => {
			expect(wrapper.find('.amelipro-menu').attributes('id')).toBe(`${testHelper.default('uniqueId')}-container`)
			const { uniqueId } = modifiedPropValues()
			await wrapper.setProps({ uniqueId })
			expect(wrapper.find('.amelipro-menu').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-container`)
		})
	})

	describe('Public functions', () => {
		let wrapper: VueWrapper<InstanceType<typeof AmeliproMenu>>

		describe('test setFocus', () => {
			beforeEach(() => {
				wrapper = mount(AmeliproMenu, {
					autoAttach: attachToApp(),
					global: {
						stubs: {
							VNavigationDrawer: { template: '<div><slot /></div>' },
							VDivider: true,
						},
					},
					props: modifiedPropValues(),
				})
			})

			it('setFocus on close button', async () => {
				await wrapper.find('.amelipro-menu__btn--open').trigger('click')
				expect(wrapper.find(`#${testHelper.modified('uniqueId')}-close-menu-btn`).exists()).toBe(true)
				await wrapper.find(`#${testHelper.modified('uniqueId')}-close-menu-btn`).trigger('keydown', { key: 'Tab', shiftKey: true })
				expect(wrapper.find(`#${testHelper.modified('uniqueId')}-return-home-menu-btn`).exists()).toBe(true)
			})

			it('setFocus on home button', async () => {
				await wrapper.find('.amelipro-menu__btn--open').trigger('click')
				expect(wrapper.find(`#${testHelper.modified('uniqueId')}-return-home-menu-btn`).exists()).toBe(true)
				await wrapper.find(`#${testHelper.modified('uniqueId')}-return-home-menu-btn`).trigger('keydown', { key: 'Tab' })
				expect(wrapper.find(`#${testHelper.modified('uniqueId')}-close-menu-btn`).exists()).toBe(true)
			})
		})
	})

	describe('Events', () => {
		let wrapper: VueWrapper<InstanceType<typeof AmeliproMenu>>

		beforeEach(() => {
			wrapper = mount(AmeliproMenu, {
				autoAttach: true,
				global: {
					stubs: {
						VNavigationDrawer: true,
						VDivider: true,
					},
				},
				props: modifiedPropValues(),
			})
		})

		it('Escape key emits escape event', async () => {
			await wrapper.find('.amelipro-menu__btn--open').trigger('click')
			expect(wrapper.emitted('escape')).toBeUndefined()
			await window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' }))
			expect(wrapper.emitted('escape')).toStrictEqual([[]])
		})
	})
})
