import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Logo from '../Logo.vue'

// Le Logo est une illustration : un `<svg role="img">` non interactif, explicitement
// `focusable="false"`. Il n'a aucune cible de focus propre et ne doit pas en avoir — on documente
// ici ce contrat (le ring DS ne concerne que les conteneurs interactifs, cf. LogoBrandSection).
describe('Logo - Focus', () => {
	it('renders a non-focusable illustrative svg', () => {
		const wrapper = mount(Logo)
		const svg = wrapper.find('svg')

		expect(svg.exists()).toBe(true)
		expect(svg.attributes('role')).toBe('img')
		expect(svg.attributes('focusable')).toBe('false')
	})

	it('exposes no interactive (focusable) element', () => {
		const wrapper = mount(Logo)

		expect(wrapper.find('a').exists()).toBe(false)
		expect(wrapper.find('button').exists()).toBe(false)
		expect(wrapper.find('[tabindex]').exists()).toBe(false)
	})
})
