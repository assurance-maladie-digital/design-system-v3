// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Accordion from '../Accordion.vue'

const items = [
	{ id: 'first', title: 'Première section', content: 'Premier contenu' },
	{ id: 'second', title: 'Deuxième section', content: 'Deuxième contenu' },
]

/**
 * RGAA criteria covered by executable assertions in this file.
 * Criteria requiring a real browser, computed colors or assistive technology
 * are documented in doc/Accessibilite/rgaa-component-coverage.md instead.
 */
export const accordionRgaaCriteria = [
	'1.2',
	'3.1',
	'7.1',
	'7.3',
	'8.2',
	'9.1',
	'12.8',
	'12.9',
] as const

describe('Accordion – executable RGAA contracts', () => {
	it('1.2 – exposes the chevron as a decorative image', () => {
		const wrapper = mount(Accordion, { props: { items } })
		const icon = wrapper.find('.sy-accordion-icon [aria-hidden="true"]')

		expect(icon.exists()).toBe(true)
		expect(icon.attributes('aria-hidden')).toBe('true')
		expect(icon.attributes('role')).not.toBe('img')
	})

	it('3.1 – exposes the expanded state independently from color', async () => {
		const wrapper = mount(Accordion, { props: { items } })
		const button = wrapper.find('.sy-accordion-button')
		const icon = wrapper.find('.sy-accordion-icon')

		expect(button.attributes('aria-expanded')).toBe('false')
		expect(icon.classes()).not.toContain('sy-accordion-icon--open')

		await button.trigger('click')

		expect(button.attributes('aria-expanded')).toBe('true')
		expect(icon.classes()).toContain('sy-accordion-icon--open')
	})

	it('7.1 – keeps the disclosure references bidirectional and valid', () => {
		const wrapper = mount(Accordion, { props: { items } })
		const buttons = wrapper.findAll('.sy-accordion-button')
		const regions = wrapper.findAll('[role="region"]')

		expect(buttons).toHaveLength(items.length)
		expect(regions).toHaveLength(items.length)

		const ids = new Set<string>()
		buttons.forEach((button, index) => {
			const buttonId = button.attributes('id')
			const contentId = button.attributes('aria-controls')

			expect(buttonId).toBeTruthy()
			expect(contentId).toBeTruthy()
			expect(ids.has(buttonId!)).toBe(false)
			ids.add(buttonId!)
			expect(wrapper.find(`#${contentId}`).exists()).toBe(true)
			expect(regions[index]!.attributes('aria-labelledby')).toBe(buttonId)
		})
	})

	it.each(['Enter', ' '])('7.3 – toggles a section with %s', async (key) => {
		const wrapper = mount(Accordion, { props: { items } })
		const button = wrapper.find('.sy-accordion-button')

		await button.trigger('keydown', { key })

		expect(button.attributes('aria-expanded')).toBe('true')
	})

	it('8.2 – generates unique ids for the items of one instance', () => {
		const wrapper = mount(Accordion, { props: { items } })
		const ids = wrapper.findAll('[id]').map(element => element.attributes('id'))

		expect(new Set(ids).size).toBe(ids.length)
	})

	it('9.1 – renders the requested semantic heading level', () => {
		const wrapper = mount(Accordion, {
			props: {
				items,
				headingLevel: 2,
			},
		})

		expect(wrapper.findAll('h2')).toHaveLength(items.length)
		expect(wrapper.findAll('h1, h3, h4, h5, h6')).toHaveLength(0)
	})

	it('12.8 and 12.9 – uses the natural focus order without a keyboard trap', () => {
		const wrapper = mount(Accordion, { props: { items } })
		const buttons = wrapper.findAll('.sy-accordion-button')

		buttons.forEach((button) => {
			expect(button.attributes('tabindex')).toBe('0')
		})
		expect(wrapper.findAll('[tabindex]:not([tabindex="-1"])')).toHaveLength(items.length)
	})
})
