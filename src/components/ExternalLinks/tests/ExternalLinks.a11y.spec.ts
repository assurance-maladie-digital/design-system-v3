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

describe('ExternalLinks – new window announcement', () => {
	it.each([false, true])('announces the new window with a custom icon: %s', async (customIcon) => {
		const wrapper = mount(ExternalLinks, {
			props: { items: [{ text: 'ameli.fr', href: 'https://ameli.fr' }] },
			slots: customIcon ? { 'link-icon': '<span aria-hidden="true">↗</span>' } : {},
		})
		try {
			await wrapper.get('.sy-external-links-btn').trigger('click')
			const link = wrapper.get('a[href="https://ameli.fr"]')
			expect(link.attributes('target')).toBe('_blank')
			expect(link.text()).toContain('ameli.fr')
			expect(link.get('.d-sr-only').text()).toBe('— nouvelle fenêtre')
			expect(link.get('.d-sr-only').attributes('aria-hidden')).toBeUndefined()

			await wrapper.setProps({ newWindowText: 'opens in a new window' })
			expect(link.get('.d-sr-only').text()).toBe('— opens in a new window')

			await wrapper.setProps({ vuetifyOptions: { listItem: { target: '_self' } } })
			expect(link.attributes('target')).toBe('_self')
			expect(link.find('.d-sr-only').exists()).toBe(false)

			await wrapper.setProps({ vuetifyOptions: { listItem: { target: '_blank' } } })
			expect(link.get('.d-sr-only').text()).toBe('— opens in a new window')
		}
		finally {
			wrapper.unmount()
		}
	})
})
