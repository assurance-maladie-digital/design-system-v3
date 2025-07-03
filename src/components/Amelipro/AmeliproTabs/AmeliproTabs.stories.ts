import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproTabs from './AmeliproTabs.vue'

const meta = {
	argTypes: {
		'`${uniqueId}-tab-panel-${index}`': { description: 'Slot généré automatiquement pour chaque onglet afin d’y insérer son contenu son nom est composé de trois parties : l’id du groupe d’onglets, de "-tab-panel-" et de l’index de l’onglet dans la liste' },
		'ariaLabel': { description: 'Titre du groupe d’onglets s’il n’y a pas de ariaLabelledby (il faut au moins un ariaLabelledby ou un ariaLabel)' },
		'ariaLabelledby': { description: 'Id du titre associé au groupe d’onglets (il faut au moins un ariaLabelledby ou un ariaLabel)' },
		'btnGroupClasses': { description: 'Classes à ajouter autour du groupe de boutons' },
		'change-tab': {
			table: { category: 'events' },
			description: 'Événement émis au click sur un des boutons',
		},
		'items': {
			description: 'Tableau comprenant la liste des onglets et leur valeur activé ou désactivé',
			table: {
				type: {
					detail: `Array<{
				disabled: boolean;
				label: string;
				notification?: number;
				}>`,
					summary: 'AmeliproTab[]',
				},
			},
		},
		'noTabDefaultStyle': { description: 'Retire le style par défaut du contenu des tabs (fond blanc et padding)' },
		'pills': { description: 'Change le style des boutons' },
		'tab-panel': { description: 'Slot généré automatiquement pour tous les onglets afin d’y insérer des contenus génériques' },
		'tabsDesc': { description: 'Slot pour ajouter des informations au dessus des boutons' },
		'uniqueId': { description: 'Renseigne un id pour le groupe d’onglets' },
		'value': { description: 'Position de l’onglet séléctionné par défaut' },
	},
	component: AmeliproTabs,
	title: 'Composants/Amelipro/Mise en page/AmeliproTabs',
} as Meta<typeof AmeliproTabs>

export default meta

type Story = StoryObj<typeof AmeliproTabs>

const items = [
	{
		label: 'Mon onglet 1',
		disabled: false,
	},
	{
		label: 'Mon onglet 2',
		disabled: false,
	},
	{
		label: 'Mon onglet 3',
		disabled: true,
	},
	{
		label: 'Mon onglet 4',
		disabled: false,
	},
]

export const Default: Story = {
	args: {
		ariaLabel: 'Titre du group d\'onglets',
		items,
		uniqueId: 'tabs',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproTabs
		:aria-label="Titre du group d'onglets"
		:items="items"
		:unique-id="tabs"
	>
		<template #tabs-tab-panel-0>Contenu de l'onglet 1</template>
		<template #tabs-tab-panel-1>Contenu de l'onglet 2</template>
		<template #tabs-tab-panel-2>Contenu de l'onglet 3</template>
		<template #tabs-tab-panel-3>Contenu de l'onglet 4</template>
	</AmeliproTabs>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import AmeliproTabs from '@cnamts/synapse';

	const items = [
		{
			label: 'Mon onglet 1',
			disabled: false,
		},
		{
			label: 'Mon onglet 2',
			disabled: false,
		},
		{
			label: 'Mon onglet 3',
			disabled: true,
		},
		{
			label: 'Mon onglet 4',
			disabled: false,
		},
	];
</script>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTabs },
		setup() {
			return { args }
		},
		template: `
			<AmeliproTabs
				:aria-label="args.ariaLabel"
				:items="args.items"
				:unique-id="args.id"
				v-bind="args"
			>
				<template #tabs-tab-panel-0>Contenu de l'onglet 1</template>
				<template #tabs-tab-panel-1>Contenu de l'onglet 2</template>
				<template #tabs-tab-panel-2>Contenu de l'onglet 3</template>
				<template #tabs-tab-panel-3>Contenu de l'onglet 4</template>
			</AmeliproTabs>
		`,
	}),
}

export const Pills: Story = {
	args: {
		ariaLabel: 'Titre du group d\'onglets',
		items,
		pills: true,
		uniqueId: 'tabs',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproTabs
		:aria-label="Titre du group d'onglets"
		:items="items"
		pills
		:unique-id="tabs"
	>
		<template #tabs-tab-panel-0>Contenu de l'onglet 1</template>
		<template #tabs-tab-panel-1>Contenu de l'onglet 2</template>
		<template #tabs-tab-panel-2>Contenu de l'onglet 3</template>
		<template #tabs-tab-panel-3>Contenu de l'onglet 4</template>
	</AmeliproTabs>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	const items = [
		{
			label: 'Mon onglet 1',
			disabled: false,
		},
		{
			label: 'Mon onglet 2',
			disabled: false,
		},
		{
			label: 'Mon onglet 3',
			disabled: true,
		},
		{
			label: 'Mon onglet 4',
			disabled: false,
		},
	];
</script>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTabs },
		setup() {
			return { args }
		},
		template: `
			<AmeliproTabs
				:aria-label="args.ariaLabel"
				:items="args.items"
				:pills="args.pills"
				:unique-id="args.id"
				v-bind="args"
			>
				<template #tabs-tab-panel-0>Contenu de l'onglet 1</template>
				<template #tabs-tab-panel-1>Contenu de l'onglet 2</template>
				<template #tabs-tab-panel-2>Contenu de l'onglet 3</template>
				<template #tabs-tab-panel-3>Contenu de l'onglet 4</template>
			</AmeliproTabs>
		`,
	}),
}
