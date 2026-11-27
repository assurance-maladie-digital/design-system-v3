// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import CookiesSelection from '../CookiesSelection.vue'

const items = {
	essentials: [{ name: 'session', description: 'Session utilisateur', conservation: '20 heures' }],
	functional: [{ name: 'display', description: 'Préférences d’affichage', conservation: '1 an' }],
	analytics: [{ name: 'visit', description: 'Mesure d’audience', conservation: '6 mois' }],
}

export const cookiesSelectionRgaaCriteria = ['7.1', '7.3', '8.2', '9.1', '10.7', '11.10', '12.8'] as const

describe('CookiesSelection – executable RGAA contracts', () => {
	it('8.2 and 9.1 – renders titled cookie sections and explicit preference groups', async () => {
		const wrapper = mount(CookiesSelection, { props: { items, headingLevel: 2 } })
		await flushPromises()
		expect(wrapper.findAll('h2')).toHaveLength(3)
		expect(wrapper.findAll('[data-test-id="radio-group"]')).toHaveLength(2)
		expect(wrapper.findAll('details > summary')).toHaveLength(3)
	})

	it('7.1, 7.3 and 11.10 – exposes named native controls and required radio groups', () => {
		const wrapper = mount(CookiesSelection, { props: { items } })
		expect(wrapper.find('[data-test-id="accept-all"]').element.tagName).toBe('BUTTON')
		expect(wrapper.find('[data-test-id="reject-all"]').element.tagName).toBe('BUTTON')
		expect(wrapper.find('[data-test-id="submit"]').element.tagName).toBe('BUTTON')
		expect(wrapper.findAll('[aria-required="true"]').length).toBeGreaterThanOrEqual(2)
	})

	it('10.7 and 12.8 – keeps details summaries and form actions keyboard reachable', () => {
		const wrapper = mount(CookiesSelection, { props: { items } })
		expect(wrapper.findAll('summary').every(summary => summary.element.tabIndex >= 0)).toBe(true)
		expect(wrapper.findAll('button').every(button => button.attributes('tabindex') !== '-1')).toBe(true)
	})
})
