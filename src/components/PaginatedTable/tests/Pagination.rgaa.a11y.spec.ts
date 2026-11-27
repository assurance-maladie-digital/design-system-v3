// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import Pagination from '../Pagination.vue'
const pagination = { page: ref(1), itemsPerPage: ref(10), startIndex: ref(0), stopIndex: ref(10), pageCount: ref(2), itemsLength: ref(20), setItemsPerPage: () => {} }
describe('Pagination – RGAA contract', () => {
	it('7.1 and 11.1 – exposes a labelled page-size select and pagination container', () => {
		const wrapper = mount(Pagination, { global: { provide: { [Symbol.for('vuetify:data-table-pagination')]: pagination } } })
		expect(wrapper.find('.v-data-table-footer__pagination').exists()).toBe(true)
		expect(wrapper.find('label').exists() || wrapper.find('[aria-label]').exists()).toBe(true)
	})
})
