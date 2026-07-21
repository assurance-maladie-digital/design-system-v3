import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SyCheckBoxGroup from '../SyCheckBoxGroup.vue'

const options = [
	{ label: 'Option A', value: 'a' },
	{ label: 'Option B', value: 'b' },
	{ label: 'Option C', value: 'c' },
]

// SyCheckBoxGroup ne porte aucun style de focus propre : c'est un <fieldset> qui assemble des
// SyCheckbox. Chaque SyCheckbox gère déjà son ring DS (`.v-selection-control--focus-visible`,
// 2px primary, offset 2px). On vérifie ici que la surface focusable est bien déléguée.
describe('SyCheckBoxGroup - Focus', () => {
	it('wraps the options in a fieldset for grouping semantics', () => {
		const wrapper = mount(SyCheckBoxGroup, {
			props: { options, label: 'Choix' },
		})
		expect(wrapper.find('fieldset.sy-checkbox-group').exists()).toBe(true)
	})

	it('exposes one keyboard-focusable checkbox per option (ring handled by SyCheckbox)', () => {
		const wrapper = mount(SyCheckBoxGroup, {
			props: { options, label: 'Choix' },
		})
		const boxes = wrapper.findAll('input[type="checkbox"]')

		expect(boxes).toHaveLength(options.length)
		boxes.forEach((box) => {
			expect(box.attributes('tabindex')).not.toBe('-1')
		})
	})
})
