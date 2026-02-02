import { shallowMount, type VueWrapper, DOMWrapper } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import AmeliproFilters from '../AmeliproFilters.vue'
import type { AmeliproFilterItem } from '../types'

const items: AmeliproFilterItem[] = [
	{ id: 'the-item-id-1', label: 'The item label 1', value: 'the-item-value-1' },
	{ id: 'the-item-id-2', label: 'The item label 2', value: 'the-item-value-2', isChecked: true },
	{ id: 'the-item-id-3', label: 'The item label 3', value: 'the-item-value-3' },
	{ id: 'the-item-id-4', label: 'The item label 4', value: 'the-item-value-4', isChecked: true },
]

const requiredProps = () => ({
	groupId: 'group-1',
	groupLabel: 'Group Label',
	value: items,
})

describe('AmeliproFilters', () => {
	let wrapper: VueWrapper
	let inputs: DOMWrapper<HTMLInputElement>[]

	beforeEach(() => {
		wrapper = shallowMount(AmeliproFilters, { props: requiredProps() })
		inputs = wrapper.findAll<HTMLInputElement>('.amelipro-filters__filter__input')
	})

	it('renders correct number of filter items', () => {
		expect(inputs.length).toBe(4)
	})

	it('renders correct labels', () => {
		const labels = wrapper.findAll('.amelipro-filters__filter__label')
		expect(labels.map(l => l.text())).toEqual([
			'The item label 1',
			'The item label 2',
			'The item label 3',
			'The item label 4',
		])
	})

	it('main div has correct aria-labelledby and role attributes', async () => {
		expect(wrapper.attributes('aria-labelledby')).toBeUndefined()
		expect(wrapper.attributes('role')).toBeUndefined()

		await wrapper.setProps({ unique: true })
		expect(wrapper.attributes('aria-labelledby')).toBe('group-1-label')
		expect(wrapper.attributes('role')).toBe('radiogroup')
	})

	it('group label has correct text and id', () => {
		const labelEl = wrapper.find('.amelipro-filters__label')
		expect(labelEl.text()).toBe('Group Label')
		expect(labelEl.attributes('id')).toBe('group-1-label')
	})

	it('applies d-sr-only class when hiddenLabel is true', async () => {
		await wrapper.setProps({ hiddenLabel: true })
		const label = wrapper.find('.amelipro-filters__label')
		expect(label.classes()).toContain('d-sr-only')
	})

	it('emits "input" and "change:selected" for multiple (checkbox) mode', async () => {
		await inputs[0]!.trigger('click')
		await inputs[2]!.trigger('click')

		const emittedInput = wrapper.emitted('input')! as unknown[][][]
		const emittedChange = wrapper.emitted('change:selected')! as unknown[][]

		expect(emittedInput.length).toBe(2)
		expect(emittedChange.length).toBe(2)

		const selectedValuesFirst = (emittedChange[0]![0] as AmeliproFilterItem[]).map(i => i.value)
		const selectedValuesSecond = (emittedChange[1]![0] as AmeliproFilterItem[]).map(i => i.value)

		expect(selectedValuesFirst).toContain('the-item-value-1')
		expect(selectedValuesFirst).toContain('the-item-value-2')
		expect(selectedValuesFirst).toContain('the-item-value-4')

		expect(selectedValuesSecond).toContain('the-item-value-1')
		expect(selectedValuesSecond).toContain('the-item-value-2')
		expect(selectedValuesSecond).toContain('the-item-value-3')
		expect(selectedValuesSecond).toContain('the-item-value-4')
	})

	it('emits "input" and "change:selected" for unique (radio) mode', async () => {
		await wrapper.setProps({ unique: true })
		inputs = wrapper.findAll<HTMLInputElement>('input')

		// Simule un changement
		inputs[0]!.element.checked = true
		await inputs[0]!.trigger('change')
		inputs[1]!.element.checked = true
		await inputs[1]!.trigger('change')

		const emittedInput = wrapper.emitted('input') as AmeliproFilterItem[][][]
		const emittedChange = wrapper.emitted('change:selected') as string[][]

		expect(emittedInput.length).toBe(2)
		expect(emittedChange.length).toBe(2)

		// Vérifie les valeurs sélectionnées
		const firstInputValues = emittedInput[0]![0]!.map(i => i.value)
		const secondInputValues = emittedInput[1]![0]!.map(i => i.value)

		expect(firstInputValues).toContain('the-item-value-1')
		expect(secondInputValues).toContain('the-item-value-2')

		expect(emittedChange[0]![0]).toBe('the-item-value-1')
		expect(emittedChange[1]![0]).toBe('the-item-value-2')
	})

	it('updates items when props.value changes', async () => {
		await wrapper.setProps({ value: [] })
		expect(wrapper.findAll('.amelipro-filters__item').length).toBe(0)

		await wrapper.setProps({ value: items })
		expect(wrapper.findAll('.amelipro-filters__item').length).toBe(4)
	})

	it('updates items correctly when props.value changes in unique mode', async () => {
		await wrapper.setProps({ unique: true, value: [] })
		expect(wrapper.findAll('.amelipro-filters__item').length).toBe(0)

		await wrapper.setProps({ value: items })
		expect(wrapper.findAll('.amelipro-filters__item').length).toBe(4)
	})

	it('updates input attributes when unique prop changes', async () => {
		await wrapper.setProps({ unique: true })
		inputs = wrapper.findAll<HTMLInputElement>('input')

		expect(inputs[0]!.attributes('type')).toBe('radio')
		expect(inputs[0]!.attributes('name')).toBe('group-1')
		expect(inputs[0]!.attributes('value')).toBe('the-item-value-1')
	})

	it('updates label text when groupLabel prop changes', async () => {
		const label = wrapper.find('.amelipro-filters__label')
		expect(label.text()).toBe('Group Label')

		await wrapper.setProps({ groupLabel: 'New Label' })
		expect(wrapper.find('.amelipro-filters__label').text()).toBe('New Label')
	})

	it('computes selectedValue correctly in unique mode', async () => {
		await wrapper.setProps({ unique: true })
		const firstInput = wrapper.findAll<HTMLInputElement>('input')[0]!
		firstInput.element.checked = true
		await firstInput.trigger('change')

		const emittedChange = wrapper.emitted('change:selected') as string[][]
		expect(emittedChange[0]![0]).toBe('the-item-value-1')
	})

	it('applies item-spacing class conditionally based on smAndUp', async () => {
		// TS-safe access
		const vmTyped = wrapper.vm as unknown as { smAndUp: boolean }
		vmTyped.smAndUp = true
		await wrapper.vm.$nextTick()
		const firstItem = wrapper.find('.amelipro-filters__item')
		expect(firstItem.classes()).toContain('item-spacing')
	})

	it('sets correct ARIA attributes for checkbox items', () => {
		const divs = wrapper.findAll('.amelipro-filters__filter__input')
		divs.forEach((div, i) => {
			const item = items[i]!
			expect(div.attributes('role')).toBe('checkbox')
			if (item.isChecked) {
				expect(div.attributes('aria-checked')).toBe('true')
			}
			else {
				expect(div.attributes('aria-checked')).toBeUndefined()
			}
		})
	})
})
