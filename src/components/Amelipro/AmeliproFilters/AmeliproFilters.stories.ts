import type { StoryObj } from '@storybook/vue3-vite'
import AmeliproFilters from '../AmeliproFilters/AmeliproFilters.vue'

const meta = {
	argTypes: {
		'groupId': { description: 'Identifiant unique du groupe de filtres' },
		'groupLabel': { description: 'Libellé du groupe de filtres' },
		'hiddenLabel': { description: 'Cache le libellé du groupe de filtres' },
		'value': { description: 'Liste des filtres du du groupe' },
		'unique': { description: 'Pour avoir seulement un filtre sélectionnable' },
		'input': {
			description: 'Event émis au click sur le bouton',
		},
		'change:selected': {
			description: 'Evènement émis au changement du v-model',
		},
	},
	title: 'Composants/Amelipro/AmeliproFilters',
	component: AmeliproFilters,
}

export default meta
type Story = StoryObj<typeof AmeliproFilters>

const value = [
	{ id: 'f1', label: 'Filtre 1', value: 'f1', isChecked: false },
	{ id: 'f2', label: 'Filtre 2', value: 'f2', isChecked: true },
	{ id: 'f3', label: 'Filtre 3', value: 'f3', isChecked: false },
	{ id: 'f4', label: 'Filtre 4', value: 'f4', isChecked: false },
]

export const Default: Story = {
	args: {
		groupId: 'filters-group',
		groupLabel: 'Filtres',
		hiddenLabel: false,
		unique: false,
		value: value,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproFilters
		group-id="filter-group"
		group-label="Filtres"
		:hidden-label="false"
		:unique="false"
		:value="value"
	/>
</template>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproFilters },
		setup() {
			return { args }
		},
		template: `
          <AmeliproFilters
              v-bind="args"
          />
        `,
	}),
}

export const SelectionUnique: Story = {
	args: {
		groupId: 'filters-group',
		groupLabel: 'Filtres',
		hiddenLabel: false,
		unique: true,
		value: value,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproFilters
		group-id="filter-group"
		group-label="Filtres"
		:hidden-label="false"
		:unique="true"
		:value="value"
	/>
</template>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproFilters },
		setup() {
			return { args }
		},
		template: `
          <AmeliproFilters
              v-bind="args"
          />
        `,
	}),
}
