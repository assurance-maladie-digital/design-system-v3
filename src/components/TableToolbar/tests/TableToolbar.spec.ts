import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TableToolbar from '../TableToolbar.vue'

describe('TableToolbar', () => {
	it('should render', () => {
		const wrapper = mount(TableToolbar, {
			props: {
				nbFiltered: 1,
				nbTotal: 2,
				showAddBtn: true,
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
		expect(wrapper.find('[data-test-id="nb-rows"]').text()).toContain('1/2')
	})

	it('renders correctly when all the item are displayed', () => {
		const wrapper = mount(TableToolbar, {
			props: {
				nbFiltered: 5,
				nbTotal: 5,
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
		expect(wrapper.find('[data-test-id="nb-rows"]').text()).toContain('5/5')
	})

	it('renders correctly when loading', () => {
		const wrapper = mount(TableToolbar, {
			props: {
				loading: true,
				nbFiltered: 0,
				nbTotal: 1,
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
		expect(wrapper.find('.v-progress-linear').exists()).toBe(true)
	})

	it('renders correctly when the screen width <= 600px', async () => {
		// @ts-expect-error  - Property 'happyDOM' does not exist on type 'Window & typeof globalThis'.
		window.happyDOM.setInnerWidth(600)

		const wrapper = mount(TableToolbar, {
			props: {
				nbFiltered: 0,
				nbTotal: 1,
			},
		})

		await wrapper.vm.$nextTick()

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('renders correctly with content slot', () => {
		const wrapper = mount(TableToolbar, {
			props: {
				nbFiltered: 0,
				nbTotal: 1,
			},
			slots: {
				searchLeft: '<p>search-left</p>',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('renders correctly with no items', () => {
		const wrapper = mount(TableToolbar, {
			props: {
				nbFiltered: 0,
				nbTotal: 0,
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
		expect(wrapper.find('[data-test-id="nb-rows"]').exists()).toBe(false)
	})

	it('renders correctly with no nbFilters', () => {
		const wrapper = mount(TableToolbar, {
			propsData: {
				nbFiltered: undefined,
				nbTotal: 50,
			},
		})
		expect(wrapper.find('[data-test-id="nb-rows"]').text()).not.toContain('/')
		expect(wrapper.find('[data-test-id="nb-rows"]').text()).toContain('50')
	})

	it('render correctly with the button add', () => {
		const wrapper = mount(TableToolbar, {
			props: {
				nbFiltered: 0,
				nbTotal: 1,
				showAddButton: true,
			},
		})

		expect(wrapper.find('[data-test-id="add-btn"]').exists()).toBe(true)
	})

	it('emit an update:search event when the search input is updated', async () => {
		const wrapper = mount(TableToolbar, {
			props: {
				nbFiltered: 0,
				nbTotal: 1,
			},
		})

		await wrapper.find('[data-test-id="search-input"] input').setValue('search')

		expect(wrapper.emitted('update:search')).toEqual([['search']])
	})

	it('emit an add event when the add button is clicked', async () => {
		const wrapper = mount(TableToolbar, {
			props: {
				nbFiltered: 0,
				nbTotal: 1,
				showAddButton: true,
			},
		})

		await wrapper.find('[data-test-id="add-btn"]').trigger('click')

		expect(wrapper.emitted('add')).toBeTruthy()
	})
})
