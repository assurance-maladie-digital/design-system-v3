import type { Meta, StoryObj } from '@storybook/vue3'
import SyTextArea from './SyTextArea.vue'
import type { VTextarea } from 'vuetify/components'
import { fn } from '@storybook/test'

const meta = {
	title: 'Composants/Formulaires/SyTextArea',
	component: SyTextArea,
	parameters: {
		docs: {
			controls: {
				exclude: ['modelValue', 'rules', 'variant', 'validateOn', 'update:modelValue', 'onUpdate:modelValue'],
			},
		},
		controls: {
			exclude: ['modelValue', 'rules', 'variant', 'validateOn', 'onUpdate:modelValue'],
		},
	},
	argTypes: {
		trim: {
			control: { type: 'boolean' },
			description: 'Supprime les espaces en début et fin de chaîne de caractères',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		replaceTabs: {
			control: { type: 'number' },
			description: 'Remplace les tabulations par un nombre défini d\'espaces',
			table: {
				type: { summary: 'number' },
				defaultValue: { summary: 'undefined' },
			},
		},
		maxLines: {
			control: { type: 'number' },
			description: 'Nombre maximum de lignes acceptées',
			table: {
				type: { summary: 'number' },
				defaultValue: { summary: 'undefined' },
			},
		},
		autoWrap: {
			control: { type: 'number' },
			description: 'Nombre de caractères maximum par ligne',
			table: {
				type: { summary: 'number' },
				defaultValue: { summary: 'undefined' },
			},
		},
		normalize: {
			control: { type: 'boolean' },
			description: 'Normalise le texte selon la norme NFC',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
	},
} satisfies Meta<typeof SyTextArea & typeof VTextarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		'onUpdate:modelValue': fn(),
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<SyTextArea
		v-model="text"
		label="Texte"
		placeholder="Entrez votre texte ici"
		style="width: 100%"
	></SyTextArea>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
const text = ref('')
</script>
				`,
			},
		],
	},
}

export const Trim: Story = {
	args: {
		'trim': true,
		'onUpdate:modelValue': fn(),
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<SyTextArea
		v-model="text"
		label="Trim text area"
		:trim="true"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
const text = ref('')
</script>
				`,
			},
		],
	},
	decorators: [
		story => ({
			components: { story },
			template: `<div>
	<p class="pb-5">Les espaces, tabulations et retours a la lignes seront retirés</p>
	<story />
</div>`,
		}),
	],
}

export const ReplaceTabs: Story = {
	args: {
		'replaceTabs': 4,
		'onUpdate:modelValue': fn(),
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<SyTextArea
		v-model="text"
		label="Replace tabs text area"
		:replace-tabs="4"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
const text = ref('')
</script>
				`,
			},
		],
	},
	decorators: [
		story => ({
			components: { story },
			template: `<div>
	<p class="pb-5">Les tabulations seront remplacées par 4 espaces</p>
	<story />
</div>`,
		}),
	],
}

export const MaxLines: Story = {
	args: {
		'modelValue': 'Lorem ipsum dolor sit amet,\n consectetur adipiscing elit,\n sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n Ut enim ad minim veniam,\n quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n Excepteur sint occaecat cupidatat non proident,\n sunt in culpa qui officia deserunt mollit anim id est laborum.',
		'maxLines': 5,
		'onUpdate:modelValue': fn(),
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<SyTextArea
		v-model="text"
		label="Max lines text area"
		:max-lines="5"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
const text = ref('')
</script>
				`,
			},
		],
	},
	decorators: [
		story => ({
			components: { story },
			template: `<div>
	<p class="pb-5">Le nombre maximum de lignes est de 5</p>
	<story />
</div>`,
		}),
	],
}

export const AutoWrap: Story = {
	args: {
		'autoWrap': 50,
		'onUpdate:modelValue': fn(),
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<SyTextArea
		v-model="text"
		label="Auto wrap text area"
		:auto-wrap="50"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
const text = ref('')
</script>
				`,
			},
		],
	},
	decorators: [
		story => ({
			components: { story },
			template: `<div>
	<p class="pb-5">Le texte sera automatiquement coupé tous les 50 caractères</p>
	<story />
</div>`,
		}),
	],
}

export const Normalize: Story = {
	args: {
		'normalize': true,
		'onUpdate:modelValue': fn(),
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<SyTextArea
		v-model="text"
		label="Normalize text area"
		:normalize="true"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
const text = ref('')
</script>
				`,
			},
		],
	},
	decorators: [
		story => ({
			components: { story },
			template: `<div>
	<p class="pb-5">Le texte sera normalisé selon la norme NFC</p>
	<story />
</div>`,
		}),
	],
}
