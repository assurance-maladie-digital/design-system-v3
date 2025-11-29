import { beforeEach, describe, expect, it } from 'vitest'
import AmeliproBreadcrumb from '../AmeliproBreadcrumb.vue'
import type { AmeliproBreadcrumbItem } from '../types'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import type { PropType } from 'vue'
import TestHelper from '@tests/helpers/TestHelper'
import { attachToApp } from '@tests/helpers/utils'
import { mount, shallowMount, VueWrapper } from '@vue/test-utils'
import { AmeliproBtn } from '@/components'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproBreadcrumb> = {
	items: {
		type: Array as PropType<AmeliproBreadcrumbItem[]>,
		required: true,
	},
	uniqueId: {
		type: String,
		default: undefined,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproBreadcrumb> => ({
	items: [
		{
			id: 'item',
			title: 'item',
		},
		{
			id: 'item2',
			title: 'item 2',
		},
		{
			id: 'item3',
			title: 'item 3',
		},
		{
			id: 'item4',
			title: 'item 4',
		},
	],
})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproBreadcrumb> => ({
	items: [
		{
			id: 'new-item',
			title: 'New item',
		},
		{
			id: 'new-item2',
			title: 'New item 2',
		},
		{
			id: 'new-item3',
			title: 'New item 3',
		},
		{
			id: 'new-item4',
			title: 'New item 4',
		},
	],
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(AmeliproBreadcrumb)
testHelper.setExpectedPropOptions(expectedPropOptions)
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
		let wrapper: VueWrapper<InstanceType<typeof AmeliproBreadcrumb>>

		beforeEach(() => {
			wrapper = shallowMount(AmeliproBreadcrumb, { props: requiredPropValues(), global: {
				stubs: {
					AmeliproBtn,
				},
			} })
		})

		it('prop uniqueId sets id on container, list, buttons and current page', async () => {
			const btns = () => wrapper.findAll('.breadcrumb__btn')

			expect(wrapper.find('ol').attributes('id')).toBe(testHelper.default('uniqueId'))
			expect(wrapper.attributes('id')).toBeUndefined()
			expect(btns().length).toBeGreaterThan(0)
			expect(btns()[0].attributes('id')).toBeUndefined()
			expect(wrapper.find('.breadcrumb__active-page').attributes('id')).toBeUndefined()

			const { uniqueId } = modifiedPropValues()
			await wrapper.setProps({ uniqueId })

			expect(wrapper.attributes('id')).toBe(testHelper.modified('uniqueId') + '-container')
			expect(wrapper.find('ol').attributes('id')).toBe(testHelper.modified('uniqueId') + '-list')
			expect(btns().length).toBeGreaterThan(0)
			expect(btns().at(0)?.attributes('id')).toBe(testHelper.modified('uniqueId') + '-btn-0')
			expect(wrapper.find('.breadcrumb__active-page').attributes('id')).toBe(testHelper.modified('uniqueId') + '-current-page')
		})

		it('prop items sets aria-current and text on last item', async () => {
			const current = () => wrapper.find('.breadcrumb__active-page')
			expect(current().attributes('aria-current')).toBe('page')
			expect(current().text()).toBe(requiredPropValues().items.slice(-1)[0].title)

			const { items } = modifiedPropValues()
			await wrapper.setProps({ items })
			expect(current().attributes('aria-current')).toBe('page')
			expect(current().text()).toBe(modifiedPropValues().items.slice(-1)[0].title)
		})

		it('sets aria-label on nav', () => {
			expect(wrapper.find('nav').attributes('aria-label')).toBe('Fil d\'Ariane')
		})
	})

	describe('Setting props should update props or attributes of inner components', () => {
		let wrapper: VueWrapper<InstanceType<typeof AmeliproBreadcrumb>>

		const requiredItems = [
			{ id: 'required-item-1', title: 'Required item 1', href: '/required-href' },
			{ id: 'required-item-2', title: 'Required item 2', to: '/required-to' },
			...requiredPropValues().items.slice(2),
		]

		const modifiedItems = [
			{ id: 'modified-item-1', title: 'Modified item 1', href: '/modified-href' },
			{ id: 'modified-item-2', title: 'Modified item 2', to: '/modified-to' },
			...modifiedPropValues().items.slice(2),
		]

		beforeEach(() => {
			wrapper = shallowMount(AmeliproBreadcrumb, { props: { ...requiredPropValues(), items: requiredItems }, global: {
				stubs: {
					AmeliproBtn,
				},
			} })
		})

		it('prop items with href and to sets AmeliproBtn props (via attribute on .breadcrumb__btn)', async () => {
			const btns = () => wrapper.findAllComponents(AmeliproBtn)

			expect(btns().length).toBeGreaterThan(1)

			expect(btns().at(0)?.props('uniqueId')).toBe(testHelper.default('uniqueId'))
			expect(btns().at(0)?.attributes('href')).toBe('/required-href')
			expect(btns().at(1)?.attributes('to')).toBe('/required-to')

			await wrapper.setProps({ items: modifiedItems })
			// Composant AmeliproBreadcrumb à revoir ? Il n'utilise pas les id spécifiés dans les items
			expect(btns().at(0)?.props('uniqueId')).toBe(testHelper.default('uniqueId'))
			expect(btns().at(0)?.attributes('href')).toBe('/modified-href')
			expect(btns().at(1)?.attributes('to')).toBe('/modified-to')
		})
	})

	describe('Events', () => {
		it('prop items sets click event payload for each button', async () => {
			const wrapper = mount(AmeliproBreadcrumb, { props: requiredPropValues(), attachTo: attachToApp() })
			const btns = wrapper.findAll('.breadcrumb__btn')
			expect(btns.length).toBe(requiredPropValues().items.length - 1)
			for (let i = 0; i < btns.length; i++) {
				await btns[i].trigger('click')
			}
			const emitted = wrapper.emitted('click')
			expect(emitted).toBeDefined()
			expect(Array.isArray(emitted)).toBe(true)
			for (let i = 0; i < btns.length; i++) {
				// Tester emitted pour faire plaisir à ESlint/TypeScript
				if (!emitted) {
					continue
				}
				expect(emitted[i][0]).toBe(requiredPropValues().items[i].id)
			}
		})
	})

	describe('Public functions', () => {
		it('getter itemsToDisplay returns correct items depending on xs', async () => {
			const wrapper = mount(AmeliproBreadcrumb, { props: requiredPropValues() })
			expect(wrapper.exists()).toBeTruthy()
			expect(wrapper.findAll('li').length).toBe(4)
			wrapper.vm.$vuetify.display.xs = true
			await wrapper.vm.$nextTick()
			expect(wrapper.findAll('li').length).toBe(2)
			wrapper.vm.$vuetify.display.xs = false
		})
	})
})
