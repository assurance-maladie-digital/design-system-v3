// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import { axe } from 'vitest-axe'
import * as filterStories from '../Filtres.stories'

enableAutoUnmount(afterEach)
afterEach(() => {
	document.body.innerHTML = ''
	localStorage.clear()
})

describe('SyServerTable – filter stories accessibility', () => {
	for (const [name, story] of Object.entries(composeStories(filterStories))) {
		it(name, async () => {
			const wrapper = mount(story, { attachTo: document.body })
			await flushPromises()
			for (const field of wrapper.findAll('.v-field')) {
				expect(field.attributes('aria-label')).toBeUndefined()
			}
			await vi.waitFor(() => expect(wrapper.get('table').attributes('aria-busy')).toBe('false'), { timeout: 3000 })
			await flushPromises()
			const result = await axe(wrapper.element, {
				runOnly: ['aria-prohibited-attr', 'aria-valid-attr-value', 'label'],
			})
			expect(result.violations.map(finding => ({ id: finding.id, nodes: finding.nodes.map(node => node.html) }))).toEqual([])
			expect(result.incomplete.map(finding => ({ id: finding.id, nodes: finding.nodes.map(node => node.html) }))).toEqual([])
		}, 30000)
	}
})
