import SocialMediaLinks from './SocialMediaLinks.vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { mdiFacebook, mdiLinkedin } from '@mdi/js'

const xIcon = 'M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z'

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
				href: 'https://www.facebook.com/AssurMaladie/',
			},
			{
				icon: xIcon,
				href: 'https://x.com/Assur_Maladie',
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
	import { mdiFacebook, mdiLinkedin } from '@mdi/js'
	
	const xIcon = 'M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z'
	
	const links = [
		{
			icon: mdiLinkedin,
			name: 'LinkedIn',
			href: 'https://www.linkedin.com/company/assurance-maladie/',
		},
		{
			icon: mdiFacebook,
			name: 'Facebook',
			href: 'https://www.facebook.com/AssurMaladie/',
		},
		{
			icon: xIcon,
			name: 'X',
			href: 'https://x.com/Assur_Maladie',
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
				href: 'https://www.facebook.com/AssurMaladie/',
			},
			{
				icon: xIcon,
				name: 'X',
				href: 'https://x.com/Assur_Maladie',
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
