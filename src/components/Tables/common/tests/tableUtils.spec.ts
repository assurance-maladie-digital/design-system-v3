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

	it('should create propsFacade correctly for client table', () => {
		const options = ref<Partial<DataOptions>>({})
		const componentAttributes = {
			'items': [{ id: 1 }],
			'onUpdate:options': vi.fn(),
		}

		const { propsFacade } = useTableUtils({
			componentAttributes,
			options,
		})

		expect(propsFacade.value).toMatchObject({
			items: [{ id: 1 }],
		})
		expect(propsFacade.value['onUpdate:options']).toBeUndefined()
	})

	it('should create propsFacade correctly for server table', () => {
		const options = ref<Partial<DataOptions>>({})
		const componentAttributes = {
			items: [{ id: 1 }],
		}

		const { propsFacade } = useTableUtils({
			serverItemsLength: 100,
			componentAttributes,
			options,
		})

		expect(propsFacade.value).toMatchObject({
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
})
