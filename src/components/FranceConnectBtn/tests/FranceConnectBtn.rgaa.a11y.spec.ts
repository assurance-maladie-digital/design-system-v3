// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FranceConnectBtn from '../FranceConnectBtn.vue'

export const franceConnectBtnRgaaCriteria = ['1.2', '3.3', '6.1'] as const

describe('FranceConnectBtn – executable RGAA contracts', () => {
	it('1.2 – hides the brand SVG from assistive technologies', () => {
		const wrapper = mount(FranceConnectBtn, { props: { href: '/connexion' } })
		const svg = wrapper.get('svg')
		expect(svg.attributes('aria-hidden')).toBe('true')
		expect(svg.attributes('role')).toBe('presentation')
	})

	it('6.1 and 7.1 – exposes named links for connection and information', () => {
		const wrapper = mount(FranceConnectBtn, { props: { href: '/connexion' } })
		const links = wrapper.findAll('a')
		expect(links).toHaveLength(2)
		expect(links[0]!.attributes('aria-label')).toContain('FranceConnect')
		expect(links[1]!.attributes('aria-label')).toContain('nouvelle fenêtre')
		expect(links[1]!.attributes('target')).toBe('_blank')
		expect(links[1]!.attributes('rel')).toContain('noopener')
	})
})
