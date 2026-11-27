// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SkipLink from '../SkipLink.vue'

export const skipLinkRgaaCriteria = ['7.1', '7.3', '8.2', '12.8'] as const

describe('SkipLink – executable RGAA contracts', () => {
	it('7.1 and 12.8 – renders a named navigation landmark and an in-page target', () => {
		const wrapper = mount(SkipLink, { props: { target: '#main', label: 'Aller au contenu' } })
		expect(wrapper.get('nav').attributes('aria-label')).toBeTruthy()
		expect(wrapper.get('a').attributes('href')).toBe('#main')
		expect(wrapper.get('a').text()).toContain('Aller au contenu')
	})

	it('supports multiple skip targets without duplicate ids', () => {
		const wrapper = mount(SkipLink, { props: { skipLinks: [{ label: 'Contenu', target: '#main' }, { label: 'Pied de page', target: '#footer' }] } })
		expect(wrapper.findAll('a')).toHaveLength(2)
		expect(new Set(wrapper.findAll('a').map(link => link.attributes('href'))).size).toBe(2)
	})
})
