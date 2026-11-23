import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref, withDirectives } from 'vue'
import { vRgaaSvgFix } from '../rgaaSvgFix'

function mountWithSvgs(value: unknown, svgCount = 1, tag = 'div', attrs: Record<string, string> = {}) {
	const count = ref(svgCount)
	const wrapper = mount(defineComponent({
		setup() {
			return () => withDirectives(
				h(tag, attrs, Array.from({ length: count.value }, () => h('svg', { role: 'img' }))),
				[[vRgaaSvgFix, value]],
			)
		},
	}))

	return { wrapper, count }
}

describe('vRgaaSvgFix', () => {
	it.each([
		['décorative (true)', true],
		['fonctionnelle (false)', false],
		['onlyInner', { onlyInner: true }],
		['rôle bouton', { role: 'button' }],
	])('masque chaque SVG et le rend non focusable : %s', (_, value) => {
		const { wrapper } = mountWithSvgs(value, 2)

		const svgs = wrapper.findAll('svg')
		expect(svgs).toHaveLength(2)
		for (const svg of svgs) {
			expect(svg.attributes('role')).toBeUndefined()
			expect(svg.attributes('aria-hidden')).toBe('true')
			expect(svg.attributes('focusable')).toBe('false')
		}
	})

	it('applique la correction aux SVG ajoutés après une mise à jour', async () => {
		const { wrapper, count } = mountWithSvgs(true)

		count.value = 2
		await nextTick()

		const svgs = wrapper.findAll('svg')
		expect(svgs).toHaveLength(2)
		expect(svgs[1]!.attributes('aria-hidden')).toBe('true')
		expect(svgs[1]!.attributes('focusable')).toBe('false')
	})

	it('ne modifie pas le conteneur en mode onlyInner', () => {
		const { wrapper } = mountWithSvgs({ onlyInner: true }, 1, 'button', { 'aria-label': 'Fermer' })

		const button = wrapper.find('button')
		expect(button.attributes('role')).toBeUndefined()
		expect(button.attributes('aria-hidden')).toBeUndefined()
		expect(button.attributes('aria-label')).toBe('Fermer')
	})

	it('masque le conteneur d\'une icône décorative', () => {
		const { wrapper } = mountWithSvgs(true)

		expect(wrapper.attributes('role')).toBe('presentation')
		expect(wrapper.attributes('aria-hidden')).toBe('true')
	})

	it('expose le conteneur d\'une icône fonctionnelle avec un label par défaut', () => {
		const { wrapper } = mountWithSvgs(false)

		expect(wrapper.attributes('role')).toBe('img')
		expect(wrapper.attributes('aria-hidden')).toBeUndefined()
		expect(wrapper.attributes('aria-label')).toBe('Cet élément est une icône')
	})
})
