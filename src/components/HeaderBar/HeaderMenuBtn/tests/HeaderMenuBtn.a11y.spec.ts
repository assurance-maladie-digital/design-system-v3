// @vitest-environment jsdom

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'

import HeaderMenuBtn from '../HeaderMenuBtn.vue'

// Scénarios d’accessibilité : bouton burger de l'en-tête, états fermé/ouvert
// (nom accessible via aria-label basculant open/close).

describe('HeaderMenuBtn – accessibility (axe)', () => {
	it('has no obvious axe violations in closed state', async () => {
		const wrapper = mount(HeaderMenuBtn, {
			props: {
				modelValue: false,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'HeaderMenuBtn – closed', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})

	it('has no obvious axe violations in open state', async () => {
		const wrapper = mount(HeaderMenuBtn, {
			props: {
				modelValue: true,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'HeaderMenuBtn – open', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})

	it('exposes a distinct accessible name per state', () => {
		const closed = mount(HeaderMenuBtn, {
			props: { modelValue: false },
		})
		const open = mount(HeaderMenuBtn, {
			props: { modelValue: true },
		})

		const closedLabel = closed.find('button').attributes('aria-label')
		const openLabel = open.find('button').attributes('aria-label')

		expect(closedLabel).toBeTruthy()
		expect(openLabel).toBeTruthy()
		expect(closedLabel).not.toBe(openLabel)

		closed.unmount()
		open.unmount()
	})
})
