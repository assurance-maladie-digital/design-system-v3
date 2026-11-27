// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ExternalLinks from '../ExternalLinks.vue'

const items = [{ text: 'Assurance Maladie', href: 'https://www.ameli.fr' }]

export const externalLinksRgaaCriteria = ['1.2', '3.2', '3.3', '7.1', '7.3', '8.2', '9.3', '10.3', '10.7', '10.9', '10.10', '12.9'] as const

describe('ExternalLinks – executable RGAA contracts', () => {
	it('7.1 and 9.3 – exposes a named menu button', () => {
		const wrapper = mount(ExternalLinks, { props: { items, ariaLabel: 'Liens externes' } })
		const button = wrapper.get('.sy-external-links-btn')
		expect(button.element.tagName).toBe('BUTTON')
		expect(button.attributes('aria-label')).toBe('Liens externes')
	})

	it('1.2 and 10.3 – keeps the menu arrow decorative and preserves link targets', async () => {
		const wrapper = mount(ExternalLinks, { props: { items } })
		const button = wrapper.get('.sy-external-links-btn')
		expect(button.find('[aria-hidden="true"]').exists()).toBe(true)
		await button.trigger('click')
		await wrapper.vm.$nextTick()
		expect(wrapper.get(`a[href="${items[0]!.href}"]`).text()).toContain(items[0]!.text)
	})
})
