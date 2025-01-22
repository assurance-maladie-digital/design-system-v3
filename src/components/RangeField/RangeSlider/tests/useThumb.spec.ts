import { describe, expect, it } from 'vitest'
import useThumb from '../useThumb'

describe('useThumb', () => {
	it('should return the correct thumb style', () => {
		const { thumbStyle } = useThumb(10, -60, 40)

		expect(thumbStyle.value.left).toBe('70%')
	})

	it('should return the correct thumb style with a negative value', () => {
		const { thumbStyle } = useThumb(-60, -100, 0)

		expect(thumbStyle.value.left).toBe('40%')
	})

	it('should return the correct thumb style with a range of 0', () => {
		const { thumbStyle } = useThumb(0, 0, 0)

		expect(thumbStyle.value.left).toBe('100%')
	})
})
