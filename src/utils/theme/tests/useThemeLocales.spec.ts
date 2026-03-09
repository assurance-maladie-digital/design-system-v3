import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useThemeLocales } from '../index'
import { useTheme } from 'vuetify'
import { nextTick, ref } from 'vue'
import type { Mock } from 'vitest'

// Mock Vuetify
vi.mock('vuetify', () => ({
	useTheme: vi.fn(),
}))

describe('useThemeLocales', () => {
	let mockTheme: { name: ReturnType<typeof ref<string>> }

	beforeEach(() => {
		// Reset mock before each test
		vi.clearAllMocks()

		// Setup default mock theme with reactive ref
		mockTheme = {
			name: ref('default'),
		}
		;(useTheme as Mock).mockReturnValue(mockTheme)
	})

	it('should return themeLocales computed property', () => {
		const locales = {
			default: { title: 'Default Title', pageTitle: 'Default', message: 'msg', code: '500' },
		}

		const { themeLocales } = useThemeLocales(locales)

		expect(themeLocales).toBeDefined()
		expect(themeLocales.value).toEqual({ title: 'Default Title', pageTitle: 'Default', message: 'msg', code: '500' })
	})

	it('should return default locale when theme name is not found', () => {
		const locales = {
			default: { title: 'Default Title', message: 'Default Message', pageTitle: 'Default', code: '500' },
			cnam: { title: 'CNAM Title', message: 'CNAM Message', pageTitle: 'CNAM', code: '500' },
		}

		mockTheme.name.value = 'unknown'

		const { themeLocales } = useThemeLocales(locales)

		expect(themeLocales.value).toEqual({
			title: 'Default Title',
			message: 'Default Message',
			pageTitle: 'Default',
			code: '500',
		})
	})

	it('should return locale for cnam theme', () => {
		const locales = {
			default: { title: 'Default Title', pageTitle: 'Default', message: 'msg', code: '500' },
			cnam: { title: 'CNAM Title', message: 'CNAM Message', pageTitle: 'CNAM', code: '500' },
		}

		mockTheme.name.value = 'cnam'

		const { themeLocales } = useThemeLocales(locales)

		expect(themeLocales.value).toEqual({
			title: 'CNAM Title',
			message: 'CNAM Message',
			pageTitle: 'CNAM',
			code: '500',
		})
	})

	it('should return locale for ap theme', () => {
		const locales = {
			default: { title: 'Default Title', pageTitle: 'Default', message: 'msg', code: '500' },
			ap: { title: 'AP Title', message: 'AP Message', pageTitle: 'AP', code: '500' },
		}

		mockTheme.name.value = 'ap'

		const { themeLocales } = useThemeLocales(locales)

		expect(themeLocales.value).toEqual({
			title: 'AP Title',
			message: 'AP Message',
			pageTitle: 'AP',
			code: '500',
		})
	})

	it('should return locale for ap2026 theme', () => {
		const locales = {
			default: { title: 'Default Title', pageTitle: 'Default', message: 'msg', code: '500' },
			ap2026: { title: 'AP 2026 Title', message: 'AP 2026 Message', pageTitle: 'AP2026', code: '500' },
		}

		mockTheme.name.value = 'ap2026'

		const { themeLocales } = useThemeLocales(locales)

		expect(themeLocales.value).toEqual({
			title: 'AP 2026 Title',
			message: 'AP 2026 Message',
			pageTitle: 'AP2026',
			code: '500',
		})
	})

	it('should update themeLocales when theme changes', async () => {
		const locales = {
			default: { title: 'Default Title', pageTitle: 'Default', message: 'msg', code: '500' },
			cnam: { title: 'CNAM Title', pageTitle: 'CNAM', message: 'msg', code: '500' },
			ap: { title: 'AP Title', pageTitle: 'AP', message: 'msg', code: '500' },
		}

		// Initial theme
		mockTheme.name.value = 'cnam'
		const { themeLocales } = useThemeLocales(locales)
		expect(themeLocales.value.title).toBe('CNAM Title')

		// Change theme
		mockTheme.name.value = 'ap'
		await nextTick()
		expect(themeLocales.value.title).toBe('AP Title')

		// Change to default
		mockTheme.name.value = 'default'
		await nextTick()
		expect(themeLocales.value.title).toBe('Default Title')
	})

	it('should handle complex locale objects', () => {
		const locales = {
			default: {
				pageTitle: 'Error',
				message: 'An error occurred',
				code: '500',
				src: undefined,
			},
			cnam: {
				pageTitle: 'Error CNAM',
				message: 'An error occurred at CNAM',
				code: '500',
				src: undefined,
			},
			ap: {
				pageTitle: 'Error AP',
				message: 'An error occurred at AP',
				code: '500',
				src: 'image-ap.svg',
			},
		}

		mockTheme.name.value = 'ap'

		const { themeLocales } = useThemeLocales(locales)

		expect(themeLocales.value).toEqual({
			pageTitle: 'Error AP',
			message: 'An error occurred at AP',
			code: '500',
			src: 'image-ap.svg',
		})
	})

	it('should maintain reactivity across multiple instances', async () => {
		const locales = {
			default: { title: 'Default', pageTitle: 'Default', message: 'msg', code: '500' },
			cnam: { title: 'CNAM', pageTitle: 'CNAM', message: 'msg', code: '500' },
		}

		const { themeLocales: locales1 } = useThemeLocales(locales)
		const { themeLocales: locales2 } = useThemeLocales(locales)

		mockTheme.name.value = 'cnam'
		await nextTick()

		expect(locales1.value.title).toBe('CNAM')
		expect(locales2.value.title).toBe('CNAM')
	})

	it('should handle locale with null or undefined values', () => {
		const locales = {
			default: { title: 'Default', icon: null, description: undefined, pageTitle: 'Default', message: 'msg', code: '500' },
			cnam: { title: 'CNAM', icon: null, description: undefined, pageTitle: 'CNAM', message: 'msg', code: '500' },
		}

		mockTheme.name.value = 'cnam'

		const { themeLocales } = useThemeLocales(locales)

		expect(themeLocales.value.title).toBe('CNAM')
		expect(themeLocales.value.icon).toBeNull()
	})

	it('should work with generic type inference', () => {
		const locales = {
			default: { title: 'Default', message: 'Default message', pageTitle: 'Default', code: '500' },
			cnam: {
				title: 'CNAM',
				message: 'CNAM message',
				code: '500',
				pageTitle: 'CNAM',
			},
		}

		mockTheme.name.value = 'cnam'

		const { themeLocales } = useThemeLocales(locales)

		expect(themeLocales.value.title).toBe('CNAM')
		expect(themeLocales.value.message).toBe('CNAM message')
	})

	it('should prefer theme locale over default when available', () => {
		const locales = {
			default: { title: 'Default Title', message: 'Default Message', pageTitle: 'Default', code: '500' },
			custom: { title: 'Custom Title', message: 'Custom Message', pageTitle: 'Custom', code: '500' },
		}

		mockTheme.name.value = 'custom'

		const { themeLocales } = useThemeLocales(locales)

		expect(themeLocales.value.title).toBe('Custom Title')
		expect(themeLocales.value.message).toBe('Custom Message')
	})

	it('should fallback to default when accessing non-existent theme', () => {
		const locales = {
			default: { title: 'Default', message: 'Default message', pageTitle: 'Default', code: '500' },
		}

		mockTheme.name.value = 'nonexistent'

		const { themeLocales } = useThemeLocales(locales)

		expect(themeLocales.value).toEqual({
			title: 'Default',
			message: 'Default message',
			pageTitle: 'Default',
			code: '500',
		})
	})
})
