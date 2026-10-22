// @vitest-environment jsdom

import { beforeAll, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SySelect from '../SySelect.vue'

// Scénario d’accessibilité : select simple requis avec ouverture du menu.

describe('SySelect – accessibility (axe)', () => {
	beforeAll(() => {
		Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, value: vi.fn() })
	})

	it('does not reference a missing label when only aria-label is provided', async () => {
		const wrapper = mount(SySelect, {
			props: { label: '', items: ['5', '10'] },
			attrs: { 'aria-label': 'Lignes par page' },
			attachTo: document.body,
		})

		try {
			const input = wrapper.get('input')
			expect(input.attributes('aria-labelledby')).toBeUndefined()
			expect(input.attributes('aria-label')).toBe('Lignes par page')
			await input.trigger('keydown', { key: 'ArrowDown' })
			const list = document.querySelector('[role="listbox"]')
			expect(list).not.toBeNull()
			expect(list?.getAttribute('aria-labelledby')).toBeNull()
			expect(list?.getAttribute('aria-label')).toBe('Lignes par page')
			const results = await axe(document.body)
			assertNoA11yViolations(results, 'SySelect – external aria-label', { ignoreRules: ['region'] })
		}
		finally {
			wrapper.unmount()
		}
	})

	it('has no obvious axe violations for required select with opened menu', async () => {
		const items = [
			{ text: 'Option 1', value: '1' },
			{ text: 'Option 2', value: '2' },
		]

		const wrapper = mount(SySelect, {
			props: {
				items,
				label: 'Choisissez une option',
				required: true,
			},
			attachTo: document.body,
		})

		// Ouvrir le menu pour inclure la liste déroulante dans l’analyse axe
		const activator = wrapper.get('input')
		await activator.trigger('keydown', { key: 'ArrowDown' })
		await flushPromises()

		const input = wrapper.get('input')
		const labelId = input.attributes('aria-labelledby')
		expect(labelId).toBeTruthy()
		if (!labelId) throw new Error('Missing aria-labelledby on SySelect')
		expect(document.getElementById(labelId)?.textContent).toContain('Choisissez une option')
		expect(document.querySelector('[role="listbox"]')?.getAttribute('aria-labelledby')).toBe(labelId)

		const results = await axe(document.body)
		assertNoA11yViolations(results, 'SySelect – required select with menu open', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})
})
