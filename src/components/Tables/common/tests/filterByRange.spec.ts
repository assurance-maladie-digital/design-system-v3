import { mount } from '@vue/test-utils'
import { afterAll, describe, expect, it, vi } from 'vitest'
import SyTable from '../../SyTable/SyTable.vue'
import DateFilter from '../filters/DateFilter.vue'
import NumberFilter from '../filters/NumberFilter.vue'
import PeriodFilter from '../filters/PeriodFilter.vue'
import SelectFilter from '../filters/SelectFilter.vue'
import TextFilter from '../filters/TextFilter.vue'

const headers = [
	{
		title: 'Nom',
		key: 'name',
		filterable: true,
		filterType: 'text' as const,
	},
	{
		title: 'Date de naissance',
		key: 'birthdate',
		filterable: true,
		filterType: 'period' as const,
	},
]

const items = [
	{
		name: 'Alice',
		birthdate: '1990-01-01',
	},
	{
		name: 'Bob',
		birthdate: '1985-05-15',
	},
	{
		name: 'Charlie',
		birthdate: '2000-12-31',
	},
	{
		name: 'David',
		birthdate: '1995-07-20',
	},
]

describe('SyTable - filterByRange', () => {
	vi.mock('../../common/filters/getFilterComponent', () => {
		return {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			default: (filterType?: string, filterOptions?: unknown) => {
				if (filterType === 'select') {
					return SelectFilter
				}
				else if (filterType === 'date') {
					return DateFilter
				}
				else if (filterType === 'period') {
					return PeriodFilter
				}
				else if (filterType === 'number') {
					return NumberFilter
				}
				else {
					return TextFilter
				}
			},
		}
	})
	afterAll(() => {
		vi.resetModules()
	})

	it('filter by max date', async () => {
		const wrapper = mount(SyTable, {
			props: {
				headers,
				items,
				showFilters: true,
				suffix: 'test',
			},
		})

		const expectedNames = ['Alice', 'Bob', 'Charlie', 'David']
		expectedNames.forEach((element) => {
			expect(wrapper.text()).toContain(element)
		})

		const endDate = wrapper.find('input[aria-label="Fin"]')
		await endDate.setValue('01/01/2000')

		const textContent = wrapper.text()

		const filteredNames = ['Alice', 'Bob', 'David']
		filteredNames.forEach((element) => {
			expect(textContent).toContain(element)
		})
		const notFilteredNames = ['Charlie']
		notFilteredNames.forEach((element) => {
			expect(textContent).not.toContain(element)
		})
	})

	it('filter by min date', async () => {
		const wrapper = mount(SyTable, {
			props: {
				headers,
				items,
				showFilters: true,
				suffix: 'test',
			},
		})

		const expectedNames = ['Alice', 'Bob', 'Charlie', 'David']
		expectedNames.forEach((element) => {
			expect(wrapper.text()).toContain(element)
		})

		const startDate = wrapper.find('input[aria-label="Début"]')
		await startDate.setValue('01/01/1995')

		const textContent = wrapper.text()

		const filteredNames = ['Charlie', 'David']
		filteredNames.forEach((element) => {
			expect(textContent).toContain(element)
		})
		const notFilteredNames = ['Alice', 'Bob']
		notFilteredNames.forEach((element) => {
			expect(textContent).not.toContain(element)
		})
	})

	it('filter by min and max date', async () => {
		const wrapper = mount(SyTable, {
			props: {
				headers,
				items,
				showFilters: true,
				suffix: 'test',
			},
		})

		const expectedNames = ['Alice', 'Bob', 'Charlie', 'David']
		expectedNames.forEach((element) => {
			expect(wrapper.text()).toContain(element)
		})

		const startDate = wrapper.find('input[aria-label="Début"]')
		await startDate.setValue('01/01/1989')

		const endDate = wrapper.find('input[aria-label="Fin"]')
		await endDate.setValue('01/01/2000')

		const textContent = wrapper.text()

		const filteredNames = ['Alice', 'David']
		filteredNames.forEach((element) => {
			expect(textContent).toContain(element)
		})
		const notFilteredNames = ['Charlie', 'Bob']
		notFilteredNames.forEach((element) => {
			expect(textContent).not.toContain(element)
		})
	})

	it('updates the items when date changes', async () => {
		const wrapper = mount(SyTable, {
			props: {
				headers,
				items,
				showFilters: true,
				suffix: 'test',
			},
		})

		const startDate = wrapper.find('input[aria-label="Début"]')
		await startDate.setValue('01/01/1990')

		const endDate = wrapper.find('input[aria-label="Fin"]')
		await endDate.setValue('01/01/2000')

		const textContent = wrapper.text()

		let filteredNames = ['Alice', 'David']
		filteredNames.forEach((element) => {
			expect(textContent).toContain(element)
		})
		let notFilteredNames = ['Bob', 'Charlie']
		notFilteredNames.forEach((element) => {
			expect(textContent).not.toContain(element)
		})

		await endDate.setValue('01/01/1995')

		filteredNames = ['Alice']
		filteredNames.forEach((element) => {
			expect(wrapper.text()).toContain(element)
		})
		notFilteredNames = ['Bob', 'Charlie', 'David']
		notFilteredNames.forEach((element) => {
			expect(wrapper.text()).not.toContain(element)
		})
	})
})
