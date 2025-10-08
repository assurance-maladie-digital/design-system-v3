import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproPatientLogged from '../AmeliproPatientLogged.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproPatientLogged', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproPatientLogged, {
			global: {
				plugins: [vuetify],
			},
			props: {
				btnMoreInfo: true,
				doctorTooltipRed: true,
				errorMessage: true,
				labels: {
					ame: 'test AME',
					birthdate: 'test Né(e) le',
					btnLabel: 'test Changer de patient',
					center: 'centre',
					c2s: 'test C2S',
					doctor: 'test MT',
					doctorDialogBtn: 'test Voir détails MT',
					doctorDialogTitle: 'test Médecin traitant',
					exemption: 'test Exonération TM',
					firstName: 'test Prénom',
					fund: ',test Caisse',
					fundDialogTitle: 'test Coordonnées de l\'organisme de rattachement du patient',
					moreInfo: 'test Plus d\'informations',
					mtm: 'test Modulation MT',
					name: 'test Nom',
					nir: 'test NIR',
					plan: 'test Régime',
					rank: 'test Rang',
					rights: 'test Droits à la date du jour',
					selectLabel: 'test Autres bénéficiaires :',
				},
				patientInfos: {
					ame: 'oui',
					birthdate: '09/11/1992 (32 ans)',
					c2s: 'non',
					c2sTooltip: 'c2s tooltip',
					doctor: 'Voir détail MT',
					doctorTooltip: 'doctor tooltip',
					exemption: 'ALD hors liste',
					firstName: 'prénom',
					fund: 'CPAM du Puy de Dome',
					fundTooltip: 'fund tooltip',
					mtm: 'Allocation de solidarité aux personnes âgées',
					name: 'nom',
					nir: '123456789012345',
					plan: 'Régime Général',
					rank: '1',
					rights: 'oui',
					selectItems: [
						{
							title: 'Patient 1',
							value: 1,
						},
						{
							title: 'Patient 2',
							value: 2,
						},
						{
							title: 'Patient 3',
							value: 3,
						},
					],
				},
				uniqueId: 'test-id',
				value: 2,
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
