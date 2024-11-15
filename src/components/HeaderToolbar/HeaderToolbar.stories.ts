import HeaderToolbar from './HeaderToolbar.vue'
import type { Meta, StoryObj } from '@storybook/vue3'

const meta: Meta<typeof HeaderToolbar> = {
	title: 'Components/HeaderToolbar',
	component: HeaderToolbar,
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		leftMenu: {
			control: 'object',
			description: 'Slot pour remplacer le menu de gauche.',
		},
		rightMenu: {
			control: 'object',
			description: 'Slot pour remplacer le menu de droite.',
		},
		itemsSelectMenu: {
			control: 'object',
			description: 'Menu de sélection.',
		},
	},
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<HeaderToolbar />
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import HeaderToolbar from '@cnamts/synapse'
				</script>
				`,
			},
		],
	},
	args: {
		leftMenu: [
			{
				title: 'Assuré',
				href: 'https://www.ameli.fr/assure',
				openInNewTab: true,
			},
			{
				title: 'Professionnel de santé',
			},
			{
				title: 'Entreprise',
				href: 'https://www.ameli.fr/entreprise',
				openInNewTab: true,
			},
		],
		rightMenu: [
			{
				title: 'Qui sommes-nous ?',
				href: 'https://www.assurance-maladie.ameli.fr/qui-sommes-nous',
				openInNewTab: true,
			},
			{
				title: 'Carrières',
				href: 'https://www.assurance-maladie.ameli.fr/carrieres',
				openInNewTab: true,
			},
			{
				title: 'Études et données',
				href: 'https://www.assurance-maladie.ameli.fr/etudes-et-donnees',
				openInNewTab: true,
			},
			{
				title: 'Presse',
				href: 'https://www.assurance-maladie.ameli.fr/presse',
				openInNewTab: true,
			},
		],
		itemsSelectMenu: [
			{
				text: 'Chirurgien-dentiste',
				value: 'Chirurgien-dentiste',
				href: 'https://www.ameli.fr/chirurgien-dentiste',
				openInNewTab: true,
			},
			{
				text: 'Établissement',
				value: 'Établissement',
				href: 'https://www.ameli.fr/etablissement',
				openInNewTab: true,
			},
			{
				text: 'Exercice coordonné',
				value: 'Exercice coordonné',
				href: 'https://www.ameli.fr/exercice-coordonne',
				openInNewTab: true,
			},
			{
				text: 'Infirmier',
				value: 'Infirmier',
				href: 'https://www.ameli.fr/infirmier',
				openInNewTab: true,
			},
			{
				text: 'Laboratoire d\'analyses médicales',
				value: 'Laboratoire d\'analyses médicales',
				href: 'https://www.ameli.fr/laboratoire-danalyses-medicales',
				openInNewTab: true,
			},
			{
				text: 'Masseur-kinésithérapeute',
				value: 'Masseur-kinésithérapeute',
				href: 'https://www.ameli.fr/masseur-kinesitherapeute',
				openInNewTab: true,
			},
			{
				text: 'Médecin',
				value: 'Médecin',
				href: 'https://www.ameli.fr/medecin',
				openInNewTab: true,
			},
			{
				text: 'Orthophoniste',
				value: 'Orthophoniste',
				href: 'https://www.ameli.fr/orthophoniste',
				openInNewTab: true,
			},
			{
				text: 'Orthoptiste',
				value: 'Orthoptiste',
				href: 'https://www.ameli.fr/orthoptiste',
				openInNewTab: true,
			},
			{
				text: 'Pédicure-podologue',
				value: 'Pédicure-podologue',
				href: 'https://www.ameli.fr/pedicure-podologue',
				openInNewTab: true,
			},
			{
				text: 'Pharmacien',
				value: 'Pharmacien',
				href: 'https://www.ameli.fr/pharmacien',
				openInNewTab: true,
			},
			{
				text: 'Professionnel de la LPP/LATM',
				value: 'Professionnel de la LPP/LATM',
				href: 'https://www.ameli.fr/professionnel-de-la-lpplatm',
				openInNewTab: true,
			},
			{
				text: 'Psychologue',
				value: 'Psychologue',
				href: 'https://www.ameli.fr/psychologue',
				openInNewTab: true,
			},
			{
				text: 'Sage-femme',
				value: 'Sage-femme',
				href: 'https://www.ameli.fr/sage-femme',
				openInNewTab: true,
			},
			{
				text: 'Taxi conventionné',
				value: 'Taxi conventionné',
				href: 'https://www.ameli.fr/taxi-conventionne',
				openInNewTab: true,
			},
			{
				text: 'Transporteur sanitaire',
				value: 'Transporteur sanitaire',
				href: 'https://www.ameli.fr/transporteur-sanitaire',
				openInNewTab: true,
			},
		],
	},
	render: (args) => {
		return {
			components: { HeaderToolbar },
			setup() {
				return { args }
			},
			template: `
              <HeaderToolbar v-bind="args" />
			`,
		}
	},
}
