import { fn } from '@storybook/test'
import type { Meta, StoryObj } from '@storybook/vue3'
import { VSelect, VTextField } from 'vuetify/components'
import PeriodField from '../PeriodField/PeriodField.vue'
import SearchListField from '../SearchListField/SearchListField.vue'
import FilterInline from './FilterInline.vue'
import DatePicker from '../DatePicker/DatePicker.vue'
import RangeField from '../RangeField/RangeField.vue'

const meta = {
	title: 'Composants/Filtres/FilterInline',
	component: FilterInline,
	argTypes: {
		'modelValue': {
			description: 'Valeur des filtres',
			control: {
				type: 'object',
			},
			table: {
				category: 'props',
				type: {
					summary: 'array',
					detail: `{
	name: string
	value?: unknown
	formatChip?: (value: unknown) => ChipItem[]
	chipOverflowLimit?: number
	title?: string
}[]`,
				},
				defaultValue: {
					summary: '[]',
				},
			},
		},
		'locales': {
			description: 'Traductions',
			control: {
				type: 'object',
			},
			table: {
				category: 'props',
				type: {
					summary: 'Record<string, Function>',
				},
				defaultValue: {
					summary: 'locales',
					detail: `{
	badgeLabel: (count: number): string =>
		\`\${count} filtre\${count > 1 ? 's' : ''}\`,
}`,
				},
			},
		},
		'onUpdate:modelValue': {
			description: 'Événement déclenché lors de la mise à jour des filtres',
			control: {
				type: undefined,
			},
			table: {
				category: 'events',
				type: {
					summary: 'array',
					detail: `{
	name: string
	value?: unknown
	formatChip?: (value: unknown) => ChipItem[]
	chipOverflowLimit?: number
	title?: string
}[]`,
				},
			},
		},
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore - storybook can't infer dynamic slot name
		'${filterName}': {
			description: 'Slot pour les filtre. <br>Le nom de chaque slot correspond au nom (`name`) du filtre. <br>Le paramètre du slot `props` est un objet contenant les props à passer du filtre.',
			table: {
				category: 'slots',
				type: {
					summary: '{ props: Object }',
				},
			},
		},
	},
	parameters: {
		controls: {
			exclude: ['update:modelValue', '`${formatFilterName(filter.name)}`'],
		},
	},
} satisfies Meta<typeof FilterInline>

export default meta

type Story = StoryObj<typeof FilterInline>

export const Default: Story = {
	args: {
		'onUpdate:modelValue': fn(),
	},
	render: args => ({
		components: { FilterInline, VTextField, VSelect, PeriodField, SearchListField },
		setup() {
			const filters = [
				{
					name: 'name',
					title: 'Identité',
				},
				{
					name: 'folder',
					title: 'Type de dossier',
				},
				{
					name: 'period',
					title: 'Période',
				},
				{
					name: 'profession',
					title: 'Profession',
				},
			]

			const folderTypes = [
				{ title: 'Arrêt de Travail (AT)', value: 'AT' },
				{ title: 'Maladie Professionnelle (MP)', value: 'MP' },
				{ title: 'Autre', value: 'other' },
			]

			const professionList = [
				{
					label: 'Chirurgien-dentiste',
					value: 'chirurgien-dentiste',
				},
				{
					label: 'Infirmier',
					value: 'infirmier',
				},
				{
					label: 'Orthophoniste',
					value: 'orthophoniste',
				},
				{
					label: 'Orthoptiste',
					value: 'orthoptiste',
				},
				{
					label: 'Pédicure-podologue',
					value: 'pedicure-podologue',
				},
				{
					label: 'Pharmacien',
					value: 'pharmacien',
				},
			]

			return { args, filters, folderTypes, professionList }
		},
		template: `
<FilterInline
	v-model="filters"
	v-bind="args"
>
	<template #name="{ props }">
		<VTextField
			v-bind="props"
			label="Nom"
			variant="outlined"
			hide-details
		/>
	</template>

	<template #folder="{ props }">
		<p class="text--secondary">
			Vous pouvez filtrer entre les dossiers de type <b>Arrêt de Travail (AT)</b> et <b>Maladie Professionnelle (MP)</b> ou <b>Autre</b>.
		</p>

		<VSelect
			v-bind="props"
			:items="folderTypes"
			label="Type de dossier"
			multiple
			variant="outlined"
			return-object
			hide-details
		/>
	</template>

	<template #period="{ props }">
		<PeriodField
			v-bind="props"
			variant="outlined"
		/>
	</template>

	<template #profession="{ props }">
		<SearchListField
			v-bind="props"
			:items="professionList"
		/>
	</template>
</FilterInline>
		`,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<FilterInline
	v-model="filters"
>
	<template #name="{ props }">
		<VTextField
			v-bind="props"
			label="Nom"
			variant="outlined"
			hide-details
		/>
	</template>

	<template #folder="{ props }">
		<p class="text--secondary">
			Vous pouvez filtrer entre les dossiers de type <b>Arrêt de Travail (AT)</b> et <b>Maladie Professionnelle (MP)</b> ou <b>Autre</b>.
		</p>

		<VSelect
			v-bind="props"
			:items="folderTypes"
			label="Type de dossier"
			multiple
			variant="outlined"
			return-object
			hide-details
		/>
	</template>

	<template #period="{ props }">
		<PeriodField
			v-bind="props"
			variant="outlined"
		/>
	</template>

	<template #profession="{ props }">
		<SearchListField
			v-bind="props"
			:items="professionList"
		/>
	</template>
</FilterInline>
				`,
			},
			{
				name: 'Script',
				code: `
import { FilterInline, PeriodField, SearchListField } from '@cnamts/synapse'
import { VTextField, VSelect } from 'vuetify/components'

const filters = [
	{
		name: 'name',
		title: 'Identité',
	},
	{
		name: 'folder',
		title: 'Type de dossier',
	},
	{
		name: 'period',
		title: 'Période',
	},
	{
		name: 'profession',
		title: 'Profession',
	},
]

const folderTypes = [
	{ title: 'Arrêt de Travail (AT)', value: 'AT' },
	{ title: 'Maladie Professionnelle (MP)', value: 'MP' },
	{ title: 'Autre', value: 'other' },
]

const professionList = [
	{
		label: 'Chirurgien-dentiste',
		value: 'chirurgien-dentiste',
	},
	{
		label: 'Infirmier',
		value: 'infirmier',
	},
	{
		label: 'Orthophoniste',
		value: 'orthophoniste',
	},
	{
		label: 'Orthoptiste',
		value: 'orthoptiste',
	},
	{
		label: 'Pédicure-podologue',
		value: 'pedicure-podologue',
	},
	{
		label: 'Pharmacien',
		value: 'pharmacien',
	},
]
				`,
			},
		],
	},
}

export const FilterCombination: Story = {
	args: {
		'onUpdate:modelValue': fn(),
	},
	render: args => ({
		components: { FilterInline, VTextField, VSelect, PeriodField, SearchListField },
		setup() {
			const filters = [
				{
					name: 'name',
					title: 'Identité',
					value: 'Dupont Jean',
				},
				{
					name: 'folder',
					title: 'Type de dossier',
					value: [
						{
							text: 'AT',
							value: 'at',
						},
						{
							text: 'MP',
							value: 'mp',
						},
					],
				},
				{
					name: 'period',
					title: 'Période',
				},
				{
					name: 'profession',
					title: 'Profession',
				},
			]

			const folderTypes = [
				{ title: 'Arrêt de Travail (AT)', value: 'AT' },
				{ title: 'Maladie Professionnelle (MP)', value: 'MP' },
				{ title: 'Autre', value: 'other' },
			]

			const professionList = [
				{
					label: 'Chirurgien-dentiste',
					value: 'chirurgien-dentiste',
				},
				{
					label: 'Infirmier',
					value: 'infirmier',
				},
				{
					label: 'Orthophoniste',
					value: 'orthophoniste',
				},
				{
					label: 'Orthoptiste',
					value: 'orthoptiste',
				},
				{
					label: 'Pédicure-podologue',
					value: 'pedicure-podologue',
				},
				{
					label: 'Pharmacien',
					value: 'pharmacien',
				},
			]

			return { args, filters, folderTypes, professionList }
		},
		template: `
<FilterInline
	v-model="filters"
	v-bind="args"
>
	<template #name="{ props }">
		<VTextField
			v-bind="props"
			label="Nom"
			variant="outlined"
			hide-details
		/>
	</template>

	<template #folder="{ props }">
		<p class="text--secondary">
			Vous pouvez filtrer entre les dossiers de type <b>Arrêt de Travail (AT)</b> et <b>Maladie Professionnelle (MP)</b> ou <b>Autre</b>.
		</p>

		<VSelect
			v-bind="props"
			:items="folderTypes"
			label="Type de dossier"
			multiple
			variant="outlined"
			return-object
			hide-details
		/>
	</template>

	<template #period="{ props }">
		<PeriodField
			v-bind="props"
			variant="outlined"
		/>
	</template>

	<template #profession="{ props }">
		<SearchListField
			v-bind="props"
			:items="professionList"
		/>
	</template>
</FilterInline>
		`,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<FilterInline
	v-model="filters"
>
	<template #name="{ props }">
		<VTextField
			v-bind="props"
			label="Nom"
			variant="outlined"
			hide-details
		/>
	</template>

	<template #folder="{ props }">
		<p class="text--secondary">
			Vous pouvez filtrer entre les dossiers de type <b>Arrêt de Travail (AT)</b> et <b>Maladie Professionnelle (MP)</b> ou <b>Autre</b>.
		</p>

		<VSelect
			v-bind="props"
			:items="folderTypes"
			label="Type de dossier"
			multiple
			variant="outlined"
			return-object
			hide-details
		/>
	</template>

	<template #period="{ props }">
		<PeriodField
			v-bind="props"
			variant="outlined"
		/>
	</template>

	<template #profession="{ props }">
		<SearchListField
			v-bind="props"
			:items="professionList"
		/>
	</template>
</FilterInline>
				`,
			},
			{
				name: 'Script',
				code: `
import { FilterInline, PeriodField, SearchListField } from '@cnamts/synapse'
import { VTextField, VSelect } from 'vuetify/components'

const filters = [
	{
		name: 'name',
		title: 'Identité',
	},
	{
		name: 'folder',
		title: 'Type de dossier',
		value: [
			{
				text: 'AT',
				value: 'at',
			},
			{
				text: 'MP',
				value: 'mp',
			},
		],
	},
	{
		name: 'period',
		title: 'Période',
	},
	{
		name: 'profession',
		title: 'Profession',
	},
]

const folderTypes = [
	{ title: 'Arrêt de Travail (AT)', value: 'AT' },
	{ title: 'Maladie Professionnelle (MP)', value: 'MP' },
	{ title: 'Autre', value: 'other' },
]

const professionList = [
	{
		label: 'Chirurgien-dentiste',
		value: 'chirurgien-dentiste',
	},
	{
		label: 'Infirmier',
		value: 'infirmier',
	},
	{
		label: 'Orthophoniste',
		value: 'orthophoniste',
	},
	{
		label: 'Orthoptiste',
		value: 'orthoptiste',
	},
	{
		label: 'Pédicure-podologue',
		value: 'pedicure-podologue',
	},
	{
		label: 'Pharmacien',
		value: 'pharmacien',
	},
]
				`,
			},
		],
	},
}

export const ChipFormat: Story = {
	args: {
		'onUpdate:modelValue': fn(),
	},
	render: args => ({
		components: { FilterInline, VSelect, DatePicker, RangeField },
		setup() {
			const filters = [
				{
					name: 'updated-at',
					title: 'Mise à jour',
				},
				{
					name: 'folder',
					title: 'Type de dossier',
				},
				{
					name: 'range-slider',
					title: 'Intervalle',
					formatChip: ([min, max]: [number, number]) => [
						{
							text: `De ${min} à ${max}`,
							value: [min, max],
						},
					],
				},
			]

			const folderTypes = [
				'AT',
				'MP',
				'Autre',
			]

			return { args, filters, folderTypes }
		},
		template: `
<FilterInline v-model="filters">
	<template #updated-at="{ props }">
		<DatePicker
			v-bind="props"
			label="Date de mise à jour"
			variant="outlined"
		/>
	</template>

	<template #folder="{ props }">
		<VSelect
			v-bind="props"
			:items="folderTypes"
			label="Type de dossier"
			multiple
			variant="outlined"
			hide-details
		/>
	</template>

	<template #range-slider="{ props }">
		<RangeField
			v-bind="props"	
			label="Intervalle"
		/>
	</template>
</FilterInline>
		`,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<FiltersInline v-model="filters">
	<template #updated-at="{ props }">
		<DatePicker
			v-bind="props"
			label="Date de mise à jour"
			variant="outlined"
		/>
	</template>

	<template #folder="{ props }">
		<VSelect
			v-bind="props"
			:items="folderTypes"
			label="Type de dossier"
			multiple
			variant="outlined"
			hide-details
		/>
	</template>

	<template #range-slider="{ props }">
		<RangeField
			v-bind="props"
			label="Intervalle"
			max="50"
			min="0"
		/>
	</template>
</FiltersInline>
				`,
			},
			{
				name: 'Script',
				code: `
import { FilterInline, RangeField } from '@cnamts/synapse'
import { VSelect } from 'vuetify/components'

const filters = [
	{
		name: 'updated-at',
		title: 'Mise à jour',
	},
	{
		name: 'folder',
		title: 'Type de dossier',
	},
	{
		name: 'range-slider',
		title: 'Intervalle',
		formatChip: ([min, max]: [number, number]) => [
			{
				text: \`De \${min} à \${max}\`,
				value: [min, max],
			},
		],
	},
]

const folderTypes = [
	'AT',
	'MP',
	'Autre',
]
				`,
			},
		],
	},
}
