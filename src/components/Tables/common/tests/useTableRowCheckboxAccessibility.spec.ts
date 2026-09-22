import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { useTableRowCheckboxAccessibility } from '../useTableRowCheckboxAccessibility'

const TestTable = defineComponent({
	setup() {
		useTableRowCheckboxAccessibility({ uniqueTableId: 'test-table' })
	},
	template: `
		<table id="test-table">
			<tbody>
				<tr>
					<td><div class="v-selection-control"><input type="radio"></div></td>
					<td><div class="v-selection-control"><input type="checkbox"></div></td>
				</tr>
			</tbody>
		</table>
	`,
})

describe('useTableRowCheckboxAccessibility', () => {
	afterEach(() => {
		vi.useRealTimers()
		document.body.innerHTML = ''
	})

	it('ajoute un libellé aux inputs radio et checkbox', async () => {
		vi.useFakeTimers()
		const wrapper = mount(TestTable, { attachTo: document.body })

		await nextTick()
		vi.advanceTimersByTime(100)

		const radio = wrapper.find('input[type="radio"]')
		const checkbox = wrapper.find('input[type="checkbox"]')

		expect(radio.attributes('aria-label')).toBe('Sélectionner la ligne 1')
		expect(radio.attributes('title')).toBe('Sélectionner la ligne 1')
		expect(checkbox.attributes('aria-label')).toBe('Sélectionner la ligne 2')
		expect(checkbox.attributes('title')).toBe('Sélectionner la ligne 2')
	})
})
