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
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	import { AmeliproPatientBanner } from '@cnamts/synapse'
</script>`,
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

// --- Bandeau sans bouton "plus d’informations" ---
export const SansPlusInfos: Story = {
	name: 'Sans bouton "plus d’informations"',
	args: {
		birthName: 'Martin',
		birthdate: '01/01/1980',
		name: 'Paul',
		patientDoctorInfos: 'Médecin traitant inconnu',
		patientNir: 'NIR patient',
		patientOrganism: 'CPAM de Paris',
		patientStatus: 'Ayant droit',
		patientSystem: 'Régime Général',
		noMoreInformation: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <AmeliproPatientBanner
    birth-name="Martin"
    birthdate="01/01/1980"
    name="Paul"
    patient-doctor-infos="Médecin traitant inconnu"
    patient-nir="NIR patient"
    patient-organism="CPAM de Paris"
    patient-status="Ayant droit"
    patient-system="Régime Général"
    :no-more-information="true"
  />
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproPatientBanner },
		setup() { return { args } },
		template: `
<p class="mb-2">Bandeau patient sans bouton "plus d’informations" (<code>noMoreInformation</code>).</p>
<AmeliproPatientBanner v-bind="args" />
`,
	}),
}

// --- Bandeau sans bouton "changer de patient" ---
export const SansChangementPatient: Story = {
	name: 'Sans bouton "changer de patient"',
	args: {
		birthName: 'Durand',
		birthdate: '15/05/1975',
		name: 'Lucie',
		patientDoctorInfos: 'Vous êtes le médecin traitant',
		patientNir: 'NIR patient',
		patientOrganism: 'CPAM de Lyon',
		patientStatus: 'Assuré(e)',
		patientSystem: 'Régime Général',
		noPatientChange: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <AmeliproPatientBanner
    birth-name="Durand"
    birthdate="15/05/1975"
    name="Lucie"
    patient-doctor-infos="Vous êtes le médecin traitant"
    patient-nir="NIR patient"
    patient-organism="CPAM de Lyon"
    patient-status="Assuré(e)"
    patient-system="Régime Général"
    :no-patient-change="true"
  />
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproPatientBanner },
		setup() { return { args } },
		template: `
<p class="mb-2">Bandeau patient sans bouton "changer de patient" (<code>noPatientChange</code>).</p>
<AmeliproPatientBanner v-bind="args" />
`,
	}),
}

// --- Bandeau avec lien interne pour "plus d’informations" ---
export const PlusInfosRouteInterne: Story = {
	name: 'Plus d’infos avec route interne',
	args: {
		birthName: 'Bernard',
		birthdate: '22/08/1990',
		name: 'Sophie',
		patientDoctorInfos: 'Médecin traitant inconnu',
		patientNir: 'NIR patient',
		patientOrganism: 'CPAM de Lille',
		patientStatus: 'Assuré(e)',
		patientSystem: 'Régime Général',
		moreInformationTo: '/patient/infos',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <AmeliproPatientBanner
    birth-name="Bernard"
    birthdate="22/08/1990"
    name="Sophie"
    patient-doctor-infos="Médecin traitant inconnu"
    patient-nir="NIR patient"
    patient-organism="CPAM de Lille"
    patient-status="Assuré(e)"
    patient-system="Régime Général"
    more-information-to="/patient/infos"
  />
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproPatientBanner },
		setup() { return { args } },
		template: `
<p class="mb-2">Bandeau patient avec lien interne pour "plus d’informations" (<code>moreInformationTo</code>).</p>
<AmeliproPatientBanner v-bind="args" />
`,
	}),
}
