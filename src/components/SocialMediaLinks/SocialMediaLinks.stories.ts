import SocialMediaLinks from './SocialMediaLinks.vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { mdiFacebook, mdiLinkedin, mdiTwitter } from '@mdi/js'

const meta = {
	title: 'Composants/Navigation/SocialMediaLinks',
	component: SocialMediaLinks,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['socialMediaLinks'] },
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
	},
	argTypes: {
		socialMediaLinks: {
			control: { type: 'object' },
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
	<SocialMediaLinks :links=":links" />
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import SocialMediaLinks from '@cnamts/synapse'
	
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
                	<SocialMediaLinks :links="args.links" />
				</div>
            `,
		}
	},
}
