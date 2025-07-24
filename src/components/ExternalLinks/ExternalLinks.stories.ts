import type { Meta, StoryObj } from '@storybook/vue3'
import ExternalLinks from './ExternalLinks.vue'
import { mdiArrowTopRight } from '@mdi/js'
import { VIcon } from 'vuetify/components'

const meta = {
	title: 'Composants/Navigation/ExternalLinks',
	component: ExternalLinks,
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		'position': {
			control: {
				type: 'select',
			},
			options: ['top left', 'top right', 'bottom left', 'bottom right'],
			table: {
				defaultValue: {
					summary: 'top left',
				},
				type: {
					summary: `'top left' | 'top right' | 'bottom left' | 'bottom right'`,
				},
			},
		},
		'items': {
			control: {
				type: 'object',
			},
			table: {
				type: {
					summary: 'Array<{ text: string, href: string }>',
				},
				category: 'props',
			},
			description: 'List des liens',
		},
		'btnText': {
			control: {
				type: 'text',
			},
			table: {
				defaultValue: {
					summary: 'Consulter les données externes',
				},
				type: {
					summary: 'string',
				},
			},
			description: 'Text affiché dans le bouton',
		},
		'nudgeTop': {
			control: {
				type: 'text',
			},
			table: {
				defaultValue: {
					summary: '0px',
				},
				type: {
					summary: 'string|number',
				},
			},
		},
		'nudgeBottom': {
			control: {
				type: 'text',
			},
			table: {
				defaultValue: {
					summary: '0px',
				},
				type: {
					summary: 'string|number',
				},
			},
		},
		'fixed': {
			control: {
				type: 'boolean',
			},
			table: {
				defaultValue: {
					summary: 'false',
				},
				type: {
					summary: 'boolean',
				},
			},
		},
		'link-icon': {
			description: 'Remplace l\'icône des liens',
			control: {
				type: 'text',
			},
		},
		'vuetifyOptions': {
			control: { type: 'object' },
			description:
        'Permet de personnaliser les props des composants vuetify `VMenu`, `VBtn`, `VIcon`, `VList`, `VListItem` et `VSheet` utilisés en interne.',
			table: {
				category: 'props',
				type: {
					summary: 'object',
					detail: `{
	menu: Record<string, any>,
	btn: Record<string, any>,
	btnIcon: Record<string, any>,
	linkIcon: Record<string, any>,
	list: Record<string, any>,
	listItem: Record<string, any>,
	sheet: Record<string, any>,
}`,
				},
				defaultValue: {
					summary: 'object',
					detail: `{
	menu: {
		tile: true,
		zIndex: 4,
		offset: 0,
	},
	btn: {
		tile: true,
		minHeight: '48px',
		minWidth: '328px',
		color: cnamColorsTokens.blue.base,
		class: 'd-flex px-3',
	},
	btnIcon: {
		color: 'white',
	},
	linkIcon: {
		color: 'rgba(0, 0, 0, .54)',
	},
	list: {
		class: 'py-0',
	},
	listItem: {
		target: '_blank',
		rel: 'noopener noreferrer',
	},
	sheet: {
		class: 'px-4 py-3',
	},
}`,
				},
			},
		},
	},
	decorators: [() => ({ template: '<div style="min-height: 300px; overflow: hidden; position: relative"><story/></div>' })],
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

export const NudgeTop: Story = {
	args: {
		position: 'top left',
		nudgeTop: '50px',
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
	nudgeTop="50px"
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

export const NudgeBottom: Story = {
	args: {
		position: 'bottom left',
		nudgeBottom: '50px',
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
	position="bottom left"
	:items="items"
	nudgeBottom="50px"
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

export const NoData: Story = {
	args: {
		position: 'top left',
		items: [],
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<ExternalLinks
	position="top left"
	:items="[]"
/>
				`,
			},
			{
				name: 'Script',
				code: `
import { ExternalLinks } from '@cnamts/synapse'

`,
			},
		],
	},
}

export const BtnText: Story = {
	args: {
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
		btnText: 'Afficher les liens externes',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<ExternalLinks
	position="top left"
	btn-text="Afficher les liens externes"
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

export const VuetifyOptions: Story = {
	args: {
		vuetifyOptions: {
			btn: {
				color: 'secondary',
			},
			list: {
				density: 'compact',
			},
		},
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
	:items
	:vuetifyOptions="options"
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

const options = {
	btn: {
		color: 'secondary',
	},
	list: {
		density: 'compact',
	},
}
`,
			},
		],
	},
}

export const CustomLinksIcon: Story = {
	render: (args) => {
		return {
			components: { ExternalLinks, VIcon },
			setup() {
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
				const arrowIcon = mdiArrowTopRight
				return { args, items, arrowIcon }
			},
			template: `
			<ExternalLinks :items>
				<template #link-icon>
					<VIcon color="rgba(0, 0, 0, 0.5)">
						{{ arrowIcon }}
					</VIcon>
				</template>
			</ExternalLinks>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<ExternalLinks :items>
	<template #link-icon>
		<VIcon color="rgba(0, 0, 0, 0.5)">
			{{ arrowIcon }}
		</VIcon>
	</template>
</ExternalLinks>
				`,
			},
			{
				name: 'Script',
				code: `
import { ExternalLinks } from '@cnamts/synapse'
import { VIcon } from 'vuetify/components'
import { mdiArrowTopRight } from '@mdi/js'

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

const arrowIcon = mdiArrowTopRight
`,
			},
		],
	},
}
