import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'
import ServiceMenu from './ServiceMenu.vue'

const serviceDesc = `Array<{
	icon?: string;
	imgSrc?: string;
	label: string;
	to?: string;
	href?: string;
	click?: CallableFunction;
}>`

const meta = {
	argTypes: {
		'activator': { description: 'Slot pour gérer le bouton d’ouverture de la fenêtre de menu' },
		'change': { description: 'Événement émis à la fermeture de le fenêtre de menu. Retourne `false`', type: 'boolean' },
		'closeMenu': { description: 'Fonction permettant de fermer la fenêtre de menu' },
		'icon': { description: 'Le nom de l’icône d’ouverture' },
		'message': { description: 'Slot permettant de personnaliser le contenu du message à afficher' },
		'messageToDisplay': { description: 'Message à afficher après les services patient si besoin' },
		'modelValue': { description: 'Valeur d’affichage de la fenêtre de menu' },
		'servicesContact': {
			description: 'Liste des services de contact',
			table: {
				type: {
					detail: serviceDesc,
					summary: 'Service[]',
				},
			},
		},
		'servicesPatient': {
			description: 'Liste des services PS',
			table: {
				type: {
					detail: serviceDesc,
					summary: 'Service[]',
				},
			},
		},
		'servicesPs': {
			description: 'Liste des services PS',
			table: {
				type: {
					detail: serviceDesc,
					summary: 'Service[]',
				},
			},
		},
		'uniqueId': { description: 'Id unique du composant' },
		'update:model-value': { description: 'Événement émis au changement d’état de la valeur d’affichage de la fenêtre de menu. Retourne la nouvelle valeur.', type: 'boolean' },
	},
	component: ServiceMenu,
	title: 'Composants/Amelipro/Mise en page/Sous-composants du header/ServiceMenu',
} as Meta<typeof ServiceMenu>
export default meta

type Story = StoryObj<typeof ServiceMenu>

const servicesContact = [
	{
		href: '#',
		icon: 'paiements',
		label: 'Contact 1',
	},
	{
		href: '#',
		icon: 'optam2',
		label: 'Contact 2',
	},
	{
		href: '#',
		icon: 'patientele',
		label: 'Contact 3',
	},
	{
		href: '#',
		icon: 'paiements',
		label: 'Contact 4',
	},
	{
		href: '#',
		icon: 'convention',
		label: 'Contact 5',
	},
]

const servicesPs = [
	{
		href: '#',
		icon: 'paiements',
		label: 'Paiements',
	},
	{
		href: '#',
		icon: 'convention',
		label: 'Conventions',
	},
	{
		href: '#',
		icon: 'patientele',
		label: 'Patientèle',
	},
	{
		href: '#',
		icon: 'perteActiviteCovid',
		label: 'Perte d’activité (Covid)',
	},
	{
		href: '#',
		icon: 'horairesCabinet',
		label: 'Horaires du cabinet',
	},
	{
		href: '#',
		icon: 'pillules',
		label: 'Patientèle SOPHIA',
	},
	{
		href: '#',
		icon: 'commandes',
		label: 'Commandes d’imprimés',
	},
]

const servicesPatient = [
	{
		href: '#',
		icon: 'brasCasse',
		label: 'Arrêt de travail',
	},
	{
		href: '#',
		icon: 'chute',
		label: 'Certificat ATMP',
	},
	{
		href: '#',
		icon: 'prescription',
		label: 'Affection de longue durée',
	},
	{
		href: '#',
		icon: 'contactCovid',
		label: 'Contact COVID',
	},
	{
		href: '#',
		icon: 'vaccination',
		label: 'Vaccination COVID',
	},
	{
		href: '#',
		icon: 'ambulance',
		label: 'Transport',
	},
	{
		href: '#',
		icon: 'horlogeFlecheGauche',
		label: 'Historique',
	},
	{
		href: '#',
		icon: 'seringue',
		label: 'Bilan soins infirmiers',
	},
]

export const Default: Story = {
	args: {
		messageToDisplay: 'exemple de message',
		modelValue: false,
		servicesContact,
		servicesPatient,
		servicesPs,
		uniqueId: 'service-menu-unique-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<ServiceMenu
		v-model="model"
		message-to-display="exemple de message"
		:services-contact="servicesContact"
		:services-patient="servicesPatient"
		:services-ps="servicesPs"
		unique-id="service-menu-unique-id"

	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import ServiceMenu from '@cnamts/synapse';
	import { ref } from 'vue';

	const model = ref(false);

	const servicesContact = [
		{
			href: '#',
			icon: 'paiements',
			label: 'Contact 1',
		},
		{
			href: '#',
			icon: 'optam2',
			label: 'Contact 2',
		},
		{
			href: '#',
			icon: 'patientele',
			label: 'Contact 3',
		},
		{
			href: '#',
			icon: 'paiements',
			label: 'Contact 4',
		},
		{
			href: '#',
			icon: 'convention',
			label: 'Contact 5',
		},
	];

	const servicesPs = [
		{
			href: '#',
			icon: 'paiements',
			label: 'Paiements',
		},
		{
			href: '#',
			icon: 'convention',
			label: 'Conventions',
		},
		{
			href: '#',
			icon: 'patientele',
			label: 'Patientèle',
		},
		{
			href: '#',
			icon: 'perteActiviteCovid',
			label: 'Perte d’activité (Covid)',
		},
		{
			href: '#',
			icon: 'horairesCabinet',
			label: 'Horaires du cabinet',
		},
		{
			href: '#',
			icon: 'pillules',
			label: 'Patientèle SOPHIA',
		},
		{
			href: '#',
			icon: 'commandes',
			label: 'Commandes d’imprimés',
		},
	];

	const servicesPatient = [
		{
			href: '#',
			icon: 'brasCasse',
			label: 'Arrêt de travail',
		},
		{
			href: '#',
			icon: 'chute',
			label: 'Certificat ATMP',
		},
		{
			href: '#',
			icon: 'prescription',
			label: 'Affection de longue durée',
		},
		{
			href: '#',
			icon: 'contactCovid',
			label: 'Contact COVID',
		},
		{
			href: '#',
			icon: 'vaccination',
			label: 'Vaccination COVID',
		},
		{
			href: '#',
			icon: 'ambulance',
			label: 'Transport',
		},
		{
			href: '#',
			icon: 'horlogeFlecheGauche',
			label: 'Historique',
		},
		{
			href: '#',
			icon: 'seringue',
			label: 'Bilan soins infirmiers',
		},
	];
</script>
				`,
			},
		],
	},
	render: args => ({
		components: { ServiceMenu },
		setup() {
			const model = ref(args.modelValue)

			// Optional: Keeps v-model in sync with storybook args
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})

			return { args, model }
		},
		template: `
<div class="d-flex justify-end">
	<ServiceMenu
		v-bind="args"
		v-model="model"
	/>
</div>
		`,
	}),

}
