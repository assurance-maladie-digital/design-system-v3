// @vitest-environment jsdom

import { describe, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import { registerHeaderMenuKey } from '../../consts'
import HeaderBurgerMenu from '../HeaderBurgerMenu.vue'
import HeaderMenuItem from '../HeaderMenuItem/HeaderMenuItem.vue'
import HeaderMenuSection from '../HeaderMenuSection/HeaderMenuSection.vue'

// Scénario d’accessibilité : menu burger ouvert avec une section et des liens.
// Le contenu est téléporté dans document.body → analyse axe sur document.body.

vi.mock('@/utils/functions/throttleDisplayFn/throttleDisplayFn.ts', () => ({
	default: (fn: (...args: unknown[]) => void) => fn,
}))

describe('HeaderBurgerMenu – accessibility (axe)', () => {
	it('has no obvious axe violations with the menu open', async () => {
		const wrapper = mount(HeaderBurgerMenu, {
			global: {
				provide: {
					[registerHeaderMenuKey]: () => {},
				},
				stubs: {
					HeaderMenuItem,
					HeaderMenuSection,
				},
			},
			props: {
				modelValue: true,
			},
			slots: {
				default: `
					<HeaderMenuSection>
						<template #title>Section 1</template>
						<HeaderMenuItem><a href="/item-1">Item 1</a></HeaderMenuItem>
						<HeaderMenuItem><a href="/item-2">Item 2</a></HeaderMenuItem>
					</HeaderMenuSection>
				`,
			},
			attachTo: document.body,
		})

		await wrapper.vm.$nextTick()

		const results = await axe(document.body)
		assertNoA11yViolations(results, 'HeaderBurgerMenu – menu open', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})

	it('has no obvious axe violations with the menu closed', async () => {
		const wrapper = mount(HeaderBurgerMenu, {
			global: {
				provide: {
					[registerHeaderMenuKey]: () => {},
				},
			},
			props: {
				modelValue: false,
			},
			slots: {
				default: '<a href="/item-1">Item 1</a>',
			},
			attachTo: document.body,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'HeaderBurgerMenu – menu closed', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})
})
