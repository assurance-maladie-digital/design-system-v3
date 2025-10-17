import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproRadioGroup from '../AmeliproRadioGroup.vue'
describe('AmeliproRadioGroup', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproRadioGroup, {
			props: {
				groupLabel: 'Label du groupe',
				modelValue: [
					{
						isChecked: false,
						label: '1',
						value: 'Valeur 1',
					},
					{
						isChecked: false,
						label: '2',
						value: 'Valeur 2',
					},
					{
						isChecked: true,
						label: '3',
						value: 'Valeur 3',
					},
					{
						isChecked: false,
						label: '4',
						value: 'Valeur 4',
					},
					{
						isChecked: false,
						label: '5',
						value: 'Valeur 5',
					},
				],
				uniqueId: 'my-radio-group-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
