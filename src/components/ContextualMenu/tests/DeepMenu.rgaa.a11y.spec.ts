// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DeepMenu from '../DeepMenu.vue'
describe('DeepMenu – RGAA contract', () => {
	it('8.2 and 10.7 – renders labelled anchor items', () => {
		const wrapper = mount(DeepMenu, { props: { currentDeepth: 1, items: [{ text: 'Accéder aux soins', hash: '#soins' }] } })
		expect(wrapper.get('a').attributes('href')).toBe('#soins')
		expect(wrapper.get('a').text()).toContain('Accéder aux soins')
	})
})
