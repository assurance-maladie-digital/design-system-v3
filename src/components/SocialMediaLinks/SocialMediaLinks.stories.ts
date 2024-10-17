import SocialMediaLinks from './SocialMediaLinks.vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { mdiFacebook, mdiLinkedin, mdiTwitter } from '@mdi/js'

const meta = {
	title: 'Components/SocialMediaLinks',
	component: SocialMediaLinks,
	parameters: {
		layout: 'centered',
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

export const Desktop: Story = {
	args: {
		links: [
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
	render: (args) => {
		return {
			components: { SocialMediaLinks },
			setup() {
				return { args }
			},
			template: `
                <SocialMediaLinks :links="args.links" />
            `,
		}
	},
}

export const Mobile: Story = {
	parameters: {
		viewport: {
			defaultViewport: 'mobile1',
		},
	},
	args: {
		links: [
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
	render: (args) => {
		return {
			components: { SocialMediaLinks },
			setup() {
				return { args }
			},
			template: `
				<SocialMediaLinks :links="args.links" />
			`,
		}
	},
}
