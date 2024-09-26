import { config } from '../config'
import { describe, it, expect } from 'vitest'

describe('config', () => {
	it('should have correct menu configuration', () => {
		expect(config.menu).toEqual({
			offsetY: true,
		})
	})

	it('should have correct button configuration', () => {
		expect(config.btn).toEqual({
			color: 'primary',
			variant: 'outlined',
			ripple: true,
		})
	})

	it('should have correct icon configuration', () => {
		expect(config.icon).toEqual({
			class: 'ml-1',
		})
	})
})
