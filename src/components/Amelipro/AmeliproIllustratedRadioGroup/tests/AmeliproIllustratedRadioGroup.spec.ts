import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproIllustratedRadioGroup from '../AmeliproIllustratedRadioGroup.vue'
describe('AmeliproIllustratedRadioGroup', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproIllustratedRadioGroup, {
			props: {
				groupLabel: 'Mon Label',
				modelValue: [
					{
						icon: 'vaccination',
						iconDefaultColor: 'ap-yellow',
						isChecked: false,
						label: '1',
						value: 'Valeur 1',
					},
					{
						icon: 'vaccination',
						iconDefaultColor: 'ap-green',
						isChecked: false,
						label: '2',
						value: 'Valeur 2',
					},
					{
						icon: 'vaccination',
						iconDefaultColor: 'ap-red',
						isChecked: false,
						label: '3',
						value: 'Valeur 3',
					},
					{
						icon: 'vaccination',
						iconDefaultColor: 'ap-yellow',
						isChecked: false,
						label: '4',
						value: 'Valeur 4',
					},
					{
						icon: 'vaccination',
						iconDefaultColor: 'ap-yellow',
						isChecked: false,
						label: '5',
						value: 'Valeur 5',
					},
				],
				uniqueId: 'illustrated-radio-group-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
