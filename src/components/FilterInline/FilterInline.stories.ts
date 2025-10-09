/* eslint-disable vue/one-component-per-file */
import { fn } from '@storybook/test'
import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent, ref, watch, type PropType } from 'vue'
import { VCheckbox, VDivider, VSelect, VTextField } from 'vuetify/components'
import FilterSideBar from '../FilterSideBar/FilterSideBar.vue'
import PeriodField from '../PeriodField/PeriodField.vue'
import RangeField from '../RangeField/RangeField.vue'
import SearchListField from '../SearchListField/SearchListField.vue'
import FilterInline from './FilterInline.vue'
import SySelect from '../Customs/Selects/SySelect/SySelect.vue'
import SyTextField from '../Customs/SyTextField/SyTextField.vue'

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
		components: { FilterInline, SyTextField, SySelect, PeriodField, SearchListField },
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
				{ text: 'Arrêt de Travail (AT)', value: 'AT' },
				{ text: 'Maladie Professionnelle (MP)', value: 'MP' },
				{ text: 'Autre', value: 'other' },
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
		<SyTextField
			v-bind="props"
			label="Nom"
			variant="outlined"
			hide-details
			color="primary"
			:noIcon="true"
			:showSuccessMessages="false"
		/>
	</template>

	<template #folder="{ props }">
		<p class="text-secondary mb-4">
			Vous pouvez filtrer entre les dossiers de type <b>Arrêt de Travail (AT)</b> et <b>Maladie Professionnelle (MP)</b> ou <b>Autre</b>.
		</p>

		<SySelect
			v-bind="props"
			:items="folderTypes"
			label="Type de dossier"
			multiple
			return-object
			hide-details
			color="primary"
		/>
	</template>

	<template #period="{ props }">
		<PeriodField
			v-bind="props"
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

const BooleanFilter = defineComponent({
	components: {
		VCheckbox,
	},
	props: {
		modelValue: {
			type: String,
			default: null,
		},
		title: {
			required: true,
			type: String,
		},
		label: {
			required: true,
			type: String,
		},
	},
	template: `
	<VCheckbox
		:model-value="modelValue === title"
		:label="label"
		color="primary"
		@update:model-value="(value) => $emit('update:modelValue', value ? title : null)"
	/>
	`,
})

export const Boolean: Story = {
	args: {
		'onUpdate:modelValue': fn(),
	},
	render: args => ({
		components: { FilterInline, BooleanFilter },
		setup() {
			const filters = ref([
				{
					name: 'eligibility',
					title: 'Éligibilité',
				},
			])

			return { args, filters }
		},
		template: `
<FilterInline v-model="filters" v-bind="args">
	<template #eligibility="{ props }">
		<p class="pt-2">Est ce que le patient est éligible à la Reconnaissance en <em class="text-primary">Qualité de travailleur handicapé</em>&nbsp;?</p>
		<BooleanFilter
			v-bind="props"
			label="Eligible RQTH"
			title="RQTH"
			@update:model-value="value => bool = value === 'eligibility'"
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
<FilterInline v-model="filters">
	<template #eligibility="{ props }">
		<p class="pt-2">Est ce que le patient est éligible à la Reconnaissance en <em class="text-primary">Qualité de travailleur handicapé</em>&nbsp;?</p>
		<BooleanFilter
			v-bind="props"
			label="Eligible RQTH"
			title="RQTH"
			@update:model-value="value => bool = value === 'eligibility'"
		/>
	</template>
</FilterInline>
				`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
	import { ref } from 'vue'
	import { FilterInline } from '@cnamts/synapse'
	import BooleanFilter from './BooleanFilter.vue'

	const filters = ref([
		{
			name: 'eligibility',
			title: 'Éligibilité',
		},
	])

	const bool = ref(false)
</script>`,
			},
			{
				name: 'BooleanFilter.vue',
				code: `
<script setup lang="ts">
	const props = defineProps<{
		title: string
		label: string
	}>()

	const modelValue = defineModel<string | null>()
</script>

<template>
	<VCheckbox
		:model-value="modelValue === title"
		:label
		color="primary"
		@update:model-value="value => modelValue = value ? props.title : undefined"
	/>
</template>
`,
			},
		],
	},
}

const ManyFilters = defineComponent({
	components: {
		VCheckbox,
	},
	props: {
		modelValue: {
			type: Object as PropType<string[] | null | undefined>,
			default: undefined,
		},
	},
	emits: ['update:modelValue'],
	setup(args, ctx) {
		const rqth = ref(false)
		const pch = ref(false)
		const aeeh = ref(false)

		watch(() => args.modelValue, (value) => {
			rqth.value = !!value?.includes('RQTH')
			pch.value = !!value?.includes('PCH')
			aeeh.value = !!value?.includes('AEEH')
		}, { immediate: true, deep: true })

		watch([rqth, pch, aeeh], () => {
			const values: string[] = []
			if (rqth.value) values.push('RQTH')
			if (pch.value) values.push('PCH')
			if (aeeh.value) values.push('AEEH')
			ctx.emit('update:modelValue', values.length ? values : undefined)
		})

		return { rqth, pch, aeeh }
	},
	template: `
		<div>
			<p>Est ce que le patient est éligible à la Reconnaissance en <em class="text-primary">Qualité de travailleur handicapé</em>&nbsp;?</p>
			<VCheckbox
				v-model="rqth"
				label="Eligible RQTH"
				color="primary"
			/>
			<hr>
			<p class="mt-6">
				Est ce que le patient est éligible à <em class="text-primary">Prestation de Compensation du Handicap</em>&nbsp;?
			</p>
			<VCheckbox
				v-model="pch"
				label="Eligible PCH"
				color="primary"
			/>
			<hr>
			<p class="mt-6">
				Est ce que le patient est éligible à <em class="text-primary">l'Allocation d'Education de l'Enfant Handicapé</em>&nbsp;?
			</p>
			<VCheckbox
				v-model="aeeh"
				label="Eligible AEEH"
				color="primary"
			/>
		</div>
	`,
})

export const ManyFields: Story = {
	args: {
		'onUpdate:modelValue': fn(),
	},
	render: args => ({
		components: { FilterInline, ManyFilters },
		setup() {
			const filters = ref([
				{
					name: 'eligibilities',
					title: 'Éligibilités',
				},
			])

			return { args, filters }
		},
		template: `
<FilterInline v-model="filters" v-bind="args">
	<template #eligibilities="{ props }">
		<ManyFilters
			v-bind="props"
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
<FilterInline v-model="filters">
	<template #eligibilities="{ props }">
		<ManyFilters
			v-bind="props"
		/>
	</template>
</FilterInline>
				`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
	import { ref } from 'vue'
	import { FilterInline } from '@cnamts/synapse'
	import ManyFilters from './ManyFilters.vue'

	const filters = ref([
		{
			name: 'eligibilities',
			title: 'Éligibilités',
		},
	])
</script>`,

			},
			{
				name: 'ManyFilters.vue',
				code: `
<script setup lang="ts">
	import { ref, watch } from 'vue'

	const modelValue = defineModel<Array<string> | null>()

	const rqth = ref(false)
	const pch = ref(false)
	const aeeh = ref(false)

	watch(modelValue, (value) => {
		rqth.value = !!value?.includes('RQTH')
		pch.value = !!value?.includes('PCH')
		aeeh.value = !!value?.includes('AEEH')
	}, { immediate: true, deep: true })

	watch([rqth, pch, aeeh], () => {
		const values: string[] = []
		if (rqth.value) values.push('RQTH')
		if (pch.value) values.push('PCH')
		if (aeeh.value) values.push('AEEH')
		modelValue.value = values.length ? values : undefined
	})

</script>

<template>
	<div>
		<p>Est ce que le patient est éligible à la Reconnaissance en <em class="text-primary">Qualité de travailleur handicapé</em>&nbsp;?</p>
		<VCheckbox
			v-model="rqth"
			label="Eligible RQTH"
			color="primary"
		/>
		<hr>
		<p class="mt-6">
			Est ce que le patient est éligible à <em class="text-primary">Prestation de Compensation du Handicap</em>&nbsp;?
		</p>
		<VCheckbox
			v-model="pch"
			label="Eligible PCH"
			color="primary"
		/>
		<hr>
		<p class="mt-6">
			Est ce que le patient est éligible à <em class="text-primary">l'Allocation d'Education de l'Enfant Handicapé</em>&nbsp;?
		</p>
		<VCheckbox
			v-model="aeeh"
			label="Eligible AEEH"
			color="primary"
		/>
	</div>
</template>
`,
			},
		],
	},
}
