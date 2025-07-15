import SocialMediaLinks from './SocialMediaLinks.vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { mdiFacebook, mdiLinkedin, mdiTwitter } from '@mdi/js'

const meta = {
	title: 'Composants/Navigation/SocialMediaLinks',
	component: SocialMediaLinks,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['socialMediaLinks'] },
		docs: {
			description: {
				component: 'Affiche une liste de liens vers les réseaux sociaux avec un titre configurable.',
			},
		},
	},
	args: {
		socialMediaLinks: [
			{
				icon: mdiLinkedin,
				href: 'https://www.linkedin.com/company/assurance-maladie/',
			},
			{
				icon: mdiFacebook,
				href: 'https://twitter.com/Assur_Maladie',
			},
			{
				icon: mdiTwitter,
				href: 'https://twitter.com/Assur_Maladie',
			},
		],
		headingLevel: 6,
		useNativeHeading: true,
	},
	argTypes: {
		socialMediaLinks: {
			control: { type: 'object' },
		},
		headingLevel: {
			control: { type: 'select' },
			options: [1, 2, 3, 4, 5, 6],
			description: 'Niveau de titre HTML à utiliser pour le libellé "Suivez-nous". Valeurs acceptées de 1 à 6.',
			table: {
				type: { summary: 'Number' },
				defaultValue: { summary: '6' },
			},
		},
		useNativeHeading: {
			control: { type: 'boolean' },
			description: 'Détermine si le libellé "Suivez-nous" doit utiliser une balise HTML native (h1-h6) ou un élément span avec les attributs ARIA appropriés.',
			table: {
				type: { summary: 'Boolean' },
				defaultValue: { summary: 'true' },
			},
		},
	},
} as Meta<typeof SocialMediaLinks>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<SocialMediaLinks 
		:links="links" 
		:heading-level="6"
		:use-native-heading="true"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { SocialMediaLinks } from '@cnamts/synapse'
	import { mdiFacebook, mdiLinkedin, mdiTwitter } from '@mdi/js'
	
	const links = [
		{
			icon: mdiLinkedin,
			name: 'LinkedIn',
			href: 'https://www.linkedin.com/company/assurance-maladie/',
		},
		{
			icon: mdiFacebook,
			name: 'Facebook',
			href: 'https://twitter.com/Assur_Maladie',
		},
		{
			icon: mdiTwitter,
			name: 'Twitter',
			href: 'https://twitter.com/Assur_Maladie',
		},
	]
</script>
				`,
			},
		],
	},
	args: {
		links: [
			{
				icon: mdiLinkedin,
				name: 'LinkedIn',
				href: 'https://www.linkedin.com/company/assurance-maladie/',
			},
			{
				icon: mdiFacebook,
				name: 'Facebook',
				href: 'https://twitter.com/Assur_Maladie',
			},
			{
				icon: mdiTwitter,
				name: 'Twitter',
				href: 'https://twitter.com/Assur_Maladie',
			},
		],
	},
	render: (args) => {
		return {
			components: { SocialMediaLinks },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
                	<SocialMediaLinks 
						:links="args.links"
						:heading-level="args.headingLevel"
						:use-native-heading="args.useNativeHeading"
					/>
				</div>
            `,
		}
	},
}
