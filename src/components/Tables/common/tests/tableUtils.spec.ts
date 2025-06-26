import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useTableUtils } from '../tableUtils'
import { LocalStorageUtility } from '@/utils/localStorageUtility'
import type { DataOptions } from '../types'

vi.mock('@/utils/localStorageUtility')

describe('tableUtils', () => {
	const mockLocalStorageUtility = {
		getItem: vi.fn(),
		setItem: vi.fn(),
	}

	beforeEach(() => {
		vi.spyOn(LocalStorageUtility.prototype, 'getItem').mockImplementation(mockLocalStorageUtility.getItem)
		vi.spyOn(LocalStorageUtility.prototype, 'setItem').mockImplementation(mockLocalStorageUtility.setItem)
	})

	afterEach(() => {
		vi.resetAllMocks()
	})

	it('should create storage key correctly with suffix', () => {
		const options = ref<Partial<DataOptions>>({})
		const { storageKey } = useTableUtils({
			tableId: 'test-table',
			prefix: 'table',
			suffix: 'test-suffix',
			caption: 'Test Table',
			componentAttributes: {},
			options,
		})

		expect(storageKey.value).toBe('table-test-suffix')
	})

	it('should create storage key correctly without suffix', () => {
		const options = ref<Partial<DataOptions>>({})
		const { storageKey } = useTableUtils({
			tableId: 'test-table',
			prefix: 'table',
			caption: 'Test Table',
			componentAttributes: {},
			options,
		})

		expect(storageKey.value).toBe('table')
	})

	it('should transform headers correctly', () => {
		const options = ref<Partial<DataOptions>>({})
		const headersProp = ref([
			{
				text: 'ID',
				key: 'id',
			},
			{
				title: 'Name',
				key: 'name',
			},
			{
				key: 'age',
			},
		])

		const { headers } = useTableUtils({
			tableId: 'test-table',
			prefix: 'table',
			caption: 'Test Table',
			componentAttributes: {},
			headersProp,
			options,
		})

		expect(headers.value).toEqual([
			{
				text: 'ID',
				key: 'id',
				title: 'ID',
			},
			{
				title: 'Name',
				key: 'name',
			},
			{
				key: 'age',
				title: undefined,
			},
		])
	})

	it('should handle undefined headers', () => {
		const options = ref<Partial<DataOptions>>({})
		const componentAttributes = {}

		const { headers } = useTableUtils({
			tableId: 'test-table',
			prefix: 'table',
			caption: 'Test Table',
			componentAttributes,
			options,
		})

		expect(headers.value).toBeUndefined()
	})

	it('should create optionsFacade correctly', () => {
		const options = ref<Partial<DataOptions>>({
			page: 2,
			sortBy: [{ key: 'name', order: 'asc' }],
		})
		const componentAttributes = {
			page: 1,
		}

		const { optionsFacade } = useTableUtils({
			tableId: 'test-table',
			prefix: 'table',
			caption: 'Test Table',
			componentAttributes,
			options,
		})

		expect(optionsFacade.value).toEqual({
			page: 2,
			sortBy: [{ key: 'name', order: 'asc' }],
			groupBy: undefined,
			multiSort: undefined,
			mustSort: undefined,
		})
	})

	it('should create propsFacade correctly for client table', () => {
		const options = ref<Partial<DataOptions>>({})
		const componentAttributes = {
			'items': [{ id: 1 }],
			'onUpdate:options': vi.fn(),
		}
		const headersProp = ref([{ title: 'ID', key: 'id' }])

		const { propsFacade } = useTableUtils({
			tableId: 'test-table',
			prefix: 'table',
			caption: 'Test Table',
			componentAttributes,
			headersProp,
			options,
		})

		expect(propsFacade.value).toMatchObject({
			headers: [{ title: 'ID', key: 'id' }],
			items: [{ id: 1 }],
		})
		expect(propsFacade.value['onUpdate:options']).toBeUndefined()
	})

	it('should create propsFacade correctly for server table', () => {
		const options = ref<Partial<DataOptions>>({})
		const componentAttributes = {
			items: [{ id: 1 }],
		}
		const headersProp = ref([{ title: 'ID', key: 'id' }])

		const { propsFacade } = useTableUtils({
			tableId: 'test-table',
			prefix: 'table',
			caption: 'Test Table',
			serverItemsLength: 100,
			componentAttributes,
			headersProp,
			options,
		})

		expect(propsFacade.value).toMatchObject({
			headers: [{ title: 'ID', key: 'id' }],
			items: [{ id: 1 }],
			itemsLength: 100,
		})
	})

	it('should update options correctly', () => {
		const options = ref<Partial<DataOptions>>({
			page: 1,
			sortBy: [{ key: 'id', order: 'asc' }],
		})
		const componentAttributes = {}

		const { updateOptions } = useTableUtils({
			tableId: 'test-table',
			prefix: 'table',
			caption: 'Test Table',
			componentAttributes,
			options,
		})

		updateOptions({
			sortBy: [{ key: 'name', order: 'desc' }],
		})

		expect(options.value).toEqual({
			page: 1,
			sortBy: [{ key: 'name', order: 'desc' }],
		})
	})

	it('should setup local storage correctly', () => {
		mockLocalStorageUtility.getItem.mockReturnValue({
			page: 2,
			options: {
				itemsPerPage: 20,
			},
		})

		const options = ref<Partial<DataOptions>>({})
		const componentAttributes = {}

		const { localOptions, setupLocalStorage } = useTableUtils({
			tableId: 'test-table',
			prefix: 'table',
			suffix: 'test',
			caption: 'Test Table',
			componentAttributes,
			options,
		})

		const { watchOptions } = setupLocalStorage()

		expect(mockLocalStorageUtility.getItem).toHaveBeenCalledWith('table-test')
		expect(localOptions.value).toEqual({
			page: 2,
			options: {
				itemsPerPage: 20,
			},
		})

		// Test watchOptions
		options.value = {
			page: 3,
			sortBy: [{ key: 'name', order: 'asc' }],
		}
		watchOptions()

		expect(mockLocalStorageUtility.setItem).toHaveBeenCalledWith('table-test', expect.objectContaining({
			page: 3,
			sortBy: [{ key: 'name', order: 'asc' }],
		}))
	})

	it('should handle server table local storage correctly', () => {
		mockLocalStorageUtility.getItem.mockReturnValue(null)

		const options = ref<Partial<DataOptions>>({
			page: 1,
		})
		const componentAttributes = {}

		const { setupLocalStorage } = useTableUtils({
			tableId: 'test-table',
			prefix: 'server-table',
			caption: 'Test Table',
			serverItemsLength: 100,
			componentAttributes,
			options,
		})

		const { watchOptions } = setupLocalStorage()
		watchOptions()

		expect(mockLocalStorageUtility.setItem).toHaveBeenCalledWith('server-table', expect.objectContaining({
			page: 1,
			itemsLength: 100,
		}))
	})
})
