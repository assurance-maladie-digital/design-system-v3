import type { Meta, StoryObj } from '@storybook/vue3'
import LunarCalendar from './LunarCalendar.vue'

const meta = {
	title: 'Composants/Formulaires/LunarCalendar',
	component: LunarCalendar,
	argTypes: {
		modelValue: {
			description: 'La valeur du calendrier lunaire au format DD/MM/YYYY',
			control: { type: 'text' },
			table: {
				type: { summary: 'string' },
				category: 'props',
			},
		},
		successMessages: {
			description: 'Messages de succès à afficher sous le champ',
			control: { type: 'text' },
		},
		minYear: {
			description: 'Année minimale autorisée',
			control: { type: 'number' },
		},
		maxYear: {
			description: 'Année maximale autorisée',
			control: { type: 'number' },
		},
		required: {
			description: 'Indique si le champ est requis',
			control: { type: 'boolean' },
		},
		placeholder: {
			description: 'Texte affiché lorsque le champ est vide',
			control: { type: 'text' },
		},
		isClearable: {
			description: 'Indique si le champ peut être effacé',
			control: { type: 'boolean' },
		},
		displayPrependIcon: {
			description: 'Affiche une icône au début du champ',
			control: { type: 'boolean' },
		},
		displayAppendIcon: {
			description: 'Affiche une icône à la fin du champ',
			control: { type: 'boolean' },
		},
	},
	args: {
		label: 'Date de naissance',
		modelValue: '',
	},
} satisfies Meta<typeof LunarCalendar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		modelValue: '',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<LunarCalendar
						label="Date de naissance"
						v-model="dateValue"
					/>
				</template>

				<script setup lang="ts">
				import { ref } from 'vue'

				const dateValue = ref('')
				</script>
				`,
			},
		],
	},
}

export const WithYearConstraints: Story = {
	args: {
		modelValue: '16/08/1550',
		minYear: 1400,
		maxYear: 1500,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<LunarCalendar
						label="Date de naissance"
						v-model="dateValue"
						:min-year="1400"
						:max-year="1500"
					/>
				</template>

				<script setup lang="ts">
				import { ref } from 'vue'

				const dateValue = ref('16/08/1550')
				</script>
				`,
			},
		],
	},
}

export const WithMinYearOnly: Story = {
	args: {
		modelValue: '12/12/1445',
		minYear: 1420,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<LunarCalendar
						label="Date de naissance"
						v-model="dateValue"
						:min-year="1420"
					/>
				</template>

				<script setup lang="ts">
				import { ref } from 'vue'

				const dateValue = ref('12/12/1445')
				</script>
				`,
			},
		],
	},
}

export const WithMaxYearOnly: Story = {
	args: {
		modelValue: '12/12/1445',
		maxYear: 1450,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<LunarCalendar
						label="Date de naissance"
						v-model="dateValue"
						:max-year="1450"
					/>
				</template>

				<script setup lang="ts">
				import { ref } from 'vue'

				const dateValue = ref('12/12/1445')
				</script>
				`,
			},
		],
	},
}

export const required: Story = {
	args: {
		modelValue: '',
		required: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<LunarCalendar
						label="Date de naissance"
						v-model="dateValue"
						required
					/>
				</template>

				<script setup lang="ts">
				import { ref } from 'vue'

				const dateValue = ref('')
				</script>
				`,
			},
		],
	},
}

export const WithClearable: Story = {
	args: {
		modelValue: '12/13/1564',
		placeholder: '21/13/1442',
		isClearable: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<LunarCalendar
						label="Date de naissance"
						v-model="dateValue"
						:placeholder="'21/13/1442'"
						:is-clearable="true"
					/>
				</template>

				<script setup lang="ts">
				import { ref } from 'vue'

				const dateValue = ref('12/13/1564')
				</script>
				`,
			},
		],
	},
}
