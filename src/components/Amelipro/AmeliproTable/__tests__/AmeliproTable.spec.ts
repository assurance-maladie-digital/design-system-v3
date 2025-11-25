import { shallowMount, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, it, expect } from 'vitest'
import AmeliproTable from '../AmeliproTable.vue'
import TestHelper from '@tests/helpers/TestHelper'
import { defineComponent, h, type PropType } from 'vue'
import type { IDataListItem } from '../../types'
import type { AmeliproTableHeader } from '../types'
import type { ExpectedPropOptions } from '@tests/types'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { SelectItem } from '../../AmeliproSelect/types'

const expectedPropOptions: ExpectedPropOptions<typeof AmeliproTable> = {
	counterLabel: {
		type: String,
		default: 'item(s)',
	},
	dataList: {
		type: Array as PropType<IDataListItem[]>,
		default: () => [],
	},
	headers: {
		type: Array as PropType<AmeliproTableHeader[]>,
		default: () => [],
	},
	hiddenLabels: {
		type: Boolean,
		default: false,
	},
	itemsToDisplayDesktop: {
		type: Number,
		default: 10,
	},
	itemsToDisplayMobile: {
		type: Number,
		default: 10,
	},
	noTableInfos: {
		type: Boolean,
		default: false,
	},
	paginationSelectLabel: {
		type: String,
		default: 'Nb lignes/page :',
	},
	paginationSelectPlaceholder: {
		type: String,
		default: 'Nb lignes/page',
	},
	sortSelectDefaultValue: {
		type: [Number, String] as PropType<number | string>,
		default: undefined,
	},
	sortSelectItems: {
		type: Array as PropType<SelectItem[]>,
		default: () => [],
	},
	sortSelectLabel: {
		type: String,
		default: 'Trier par :',
	},
	sortSelectPlaceholder: {
		type: String,
		default: 'Trier par',
	},
	tableMaxWidth: {
		type: String,
		default: '100%',
	},
	tableMinWidth: {
		type: String,
		default: undefined,
	},
	tableWidth: {
		type: String,
		default: '100%',
	},
	title: {
		type: String,
		required: true,
	},
	uniqueId: {
		type: String,
		required: true,
	},
	verticalBorder: {
		type: Boolean,
		default: false,
	},
}

const requiredPropValues = (): ComponentProps<typeof AmeliproTable> => ({
	title: 'Required Titre du tableau',
	uniqueId: 'required-amelipro-table-id',
})

const modifiedPropValues = (): ComponentProps<typeof AmeliproTable> => ({
	counterLabel: 'Modified counter label',
	dataList: [
		{ email: 'modified.jean.bernard@gmail.com', firstname: 'Modified Jean', id: 10, name: 'Modified Bernard' },
		{ email: 'modified.simon.pierre@gmail.com', firstname: 'Modified Simon', id: 11, name: 'Modified Pierre' },
	],
	headers: [
		{
			align: 'right',
			maxWidth: '30%',
			minWidth: '10%',
			name: 'name',
			title: 'Modified Nom',
			width: '30%',
			sort: {
				ascendant: { label: 'modified tri asc', disabled: true },
				descendant: { label: 'modified tri desc', disabled: false },
			},
		},
		{
			align: 'right',
			maxWidth: '30%',
			minWidth: '10%',
			name: 'firstname',
			title: 'Modified Prénom',
			width: '30%',
		},
		{
			align: 'right',
			maxWidth: '30%',
			minWidth: '10%',
			name: 'email',
			title: 'Modified E-mail',
			width: '30%',
		},
	],
	hiddenLabels: true,
	itemsToDisplayDesktop: 5,
	itemsToDisplayMobile: 2,
	noTableInfos: true,
	paginationSelectLabel: 'Modified pagination select label',
	paginationSelectPlaceholder: 'Modified pagination select placeholder',
	sortSelectDefaultValue: 'modified-sort-default',
	sortSelectItems: [{ title: 'Modified Sort', value: 'modified-sort' }],
	sortSelectLabel: 'Modified sort select label',
	sortSelectPlaceholder: 'Modified sort select placeholder',
	tableMaxWidth: '80%',
	tableMinWidth: '60%',
	tableWidth: '90%',
	title: 'Modified Titre du tableau',
	uniqueId: 'modified-amelipro-table-id',
	verticalBorder: true,
})

const AmeliproSelectMock = defineComponent({
	name: 'AmeliproSelect',
	props: {
		hideErrorMessage: { type: Boolean, default: true },
		items: { type: Array as PropType<SelectItem[]>, default: () => [] },
		label: { type: String, default: '' },
		placeholder: { type: String, default: '' },
		uniqueId: { type: String, required: true },
	},
	setup(props, { slots }) {
		return () =>
			h('amelipro-select-stub', { uniqueId: props.uniqueId }, [
				slots.default ? slots.default() : null,
			])
	},
})

const testHelper = new TestHelper(AmeliproTable)
testHelper
	.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)
	.setMountOptions({ global: { stubs: { AmeliproSelect: AmeliproSelectMock } } })

describe('AmeliproTable', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	describe('Setting props should update attributes of inner tags', () => {
		let wrapper: VueWrapper<InstanceType<typeof AmeliproTable>>

		beforeEach(() => {
			wrapper = shallowMount(AmeliproTable, { props: requiredPropValues() })
		})

		describe('Main', () => {
			it('prop uniqueId sets id attribute on root container', async () => {
				expect(wrapper.attributes('id')).toBe(`${testHelper.default('uniqueId')}-container`)
				await wrapper.setProps({ uniqueId: testHelper.modified('uniqueId') })
				expect(wrapper.attributes('id')).toBe(`${testHelper.modified('uniqueId')}-container`)
			})
		})

		describe('Info wrapper', () => {
			it('prop uniqueId sets attribute id', async () => {
				expect(wrapper.find('.amelipro-table__infos').attributes('id')).toBe(`${testHelper.default('uniqueId')}-info-wrapper`)

				const { uniqueId } = modifiedPropValues()
				await wrapper.setProps({ uniqueId })
				expect(wrapper.find('.amelipro-table__infos').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-info-wrapper`)
			})
		})

		describe('Total counter', () => {
			it('prop uniqueId sets attribute id', async () => {
				expect(wrapper.find('.total-counter').attributes('id')).toBe(`${testHelper.default('uniqueId')}-total-counter`)

				const { uniqueId } = modifiedPropValues()
				await wrapper.setProps({ uniqueId })
				expect(wrapper.find('.total-counter').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-total-counter`)
			})

			it('prop counterLabel sets content text', async () => {
				expect(wrapper.find('.total-counter').text()).toContain(`${testHelper.default('counterLabel')}`)

				const { counterLabel } = modifiedPropValues()
				await wrapper.setProps({ counterLabel })
				expect(wrapper.find('.total-counter').text()).toContain(`${testHelper.modified('counterLabel')}`)
			})
		})

		describe('Select wrapper', () => {
			it('prop uniqueId sets attribute id', async () => {
				expect(wrapper.find('.amelipro-table__selects').attributes('id')).toBe(`${testHelper.default('uniqueId')}-select-wrapper`)

				const { uniqueId } = modifiedPropValues()
				await wrapper.setProps({ uniqueId })
				expect(wrapper.find('.amelipro-table__selects').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-select-wrapper`)
			})
		})

		it('prop title sets aria-label on table', async () => {
			const table = wrapper.find(`#${testHelper.default('uniqueId')}-table`)
			expect(table.attributes('aria-label')).toBe(testHelper.default('title'))
			await wrapper.setProps({ title: testHelper.modified('title'), uniqueId: testHelper.modified('uniqueId') })
			const tableMod = wrapper.find(`#${testHelper.modified('uniqueId')}-table`)
			expect(tableMod.attributes('aria-label')).toBe(testHelper.modified('title'))
		})
	})

	describe.skip('Setting props should update props or attributes of inner components', () => {
		let wrapper: VueWrapper<InstanceType<typeof AmeliproTable>>

		beforeEach(() => {
			wrapper = shallowMount(AmeliproTable, { props: requiredPropValues() })
		})

		it('prop headers sets table header cells', async () => {
			const headerCell = wrapper.find(`#${testHelper.default('uniqueId')}-table-header-cell-0`)
			expect(headerCell.text()).toContain(testHelper.default('headers')[0].title)
			await wrapper.setProps({ headers: testHelper.modified('headers'), uniqueId: testHelper.modified('uniqueId') })
			const headerCellMod = wrapper.find(`#${testHelper.modified('uniqueId')}-table-header-cell-0`)
			expect(headerCellMod.text()).toContain(testHelper.modified('headers')[0].title)
		})

		it('prop dataList sets table rows', async () => {
			const row = wrapper.find(`#${testHelper.default('uniqueId')}-table-row-0`)
			expect(row.exists()).toBe(true)
			await wrapper.setProps({ dataList: testHelper.modified('dataList'), uniqueId: testHelper.modified('uniqueId') })
			const rowMod = wrapper.find(`#${testHelper.modified('uniqueId')}-table-row-0`)
			expect(rowMod.exists()).toBe(true)
		})
	})

	describe.skip('Slots', () => {
		it('displays slot content', () => {
			const wrapper = shallowMount(AmeliproTable, {
				props: requiredPropValues(),
				slots: { default: '<div id="slot-content">Slot Content</div>' },
			})
			expect(wrapper.find('#slot-content').text()).toBe('Slot Content')
		})
	})
})
