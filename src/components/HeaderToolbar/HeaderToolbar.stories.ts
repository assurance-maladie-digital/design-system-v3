import HeaderToolbar from './HeaderToolbar.vue'
import type { Meta, StoryObj } from '@storybook/vue3'

const meta: Meta<typeof HeaderToolbar> = {
	title: 'Composants/Structure/HeaderToolbar',
	component: HeaderToolbar,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['hideOverlay', 'handleLink', 'checkActiveLink', 'deleteActiveLink', 'activeIndex', 'highlightMenu', 'showOverlay', 'getLinkComponent'] },
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
              <HeaderToolbar v-bind="args"/>
            `,
		}
	},
}

export const CustomLinks: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<HeaderToolbar>
					 <template #left-menu>
					  <ul>
						<li v-for="item in leftMenu">
						  <a :href="item.href" target="_blank">
							{{ item.title }}
						  </a>
						</li>
					  </ul>
					</template>
					<template #right-menu>
					  <ul>
						<li v-for="item in rightMenu">
						  <a :href="item.href" target="_blank">
							{{ item.title }}
						  </a>
						</li>
					  </ul>
					</HeaderToolbar>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import HeaderToolbar from '@cnamts/synapse'
					
					const leftMenu = [
						{
							title: 'Titre 1',
							href: 'https://www.ameli.fr',
							openInNewTab: true,
						},
						{
							title: 'Titre 2',
							href: 'https://www.ameli.fr',
							openInNewTab: true,
						},
						{
							title: 'Titre 3',
							href: 'https://www.ameli.fr',
							openInNewTab: true,
						},
					]
					
					const rightMenu = [
						{
							title: 'Titre 4',
							href: 'https://www.ameli.fr',
							openInNewTab: true,
						},
						{
							title: 'Titre 5',
							href: 'https://www.ameli.fr',
							openInNewTab: true,
						},
						{
							title: 'Titre 6',
							href: 'https://www.ameli.fr',
							openInNewTab: true,
						},
					]
				</script>
				`,
			},
		],
	},
	args: {
		leftMenu: [
			{
				title: 'Titre 1',
				href: 'https://www.ameli.fr',
				openInNewTab: true,
			},
			{
				title: 'Titre 2',
				href: 'https://www.ameli.fr',
				openInNewTab: true,
			},
			{
				title: 'Titre 3',
				href: 'https://www.ameli.fr',
				openInNewTab: true,
			},
		],
		rightMenu: [
			{
				title: 'Titre 4',
				href: 'https://www.ameli.fr',
				openInNewTab: true,
			},
			{
				title: 'Titre 5',
				href: 'https://www.ameli.fr',
				openInNewTab: true,
			},
			{
				title: 'Titre 6',
				href: 'https://www.ameli.fr',
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
              <HeaderToolbar v-bind="args">
                <template #left-menu>
                  <ul>
                    <li v-for="item in args.leftMenu">
                      <a :href="item.href" target="_blank">
                        {{ item.title }}
                      </a>
                    </li>
                  </ul>
                </template>
                <template #right-menu>
                  <ul>
                    <li v-for="item in args.rightMenu">
                      <a :href="item.href" target="_blank">
                        {{ item.title }}
                      </a>
                    </li>
                  </ul>
                </template>
              </HeaderToolbar>
            `,
		}
	},
}
