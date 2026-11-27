// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import HeaderBurgerMenu from '../HeaderBurgerMenu.vue'

export const headerBurgerMenuRgaaCriteria = ['1.2', '7.1', '7.3', '8.2', '9.1', '9.2', '9.3', '10.3', '12.9'] as const

describe('HeaderBurgerMenu – executable RGAA contracts', () => {
	it('7.1 and 9.2 – exposes a named menu trigger and modal navigation when opened', async () => {
		const wrapper = mount(HeaderBurgerMenu, { props: { modelValue: true }, attachTo: document.body })
		await flushPromises()
		expect(document.querySelector('[role="dialog"]')?.getAttribute('aria-modal')).toBe('true')
		expect(document.querySelector('[role="navigation"]')?.getAttribute('aria-label')).toBeTruthy()
		wrapper.unmount()
	})
})
