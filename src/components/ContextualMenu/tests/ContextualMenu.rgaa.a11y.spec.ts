// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ContextualMenu from '../ContextualMenu.vue'

const items = [
	{ text: 'Introduction', hash: '#intro', level: 1 },
	{ text: 'Installation', hash: '#install', level: 2 },
]

export const contextualMenuRgaaCriteria = ['7.1', '9.2', '10.3', '10.9', '10.10'] as const

describe('ContextualMenu – executable RGAA contracts', () => {
	it('7.1 and 9.2 – renders a named navigation landmark and list links', () => {
		const wrapper = mount(ContextualMenu, { props: { ariaLabel: 'Sommaire', items } })
		const nav = wrapper.get('nav')
		expect(nav.attributes('aria-label')).toBe('Sommaire')
		expect(wrapper.findAll('a')).toHaveLength(items.length)
	})

	it('10.3 and 10.9 – keeps href targets and the current item state', async () => {
		const wrapper = mount(ContextualMenu, { props: { modelValue: '#intro', ariaLabel: 'Sommaire', items } })
		expect(wrapper.get('a[href="#intro"]').attributes('aria-current')).toBe('true')
		await wrapper.get('a[href="#install"]').trigger('click')
		expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['#install'])
	})
})
