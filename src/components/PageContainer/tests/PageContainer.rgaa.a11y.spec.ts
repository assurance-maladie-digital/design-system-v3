// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PageContainer from '../PageContainer.vue'

export const pageContainerRgaaCriteria = ['3.2'] as const

describe('PageContainer – executable RGAA contracts', () => {
	it('keeps the optional role and accessible name association on the container', () => {
		const wrapper = mount(PageContainer, {
			props: { uniqueId: 'main', role: 'main', ariaLabelledby: 'main-title' },
			slots: { default: '<h1 id="main-title">Contenu principal</h1>' },
		})
		const container = wrapper.get('.vd-page-container')
		expect(container.attributes('role')).toBe('main')
		expect(container.attributes('aria-labelledby')).toBe('main-title')
		expect(wrapper.get('#main-container').exists()).toBe(true)
		expect(wrapper.get('#main-content').exists()).toBe(true)
	})
})
