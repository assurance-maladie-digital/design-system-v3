import type { Meta, StoryObj } from '@storybook/vue3-vite'
import FilterSideBar from './FilterSideBar.vue'
import { fn } from 'storybook/test'
import { VBtn, VDialog, VCard, VCardText, VCardActions, VDivider, VSelect } from 'vuetify/components'
import PeriodField from '../PeriodField/PeriodField.vue'
import SearchListField from '../SearchListField/SearchListField.vue'
import { ref } from 'vue'
import FilterInline from '../FilterInline/FilterInline.vue'
import RangeField from '../RangeField/RangeField.vue'
import SyTextField from '../Customs/SyTextField/SyTextField.vue'

const meta = {
	title: 'Composants/Filtres/FilterSideBar',
	component: FilterSideBar,

	argTypes: {
		'locales': {
			description: 'Surcharge des chaînes affichées à l\'utilisateur (libellés des boutons, de la modale et ARIA de la barre de filtres). Les valeurs par défaut sont définies dans le fichier `locales.ts` du composant. La prop accepte un objet partiel : seules les clés renseignées surchargent les valeurs par défaut, le reste est conservé.',
			control: 'object',
			table: {
				type: { summary: 'object', detail: `{
	filterBtnLabel: string,
	modaleLabel: string,
	badgeListLabel: (filterName: string) => string,
	badgeLabel: (count: number) => string,
	reset: string,
	close: string,
	apply: string,
	closeAriaLabel: string,
	resetAriaLabel: string,
	applyAriaLabel: string,
}` },
				category: 'props',
			},
		},
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
		'modale': {
			description: 'Definit la dialogue en mode modale et bloque le focus dans la dialogue.',
			control: {
				type: 'boolean',
			},
			table: {
				category: 'props',
				type: {
					summary: 'boolean',
				},
				defaultValue: {
					summary: 'false',
				},
			},
		},
		'zIndex': {
			description: 'Surcharge le z-index du panneau. À utiliser uniquement lorsque le FilterSideBar doit s\'afficher par-dessus ou en-dessous d\'un composant en surimpression (modale, bottom sheet…). Voir la section <em>Gestion du z-index</em> ci-dessous pour les préconisations.',
			control: {
				type: 'number',
			},
			table: {
				category: 'props',
				type: {
					summary: 'number',
				},
				defaultValue: {
					summary: 'undefined',
				},
			},
		},
		'title': {
			description: 'Titre affiché au-dessus des filtres du panneau',
			control: {
				type: 'text',
			},
			table: {
				category: 'props',
				type: {
					summary: 'string',
				},
				defaultValue: {
					summary: 'undefined',
				},
			},
		},
		'headingLevel': {
			description: 'Niveau sémantique du titre (balise h1 à h6), pour l’intégration dans la hiérarchie de titres de la page',
			control: {
				type: 'select',
			},
			options: [1, 2, 3, 4, 5, 6],
			table: {
				category: 'props',
				type: {
					summary: '1 | 2 | 3 | 4 | 5 | 6',
				},
				defaultValue: {
					summary: '2',
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
			description: 'Slot pour les filtres. <br>Le nom de chaque slot correspond au nom (`name`) du filtre. <br>Le paramètre du slot `props` est un objet contenant les props à passer au filtre.',
			table: {
				category: 'slots',
				type: {
					summary: '{ props: Object }',
				},
			},
		},
	},
	parameters: {
		layout: 'fullscreen',
		controls: {
			exclude: ['update:modelValue', '`${formatFilterName(filter.name)}`'],
		},
	},
} satisfies Meta<typeof FilterSideBar>

export default meta

type Story = StoryObj<typeof FilterSideBar>

export const Default: Story = {
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
		components: { FilterSideBar, SyTextField, VSelect, PeriodField, SearchListField },
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
			<FilterSideBar
				v-bind="args"
				v-model="filters"
			>
				<template #name="{ props }">
					<SyTextField
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
						label="Profession"
						:items="professionList"
					/>
				</template>
			</FilterSideBar>
		`,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<FilterSideBar
	v-model="filters"
>
	<template #name="{ props }">
		<SyTextField
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
			label="Profession"
			:items="professionList"
			return-object
		/>
	</template>
</FilterSideBar>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { FilterSideBar } from '@cnamts/synapse'

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

export const ChipFormat: Story = {
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
		components: { FilterSideBar, RangeField },
		setup() {
			const filters = ref([
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
			])

			return { args, filters }
		},
		template: `
			<FilterSideBar
				v-model="filters"
				v-bind="args"
			>
				<template #range-slider="{ props }">
					<RangeField
						v-bind="props"	
						label="Intervalle"
					/>
				</template>
			</FilterSideBar>
		`,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<FilterSideBar
	v-model="filters"
>
		<template #range-slider="{ props }">
		<RangeField
			v-bind="props"	
			label="Intervalle"
		/>
	</template>
</FilterSideBar>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { FilterSideBar, RangeField } from '@cnamts/synapse'

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
</script>`,
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
			<VApp style="height: 500px; overflow-y: hidden; background: none">
				<div class="pa-4">
					<story />
				</div>
			</VApp>
		`,
		}),
	],
	render: args => ({
		components: { FilterSideBar, FilterInline, SyTextField, VSelect, PeriodField, SearchListField, VDivider },
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
					<SyTextField
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
						label="Profession"
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
					<SyTextField
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
						label="Profession"
						:items="professionList"
						color="primary"
					/>
				</template>
			</FilterInline>
		</div>
		`,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
		<div>
			<FilterSideBar
				v-model="filters"
			>
				<template #name="{ props }">
					<SyTextField
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
						label="Profession"
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
					<SyTextField
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
						label="Profession"
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
import { VDivider, VSelect, SyTextField } from 'vuetify/components'

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

export const Title: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<FilterSideBar
		v-model="filters"
		title="Filtres du tableau personnalisé"
	>
		<template #name="{ props }">
			<SyTextField
				v-bind="props"
				label="Nom"
				variant="outlined"
				hide-details
			/>
		</template>

		<template #folder="{ props }">
			<SyTextField
				v-bind="props"
				label="Type de dossier"
				variant="outlined"
				hide-details
			/>
		</template>
	</FilterSideBar>
</template>
			`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { FilterSideBar, SyTextField } from '@cnamts/synapse'

const filters = ref([
	{
		name: 'name',
		title: 'Identité',
	},
	{
		name: 'folder',
		title: 'Type de dossier',
	},
])
</script>
			`,
			},
		],
	},
	args: {
		'onUpdate:modelValue': fn(),
		'title': 'Filtres du tableau personnalisé',
	},
	decorators: Default.decorators,
	render: args => ({
		components: { FilterSideBar, SyTextField },
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
			])

			return { args, filters }
		},
		template: `
			<FilterSideBar
				v-bind="args"
				v-model="filters"
			>
				<template #name="{ props }">
					<SyTextField
						v-bind="props"
						label="Nom"
						variant="outlined"
						hide-details
					/>
				</template>

				<template #folder="{ props }">
					<SyTextField
						v-bind="props"
						label="Type de dossier"
						variant="outlined"
						hide-details
					/>
				</template>
			</FilterSideBar>
		`,
	}),
}

export const ZIndex: Story = {
	args: {
		'onUpdate:modelValue': fn(),
	},
	decorators: [
		() => ({
			template: `
			<VApp style="height: 600px; overflow-y: hidden;">
				<div class="pa-4">
					<story />
				</div>
			</VApp>
		`,
		}),
	],
	render: args => ({
		components: { FilterSideBar, VBtn, VDialog, VCard, VCardText, VCardActions, VSelect, VDivider },
		setup() {
			const filters1 = ref([{ name: 'folder', title: 'Type de dossier' }])
			const filters2 = ref([{ name: 'folder', title: 'Type de dossier' }])

			const folderTypes = [
				{ title: 'AT', value: 'at' },
				{ title: 'MP', value: 'mp' },
				{ title: 'Autre', value: 'other' },
			]

			const dialog1 = ref(false)
			const dialog2 = ref(false)

			return { args, filters1, filters2, folderTypes, dialog1, dialog2 }
		},
		template: `
			<div>
				<p class="text-subtitle-2 mb-2">Sans zIndex — la modale s'affiche par-dessus le panneau (comportement par défaut)</p>
				<div class="d-flex align-center ga-4 mb-6">
					<FilterSideBar v-bind="args" v-model="filters1">
						<template #folder="{ props }">
							<VSelect v-bind="props" :items="folderTypes" label="Type de dossier" multiple variant="outlined" return-object hide-details color="primary" />
						</template>
					</FilterSideBar>
					<VBtn color="primary" variant="outlined" @click="dialog1 = true">
						Ouvrir une modale de confirmation
					</VBtn>
				</div>
				<VDialog v-model="dialog1" max-width="400">
					<VCard>
						<VCardText>Confirmez-vous la réinitialisation des filtres ?</VCardText>
						<VCardActions class="justify-end">
							<VBtn variant="text" @click="dialog1 = false">Annuler</VBtn>
							<VBtn color="primary" variant="elevated" @click="dialog1 = false">Confirmer</VBtn>
						</VCardActions>
					</VCard>
				</VDialog>

				<VDivider class="mb-6" />

				<p class="text-subtitle-2 mb-2">Avec zIndex="2401" — le panneau s'affiche par-dessus la modale</p>
				<div class="d-flex align-center ga-4">
					<FilterSideBar v-bind="args" v-model="filters2" :z-index="2401">
						<template #folder="{ props }">
							<VSelect v-bind="props" :items="folderTypes" label="Type de dossier" multiple variant="outlined" return-object hide-details color="primary" />
						</template>
					</FilterSideBar>
					<VBtn color="primary" variant="outlined" @click="dialog2 = true">
						Ouvrir une modale de confirmation
					</VBtn>
				</div>
				<VDialog v-model="dialog2" max-width="400">
					<VCard>
						<VCardText>Confirmez-vous la réinitialisation des filtres ?</VCardText>
						<VCardActions class="justify-end">
							<VBtn variant="text" @click="dialog2 = false">Annuler</VBtn>
							<VBtn color="primary" variant="elevated" @click="dialog2 = false">Confirmer</VBtn>
						</VCardActions>
					</VCard>
				</VDialog>
			</div>
		`,
	}),
	parameters: {
		docs: {
			description: {
				story: 'Deux exemples côte à côte : sans <code>zIndex</code>, la modale s\'affiche par-dessus le panneau (comportement par défaut) ; avec <code>zIndex: 2401</code>, le panneau passe au premier plan.',
			},
		},
	},
}
