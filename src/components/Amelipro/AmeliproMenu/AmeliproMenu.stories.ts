import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproMenu from './AmeliproMenu.vue'
import type { AmeliproMenuItem } from './types'

const meta = {
	argTypes: {
		escape: { description: 'Événement émis si la touche "Échap" est utilisée pour fermer le menu', type: 'void' },
		homeHref: { description: 'Lien du bouton vers l’accueil' },
		homeTo: { description: 'Route du bouton vers l’accueil' },
		items: {
			description: 'Tableau d’objet composant le menu et sa structure',
			table: {
				type: {
					detail: `Array<{
	actif?: boolean;
	children?: AmeliproMenuItem[];
	href?: string;
	id: string;
	name: string;
	to?: RouteLocationRaw;
}>`,
					summary: 'AmeliproMenuItem[]',
				},
			},
		},
		menuHeader: { description: 'Header du Menu' },
		setFocus: { description: 'Fonction pour mettre le focus sur le bouton dont l’id est à passer en paramètre' },
		uniqueId: { description: 'Identifiant unique du menu' },
	},
	component: AmeliproMenu,
	title: 'Composants/Amelipro/Mise en page/Sous-composants du header/AmeliproMenu',
} as Meta<typeof AmeliproMenu>
export default meta

type Story = StoryObj<typeof AmeliproMenu>

export const Default: Story = {
	args: {
		uniqueId: 'amelipro-menu-unique-id',
		items: [
			{
				actif: false,
				children: [
					{
						actif: false,
						children: [
							{
								id: '111',
								name: 'SubSubMenu 1.1.1',
								to: '/test',
							},
							{
								id: '112',
								name: 'SubSubMenu 1.1.2',
								to: '/test2',
							},
						],
						id: '11',
						name: 'SubMenu 1.1',
					},
					{
						actif: false,
						id: '12',
						name: 'SubMenu 1.2',
						to: '/test3',
					},
				],
				id: '1',
				name: 'Menu 1',
			},
			{
				actif: false,
				children: [
					{
						id: '21',
						name: 'SubMenu 2.1',
					},
					{
						actif: false,
						children: [
							{
								children: [],
								id: '211',
								name: 'SubSubMenu 2.1.1',
							},
							{
								children: [],
								id: '212',
								name: 'SubSubMenu 2.1.2',
							},
						],
						id: '22',
						name: 'SubMenu 2.2',
					},
				],
				id: '2',
				name: 'Menu 2',
			},
			{
				id: '3',
				name: 'Menu 3',
			},
		] as AmeliproMenuItem[],
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproMenu
		:items="items"
		unique-id="amelipro-menu-unique-id"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproMenu } from '@cnamts/synapse'

	const items = [
		{	actif: false,
			children: [
				{
					actif: false,
					children: [
						{
							id: '111',
							name: 'SubSubMenu 1.1.1',
							to: '/test',
						},
						{
							id: '112',
							name: 'SubSubMenu 1.1.2',
							to: '/test2',
						},
					],
					id: '11',
					name: 'SubMenu 1.1',
				},
				{
					actif: false,
					id: '12',
					name: 'SubMenu 1.2',
					to: '/test3',
				},
			],
			id: '1',
			name: 'Menu 1',
		},
		{
			actif: false,
			children: [
				{
					id: '21',
					name: 'SubMenu 2.1',
				},
				{
					actif: false,
					children: [
						{
							children: [],
							id: '211',
							name: 'SubSubMenu 2.1.1',
						},
						{
							children: [],
							id: '212',
							name: 'SubSubMenu 2.1.2',
						},
					],
					id: '22',
					name: 'SubMenu 2.2',
				},
			],
			id: '2',
			name: 'Menu 2',
		},
		{
			id: '3',
			name: 'Menu 3',
		},
	]
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproMenu },
		setup() {
			return { args }
		},
		template: `
	<VApp>
		<div class="bg-ap-blue-darken-1">
			<AmeliproMenu
				v-bind="args"
			/>
		</div>
	</VApp>
		`,
	}),
}

// --- Menu avec lien d’accueil personnalisé ---
export const AvecLienAccueil: Story = {
	name: 'Avec lien accueil',
	args: {
		uniqueId: 'amelipro-menu-home',
		items: [
			{
				id: '1',
				name: 'Menu 1',
			},
			{
				id: '2',
				name: 'Menu 2',
			},
		] as AmeliproMenuItem[],
		homeHref: 'https://ameli.fr',
		menuHeader: 'Menu avec lien accueil',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <AmeliproMenu
    :items="items"
    unique-id="amelipro-menu-home"
    home-href="https://ameli.fr"
    menu-header="Menu avec lien accueil"
  />
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproMenu },
		setup() { return { args } },
		template: `
<p class="mb-2">Menu avec un lien d’accueil personnalisé (<code>homeHref</code>) et un header de menu.</p>
<VApp>
    <div class="bg-ap-blue-darken-1">
        <AmeliproMenu v-bind="args" />
    </div>
</VApp>
        `,
	}),
}

// --- Menu avec route d’accueil interne ---
export const AvecRouteAccueil: Story = {
	name: 'Avec route accueil (to)',
	args: {
		uniqueId: 'amelipro-menu-home-to',
		items: [
			{
				id: '1',
				name: 'Menu 1',
			},
			{
				id: '2',
				name: 'Menu 2',
			},
		] as AmeliproMenuItem[],
		homeTo: '/accueil',
		menuHeader: 'Menu avec route accueil',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <AmeliproMenu
    :items="items"
    unique-id="amelipro-menu-home-to"
    home-to="/accueil"
    menu-header="Menu avec route accueil"
  />
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproMenu },
		setup() { return { args } },
		template: `
<p class="mb-2">Menu avec une route d’accueil interne (<code>homeTo</code>).</p>
<VApp>
    <div class="bg-ap-blue-darken-1">
        <AmeliproMenu v-bind="args" />
    </div>
</VApp>
        `,
	}),
}
