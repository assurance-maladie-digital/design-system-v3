import { describe, it, expect } from 'vitest'
import { useWidthable } from '../'

describe('useWidthable', () => {
	it('returns correct styles for default props', () => {
		const props = {
			maxWidth: undefined,
			minWidth: undefined,
			width: undefined,
		}

		const { widthStyles } = useWidthable(props)

		expect(widthStyles.value).toEqual({
			maxWidth: undefined,
			minWidth: undefined,
			width: '100%',
		})
	})

	it('returns correct styles for specific width values', () => {
		const props = {
			maxWidth: '500px',
			minWidth: '200px',
			width: 300,
		}

		const { widthStyles } = useWidthable(props)

		expect(widthStyles.value).toEqual({
			maxWidth: '500px',
			minWidth: '200px',
			width: '300px',
		})
	})

	it('handles numeric and string values correctly', () => {
		const props = {
			maxWidth: 600,
			minWidth: '50%',
			width: '75%',
		}

		const { widthStyles } = useWidthable(props)

		expect(widthStyles.value).toEqual({
			maxWidth: '600px',
			minWidth: '50%',
			width: '75%',
		})
	})
})
