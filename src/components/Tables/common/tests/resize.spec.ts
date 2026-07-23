import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SyTable from '../../SyTable/SyTable.vue'

describe('Resize columns functionality', () => {
	describe('with the keyboard', () => {
		it('should resize the column to the right', async () => {
			const wrapper = mount(SyTable, {
				props: {
					items: [
						{ name: 'col1', label: 'Column 1' },
						{ name: 'col2', label: 'Column 2' },
					],
					resizableColumns: true,
					suffix: 'resize-test',
				},
			})

			// mock current width of the columns
			const col1 = wrapper.find<Element>('.v-data-table-header__content')
			Object.defineProperty(col1.element, 'offsetWidth', {
				get: () => 100,
			})

			const col1Header = wrapper.find<HTMLTableCellElement>('.v-data-table__tr .v-data-table__td')
			const col2Header = wrapper.find<HTMLTableCellElement>('.v-data-table__tr .v-data-table__td:nth-child(2)')

			await wrapper.vm.$nextTick()

			expect(col1Header.exists()).toBe(true)
			expect(col2Header.exists()).toBe(true)

			expect(col1Header.element.style.width).toBe('')
			const separator = wrapper.find('.resizer')
			expect(separator.exists()).toBe(true)
			await wrapper.vm.$nextTick()

			await separator.trigger('keydown', { key: 'ArrowRight' })

			// Le clavier applique la même correction que la souris (`offsetWidth + 24 + 1/2*16`
			// ≈ +32) pour repartir de la vraie largeur de colonne : 100 + 32 = 132, puis +10.
			// Sans cette correction, la 1re flèche rétrécissait la colonne (bug corrigé).
			expect(col1Header.element.style.width).toBe(`142px`)
		})

		it('should resize the column to the right', async () => {
			const wrapper = mount(SyTable, {
				props: {
					items: [
						{ name: 'col1', label: 'Column 1' },
						{ name: 'col2', label: 'Column 2' },
					],
					resizableColumns: true,
					suffix: 'resize-test',
				},
			})

			// mock current width of the columns
			const col1 = wrapper.find<Element>('.v-data-table-header__content')
			Object.defineProperty(col1.element, 'offsetWidth', {
				get: () => 100,
			})

			const col1Header = wrapper.find<HTMLTableCellElement>('.v-data-table__tr .v-data-table__td')
			const col2Header = wrapper.find<HTMLTableCellElement>('.v-data-table__tr .v-data-table__td:nth-child(2)')

			await wrapper.vm.$nextTick()

			expect(col1Header.exists()).toBe(true)
			expect(col2Header.exists()).toBe(true)

			expect(col1Header.element.style.width).toBe('')
			const separator = wrapper.find('.resizer')
			expect(separator.exists()).toBe(true)
			await wrapper.vm.$nextTick()

			await separator.trigger('keydown', { key: 'ArrowLeft' })

			// Correction +32 comme la souris : 100 + 32 = 132, puis -10.
			expect(col1Header.element.style.width).toBe(`122px`)
		})
	})

	describe('with the mouse', () => {
		it('should resize the column to the right', async () => {
			const wrapper = mount(SyTable, {
				props: {
					items: [
						{ name: 'col1', label: 'Column 1' },
						{ name: 'col2', label: 'Column 2' },
					],
					resizableColumns: true,
					suffix: 'resize-test',
				},
			})

			// mock current width of the columns
			const col1 = wrapper.find<Element>('.v-data-table-header__content')
			Object.defineProperty(col1.element, 'offsetWidth', {
				get: () => 100,
			})

			const col1Header = wrapper.find<HTMLTableCellElement>('.v-data-table__tr .v-data-table__td')
			const col2Header = wrapper.find<HTMLTableCellElement>('.v-data-table__tr .v-data-table__td:nth-child(2)')

			expect(col1Header.exists()).toBe(true)
			expect(col2Header.exists()).toBe(true)

			expect(col1Header.element.style.width).toBe('')
			const separator = wrapper.find('.resizer')
			expect(separator.exists()).toBe(true)

			await separator.trigger('mousedown', { clientX: 150 })
			document.dispatchEvent(new MouseEvent('mousemove', { clientX: 250 }))
			document.dispatchEvent(new MouseEvent('mouseup'))
			await wrapper.vm.$nextTick()

			expect(col1Header.element.style.width).toBe(`232px`)
		})

		it('should resize the column to the left', async () => {
			const wrapper = mount(SyTable, {
				props: {
					items: [
						{ name: 'col1', label: 'Column 1' },
						{ name: 'col2', label: 'Column 2' },
					],
					resizableColumns: true,
					suffix: 'resize-test',
				},
			})

			// mock current width of the columns
			const col1 = wrapper.find<Element>('.v-data-table-header__content')
			Object.defineProperty(col1.element, 'offsetWidth', {
				get: () => 100,
			})

			const col1Header = wrapper.find<HTMLTableCellElement>('.v-data-table__tr .v-data-table__td')
			expect(col1Header.element.style.width).toBe('')
			const separator = wrapper.find('.resizer')
			expect(separator.exists()).toBe(true)

			await separator.trigger('mousedown', { clientX: 150 })
			document.dispatchEvent(new MouseEvent('mousemove', { clientX: 50 }))
			document.dispatchEvent(new MouseEvent('mouseup'))
			await wrapper.vm.$nextTick()

			expect(col1Header.element.style.width).toBe(`50px`)
		})
	})
})
