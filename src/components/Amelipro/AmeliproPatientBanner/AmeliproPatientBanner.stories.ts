import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproPatientBanner from './AmeliproPatientBanner.vue'

const meta = {
	argTypes: {
		'birthName': { description: 'Nom de naissance du patient s’il y en a un' },
		'birthdate': { description: 'Date de naissance du patient' },
		'click:patient-change': { description: 'Événement émis au clic sur le bouton changer de patient', type: 'void' },
		'moreInformationHref': { description: 'URL pour aux informations détaillées du patient' },
		'moreInformationTo': { description: 'Route pour aux informations détaillées du patient' },
		'name': { description: 'Nom et Prénom du patient' },
		'noMoreInformation': { description: 'Permet de masquer le bouton plus d’informations' },
		'noPatientChange': { description: 'Permet de masquer le bouton changer de patient' },
		'patientDoctorInfos': { description: 'Informations sur le médecin traitant du patient' },
		'patientNir': { description: 'NIR du patient' },
		'patientOrganism': { description: 'Organisme du patient' },
		'patientStatus': { description: 'Statut du patient' },
		'patientSystem': { description: 'Régime du patient' },
		'uniqueId': { description: 'Identifiant unique du bandeau patient' },
	},
	component: AmeliproPatientBanner,
	title: 'Composants/Amelipro/Mise en page/Sous-composants du header/AmeliproPatientBanner',
} as Meta<typeof AmeliproPatientBanner>
export default meta

type Story = StoryObj<typeof AmeliproPatientBanner>

export const Default: Story = {
	args: {
		birthName: 'Dupont',
		birthdate: '09/11/1992',
		moreInformationHref: '#',
		name: 'Jeanne',
		patientDoctorInfos: 'Vous êtes le médecin traitant',
		patientNir: 'NIR patient',
		patientOrganism: 'CPAM des Alpes de Haute Provence - Centre 103',
		patientStatus: 'Assuré(e)',
		patientSystem: 'Régime Général',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproPatientBanner
		birth-name="Dupont"
		birthdate="09/11/1992"
		more-information-href="#"
		name="Jeanne"
		patient-doctor-infos="Vous êtes le médecin traitant"
		patient-nir="NIR patient"
		patient-organism="CPAM des Alpes de Haute Provence - Centre 103"
		patient-status="Assuré(e)"
		patient-system="Régime Général"
	/>
</template>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproPatientBanner },
		setup() {
			return { args }
		},
		template: `
<AmeliproPatientBanner
	v-bind="args"
/>`,
	}),

}
