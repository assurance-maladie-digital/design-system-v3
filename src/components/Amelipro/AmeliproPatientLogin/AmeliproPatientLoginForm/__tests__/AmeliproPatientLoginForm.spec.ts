import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproPatientLoginForm from '../AmeliproPatientLoginForm.vue'

describe('AmeliproPatientLoginForm', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproPatientLoginForm, {
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
				disablePatientLoginFormAppVitalCard: true,
				disablePatientLoginFormNir: true,
				disablePatientLoginFormVitalCard: true,
				errorMessageAppVitalCard: true,
				errorMessageNir: true,
				errorMessageVitalCard: true,
				loading: true,
				modelValue: {
					fieldValue: 'test',
					autoCompleteValue: '2',
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
