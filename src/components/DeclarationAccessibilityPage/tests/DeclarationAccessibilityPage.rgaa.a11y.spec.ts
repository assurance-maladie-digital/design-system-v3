// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DeclarationAccessibilityPage from '../DeclarationAccessibilityPage.vue'

export const declarationAccessibilityPageRgaaCriteria = ['9.1', '11.1', '12.6'] as const

describe('DeclarationAccessibilityPage – executable RGAA contracts', () => {
	it('9.1 and 12.6 – exposes structured sections and named external links', () => {
		const wrapper = mount(DeclarationAccessibilityPage, { props: { entityName: 'CNAM', siteName: 'Mon site', siteUrl: '/', contactEmail: 'accessibilite@example.fr' } })
		expect(wrapper.findAll('h2').length).toBeGreaterThan(0)
		expect(wrapper.get('a[href="mailto:accessibilite@example.fr"]').exists()).toBe(true)
	})
})
