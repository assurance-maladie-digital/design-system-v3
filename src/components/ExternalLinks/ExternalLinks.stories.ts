import type { Meta, StoryObj } from '@storybook/vue3'
import ExternalLinks from './ExternalLinks.vue'

const meta = {
	title: 'Composants/Navigation/ExternalLinks',
	component: ExternalLinks,
	parameters: {
		layout: 'centered',
	},
	argTypes: {
		position: {
			control: {
				type: 'select',
				options: ['top left', 'top right', 'bottom left', 'bottom right'],
			},
			table: {
				defaultValue: {
					summary: 'top left',
				},
			},
		},
		items: {
			control: {
				type: 'object',
			},
			table: {
				type: {
					summary: 'Array<{ text: string, href: string }>',
				},
			},
		},
		btnText: {
			control: {
				type: 'text',
			},
			table: {
				defaultValue: {
					summary: 'Consulter les données externes',
				},
			},
		},
		nudgeTop: {
			control: {
				type: 'text',
			},
			table: {
				defaultValue: {
					summary: '0px',
				},
			},
		},
		nudgeBottom: {
			control: {
				type: 'text',
			},
			table: {
				defaultValue: {
					summary: '0px',
				},
			},
		},
		fixed: {
			control: {
				type: 'boolean',
			},
			table: {
				defaultValue: {
					summary: 'false',
				},
			},
		},
	},
} satisfies Meta<typeof ExternalLinks>

export default meta

type Story = StoryObj<typeof ExternalLinks>

export const Default: Story = {
	args: {
		position: 'top left',
		items: [
			{
				text: 'ameli.fr',
				href: 'https://www.ameli.fr',
			},
			{
				text: 'Github',
				href: 'https://www.github.com',
			},
			{
				text: 'Twitter',
				href: 'https://www.twitter.com',
			},
		],
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<ExternalLinks
  position="top left"
  :items="items"
/>
				`,
			},
			{
				name: 'Script',
				code: `
import { ExternalLinks } from '@cnamts/synapse'

const items = [
  {
	text: 'ameli.fr',
	href: 'https://www.ameli.fr',
  },
  {
	text: 'Github',
	href: 'https://www.github.com',
  },
  {
	text: 'Twitter',
	href: 'https://www.twitter.com',
  },
]
`,
			},
		],
	},
}
