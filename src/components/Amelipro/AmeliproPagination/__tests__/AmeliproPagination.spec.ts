import { VueWrapper, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import AmeliproPagination from '../AmeliproPagination.vue'
import AmeliproPaginationBtn from '../AmeliproPaginationBtn/AmeliproPaginationBtn.vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import type { PaginationTypes } from '../types'
import TestHelper from '@tests/helpers/TestHelper'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproPagination> = {
	activePageDefault: {
		type: Number,
		default: 1,
	},
	items: {
		type: Array as () => PaginationTypes[],
		default: () => [],
	},
	uniqueId: {
		type: String,
		default: undefined,
	},
}

const items2 = () => [
	{ key: 1 },
	{ key: 2 },
]

const items3 = () => [
	{ key: 1 },
	{ key: 2 },
	{ key: 3 },
]

const items4 = () => [
	{ key: 1 },
	{ key: 2 },
	{ key: 3 },
	{ key: 4 },
]

const items5 = () => [
	{ key: 1 },
	{ key: 2 },
	{ key: 3 },
	{ key: 4 },
	{ key: 5 },
]

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof AmeliproPagination> => ({})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof AmeliproPagination> => ({
	activePageDefault: 2,
	items: [
		{ key: 1 },
		{ key: 2 },
		{ key: 3 },
		{ key: 4 },
		{ key: 5 },
		{ key: 6 },
		{ key: 7 },
	],
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(AmeliproPagination)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('AmeliproPagination', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update list of items', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproPagination>>
		const itemFinder = () => vueWrapper.findAll('.amelipro-pagination__item')
		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproPagination, { props: requiredPropValues() })
		})

		it('initialise le composant avec le bon nombre d’items', async () => {
			// TODO: corriger le composant pour ne pas avoir 2 boutons vide si liste vide ?
			expect(itemFinder()).toHaveLength(2)

			await vueWrapper.setProps({ items: items2() })
			expect(itemFinder()).toHaveLength(2)

			await vueWrapper.setProps({ items: items3() })
			expect(itemFinder()).toHaveLength(3)

			await vueWrapper.setProps({ items: items4() })
			expect(itemFinder()).toHaveLength(4)

			await vueWrapper.setProps({ items: items5() })
			expect(itemFinder()).toHaveLength(5)

			// we expect it to be 5 because the component must display 5 elements maximum
			await vueWrapper.setProps({ items: testHelper.modified('items') })
			expect(itemFinder()).toHaveLength(5)
		})
	})

	describe('Events', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof AmeliproPagination>>
		const buttonsFinder = () => vueWrapper.findAllComponents(AmeliproPaginationBtn)

		beforeEach(() => {
			vueWrapper = shallowMount(AmeliproPagination, { props: { ...requiredPropValues(), items: testHelper.modified('items') } })
		})

		it('emits click event when emitClickEvent is called', async () => {
			expect(vueWrapper.emitted('click')).toBeUndefined()
			await vueWrapper.findComponent(AmeliproPaginationBtn).trigger('click')
			expect(vueWrapper.emitted('click')).toEqual([[1]])
		})

		it('updates navigation bar items when clicking on buttons', async () => {
			expect(buttonsFinder().length).toBe(5)
			// [_1_] [2] [3] [>] [7]
			expect(buttonsFinder().at(0)?.props('isActive')).toBe(true)
			expect(buttonsFinder().at(1)?.attributes('title')).toBe(undefined)
			expect(buttonsFinder().at(3)?.attributes('title')).toBe('page suivante')

			await buttonsFinder().at(0)?.trigger('click')
			// => click bouton [1], bouton actif reste positionné sur le [1]
			// [_1_] [2] [3] [>] [7]
			expect(buttonsFinder().at(0)?.props('isActive')).toBe(true)
			expect(buttonsFinder().at(1)?.attributes('title')).toBe(undefined)
			expect(buttonsFinder().at(3)?.attributes('title')).toBe('page suivante')

			await buttonsFinder().at(3)?.trigger('click')
			// => click bouton [>], bouton actif se décale
			// [1] [_2_] [3] [>] [7]
			expect(buttonsFinder().at(0)?.attributes('title')).toBe(undefined)
			expect(buttonsFinder().at(1)?.props('isActive')).toBe(true)
			expect(buttonsFinder().at(3)?.attributes('title')).toBe('page suivante')

			await buttonsFinder().at(2)?.trigger('click')
			// => click bouton [3], bouton actif se positionne sur le [3]
			// [1] [2] [_3_] [>] [7]
			expect(buttonsFinder().at(0)?.attributes('title')).toBe(undefined)
			expect(buttonsFinder().at(1)?.attributes('title')).toBe(undefined)
			expect(buttonsFinder().at(2)?.props('isActive')).toBe(true)
			expect(buttonsFinder().at(3)?.attributes('title')).toBe('page suivante')

			await buttonsFinder().at(3)?.trigger('click')
			// => click bouton [>], bouton actif se positionne sur le [4]
			// [1] [<] [_4_] [>] [7]
			expect(buttonsFinder().at(0)?.attributes('title')).toBe(undefined)
			expect(buttonsFinder().at(1)?.attributes('title')).toBe('page précédente')
			expect(buttonsFinder().at(2)?.props('isActive')).toBe(true)
			expect(buttonsFinder().at(3)?.attributes('title')).toBe('page suivante')
			expect(buttonsFinder().at(4)?.attributes('title')).toBe(undefined)
		})
	})
})
