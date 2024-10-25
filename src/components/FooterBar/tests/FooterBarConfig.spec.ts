import { config } from '../config'
import { describe, it, expect } from 'vitest'

describe('FooterBar config', () => {
	it('should have correct footer elevation', () => {
		expect(config.footer.elevation).toBe(3)
	})

	it('should have correct footer color', () => {
		expect(config.footer.color).toBe('#2f384d')
	})

	it('should have correct footer minHeight', () => {
		expect(config.footer.height).toBe('auto')
	})

	it('should have correct goTopBtn density', () => {
		expect(config.goTopBtn.density).toBe('compact')
	})

	it('should have correct goTopBtn icon', () => {
		expect(config.goTopBtn.icon).toBe('true')
	})

	it('should have correct goTopBtn variant', () => {
		expect(config.goTopBtn.variant).toBe('text')
	})

	it('should have correct goTopBtn elevation', () => {
		expect(config.goTopBtn.elevation).toBe(0)
	})

	it('should have correct goTopBtnIcon color', () => {
		expect(config.goTopBtnIcon.color).toBe('white')
	})
})
