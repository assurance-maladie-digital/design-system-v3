// @vitest-environment jsdom

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SyIcon from './SyIcon.vue'

// Scénario d’accessibilité : icône informative avec label.

describe('SyIcon – accessibility (axe)', () => {
	it('has no obvious axe violations for informative icon with label', async () => {
		const wrapper = mount(SyIcon, {
			props: {
				icon: 'mdi-alert',
				decorative: false,
				label: 'Alerte importante',
			},
			global: {
				stubs: {
					'v-icon': {
						template: '<span class="v-icon" :role="role" :aria-label="ariaLabel" :aria-hidden="ariaHidden"><svg><slot></slot></svg></span>',
						props: ['color', 'size', 'role', 'aria-hidden', 'aria-label'],
					},
				},
				directives: {
					'rgaa-svg-fix': () => {},
				},
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyIcon – informative icon with label', {
			ignoreRules: ['region'],
		})
	})

	it('hides decorative icons from assistive tech (aria-hidden)', async () => {
		const wrapper = mount(SyIcon, {
			props: {
				icon: 'mdi-star',
				decorative: true,
			},
			global: {
				stubs: {
					'v-icon': {
						template: '<span class="v-icon" :role="role" :aria-label="ariaLabel" :aria-hidden="ariaHidden"><svg><slot></slot></svg></span>',
						props: ['color', 'size', 'role', 'aria-hidden', 'aria-label'],
					},
				},
				directives: {
					'rgaa-svg-fix': () => {},
				},
			},
		})

		const iconEl = wrapper.find('.v-icon')
		expect(iconEl.attributes('aria-hidden')).toBe('true')

		// Axe should not report a visible control with missing label since it is hidden
		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyIcon – decorative icon hidden from AT', {
			ignoreRules: ['region'],
		})
	})
})
