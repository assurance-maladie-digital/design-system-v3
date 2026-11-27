// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CollapsibleList from '../CollapsibleList.vue'

const items = [{ text: 'Aide', href: '/aide', ariaLabel: 'Aide' }]

export const collapsibleListRgaaCriteria = ['3.2', '3.3', '10.7'] as const

describe('CollapsibleList – executable RGAA contracts', () => {
	it('renders a semantic heading and named links in desktop mode', () => {
		const wrapper = mount(CollapsibleList, { props: { listTitle: 'Ressources', items, headingLevel: 3 } })
		expect(wrapper.find('h3').text()).toBe('Ressources')
		expect(wrapper.get('a').attributes('aria-label')).toBe('Aide')
	})
})
