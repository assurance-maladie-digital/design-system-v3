import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproPatientLogin from '../AmeliproPatientLogin.vue'

describe('AmeliproPatientLogin', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproPatientLogin, {
			props: {
				autoCompleteCardItems: [
					{
						title: 'Carte 1',
						value: '1',
					},
					{
						title: 'Carte 2',
						value: '2',
					},
					{
						title: 'Carte 3',
						value: '3',
					},
				],
				disableBtnAppVitalCard: true,
				disableBtnNir: true,
				disableBtnVitalCard: true,
				errorMessageAppVitalCard: true,
				errorMessageNir: true,
				errorMessageVitalCard: true,
				loading: true,
				modelValue: {
					dialog: false,
					formValue: {
						fieldValue: 'test',
						autoCompleteValue: '2',
					},
				},
				noAppVitalCard: false,
				noNir: false,
				noVitalCard: false,
				uniqueId: 'test-id',
			},
		})
		expect(wrapper.html()).toMatchSnapshot()
	})
})
