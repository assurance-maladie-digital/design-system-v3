import type { IStructureTabs, StructureTab } from '../types'
import { VueWrapper, mount, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import type { PropType } from 'vue'
import StructureBtn from '../../StructureBtn/StructureBtn.vue'
import StructureList from '../../StructureList/StructureList.vue'
import StructureTabs from '../StructureTabs.vue'
import TestHelper from '@tests/helpers/TestHelper'

const expectedPropOptions: ExpectedPropOptions<typeof StructureTabs> = {
	ariaLabel: {
		type: String,
		default: undefined,
	},
	ariaLabelledby: {
		type: String,
		default: undefined,
	},
	maxStructuresLoadedDefault: {
		type: Number,
		default: 5,
	},
	modelValue: {
		type: Object as PropType<IStructureTabs>,
		default: undefined,
	},
	searchBar: {
		type: Boolean,
		default: false,
	},
	tabs: {
		type: Array as PropType<StructureTab[]>,
		default: () => [],
	},
	uniqueId: {
		type: String,
		required: true,
	},
}

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof StructureTabs> => ({ uniqueId: 'required-unique-id' })

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof StructureTabs> => ({
	ariaLabel: 'mon label',
	ariaLabelledby: 'mon-id-label',
	maxStructuresLoadedDefault: 3,
	modelValue: {
		activeTab: 1,
		activeValue: 'valeur4',
	},
	searchBar: true,
	tabs: [
		{
			label: 'item1',
			listLabel: 'label1',
			structures: [
				{
					address: '39 rue de la Vie',
					idNumber: '1',
					value: 'valeur',
				},
				{
					address: '39 rue de la Vie',
					idNumber: '2',
					value: 'valeur2',
				},
			],
		},
		{
			label: 'item2',
			listLabel: 'label2',
			structures: [
				{
					address: '39 rue de la Vie',
					idNumber: '3',
					value: 'valeur3',
				},
				{
					address: '39 rue de la Vie',
					idNumber: '4',
					value: 'valeur4',
				},
			],
		},
	] as StructureTab[],
	uniqueId: 'modified-unique-id',
})

const testHelper = new TestHelper(StructureTabs)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

describe('StructureTabs', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof StructureTabs>>
		beforeEach(() => {
			vueWrapper = shallowMount(StructureTabs, { props: requiredPropValues() })
		})

		it('prop uniqueId sets id attribute on root container', async () => {
			expect(vueWrapper.attributes('id')).toBe(`${testHelper.default('uniqueId')}-container`)
			const { uniqueId } = modifiedPropValues()
			await vueWrapper.setProps({ uniqueId })
			expect(vueWrapper.attributes('id')).toBe(`${testHelper.modified('uniqueId')}-container`)
		})
	})

	describe('Setting props should update props or attributes of inner components', () => {
		let vueWrapper: VueWrapper<InstanceType<typeof StructureTabs>>
		// beforeEach(() => {
		//	vueWrapper = shallowMount(StructureTabs, { props: requiredPropValues() });
		// });

		it('prop tabs sets items on StructureBtn', async () => {
			// Le label est dans un slot, donc besoin de "mount" pour le tester
			vueWrapper = mount(StructureTabs, { props: requiredPropValues() })

			expect(vueWrapper.findAllComponents(StructureBtn).length).toBe(0)
			const { tabs } = modifiedPropValues()
			await vueWrapper.setProps({ tabs })
			const btns = vueWrapper.findAllComponents(StructureBtn)
			// Le "if" ne sert qu'à éviter les erreurs typescript
			if (tabs) {
				expect(btns.length).toBe(tabs.length)
				btns.forEach((btn, idx) => {
					expect(btn.text()).toBe((tabs[idx]).label)
				})
			}
		})

		it('prop tabs sets structures on StructureList', async () => {
			vueWrapper = shallowMount(StructureTabs, { props: requiredPropValues() })

			const { tabs } = modifiedPropValues()
			await vueWrapper.setProps({ tabs })
			const lists = vueWrapper.findAllComponents(StructureList)
			// Le "if" ne sert qu'à éviter les erreurs typescript
			if (tabs) {
				expect(lists.length).toBe(tabs.length)
				lists.forEach((list, idx) => {
					expect(list.props('structures')).toStrictEqual(tabs[idx].structures)
				})
			}
		})
	})
})
