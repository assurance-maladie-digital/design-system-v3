import { describe, expect, it } from 'vitest'
import { useDatePickerDerivedValues } from '../useDatePickerDerivedValues'

describe('useDatePickerDerivedValues', () => {
	it('normalizes custom period bounds from display format to ISO', () => {
		const { minDate, maxDate } = useDatePickerDerivedValues({
			format: 'DD/MM/YYYY',
			period: {
				min: '01/01/1995',
				max: '31/12/2005',
			},
		})

		expect(minDate.value).toBe('1995-01-01')
		expect(maxDate.value).toBe('2005-12-31')
	})

	it('keeps supporting legacy custom period bounds provided in MM/DD/YYYY', () => {
		const { minDate, maxDate } = useDatePickerDerivedValues({
			format: 'DD/MM/YYYY',
			period: {
				min: '01/01/1995',
				max: '12/31/2005',
			},
		})

		expect(minDate.value).toBe('1995-01-01')
		expect(maxDate.value).toBe('2005-12-31')
	})
})
