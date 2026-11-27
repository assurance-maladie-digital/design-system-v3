// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import HeaderMenuItem from '../HeaderMenuItem.vue'

export const headerMenuItemRgaaCriteria = ['7.1', '8.2', '12.6'] as const

describe('HeaderMenuItem – executable RGAA contracts', () => {
	it('7.1 and 12.6 – renders a list item containing the supplied navigation link', () => {
		const wrapper = mount(HeaderMenuItem, { slots: { default: '<a href="/accueil">Accueil</a>' } })
		expect(wrapper.get('li').get('a').attributes('href')).toBe('/accueil')
		expect(wrapper.get('li').text()).toContain('Accueil')
	})
})
