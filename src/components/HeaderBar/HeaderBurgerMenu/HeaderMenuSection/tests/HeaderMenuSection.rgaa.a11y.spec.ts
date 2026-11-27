// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import HeaderMenuSection from '../HeaderMenuSection.vue'

export const headerMenuSectionRgaaCriteria = ['9.1', '12.6'] as const

describe('HeaderMenuSection – executable RGAA contracts', () => {
	it('9.1 and 12.6 – associates its section with a visible heading', () => {
		const wrapper = mount(HeaderMenuSection, { props: { title: 'Navigation' }, slots: { default: '<li>Accueil</li>' } })
		const section = wrapper.get('section')
		expect(section.attributes('aria-labelledby')).toBe(wrapper.get('h2').attributes('id'))
		expect(wrapper.get('h2').text()).toBe('Navigation')
	})
})
