import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchListField from '../SearchListField.vue'

const items = [
	{ label: 'Option A', value: 'a' },
	{ label: 'Option B', value: 'b' },
	{ label: 'Option C', value: 'c' },
]

// jsdom ne calcule pas `:focus-visible` ni `:has()` : le ring DS est porté par la CSS scoped
// (`.label:has(:focus-visible)`, vérifié par le visuel). On valide ici la structure focusable :
// le champ de recherche et une vraie case à cocher focusable par ligne.
describe('SearchListField - Focus', () => {
	it('renders a real focusable search input', () => {
		const wrapper = mount(SearchListField, {
			props: { label: 'Rechercher', items },
		})

		const input = wrapper.find('[data-test-id="search-input"] input')
		expect(input.exists()).toBe(true)
		expect(input.attributes('tabindex')).not.toBe('-1')
	})

	it('wraps each row in a label holding one real focusable checkbox', () => {
		const wrapper = mount(SearchListField, {
			props: { label: 'Rechercher', items },
		})

		const rows = wrapper.findAll('[data-test-id="suggestions-list"] li')
		expect(rows.length).toBe(items.length)

		rows.forEach((row) => {
			expect(row.find('label.label').exists()).toBe(true)
			const checkbox = row.findAll('input[type="checkbox"]')
			expect(checkbox.length).toBe(1)
			expect(checkbox[0]!.attributes('tabindex')).not.toBe('-1')
		})
	})
})
