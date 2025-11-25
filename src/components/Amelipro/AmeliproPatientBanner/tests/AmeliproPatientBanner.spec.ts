import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproPatientBanner from '../AmeliproPatientBanner.vue'

describe('AmeliproPatientBanner', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproPatientBanner, {
			props: {
				birthName: 'Dupont',
				birthdate: '09/11/1992',
				moreInformationHref: '#',
				name: 'Jeanne',
				patientDoctorInfos: 'Vous êtes le médecin traitant',
				patientNir: 'NIR patient',
				patientOrganism: 'CPAM des Alpes de Haute Provence - Centre 103',
				patientStatus: 'Assuré(e)',
				patientSystem: 'Régime Général',
				uniqueId: 'my-patient-banner-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
