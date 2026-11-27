// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SyNavList from '../SyNavList.vue'

export const syNavListRgaaCriteria = ['7.1', '8.2', '10.7', '12.6'] as const

describe('SyNavList – executable RGAA contracts', () => {
	it('7.1, 8.2 and 12.6 – exposes a named navigation landmark and links', () => {
		const wrapper = mount(SyNavList, { props: { label: 'Dossiers', items: [{ id: 'home', label: 'Accueil', href: '/accueil' }] } })
		expect(wrapper.get('nav').attributes('aria-label')).toBe('Dossiers')
		expect(wrapper.get('a').text()).toContain('Accueil')
	})
})
