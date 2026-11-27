// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PaginatedTable from '../PaginatedTable.vue'

const headers = [{ title: 'Nom', key: 'name' }, { title: 'Âge', key: 'age' }]
const items = [{ name: 'Ada', age: 36 }]

describe('PaginatedTable – RGAA contract', () => {
	beforeEach(() => {
		document.body.innerHTML = ''
	})

	it('9.1 and 11.1 – exposes a caption and scoped table headers', async () => {
		const wrapper = mount(PaginatedTable, {
			props: { suffix: 'rgaa-contract', caption: 'Liste des personnes', headers, items },
			attachTo: document.body,
		})
		await wrapper.vm.$nextTick()

		expect(wrapper.get('caption').text()).toBe('Liste des personnes')
		expect(wrapper.findAll('th[scope="col"]').length).toBeGreaterThanOrEqual(2)
		wrapper.unmount()
	})

	it('7.1 and 11.1 – exposes native pagination controls for a multi-page dataset', () => {
		const wrapper = mount(PaginatedTable, {
			props: {
				suffix: 'rgaa-pagination',
				caption: 'Liste paginée',
				headers,
				items: Array.from({ length: 12 }, (_, index) => ({ name: `Personne ${index}`, age: index })),
				itemsPerPage: 10,
			},
			attachTo: document.body,
		})

		expect(wrapper.findAll('button').length).toBeGreaterThan(0)
		wrapper.unmount()
	})
})
