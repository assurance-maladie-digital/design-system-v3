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
		{
			email: 'modified.jean.bernard@gmail.com',
			firstname: 'Modified Jean',
			id: 10,
			name: 'Modified Bernard',
		},
		{
			email: 'modified.simon.pierre@gmail.com',
			firstname: 'Modified Simon',
			id: 11,
			name: 'Modified Pierre',
		},
	],
	headers: [
		{
			align: 'right',
			headerClasses: 'custom-header-class',
			cellsClasses: 'custom-cells-class',
			descriptionId: 'modified-description-id',
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
	.setMountOptions({
		global: {
			stubs: {
				AmeliproSelect: AmeliproSelectMock,
			},
		},
	})

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

		describe('Desktop wrapper', () => {
			it('prop uniqueId sets attribute id', async () => {
				expect(wrapper.find('.amelipro-table__wrapper--desktop').attributes('id')).toBe(`${testHelper.default('uniqueId')}-desktop`)

				const { uniqueId } = modifiedPropValues()
				await wrapper.setProps({ uniqueId })
				expect(wrapper.find('.amelipro-table__wrapper--desktop').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-desktop`)
			})
		})

		describe('Desktop wrapper > div', () => {
			it('prop tableMaxWidth & tableWidth set attribute style', async () => {
				expect(wrapper.find('.amelipro-table__wrapper--desktop > div').attributes('style')).toBe(`max-width: ${testHelper.default('tableMaxWidth')}; width: ${testHelper.default('tableWidth')};`)

				const { tableMaxWidth, tableWidth } = modifiedPropValues()
				await wrapper.setProps({ tableMaxWidth, tableWidth })
				expect(wrapper.find('.amelipro-table__wrapper--desktop > div').attributes('style')).toBe(`max-width: ${testHelper.modified('tableMaxWidth')}; width: ${testHelper.modified('tableWidth')};`)
			})
		})

		describe('Desktop table', () => {
			it('prop uniqueId sets attribute id', async () => {
				expect(wrapper.find('.amelipro-table__table--desktop').attributes('id')).toBe(`${testHelper.default('uniqueId')}-table`)

				const { uniqueId } = modifiedPropValues()
				await wrapper.setProps({ uniqueId })
				expect(wrapper.find('.amelipro-table__table--desktop').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-table`)
			})

			it('prop title sets attribute aria-label', async () => {
				expect(wrapper.find('.amelipro-table__table--desktop').attributes('aria-label')).toBe(testHelper.default('title'))

				const { title } = modifiedPropValues()
				await wrapper.setProps({ title })
				expect(wrapper.find('.amelipro-table__table--desktop').attributes('aria-label')).toBe(testHelper.modified('title'))
			})

			it('prop verticalBorder sets attribute class', async () => {
				expect(wrapper.find('.amelipro-table__table--desktop').classes('vertical-border')).toBe(testHelper.default('verticalBorder'))

				const { verticalBorder } = modifiedPropValues()
				await wrapper.setProps({ verticalBorder })
				expect(wrapper.find('.amelipro-table__table--desktop').classes('vertical-border')).toBe(testHelper.modified('verticalBorder'))
			})
		})

		describe('Desktop table header', () => {
			it('prop uniqueId sets attribute id', async () => {
				expect(wrapper.find('.amelipro-table__table--desktop thead tr').attributes('id')).toBe(`${testHelper.default('uniqueId')}-table-header`)

				const { uniqueId } = modifiedPropValues()
				await wrapper.setProps({ uniqueId })
				expect(wrapper.find('.amelipro-table__table--desktop thead tr').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-table-header`)
			})
		})

		describe('Desktop table header cells', () => {
			// Ici on a besoin d'avoir des lignes à afficher pour que les headers puissent être contrôlés
			beforeEach(() => {
				wrapper = shallowMount(AmeliproTable, {
					props: {
						...requiredPropValues(),
						dataList: [
							{
								email: 'test@example.com', firstname: 'Test', id: 1, name: 'User',
							},
						],
						headers: [{
							align: 'right',
							maxWidth: '50%',
							minWidth: '20%',
							name: 'test',
							title: 'header test',
							width: '50%',
						}],
					},
				})
			})

			it('prop headers sets number of header cells', async () => {
				expect(wrapper.findAll('.amelipro-table__table--desktop thead th').length).toBe(1)

				const { headers } = modifiedPropValues()
				await wrapper.setProps({ headers })
				expect(wrapper.findAll('.amelipro-table__table--desktop thead th').length).toBe(testHelper.modified('headers').length)
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(wrapper.find('.amelipro-table__table--desktop thead th').attributes('id')).toBe(`${testHelper.default('uniqueId')}-table-header-cell-0`)

				const { uniqueId } = modifiedPropValues()
				await wrapper.setProps({ uniqueId })
				expect(wrapper.find('.amelipro-table__table--desktop thead th').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-table-header-cell-0`)
			})

			it('prop headers sets attribute class', async () => {
				expect(wrapper.find('.amelipro-table__table--desktop thead th').classes('custom-header-class')).toBe(false)

				const { headers } = modifiedPropValues()
				await wrapper.setProps({ headers })
				expect(wrapper.find('.amelipro-table__table--desktop thead th').classes('custom-header-class')).toBe(true)
			})

			it('prop headers sets attribute style', async () => {
				expect(wrapper.find('.amelipro-table__table--desktop thead th').attributes('style')).toBe('min-width: 20%; width: 50%; max-width: 50%; text-align: right;')

				const { headers } = modifiedPropValues()
				await wrapper.setProps({ headers })
				expect(wrapper.find('.amelipro-table__table--desktop thead th').attributes('style')).toBe('min-width: 10%; width: 30%; max-width: 30%; text-align: right;')
			})

			// th > p
			it('prop headers sets attributes style & class and content', async () => {
				expect(wrapper.find('.amelipro-table__table--desktop thead th p').attributes('aria-describedby')).toBeUndefined()
				expect(wrapper.find('.amelipro-table__table--desktop thead th p').classes('d-flex')).toBe(false)
				expect(wrapper.find('.amelipro-table__table--desktop thead th p').text()).toBe('header test')

				const { headers } = modifiedPropValues()
				await wrapper.setProps({ headers })
				expect(wrapper.find('.amelipro-table__table--desktop thead th p').attributes('aria-describedby')).toBe('modified-description-id')
				expect(wrapper.find('.amelipro-table__table--desktop thead th p').classes('d-flex')).toBe(true)
				expect(wrapper.find('.amelipro-table__table--desktop thead th p').text()).toBe('Modified Nom')
			})
		})

		describe('Desktop table body rows', () => {
			beforeEach(() => {
				wrapper = shallowMount(AmeliproTable, {
					props: {
						...requiredPropValues(),
						dataList: [
							{
								email: 'test@example.com', firstname: 'Test', id: 1, name: 'User',
							},
						],
						headers: [{
							align: 'right',
							maxWidth: '50%',
							minWidth: '20%',
							name: 'test',
							title: 'header test',
							width: '50%',
						}],
					},
				})
			})

			it('prop dataList sets number of body rows', async () => {
				expect(wrapper.findAll('.amelipro-table__table--desktop tbody tr').length).toBe(1)

				const { dataList } = modifiedPropValues()
				await wrapper.setProps({ dataList })
				expect(wrapper.findAll('.amelipro-table__table--desktop tbody tr').length).toBe(testHelper.modified('dataList').length)
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(wrapper.find('.amelipro-table__table--desktop tbody tr').attributes('id')).toBe(`${testHelper.default('uniqueId')}-table-row-0`)

				const { uniqueId } = modifiedPropValues()
				await wrapper.setProps({ uniqueId })
				expect(wrapper.find('.amelipro-table__table--desktop tbody tr').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-table-row-0`)
			})
		})

		describe('Desktop table body cells', () => {
			beforeEach(() => {
				wrapper = shallowMount(AmeliproTable, {
					props: {
						...requiredPropValues(),
						dataList: [
							{
								email: 'test@example.com', firstname: 'Test', id: 1, name: 'User',
							},
						],
						headers: [{
							align: 'right',
							maxWidth: '50%',
							minWidth: '20%',
							name: 'test',
							title: 'header test',
							width: '50%',
						}],
					},
				})
			})

			it('prop headers sets number of body cells', async () => {
				expect(wrapper.findAll('.amelipro-table__table--desktop tbody td').length).toBe(1)

				const { headers } = modifiedPropValues()
				await wrapper.setProps({ headers })
				expect(wrapper.findAll('.amelipro-table__table--desktop tbody td').length).toBe(testHelper.modified('headers').length)
			})

			it('prop uniqueId sets attribute id', async () => {
				expect(wrapper.find('.amelipro-table__table--desktop tbody td').attributes('id')).toBe(`${testHelper.default('uniqueId')}-table-row-0-cell-0`)

				const { uniqueId } = modifiedPropValues()
				await wrapper.setProps({ uniqueId })
				expect(wrapper.find('.amelipro-table__table--desktop tbody td').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-table-row-0-cell-0`)
			})

			it('prop dataList sets attribute class', async () => {
				expect(wrapper.find('.amelipro-table__table--desktop tbody td').classes()).toEqual([])

				// Il faut aussi modifier headers pour que cell.value soit correctement mise à jour
				const { dataList, headers } = modifiedPropValues()
				await wrapper.setProps({ dataList, headers })
				expect(wrapper.find('.amelipro-table__table--desktop tbody td').classes()).toEqual(['custom-cells-class'])
			})
		})
	})

	// TODO:
	// describe.skip('Setting props should update props or attributes of inner components', () => {	})

	// TODO:
	// describe.skip('Slots', () => {	})
})
