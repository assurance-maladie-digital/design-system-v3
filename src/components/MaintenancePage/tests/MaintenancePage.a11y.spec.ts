// @vitest-environment jsdom

import { describe, it, expect, vi, afterEach } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import StatusPage from '../../StatusPage/StatusPage.vue'

const themeLocales = {
	pageTitle: 'Maintenance en cours',
	message: 'L\'application n\'est pas disponible pour le moment.',
	code: '503',
	src: '/img/maintenance.svg',
}

vi.mock('@/utils/theme', () => ({
	useThemeLocales: () => ({
		themeLocales: ref(themeLocales),
	}),
}))

// Import après les mocks
import MaintenancePage from '../MaintenancePage.vue'

afterEach(() => {
	vi.clearAllMocks()
})

describe('MaintenancePage – accessibility (axe)', () => {
	it('has no obvious axe violations in default state', async () => {
		const wrapper = mount(MaintenancePage)

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'MaintenancePage – default state', {
			// Ignoré car la page repose sur la structure de StatusPage/PageContainer
			ignoreRules: ['region'],
		})
	})
})

describe('MaintenancePage – StatusPage wiring', () => {
	it('passes expected props to StatusPage and hides the action button', () => {
		const wrapper = mount(MaintenancePage)
		const statusPage = wrapper.findComponent(StatusPage)

		expect(statusPage.exists()).toBe(true)
		expect(statusPage.props()).toMatchObject({
			pageTitle: themeLocales.pageTitle,
			message: themeLocales.message,
			code: themeLocales.code,
			hideBtn: true,
		})
	})

	it('renders a single main heading with the page title', () => {
		const wrapper = mount(MaintenancePage)
		const headings = wrapper.findAll('h1')

		expect(headings).toHaveLength(1)
		expect(headings[0]!.text()).toContain(themeLocales.pageTitle)
	})

	it('displays the status code block when provided', () => {
		const wrapper = mount(MaintenancePage)
		const code = wrapper.find('.sy-code')

		expect(code.exists()).toBe(true)
		expect(code.text()).toContain(themeLocales.code)
	})
})

describe('MaintenancePage – illustration', () => {
	it('renders decorative illustration with proper ARIA when provided by theme', () => {
		const wrapper = mount(MaintenancePage)
		const img = wrapper.find('img')

		expect(img.exists()).toBe(true)
		expect(img.attributes('aria-hidden')).toBe('true')
		expect(img.attributes('alt')).toBe('')
	})

	it('uses custom illustration slot instead of default decorative image', () => {
		const wrapper = mount(MaintenancePage, {
			slots: {
				illustration: '<img class="custom-illustration" src="/custom.svg" alt="Illustration personnalisée" />',
			},
		})

		const customImg = wrapper.find('.custom-illustration')
		expect(customImg.exists()).toBe(true)
		expect(wrapper.find('img[aria-hidden="true"]').exists()).toBe(false)
	})
})
