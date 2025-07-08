import { VueWrapper, mount, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import type { PropType } from 'vue'
import type { Structure } from '../../StructureItem/types'
import StructureItem from '../../StructureItem/StructureItem.vue'
import StructureList from '../StructureList.vue'
import TestHelper from '@tests/helpers/TestHelper'

const expectedPropOptions: ExpectedPropOptions<typeof StructureList> = {
	hiddenLabel: {
		type: Boolean,
		default: false,
	},
	label: {
		type: String,
		required: true,
	},
	maxStructuresLoadedDefault: {
		type: Number,
		default: 5,
	},
	modelValue: {
		type: String,
		default: undefined,
	},
	name: {
		type: String,
		required: true,
	},
	structures: {
		type: Array as PropType<Structure[]>,
		required: true,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof StructureList> => ({
	label: 'Required label',
	name: 'Required name',
	structures: [
		{
			address: 'required-address-1',
			idNumber: 'required-id-number-1',
			value: 'required-value-1',
		},
		{
			address: 'required-address-2',
			idNumber: 'required-id-number-2',
			value: 'required-value-2',
		},
	] as Structure[],
})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof StructureList> => ({
	hiddenLabel: true,
	label: 'Label liste',
	maxStructuresLoadedDefault: 3,
	modelValue: 'valeur',
	name: 'test-name',
	structures: [
		{
			address: 'modified-address-1',
			idNumber: 'modified-id-number-1',
			value: 'modified-value-1',
		},
		{
			address: 'modified-address-2',
			idNumber: 'modified-id-number-2',
			value: 'modified-value-2',
		},
		{
			address: 'modified-address-3',
			idNumber: 'modified-id-number-3',
			value: 'modified-value-3',
		},
		{
			address: 'modified-address-4',
			idNumber: 'modified-id-number-4',
			value: 'modified-value-4',
		},
		{
			address: 'modified-address-5',
			idNumber: 'modified-id-number-5',
			value: 'modified-value-5',
		},
		{
			address: 'modified-address-6',
			idNumber: 'modified-id-number-6',
			value: 'modified-value-6',
		},
	] as Structure[],
})

const testHelper = new TestHelper(StructureList)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('StructureList', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof StructureList>>
		beforeEach(() => {
			vueWrapper = shallowMount(StructureList, { props: requiredPropValues() })
		})

		it('prop name sets id attribute on root container', async () => {
			expect(vueWrapper.attributes('id')).toBe(`${testHelper.default('name')}-container`)
			const { name } = modifiedPropValues()
			await vueWrapper.setProps({ name })
			expect(vueWrapper.attributes('id')).toBe(`${testHelper.modified('name')}-container`)
		})

		it('prop name sets id attribute on VRadioGroup', async () => {
			expect(vueWrapper.findComponent({ name: 'VRadioGroup' }).attributes('id')).toBe(`${testHelper.default('name')}-radio-group`)
			const { name } = modifiedPropValues()
			await vueWrapper.setProps({ name })
			expect(vueWrapper.findComponent({ name: 'VRadioGroup' }).attributes('id')).toBe(`${testHelper.modified('name')}-radio-group`)
		})
	})

	describe('Setting props should update props or attributes of inner components', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof StructureList>>
		beforeEach(() => {
			// Dans un slot, requiert mount au lieu de shallowMount
			vueWrapper = mount(StructureList, { props: requiredPropValues() })
		})

		it('prop structures sets items prop on StructureItem', async () => {
			expect(vueWrapper.findAllComponents(StructureItem).length).toBe(2)
			const { structures } = modifiedPropValues()
			await vueWrapper.setProps({ structures })
			// Vérifie que chaque StructureItem reçoit bien la prop attendue
			// maxStructuresLoadedDefault = 3 dans modifiedPropValues MAIS composant non réactif aux changements sur cette prop !
			const items = vueWrapper.findAllComponents(StructureItem)
			expect(items.length).toBe(5)
			items.forEach((item, idx) => {
				expect(item.props('item')).toStrictEqual(testHelper.modified('structures')[idx])
			})
		})

		it('prop name sets group-name prop on StructureItem', async () => {
			const { structures, name } = modifiedPropValues()
			await vueWrapper.setProps({ structures, name })
			const items = vueWrapper.findAllComponents(StructureItem)
			items.forEach((item) => {
				expect(item.props('groupName')).toBe(testHelper.modified('name'))
			})
		})
	})

	describe.skip('Events', () => {
		const vueWrapper = mount(StructureList, {
			autoAttach: true,
			props: modifiedPropValues(),
			stubs: { StructureItem },
		})
		it('Test emit input', async () => {
			expect(vueWrapper.emitted('input')).toBeUndefined()
			await vueWrapper.findAllComponents(StructureItem).at(2)?.trigger('click')
			await vueWrapper.vm.$nextTick()
			expect(vueWrapper.emitted('input')).toStrictEqual([['valeur3']])
		})
	})

	describe.skip('functions', () => {
		const vueWrapper = mount(StructureList, {
			autoAttach: true,
			props: modifiedPropValues(),
			stubs: { StructureItem },
		})

		it('Test loadMore', async () => {
			expect(vueWrapper.findAll('input').length).toStrictEqual(3)
			await vueWrapper.find('button').trigger('click')
			await vueWrapper.vm.$nextTick()
			expect(vueWrapper.findAll('input').length).toStrictEqual(6)
		})
	})
})
