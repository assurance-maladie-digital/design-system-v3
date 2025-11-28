import { VueWrapper, mount, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { AmeliproBtn } from '@/components'
import AmeliproDropdownMenu from '../AmeliproDropdownMenu.vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { DropdownItem } from '../types'
import type { ExpectedPropOptions } from '@tests/types'
import type { PropType } from 'vue'
import TestHelper from '@tests/helpers/TestHelper'
import { attachToApp } from '@tests/helpers/utils'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproDropdownMenu> = {
	items: {
		type: Array as PropType<DropdownItem[]>,
		required: true,
	},
	label: {
		type: String,
		required: true,
	},
	menuWidth: {
		type: String,
		default: '100%',
	},
	uniqueId: {
		type: String,
		required: true,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproDropdownMenu> => ({
	items: [],
	label: 'Required label',
	uniqueId: 'required-unique-id',
})

const items = (): DropdownItem[] => ([
	{
		active: false,
		href: '#',
		label: 'Boîte de réception',
	},
	{
		active: true,
		href: '#',
		label: 'Brouillons',
	},
	{
		active: false,
		href: '#',
		label: 'Archives',
	},
])

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproDropdownMenu> => ({
	items: items(),
	label: 'Modified label',
	menuWidth: '500px',
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(AmeliproDropdownMenu)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproDropdownMenu', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproDropdownMenu>>

		describe('root', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproDropdownMenu, { props: requiredPropValues() })
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.attributes('id')).toBe(testHelper.default('uniqueId'))

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.attributes('id')).toBe(testHelper.modified('uniqueId'))
			})

			it('prop menuWidth sets attribute style', async () => {
				expect(vueWrapper.attributes('style')).toBe(`width: ${testHelper.default('menuWidth')};`)

				const { menuWidth } = modifiedPropValues()
				await vueWrapper.setProps({ menuWidth })
				expect(vueWrapper.attributes('style')).toBe(`width: ${testHelper.modified('menuWidth')};`)
			})
		})

		describe('dropdown menu list', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproDropdownMenu, { props: requiredPropValues() })
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(vueWrapper.find('.dropdown-menu__list').attributes('id')).toBe(`${testHelper.default('uniqueId')}-menu`)

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.find('.dropdown-menu__list').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-menu`)
			})

			it('prop label sets attribute aria-label', async () => {
				expect(vueWrapper.find('.dropdown-menu__list').attributes('aria-label')).toBe(testHelper.default('label'))

				const { label } = modifiedPropValues()
				await vueWrapper.setProps({ label })
				expect(vueWrapper.find('.dropdown-menu__list').attributes('aria-label')).toBe(testHelper.modified('label'))
			})
		})

		// describe.todo('dropdown menu item')
	})

	describe('Setting props should update props or attributes of inner components', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproDropdownMenu>>

		describe('AmeliproBtn', () => {
			beforeEach(() => {
				vueWrapper = shallowMount(AmeliproDropdownMenu, { props: requiredPropValues() })
			})

			it('prop uniqueId sets prop uniqueId', async () => {
				expect(vueWrapper.findComponent(AmeliproBtn).props('uniqueId')).toBe(`${testHelper.default('uniqueId')}-btn`)

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.findComponent(AmeliproBtn).props('uniqueId')).toBe(`${testHelper.modified('uniqueId')}-btn`)
			})

			it('prop uniqueId sets prop aria-controls', async () => {
				expect(vueWrapper.findComponent(AmeliproBtn).attributes('aria-controls')).toBe(`${testHelper.default('uniqueId')}-menu`)

				const { uniqueId } = modifiedPropValues()
				await vueWrapper.setProps({ uniqueId })
				expect(vueWrapper.findComponent(AmeliproBtn).attributes('aria-controls')).toBe(`${testHelper.modified('uniqueId')}-menu`)
			})
		})

		// describe.todo('AmeliproDropdownMenuBtn')
	})

	// Apparemment, Vitest ne modifie pas document.activeElement (contrairement à Jest)
	// On ne peut pas se baser sur ça pour identifier l'élément actif...
	// CF : https://stackoverflow.com/questions/78798672/vue-3-and-vitest-focus-input-sets-document-activeelement-to-htmlbodyelement-in-t
	describe.skip('Functions', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproDropdownMenu>>
		const wrapperFinder = () => vueWrapper.find('#test-id-btn')

		beforeEach(() => {
			vueWrapper = mount(AmeliproDropdownMenu, {
				autoAttach: attachToApp(),
				props: modifiedPropValues(),
			})
		})

		it('test openMenu', async () => {
			expect(wrapperFinder().exists()).toBe(true)
			// open the menu with down key
			await wrapperFinder().trigger('keyup.down')
			await vueWrapper.vm.$nextTick()

			expect(wrapperFinder().attributes('aria-expanded')).toStrictEqual('true')
			// expect(document.activeElement?.id).toStrictEqual('test-id-btn-0');
			// close the menu
			await wrapperFinder().trigger('click')
			await vueWrapper.vm.$nextTick()
			expect(wrapperFinder().attributes('aria-expanded')).toStrictEqual('false')
			// expect(document.activeElement?.id).toStrictEqual('test-id-btn');
			// open the menu with up key
			await wrapperFinder().trigger('keyup.up')
			await vueWrapper.vm.$nextTick()

			expect(wrapperFinder().attributes('aria-expanded')).toStrictEqual('true')
			// expect(document.activeElement?.id).toStrictEqual('test-id-btn-2');
			// close the menu with click
			await wrapperFinder().trigger('click')
		})

		it('test closeMenu', async () => {
			// open the menu with down key
			await wrapperFinder().trigger('keyup.down')
			await vueWrapper.vm.$nextTick()

			expect(wrapperFinder().attributes('aria-expanded')).toStrictEqual('true')
			// expect(document.activeElement?.id).toStrictEqual('test-id-btn-0');
			// close the menu with esc
			await vueWrapper.find('#test-id-btn-0').trigger('keyup.esc')
			await vueWrapper.vm.$nextTick()

			expect(wrapperFinder().attributes('aria-expanded')).toStrictEqual('false')
			// expect(document.activeElement?.id).toStrictEqual('test-id-btn');
		})

		it('test pressUp', async () => {
			// open the menu with up key
			await wrapperFinder().trigger('keyup.up')
			await vueWrapper.vm.$nextTick()

			expect(wrapperFinder().attributes('aria-expanded')).toStrictEqual('true')
			// expect(document.activeElement?.id).toStrictEqual('test-id-btn-2');
			// press up on the focused btn
			await vueWrapper.find('#test-id-btn-2').trigger('keyup.up')
			await vueWrapper.vm.$nextTick()
			// expect(document.activeElement?.id).toStrictEqual('test-id-btn-1');
			// press up on the focused btn
			await vueWrapper.find('#test-id-btn-1').trigger('keyup.up')
			await vueWrapper.vm.$nextTick()
			// expect(document.activeElement?.id).toStrictEqual('test-id-btn-0');
			// press up on the focused btn
			await vueWrapper.find('#test-id-btn-0').trigger('keyup.up')
			await vueWrapper.vm.$nextTick()
			// expect(document.activeElement?.id).toStrictEqual('test-id-btn-2');
			// close the menu with click
			await wrapperFinder().trigger('click')
		})

		it('test pressDown', async () => {
			// open the menu with down key
			await wrapperFinder().trigger('keyup.down')
			await vueWrapper.vm.$nextTick()

			expect(wrapperFinder().attributes('aria-expanded')).toStrictEqual('true')
			// expect(document.activeElement?.id).toStrictEqual('test-id-btn-0');
			// expect(vueWrapper.find('#test-id-btn-0').element.matches(':focus')).toBe(true);
			// press down on the focused btn
			await vueWrapper.find('#test-id-btn-0').trigger('keyup.down')
			await vueWrapper.vm.$nextTick()
			// expect(document.activeElement?.id).toStrictEqual('test-id-btn-1');
			// press down on the focused btn
			await vueWrapper.find('#test-id-btn-1').trigger('keyup.down')
			await vueWrapper.vm.$nextTick()
			// expect(document.activeElement?.id).toStrictEqual('test-id-btn-2');
			// press down on the focused btn
			await vueWrapper.find('#test-id-btn-2').trigger('keyup.down')
			await vueWrapper.vm.$nextTick()
			// expect(document.activeElement?.id).toStrictEqual('test-id-btn-0');
			// close the menu with click
			await wrapperFinder().trigger('click')
		})

		it('test pressCharacter', async () => {
			// open the menu with down key
			await wrapperFinder().trigger('keyup.down')
			await vueWrapper.vm.$nextTick()

			expect(wrapperFinder().attributes('aria-expanded')).toStrictEqual('true')
			// expect(document.activeElement?.id).toStrictEqual('test-id-btn-0');
			// press A to set focus on item 2
			await vueWrapper.find('#test-id-btn-0').trigger('keyup', { key: 'A' })
		})
	})
})
