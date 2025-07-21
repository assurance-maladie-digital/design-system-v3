import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproStepper from '../AmeliproStepper.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproStepper', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproStepper, {
			global: {
				plugins: [vuetify],
			},
			props: {
				items: [
					{
						disabled: false,
						label: 'Mes Informations',
					},
					{
						disabled: false,
						label: 'Ma démarche',
					},
					{
						label: 'Ma demande',
						disabled: true,
					},
					{
						label: 'Récapitulatif',
						disabled: true,
					},
				],
				uniqueId: 'my-stepper-id',
			},
			slots: {
				stepContent: '<p>Contenu principal</p>',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
