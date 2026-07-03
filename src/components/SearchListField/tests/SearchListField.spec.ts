import { mount } from '@vue/test-utils'
import SearchListField from '../SearchListField.vue'
import { describe, it, expect } from 'vitest'

describe('SearchListField.vue', () => {
	it('renders the password field', () => {
		const wrapper = mount(SearchListField, {
			props: {
				label: 'Filtrer la liste des Items',
				items: [
					{
						label: 'Item 1',
						value: 1,
					},
					{
						label: 'Item 2',
						value: 2,
					},
				],
				modelValue: [1],
			},
		})
		expect(wrapper.exists()).toBe(true)
	})

	it('initial state', () => {
		const wrapper = mount(SearchListField, {
			props: {
				label: 'Filtrer la liste des Items',
				items: [
					{
						label: 'Item 1',
						value: 1,
					},
					{
						label: 'Item 2',
						value: 2,
					},
				],
			},
		})

		expect(wrapper.vm.filteredItems).toEqual(wrapper.props().items)
		expect(
			wrapper.find('.vd-search-list .v-list-item--active').exists(),
		).toBe(false)
	})

	it('initial state with empty value prop', () => {
		const wrapper = mount(SearchListField, {
			props: {
				label: 'Filtrer la liste des Items',
				items: [
					{
						label: 'Item 1',
						value: 1,
					},
					{
						label: 'Item 2',
						value: 2,
					},
				],
				modelValue: [],
			},
		})

		expect(
			wrapper.find('.vd-search-list .v-list-item--active').exists(),
		).toBe(false)
	})

	it('supports null modelValue and can select an item', async () => {
		const wrapper = mount(SearchListField, {
			props: {
				label: 'Filtrer la liste des Items',
				items: [
					{
						label: 'Item 1',
						value: 1,
					},
					{
						label: 'Item 2',
						value: 2,
					},
				],
				modelValue: null,
			},
		})

		const listItem = wrapper.find('[data-test-id="suggestions-list"] li')
		await listItem.find('input[type="checkbox"]').setValue(true)
		await wrapper.vm.$nextTick()

		expect(wrapper.emitted('update:modelValue')).toEqual([[[1]]])
	})

	it('supports undefined modelValue and can select an item', async () => {
		const wrapper = mount(SearchListField, {
			props: {
				label: 'Filtrer la liste des Items',
				items: [
					{
						label: 'Item 1',
						value: 1,
					},
					{
						label: 'Item 2',
						value: 2,
					},
				],
				modelValue: undefined,
			},
		})

		const listItem = wrapper.find('[data-test-id="suggestions-list"] li')
		await listItem.find('input[type="checkbox"]').setValue(true)
		await wrapper.vm.$nextTick()

		expect(wrapper.emitted('update:modelValue')).toEqual([[[1]]])
	})

	it('selects an item', async () => {
		const wrapper = mount(SearchListField, {
			props: {
				label: 'Filtrer la liste des Items',
				items: [
					{
						label: 'Item 1',
						value: 1,
					},
					{
						label: 'Item 2',
						value: 2,
					},
				],
			},
		})

		const listItem = wrapper.find('[data-test-id="suggestions-list"] li')
		await listItem.find('input[type="checkbox"]').setValue(true)
		await wrapper.vm.$nextTick()

		expect(wrapper.emitted('update:modelValue')).toEqual([[[1]]])
		expect(listItem.classes()).toContain('suggestion-item--selected')
	})

	it('filters items based on search input', async () => {
		const wrapper = mount(SearchListField, {
			props: {
				label: 'Filtrer la liste des fruits',
				items: [
					{
						label: 'Apple',
						value: 'apple',
					},
					{
						label: 'Banana',
						value: 'banana',
					},
					{
						label: 'Orange',
						value: 'orange',
					},
				],
			},
		})

		wrapper.vm.search = 'Banana'
		await wrapper.vm.$nextTick()

		const filteredItems = wrapper.vm.filteredItems
		expect(filteredItems).toHaveLength(1)
		expect(filteredItems[0]?.label).toBe('Banana')
	})

	it('clears the search field', async () => {
		const wrapper = mount(SearchListField, {
			props: {
				label: 'Filtrer la liste des Items',
				items: [
					{
						label: 'Item 1',
						value: 1,
					},
					{
						label: 'Item 2',
						value: 2,
					},
				],
			},
		})

		wrapper.vm.search = 'Item 1'
		await wrapper.vm.$nextTick()

		await wrapper.find('.v-icon--clickable').trigger('click')

		expect(wrapper.vm.search).toBeNull()
	})

	it('filteredItems computed property', async () => {
		const wrapper = mount(SearchListField, {

			props: {
				label: 'Filtrer la liste des Items',
				items: [
					{
						label: 'Item 1',
						value: 1,
					},
					{
						label: 'Item 2',
						value: 2,
					},
				],
			},
		})

		expect(wrapper.vm.filteredItems).toHaveLength(2)

		wrapper.vm.search = 'Item 1'
		await wrapper.vm.$nextTick()
		expect(wrapper.vm.filteredItems).toHaveLength(1)
	})

	it('filteredItems computed property with null search', async () => {
		const wrapper = mount(SearchListField, {

			props: {
				label: 'Filtrer la liste des Items',
				items: [
					{
						label: 'Item 1',
						value: 1,
					},
					{
						label: 'Item 2',
						value: 2,
					},
				],
			},
		})

		expect(wrapper.vm.filteredItems).toHaveLength(2)

		wrapper.vm.search = null
		await wrapper.vm.$nextTick()
		expect(wrapper.vm.filteredItems).toHaveLength(2)
	})

	it('filteredItems computed property with multiple matching items', async () => {
		const wrapper = mount(SearchListField, {

			props: {
				label: 'Filtrer la liste des Items',
				items: [
					{
						label: 'Item 1',
						value: 1,
					},
					{
						label: 'Item 2',
						value: 2,
					},
					{
						label: 'Another Item 1',
						value: 3,
					},
				],
			},
		})

		wrapper.vm.search = 'Item 1'
		await wrapper.vm.$nextTick()
		expect(wrapper.vm.filteredItems).toHaveLength(2)
	})

	it('emitChangeEvent method', async () => {
		const wrapper = mount(SearchListField, {

			props: {
				label: 'Filtrer la liste des Items',
				items: [
					{
						label: 'Item 1',
						value: 1,
					},
					{
						label: 'Item 2',
						value: 2,
					},
				],
			},
		})

		wrapper.vm.emitChangeEvent([''])
		await wrapper.vm.$nextTick()
		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
	})

	it('emits the update:modelValue event when an item is selected', async () => {
		const wrapper = mount(SearchListField, {

			props: {
				label: 'Filtrer la liste des Items',
				items: [
					{
						label: 'Item 1',
						value: 1,
					},
					{
						label: 'Item 2',
						value: 2,
					},
				],
			},
		})

		const listItem = wrapper.find('[data-test-id="suggestions-list"] input')
		listItem.setValue(true)
		await wrapper.vm.$nextTick()

		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
		expect(wrapper.emitted('update:modelValue')).toEqual([[[1]]])
	})

	it('renders the password field without outlined prop', () => {
		const wrapper = mount(SearchListField, {

			props: {
				label: 'Filtrer la liste des Items',
				items: [
					{
						label: 'Item 1',
						value: 1,
					},
					{
						label: 'Item 2',
						value: 2,
					},
				],
				outlined: false,
			},
		})

		expect(wrapper.find('.v-field--variant-underlined')).toBeTruthy()
	})

	describe('Return object functionality', () => {
		it('emits values when returnObject is false (default)', async () => {
			const items = [
				{
					label: 'First Item',
					value: { id: 1, name: 'First' },
				},
				{
					label: 'Second Item',
					value: { id: 2, name: 'Second' },
				},
			]

			const wrapper = mount(SearchListField, {
				props: {
					label: 'Filtrer la liste des Items',
					items,
					modelValue: [],
					returnObject: false,
				},
			})

			wrapper.find('input[type="checkbox"]').setValue(true)
			await wrapper.vm.$nextTick()

			const emittedEvents = wrapper.emitted('update:modelValue')
			expect(emittedEvents).toBeTruthy()
			expect(emittedEvents![0]).toEqual([[{ id: 1, name: 'First' }]])
		})

		it('emits entire objects when returnObject is true', async () => {
			const items = [
				{
					label: 'First Item',
					value: { id: 1, name: 'First' },
				},
				{
					label: 'Second Item',
					value: { id: 2, name: 'Second' },
				},
			]

			const wrapper = mount(SearchListField, {
				props: {
					label: 'Filtrer la liste des Items',
					items,
					modelValue: [],
					returnObject: true,
				},
			})

			wrapper.find('input[type="checkbox"]').setValue(true)
			await wrapper.vm.$nextTick()

			const emittedEvents = wrapper.emitted('update:modelValue')
			expect(emittedEvents).toBeTruthy()
			expect(emittedEvents![0]).toEqual([[items[0]]])
		})

		it('handles selection and deselection correctly with returnObject true', async () => {
			const items = [
				{
					label: 'First Item',
					value: { id: 1, name: 'First' },
				},
				{
					label: 'Second Item',
					value: { id: 2, name: 'Second' },
				},
			]

			const wrapper = mount(SearchListField, {
				props: {
					label: 'Filtrer la liste des Items',
					items,
					modelValue: [],
					returnObject: true,
				},
			})

			wrapper.find('input[type="checkbox"]').setValue(true)
			await wrapper.vm.$nextTick()

			const emittedEvents = wrapper.emitted('update:modelValue')
			expect(emittedEvents).toBeTruthy()
			expect(emittedEvents![0]).toEqual([[items[0]]])

			// Update props to simulate parent component update
			await wrapper.setProps({ modelValue: [items[0]] })
			await wrapper.vm.$nextTick()

			// Deselect first item
			wrapper.find('input[type="checkbox"]').setValue(false)
			await wrapper.vm.$nextTick()

			expect(emittedEvents![1]).toEqual([[]])
		})
	})

	describe('reset and immutability', () => {
		it('clears internalValue when modelValue is reset to undefined after selections', async () => {
			const wrapper = mount(SearchListField, {
				props: {
					label: 'Test',
					items: [
						{ label: 'Item 1', value: 1 },
						{ label: 'Item 2', value: 2 },
					],
				},
			})

			// Select item 1
			const checkboxes = wrapper.findAll('[data-test-id="suggestions-list"] input[type="checkbox"]')
			await checkboxes[0].setValue(true)
			await wrapper.vm.$nextTick()

			// Simulate parent syncing modelValue back
			await wrapper.setProps({ modelValue: [1] })

			// Reset: parent sets modelValue to undefined (filter reset)
			await wrapper.setProps({ modelValue: undefined })

			// Select item 2
			await checkboxes[1].setValue(true)
			await wrapper.vm.$nextTick()

			const emitted = wrapper.emitted('update:modelValue')!
			// Last emit should only contain [2], not [1, 2]
			expect(emitted[emitted.length - 1]).toEqual([[2]])
		})

		it('does not mutate the modelValue prop array when selecting items', async () => {
			const modelValue = [1]
			const wrapper = mount(SearchListField, {
				props: {
					label: 'Test',
					items: [
						{ label: 'Item 1', value: 1 },
						{ label: 'Item 2', value: 2 },
					],
					modelValue,
				},
			})

			await wrapper.findAll('[data-test-id="suggestions-list"] input[type="checkbox"]')[1].setValue(true)
			await wrapper.vm.$nextTick()

			// Original prop array must not be mutated
			expect(modelValue).toEqual([1])
			// Emitted value should include both items
			expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[1, 2]])
		})

		it('does not mutate the modelValue prop array when deselecting items', async () => {
			const modelValue = [1, 2]
			const wrapper = mount(SearchListField, {
				props: {
					label: 'Test',
					items: [
						{ label: 'Item 1', value: 1 },
						{ label: 'Item 2', value: 2 },
					],
					modelValue,
				},
			})

			await wrapper.findAll('[data-test-id="suggestions-list"] input[type="checkbox"]')[0].setValue(false)
			await wrapper.vm.$nextTick()

			// Original prop array must not be mutated
			expect(modelValue).toEqual([1, 2])
			// Emitted value should only contain item 2
			expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[2]])
		})
	})
})
