import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import SelectBtnField from '../SelectBtnField.vue'

describe('SelectBtnField', () => {
	it('renders correctly', () => {
		const wrapper = mount(SelectBtnField)

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('renders correctly with props', () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				label: 'Test',
				hint: 'Test',
				items: [
					{
						text: 'Test',
						value: 'test',
					},
					{
						text: 'Test 2',
						value: '',
					},
					{
						text: 'Test 3',
						value: 'test3',
					},
				],
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('render correctly in multiple mode', () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				label: 'Test',
				hint: 'Test',
				items: [
					{
						text: 'Test',
						value: 'test',
					},
					{
						text: 'Test 2',
						value: '',
					},
					{
						text: 'Test 3',
						value: 'test3',
					},
				],
				multiple: true,
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('emits an update event when the value change in single mode', async () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				label: 'Test',
				hint: 'Test',
				items: [
					{
						text: 'Test',
						value: 'test',
					},
				],
			},
		})

		await wrapper.find('[role="option"]').trigger('click')

		expect(wrapper.emitted()).toHaveProperty('update:modelValue')

		await wrapper.find('[role="option"]').trigger('click')

		expect(wrapper.emitted('update:modelValue')).toEqual([['test'], [null]])
	})

	it(`emits an array of values when the value changes in multiple mode`, async () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				label: 'Test',
				hint: 'Test',
				items: [
					{
						text: 'Test',
						value: 'test',
					},
					{
						text: 'Test 2',
						value: 'test2',
					},
					{
						text: 'Test 3',
						value: 'test3',
					},
				],
				multiple: true,
			},
		})

		await wrapper.find('li:nth-child(2)[role="option"]').trigger('click')
		await wrapper.find('li:nth-child(3)[role="option"]').trigger('click')
		await wrapper.find('li:nth-child(2)[role="option"]').trigger('click')

		expect(wrapper.emitted('update:modelValue')).toEqual([
			[['test2']],
			[['test2', 'test3']],
			[['test3']],
		])
	})

	it('handles multiple mode safely when modelValue is null', async () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				label: 'Test',
				hint: 'Test',
				items: [
					{
						text: 'Test',
						value: 'test',
					},
					{
						text: 'Test 2',
						value: 'test2',
					},
					{
						text: 'Test 3',
						value: 'test3',
					},
				],
				multiple: true,
				modelValue: null,
			},
		})

		await wrapper.find('[role="option"]').trigger('click')

		expect(wrapper.emitted('update:modelValue')).toEqual([
			[['test']],
		])
	})

	it(`display correctly with an error`, () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				label: 'Test',
				hint: 'Test',
				items: [
					{
						text: 'Test',
						value: 'test',
					},
					{
						text: 'Test 2',
						value: 'test2',
					},
					{
						text: 'Test 3',
						value: 'test3',
					},
				],
				error: true,
				errorMessages: ['Test'],
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})

	it(`clear the others values when defined to unique`, async () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				label: 'Test',
				items: [
					{
						text: 'Test 1',
						value: 'test1',
					},
					{
						text: 'Test 2',
						value: 'test2',
					},
					{
						text: 'Other',
						value: 'other',
						unique: true,
					},
				],
				multiple: true,
			},
		})

		await wrapper.find('li:nth-child(1)[role="option"]').trigger('click')
		await wrapper.find('li:nth-child(2)[role="option"]').trigger('click')
		await wrapper.find('li:nth-child(3)[role="option"]').trigger('click')
		await wrapper.find('li:nth-child(2)[role="option"]').trigger('click')

		expect(wrapper.emitted('update:modelValue')).toEqual([
			[['test1']],
			[['test1', 'test2']],
			[['other']],
			[['test2']],
		])
	})

	it(`display correctly in dark mode with an error`, () => {
		const DarkMode = {
			template: `
				<v-app>
					<v-theme-provider theme="dark">
						<div>
							<SelectBtnField v-bind="props" />
						</div>
					</v-theme-provider>
				</v-app>
			`,
			components: {
				SelectBtnField,
			},
			data() {
				return {
					props: {
						label: 'Test',
						hint: 'Test',
						items: [
							{
								text: 'Test 1',
								value: 'test1',
							},
							{
								text: 'Test 2',
								value: 'test2',
							},
						],
						error: true,
						errorMessages: ['Test'],
						multiple: true,
						inline: true,
					},
				}
			},
		}

		const wrapper = mount(DarkMode)

		wrapper.find('li:nth-child(1)[role="option"]').trigger('click')
		wrapper.find('li:nth-child(2)[role="option"]').trigger('click')

		expect(wrapper.html()).toMatchSnapshot()
	})

	it(`display correctly with in dark mode with an hint`, () => {
		const DarkMode = {
			template: `
				<v-app>
					<v-theme-provider theme="dark">
						<div>
							<SelectBtnField v-bind="props" />
						</div>
					</v-theme-provider>
				</v-app>
			`,
			components: {
				SelectBtnField,
			},
			data() {
				return {
					props: {
						label: 'Test',
						hint: 'Test',
						items: [
							{
								text: 'Test 1',
								value: 'test1',
							},
							{
								text: 'Test 2',
								value: 'test2',
							},
						],
						multiple: true,
						inline: true,
					},
				}
			},
		}

		const wrapper = mount(DarkMode)

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('do not allow to select an item when the readonly prop is defined', async () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				label: 'Test',
				hint: 'Test',
				items: [
					{
						text: 'Test 1',
						value: 'test1',
					},
					{
						text: 'Test 2',
						value: 'test2',
					},
				],
				readonly: true,
			},
		})

		await wrapper.find('[role="option"]').trigger('click')
		expect(wrapper.emitted()).not.toHaveProperty('update:modelValue')
	})

	it('emits update:error and update:error-messages when an item is selected', async () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				items: [{ text: 'Test', value: 'test' }],
				error: true,
				errorMessages: ['Champ requis'],
			},
		})

		await wrapper.find('[role="option"]').trigger('click')

		expect(wrapper.emitted('update:error')).toEqual([[false]])
		expect(wrapper.emitted('update:error-messages')).toEqual([[undefined]])
	})

	it('filters out items with null or undefined value', () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				items: [
					{ text: 'Valide', value: 'valide' },
					{ text: 'Null', value: null as unknown as string },
					{ text: 'Undefined', value: undefined as unknown as string },
				],
			},
		})

		const options = wrapper.findAll('[role="option"]')
		expect(options).toHaveLength(1)
		expect(options[0]!.text()).toContain('Valide')
	})

	it('syncs internalValue when modelValue prop changes externally', async () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				items: [
					{ text: 'A', value: 'a' },
					{ text: 'B', value: 'b' },
				],
				modelValue: 'a',
			},
		})

		let selectedItem = wrapper.find('[aria-selected="true"]')
		expect(selectedItem.text()).toContain('A')

		await wrapper.setProps({ modelValue: 'b' })

		selectedItem = wrapper.find('[aria-selected="true"]')
		expect(selectedItem.text()).toContain('B')
	})

	it('syncs internalValue array when modelValue changes in multiple mode', async () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				items: [
					{ text: 'A', value: 'a' },
					{ text: 'B', value: 'b' },
				],
				multiple: true,
				modelValue: ['a'],
			},
		})

		expect(wrapper.find('li:nth-child(1)').attributes('aria-checked')).toBe('true')
		expect(wrapper.find('li:nth-child(2)').attributes('aria-checked')).toBe('false')

		await wrapper.setProps({ modelValue: ['a', 'b'] })

		expect(wrapper.find('li:nth-child(2)').attributes('aria-checked')).toBe('true')
	})

	it('sets correct ARIA attributes on the listbox', () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				label: 'Choix',
				multiple: true,
				inline: true,
				error: true,
			},
		})

		const listbox = wrapper.find('[role="listbox"]')
		expect(listbox.attributes('aria-label')).toBe('Choix')
		expect(listbox.attributes('aria-multiselectable')).toBe('true')
		expect(listbox.attributes('aria-orientation')).toBe('horizontal')
		expect(listbox.attributes('aria-invalid')).toBe('true')
	})

	it('sets aria-readonly on the listbox when readonly', () => {
		const wrapper = mount(SelectBtnField, {
			props: { readonly: true },
		})

		expect(wrapper.find('[role="listbox"]').attributes('aria-readonly')).toBe('true')
	})

	it('navigates to next item with ArrowRight key', async () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				items: [
					{ text: 'A', value: 'a' },
					{ text: 'B', value: 'b' },
					{ text: 'C', value: 'c' },
				],
			},
		})

		await wrapper.find('[role="listbox"]').trigger('keydown', { key: 'ArrowRight' })
		await wrapper.find('[role="listbox"]').trigger('keydown', { key: 'ArrowRight' })

		const emitted = wrapper.emitted('update:modelValue')
		expect(emitted).toBeTruthy()
		expect(emitted!.length).toBeGreaterThanOrEqual(1)
	})

	it('wraps around to first item when navigating past last with ArrowDown', async () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				items: [
					{ text: 'A', value: 'a' },
					{ text: 'B', value: 'b' },
				],
				modelValue: 'b',
			},
		})

		await wrapper.find('[role="listbox"]').trigger('keydown', { key: 'ArrowDown' })

		const emitted = wrapper.emitted('update:modelValue')
		expect(emitted).toBeTruthy()
		expect(emitted![emitted!.length - 1]![0]).toBe('a')
	})

	it('wraps around to last item when navigating before first with ArrowUp', async () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				items: [
					{ text: 'A', value: 'a' },
					{ text: 'B', value: 'b' },
				],
				modelValue: 'a',
			},
		})

		await wrapper.find('[role="listbox"]').trigger('keydown', { key: 'ArrowUp' })

		const emitted = wrapper.emitted('update:modelValue')
		expect(emitted).toBeTruthy()
		expect(emitted![emitted!.length - 1]![0]).toBe('b')
	})

	it('selects item with Space key', async () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				items: [{ text: 'Test', value: 'test' }],
			},
		})

		await wrapper.find('[role="option"]').trigger('keydown', { key: ' ' })

		expect(wrapper.emitted('update:modelValue')).toEqual([['test']])
	})

	it('selecting unique item when others are selected replaces all', async () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				multiple: true,
				items: [
					{ text: 'A', value: 'a' },
					{ text: 'B', value: 'b' },
					{ text: 'Unique', value: 'unique', unique: true },
				],
				modelValue: ['a', 'b'],
			},
		})

		await wrapper.find('li:nth-child(3)[role="option"]').trigger('click')

		const emitted = wrapper.emitted('update:modelValue')
		expect(emitted![emitted!.length - 1]![0]).toEqual(['unique'])
	})

	it('re-selecting a unique item in multiple mode deselects it', async () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				multiple: true,
				items: [
					{ text: 'Unique', value: 'unique', unique: true },
				],
				modelValue: ['unique'],
			},
		})

		await wrapper.find('[role="option"]').trigger('click')

		const emitted = wrapper.emitted('update:modelValue')
		expect(emitted![emitted!.length - 1]![0]).toEqual([])
	})

	it('displays hint when no errorMessages', () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				hint: 'Aide contextuelle',
				items: [{ text: 'A', value: 'a' }],
			},
		})

		expect(wrapper.text()).toContain('Aide contextuelle')
	})

	it('displays errorMessages instead of hint when both are provided', () => {
		const wrapper = mount(SelectBtnField, {
			props: {
				hint: 'Aide contextuelle',
				errorMessages: ['Champ invalide'],
				items: [{ text: 'A', value: 'a' }],
			},
		})

		expect(wrapper.text()).toContain('Champ invalide')
		expect(wrapper.text()).not.toContain('Aide contextuelle')
	})
})
