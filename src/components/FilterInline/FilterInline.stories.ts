import { fn } from '@storybook/test'
import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { VDivider, VSelect, VTextField } from 'vuetify/components'
import FilterSideBar from '../FilterSideBar/FilterSideBar.vue'
import PeriodField from '../PeriodField/PeriodField.vue'
import RangeField from '../RangeField/RangeField.vue'
import SearchListField from '../SearchListField/SearchListField.vue'
import FilterInline from './FilterInline.vue'

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
			color="primary"
		/>
	</template>

	<template #folder="{ props }">
		<p class="text-secondary mb-4">
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
			color="primary"
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
			color="primary"
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
				<template>
<FilterInline
	v-model="filters"
>
	<template #name="{ props }">
		<VTextField
			v-bind="props"
			label="Nom"
			variant="outlined"
			hide-details
			color="primary"
		/>
	</template>

	<template #folder="{ props }">
		<p class="text-secondary mb-4">
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
			color="primary"
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
			color="primary"
		/>
	</template>
</FilterInline>
</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script lang='ts setup>
import { ref } from 'vue'
import { FilterInline, PeriodField, SearchListField } from '@cnamts/synapse'
import { VTextField, VSelect } from 'vuetify/components'

const filters = ref([
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
])

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
	</script>
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
		components: { FilterInline, RangeField },
		setup() {
			const filters = [
				{
					name: 'range-slider',
					title: 'Intervalle',
					value: [0, 50],
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
import { ref } from 'vue'
import { FilterInline, RangeField } from '@cnamts/synapse'
import { VSelect } from 'vuetify/components'

const filters = ref([
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
])

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

export const FilterCombination: Story = {
	args: {
		'onUpdate:modelValue': fn(),
	},
	decorators: [
		() => ({
			template: `
			<VApp style="height: 500px; overflow-y: hidden;">
				<div class="pa-4">
					<story />
				</div>
			</VApp>
		`,
		}),
	],
	render: args => ({
		components: { FilterSideBar, FilterInline, VTextField, VSelect, PeriodField, SearchListField, VDivider },
		setup() {
			const filters = ref([
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
			])

			const folderTypes = [
				{
					title: 'AT',
					value: 'at',
				},
				{
					title: 'MP',
					value: 'mp',
				},
				{
					title: 'Autre',
					value: 'other',
				},
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
		<div>
			<FilterSideBar
				v-model="filters"
				v-bind="args"
			>
				<template #name="{ props }">
					<VTextField
						v-bind="props"
						label="Nom"
						variant="outlined"
						hide-details
						color="primary"
					/>
				</template>

				<template #folder="{ props }">
					<p class="text-secondary mb-4">
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
						color="primary"
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
			</FilterSideBar>
			<VDivider class="my-4" />
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
						color="primary"
					/>
				</template>

				<template #folder="{ props }">
					<p class="text-secondary mb-4">
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
						color="primary"
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
						color="primary"
					/>
				</template>
			</FilterInline>
		</div>
		`,
	}),
	parameters: {
		layout: 'fullscreen',
		sourceCode: [
			{
				name: 'Template',
				code: `
		<div>
			<FilterSideBar
				v-model="filters"
			>
				<template #name="{ props }">
					<VTextField
						v-bind="props"
						label="Nom"
						variant="outlined"
						hide-details
						color="primary"
					/>
				</template>

				<template #folder="{ props }">
					<p class="text-secondary mb-4">
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
						color="primary"
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
			</FilterSideBar>
			<VDivider class="my-4" />
			<FilterInline
				v-model="filters"
			>
				<template #name="{ props }">
					<VTextField
						v-bind="props"
						label="Nom"
						variant="outlined"
						hide-details
						color="primary"
					/>
				</template>

				<template #folder="{ props }">
					<p class="text-secondary mb-4">
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
						color="primary"
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
						color="primary"
					/>
				</template>
			</FilterInline>
		</div>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { FilterSideBar, filterInline, SearchListField, PeriodField } from '@cnamts/synapse'
import { VDivider, VSelect, VTextField } from 'vuetify/components'

const filters = ref([
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
])

const folderTypes = [
	{
		title: 'AT',
		value: 'at',
	},
	{
		title: 'MP',
		value: 'mp',
	},
	{
		title: 'Autre',
		value: 'other',
	},
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
	
</script>`,
			},
		],
	},
}
