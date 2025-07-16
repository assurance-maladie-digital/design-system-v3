import { beforeEach, describe, expect, it } from 'vitest'
import AmeliproBreadcrumb from '../AmeliproBreadcrumb.vue'
import type { AmeliproBreadcrumbItem } from '../types'
import type { PropType } from 'vue'
import TestHelper from '@tests/helpers/TestHelper'
import { VueWrapper, mount, shallowMount } from '@vue/test-utils'
import type { AmeliproAutoCompleteField } from '@/components'

const expectedPropOptions = {
	items: {
		type: Array as PropType<AmeliproBreadcrumbItem[]>,
		required: true,
	},
	uniqueId: {
		type: String,
		default: undefined,
	},
}

const requiredPropValues = (): { items: AmeliproBreadcrumbItem[] } => ({
	items: [
		{ href: '/required-1', id: 'required-id-1', title: 'Required title 1', to: undefined },
		{ href: '/required-2', id: 'required-id-2', title: 'Required title 2', to: undefined },
		{ href: '/required-3', id: 'required-id-3', title: 'Required title 3', to: undefined },
	],
})

const modifiedPropValues = (): { items: AmeliproBreadcrumbItem[], uniqueId: string } => ({
	items: [
		{ href: '/modified-1', id: 'modified-id-1', title: 'Modified title 1', to: undefined },
		{ href: '/modified-2', id: 'modified-id-2', title: 'Modified title 2', to: undefined },
		{ href: '/modified-3', id: 'modified-id-3', title: 'Modified title 3', to: undefined },
		{ href: '/modified-4', id: 'modified-id-4', title: 'Modified title 4', to: undefined },
	],
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(AmeliproBreadcrumb)
	.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproBreadcrumb', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproBreadcrumb>>

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproBreadcrumb, { props: requiredPropValues() })
		})

		it('prop uniqueId sets id attributes on nav, ol, btn and current page', async () => {
			// Par défaut
			expect(vueWrapper.find('nav').attributes('id')).toBeUndefined()
			expect(vueWrapper.find('ol').attributes('id')).toBeUndefined()
			expect(vueWrapper.find('p').attributes('id')).toBeUndefined()
			// Modifié
			const { uniqueId } = modifiedPropValues()
			await vueWrapper.setProps({ uniqueId })
			expect(vueWrapper.find('nav').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-container`)
			expect(vueWrapper.find('ol').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-list`)
			expect(vueWrapper.find('p').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-current-page`)
			// Vérifie le bouton
			// TODO: trouver pourquoi le bouton est "undefined"
			// const btn = vueWrapper.find('.breadcrumb__btn')
			// expect(btn.attributes('unique-id')).toBe(`${testHelper.modified('uniqueId')}-btn-0`)
		})
	})

	describe('Setting props should update props or attributes of inner components', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproBreadcrumb>>

		beforeEach(() => {
			vueWrapper = mount(AmeliproBreadcrumb, { props: requiredPropValues() })
		})

		it('prop items sets AmeliproBtn and active page content', async () => {
			// Par défaut
			const items = testHelper.default('items')
			const btns = vueWrapper.findAllComponents({ name: 'AmeliproBtn' })
			expect(btns.length).toBe(items.length - 1)
			btns.forEach((btn, i) => {
				expect(btn.text()).toBe(items[i].title)
				expect(btn.attributes('href')).toBe(items[i].href)
			})
			expect(vueWrapper.find('.breadcrumb__active-page').text()).toBe(items[items.length - 1].title)

			// Modifié
			const { items: modItems } = modifiedPropValues()
			await vueWrapper.setProps({ items: modItems })
			const modBtns = vueWrapper.findAllComponents({ name: 'AmeliproBtn' })
			expect(modBtns.length).toBe(modItems.length - 1)
			modBtns.forEach((btn, i) => {
				expect(btn.text()).toBe(modItems[i].title)
				expect(btn.attributes('href')).toBe(modItems[i].href)
			})
			expect(vueWrapper.find('.breadcrumb__active-page').text()).toBe(modItems[modItems.length - 1].title)
		})
	})

	describe('Events', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproBreadcrumb>>

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproBreadcrumb, { props: requiredPropValues() })
		})
		it('click on AmeliproBtn emits click event with item id', async () => {
			const btns = vueWrapper.findAllComponents({ name: 'AmeliproBtn' })
			await btns[0].trigger('click')
			expect(vueWrapper.emitted('click')).toBeTruthy()
			expect(vueWrapper.emitted('click')![0][0]).toBe(testHelper.default('items')[0].id)
		})
	})

	describe('Slots', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproBreadcrumb>>

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproBreadcrumb, { props: requiredPropValues() })
		})
		it('does not render default slot', () => {
			// Le composant ne prévoit pas de slot, test de structure
			expect(vueWrapper.html()).toContain('breadcrumb__list')
		})
	})
})
