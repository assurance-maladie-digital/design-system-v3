// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import CookieBanner from '../CookieBanner.vue'

export const cookieBannerRgaaCriteria = ['1.2', '3.3', '7.1', '7.3', '8.2', '10.11', '10.12', '11.10', '12.8'] as const

describe('CookieBanner – executable RGAA contracts', () => {
	it('7.1 and 9.1 – exposes a named dialog with a heading and consent actions', async () => {
		const wrapper = mount(CookieBanner, { attachTo: document.body })
		await flushPromises()
		const dialog = document.querySelector('.vd-cookie-banner__inner')!
		expect(dialog.getAttribute('role')).toBe('dialog')
		expect(dialog.getAttribute('aria-label')).toBeTruthy()
		expect(dialog.querySelector('h1, h2, h3, h4, h5, h6')).not.toBeNull()
		wrapper.unmount()
	})

	it('7.3 and 12.8 – exposes keyboard controls without positive tabindex values', async () => {
		const wrapper = mount(CookieBanner, { attachTo: document.body })
		await flushPromises()
		expect(document.querySelectorAll('.vd-cookie-banner__inner button').length).toBeGreaterThan(0)
		const positiveTabindexes = Array.from(document.querySelectorAll('.vd-cookie-banner__inner [tabindex]'))
			.filter(element => Number(element.getAttribute('tabindex')) > 0)
		expect(positiveTabindexes).toHaveLength(0)
		wrapper.unmount()
	})
})
