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

	describe('locales', () => {
		it('surcharge les libellés des boutons via `locales`', () => {
			const wrapper = mount(AmeliproPatientLoginForm, {
				props: {
					autoCompleteCardItems: [{ title: 'Carte 1', value: '1' }],
					noAppVitalCard: false,
					noNir: false,
					noVitalCard: false,
					loading: false,
					uniqueId: 'test-id',
					locales: {
						readVirtualCardLabel: 'LIRE_VIRT_X',
						readVitalCardAppLabel: 'LIRE_APP_X',
						validateNirLabel: 'VALIDER_X',
					},
				},
			})

			const html = wrapper.html()
			expect(html).toContain('LIRE_VIRT_X')
			expect(html).toContain('LIRE_APP_X')
			expect(html).toContain('VALIDER_X')
		})

		it('surcharge le message de chargement via `locales`', () => {
			const wrapper = mount(AmeliproPatientLoginForm, {
				props: {
					loading: true,
					uniqueId: 'test-id',
					locales: { loadingText: 'PATIENTEZ_X' },
				},
			})

			expect(wrapper.html()).toContain('PATIENTEZ_X')
		})
	})
})
