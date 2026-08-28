import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useTableHeaders } from '../useTableHeaders'

describe('useTableHeaders', () => {
	it('reacts to changes in filterInputConfig', () => {
		const filterInputConfig = ref<Record<string, unknown>>({
			name: { variant: 'outlined' },
		})
		const { getEnhancedHeader } = useTableHeaders({
			headersProp: [],
			filterInputConfig,
		})
		const header = {
			title: 'Name',
			key: 'name',
			filterable: true,
		}

		expect(getEnhancedHeader(header).filterConfig).toEqual({ variant: 'outlined' })

		filterInputConfig.value = { name: { variant: 'solo' } }

		expect(getEnhancedHeader(header).filterConfig).toEqual({ variant: 'solo' })
	})
})
