import { describe, it, expect } from 'vitest'
import { filterItems } from '../tableFilterUtils'
import type { FilterOption } from '../types'

describe('tableFilterUtils', () => {
	describe('filterItems', () => {
		const testItems = [
			{ id: 1, name: 'John Doe', age: 25, department: 'IT', status: 'Active', hireDate: '01/05/2020', vacationPeriod: { from: '01/07/2023', to: '15/07/2023' } },
			{ id: 2, name: 'Jane Smith', age: 30, department: 'HR', status: 'On leave', hireDate: '10/03/2019', vacationPeriod: { from: '01/08/2023', to: '20/08/2023' } },
			{ id: 3, name: 'Bob Johnson', age: 45, department: 'Finance', status: 'Active', hireDate: '22/11/2015', vacationPeriod: { from: '15/06/2023', to: '05/07/2023' } },
			{ id: 4, name: 'Alice Brown', age: 36, department: 'Marketing', status: 'Active', hireDate: '08/01/2021', vacationPeriod: { from: '20/12/2023', to: '05/01/2024' } },
			{ id: 5, name: 'Tom Wilson', age: 41, department: 'IT', status: 'Inactive', hireDate: '30/07/2018', vacationPeriod: { from: '10/09/2023', to: '25/09/2023' } },
		]

		it('should return all items when no filters are provided', () => {
			const result = filterItems(testItems, [])
			expect(result).toEqual(testItems)
		})

		it('should return empty array when items is empty', () => {
			const result = filterItems([], [{ key: 'name', value: 'John', type: 'text' }])
			expect(result).toEqual([])
		})

		it('should filter by text correctly', () => {
			const filters: FilterOption[] = [
				{ key: 'name', value: 'John Doe', type: 'text' },
			]
			const result = filterItems(testItems, filters)
			expect(result).toHaveLength(1)
			expect(result[0].id).toBe(1)
		})

		it('should filter by number correctly', () => {
			const filters: FilterOption[] = [
				{ key: 'age', value: 30, type: 'number' },
			]
			const result = filterItems(testItems, filters)
			expect(result).toHaveLength(1)
			expect(result[0].id).toBe(2)
		})

		it('should filter by select correctly', () => {
			const filters: FilterOption[] = [
				{ key: 'department', value: 'IT', type: 'select' },
			]
			const result = filterItems(testItems, filters)
			expect(result).toHaveLength(2)
			expect(result.map(item => item.id)).toContain(1)
			expect(result.map(item => item.id)).toContain(5)
		})

		it('should filter by date correctly', () => {
			const filters: FilterOption[] = [
				{ key: 'hireDate', value: '10/03/2019', type: 'date' },
			]
			const result = filterItems(testItems, filters)
			expect(result).toHaveLength(1)
			expect(result[0].id).toBe(2)
		})

		it('should apply multiple filters correctly', () => {
			const filters: FilterOption[] = [
				{ key: 'department', value: 'IT', type: 'select' },
				{ key: 'status', value: 'Active', type: 'select' },
			]
			const result = filterItems(testItems, filters)
			expect(result).toHaveLength(1)
			expect(result[0].id).toBe(1)
		})

		it('should handle case insensitivity for text filters', () => {
			const filters: FilterOption[] = [
				{ key: 'name', value: 'john doe', type: 'text' },
			]
			const result = filterItems(testItems, filters)
			expect(result).toHaveLength(1)
			expect(result[0].id).toBe(1)
		})

		it('should handle partial matches for text filters', () => {
			const filters: FilterOption[] = [
				{ key: 'name', value: 'oh', type: 'text' },
			]
			const result = filterItems(testItems, filters)
			// This should match both John Doe and Bob Johnson
			expect(result.length).toBeGreaterThanOrEqual(2)
			expect(result.map(item => item.id)).toContain(1) // John Doe
			expect(result.map(item => item.id)).toContain(3) // Bob Johnson
		})
	})
})
