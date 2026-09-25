// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import ExternalLinks from '../ExternalLinks.vue'

describe('ExternalLinks – accessibility (axe)', () => {
	it('has no obvious axe violations', async () => {
		const wrapper = mount(ExternalLinks, {
			props: {
				items: [
					{ text: 'ameli.fr', href: 'https://ameli.fr' },
					{ text: 'Legifrance', href: 'https://legifrance.gouv.fr' },
				],
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'ExternalLinks – default state')
		wrapper.unmount()
	})
})

describe('ExternalLinks – menu accessibility', () => {
	it.each([
		{ name: 'empty', items: [] },
		{ name: 'with links', items: [{ text: 'ameli.fr', href: 'https://ameli.fr' }] },
	])('keeps menu references valid and has no axe violations when $name', async ({ items }) => {
		const target = document.createElement('main')
		document.body.appendChild(target)
		const wrapper = mount(ExternalLinks, { props: { items }, attachTo: target })
		try {
			const button = wrapper.get('.sy-external-links-btn')
			expect(button.attributes('aria-controls')).toBeUndefined()
			expect(button.attributes('aria-owns')).toBeUndefined()
			await button.trigger('click')
			const id = button.attributes('aria-controls')
			expect(id).toBeTruthy()
			expect(document.getElementById(id!)).not.toBeNull()
			expect(button.attributes('aria-owns')).toBe(id)
			assertNoA11yViolations(await axe(target), 'ExternalLinks – open')
			await button.trigger('click')
			expect(button.attributes('aria-controls')).toBeUndefined()
			expect(button.attributes('aria-owns')).toBeUndefined()
		}
		finally {
			wrapper.unmount()
			target.remove()
		}
	})
})
