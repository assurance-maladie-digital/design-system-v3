import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproCheckboxGroup from '../AmeliproCheckboxGroup.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproCheckboxGroup', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproCheckboxGroup, {
			global: {
				plugins: [vuetify],
			},
			props: {
				groupLabel: 'Libellé du groupe',
				modelValue: [
					{
						disabled: true,
						isChecked: true,
						label: '1',
						value: 'Valeur 1',
					},
					{
						description: 'ma-tooltip',
						disabled: true,
						isChecked: false,
						label: '2',
						value: 'Valeur 2',
					},
					{
						isChecked: false,
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
				uniqueId: 'my-checkbox-group-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
