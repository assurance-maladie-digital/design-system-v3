// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import HeaderLoading from '../HeaderLoading.vue'

export const headerLoadingRgaaCriteria = ['1.2', '7.1', '7.5'] as const

describe('HeaderLoading – executable RGAA contracts', () => {
	it('7.1 and 7.5 – announces the standalone loading state', () => {
		const wrapper = mount(HeaderLoading, { props: { standalone: true, ariaLabel: 'Chargement de l’en-tête' } })
		const status = wrapper.get('[role="alert"]')
		expect(status.attributes('aria-live')).toBe('polite')
		expect(status.attributes('aria-label')).toBe('Chargement de l’en-tête')
	})

	it('1.2 – hides the decorative inline skeleton', () => {
		expect(mount(HeaderLoading).get('.vd-header-loading').attributes('aria-hidden')).toBe('true')
	})
})
