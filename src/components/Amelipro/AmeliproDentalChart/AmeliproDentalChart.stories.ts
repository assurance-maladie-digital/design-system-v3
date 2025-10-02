import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproDentalChart from './AmeliproDentalChart.vue'
import type { AmeliproDentalChartLine } from './types'
import AmeliproMessage from '../AmeliproMessage/AmeliproMessage.vue'
import { ref } from 'vue'

const meta = {
	argTypes: {
		'change': {
			description: 'Événement émis au changement d’état d’une dent. Retourne la dent modifiée.',
			type: 'IAmeliproTooth',
		},
		'change:filter': { description: 'Événement émis au changement d’état des filtres. Retourne la valeur du filtre sélectionné.', type: 'string' },
		'information': { description: 'Informations à placer entre les boutons de filtre et le schéma' },
		'modelValue': {
			description: 'Valeur qui sert de v-model au schéma, un tableau de 4 entrées, chaque entrée correspond à une ligne de dents',
			table: {
				type: {
					detail: `Array<Array<{
	currentState: {
		decayed: boolean;
		filled: boolean;
		missing: boolean;
	};
	previousState?: {
		decayed: boolean;
		filled: boolean;
		missing: boolean;
	};
	toothNumber: string;
}>>`,
					summary: 'AmeliproDentalChartLine[]',
				},
			},
		},
		'readonly': { description: 'Met le composant en lecture seule' },
		'uniqueId': { description: 'Identifiant unique' },
		'update:model-value': {
			description: 'Événement émis si le tableau complet est changé. Retourne la nouvelle valeur de `modelValue`.',
			type: 'AmeliproTabAmeliproDentalChartLine[]',
		},
	},
	component: AmeliproDentalChart,
	title: 'Composants/Amelipro/AmeliproDentalChart',
} as Meta<typeof AmeliproDentalChart>
export default meta

type Story = StoryObj<typeof AmeliproDentalChart>

const items: AmeliproDentalChartLine[] = [
	[
		{
			currentState: {
				decayed: true,
				filled: false,
				missing: false,
			},
			previousState: {
				decayed: true,
				filled: false,
				missing: false,
			},
			toothNumber: '18',
		},
		{
			currentState: {
				decayed: false,
				filled: true,
				missing: false,
			},
			previousState: {
				decayed: false,
				filled: true,
				missing: false,
			},
			toothNumber: '17',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: true,
			},
			previousState: {
				decayed: false,
				filled: false,
				missing: true,
			},
			toothNumber: '16',
		},
		{
			currentState: {
				decayed: true,
				filled: true,
				missing: false,
			},
			previousState: {
				decayed: true,
				filled: true,
				missing: false,
			},
			toothNumber: '15',
		},
		{
			currentState: {
				decayed: true,
				filled: false,
				missing: false,
			},
			toothNumber: '14',
		},
		{
			currentState: {
				decayed: false,
				filled: true,
				missing: false,
			},
			toothNumber: '13',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: true,
			},
			toothNumber: '12',
		},
		{
			currentState: {
				decayed: true,
				filled: true,
				missing: false,
			},
			toothNumber: '11',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '21',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '22',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '23',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '24',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '25',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '26',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '27',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '28',
		},
	],
	[
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '55',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '54',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '53',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '52',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '51',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '61',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '62',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '63',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '64',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '65',
		},
	],
	[
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '85',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '84',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '83',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '82',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '81',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '71',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '72',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '73',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '74',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '75',
		},
	],
	[
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '48',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '47',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '46',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '45',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '44',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '43',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '42',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '41',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '31',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '32',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '33',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '34',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '35',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '36',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '37',
		},
		{
			currentState: {
				decayed: false,
				filled: false,
				missing: false,
			},
			toothNumber: '38',
		},
	],
]

export const Default: Story = {
	args: {
		modelValue: items,
		uniqueId: 'amelipro-dental-chart-unique-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproDentalChart
		v-model="items"
		unique-id="amelipro-dental-chart-unique-id"
		@change:filter="changeMessage"
	>
		<template #information>
			<AmeliproMessage
				class="my-2"
				text
				unique-id="dental-chart-info"
			>
				<p class="mb-0">
					Sélectionnez les dents {{ messageValue }}
				</p>
				<p class="mb-0">
					<span class="font-weight-semibold">C :</span> Dent cariée (lésion dentaire ou non),
					<span class="font-weight-semibold">A :</span> Dent absente,
					<span class="font-weight-semibold">O :</span> Dent obturée,
					<span class="font-weight-semibold">CO :</span> Dent cariée et obturée.
				</p>
				<p
					aria-hidden="true"
					class="mb-0 d-inline-flex align-center"
				>
					<span class="border-dash-legend" /> Ancienne saisie,
					<span class="border-solid-legend" /> Nouvelle saisie
				</p>
			</AmeliproMessage>
		</template>
	</AmeliproDentalChart>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproDentalChart, AmeliproMessage } from '@cnamts/synapse'
	import { ref } from 'vue'

	const items = ref([
		[
			{
				currentState: {
					decayed: true,
					filled: false,
					missing: false,
				},
				previousState: {
					decayed: true,
					filled: false,
					missing: false,
				},
				toothNumber: '18',
			},
			{
				currentState: {
					decayed: false,
					filled: true,
					missing: false,
				},
				previousState: {
					decayed: false,
					filled: true,
					missing: false,
				},
				toothNumber: '17',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: true,
				},
				previousState: {
					decayed: false,
					filled: false,
					missing: true,
				},
				toothNumber: '16',
			},
			{
				currentState: {
					decayed: true,
					filled: true,
					missing: false,
				},
				previousState: {
					decayed: true,
					filled: true,
					missing: false,
				},
				toothNumber: '15',
			},
			{
				currentState: {
					decayed: true,
					filled: false,
					missing: false,
				},
				toothNumber: '14',
			},
			{
				currentState: {
					decayed: false,
					filled: true,
					missing: false,
				},
				toothNumber: '13',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: true,
				},
				toothNumber: '12',
			},
			{
				currentState: {
					decayed: true,
					filled: true,
					missing: false,
				},
				toothNumber: '11',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '21',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '22',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '23',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '24',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '25',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '26',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '27',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '28',
			},
		],
		[
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '55',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '54',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '53',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '52',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '51',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '61',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '62',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '63',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '64',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '65',
			},
		],
		[
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '85',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '84',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '83',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '82',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '81',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '71',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '72',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '73',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '74',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '75',
			},
		],
		[
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '48',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '47',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '46',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '45',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '44',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '43',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '42',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '41',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '31',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '32',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '33',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '34',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '35',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '36',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '37',
			},
			{
				currentState: {
					decayed: false,
					filled: false,
					missing: false,
				},
				toothNumber: '38',
			},
		],
	])

	const messageValue = ref('cariées')
	const changeMessage = (value: string) => {
		if (value === 'decayed') {
			messageValue.value = 'cariées'
		} else if (value === 'filled') {
			messageValue.value = 'obturées'
		} else if (value === 'missing') {
			messageValue.value = 'manquantes'
		}
	}
</script>
				`,
			},
			{
				name: 'Style',
				code: `<style lang="scss" scoped>
	.border-dash-legend,
	.border-solid-legend {
		display: inline-block;
		margin: 0 4px;
		width: 30px;
		height: 1px;
	}

	.border-dash-legend {
		border-bottom: 1px dashed #d00063;
	}

	.border-solid-legend {
		border-bottom: 1px solid #00749c;
	}
</style>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproDentalChart, AmeliproMessage },
		setup() {
			const messageValue = ref('cariées')
			const model = ref(items)
			const changeMessage = (value: string) => {
				if (value === 'decayed') {
					messageValue.value = 'cariées'
				}
				else if (value === 'filled') {
					messageValue.value = 'obturées'
				}
				else if (value === 'missing') {
					messageValue.value = 'manquantes'
				}
			}
			return { args, changeMessage, messageValue, model }
		},
		template: `
<AmeliproDentalChart
	v-bind="args"
	@change:filter="changeMessage"
	v-model="model"
>
	<template #information>
		<AmeliproMessage
			class="my-2"
			text
			unique-id="dental-chart-info"
		>
			<p class="mb-0">
				Sélectionnez les dents {{ messageValue }}
			</p>
			<p class="mb-0">
				<span class="font-weight-semibold">C :</span> Dent cariée (lésion dentaire ou non),
				<span class="font-weight-semibold">A :</span> Dent absente,
				<span class="font-weight-semibold">O :</span> Dent obturée,
				<span class="font-weight-semibold">CO :</span> Dent cariée et obturée.
			</p>
			<p
				aria-hidden="true"
				class="mb-0 d-inline-flex align-center"
			>
				<span style="display: inline-block; margin: 0 4px; width: 30px; height: 1px; border-bottom: 1px solid #00749c;" /> Ancienne saisie,
				<span style="display: inline-block; margin: 0 4px; width: 30px; height: 1px; border-bottom: 1px dashed #d00063;" /> Nouvelle saisie
			</p>
		</AmeliproMessage>
	</template>
</AmeliproDentalChart>`,
	}),
}
