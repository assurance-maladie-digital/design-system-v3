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
				exclude: ['validateOn', 'update:modelValue', 'onUpdate:modelValue'],
			},
		},
		controls: {
			exclude: ['validateOn', 'onUpdate:modelValue'],
		},
	},
	argTypes: {
		label: {
			control: { type: 'text' },
			description: 'Texte affiché au-dessus du champ',
			table: {
				type: { summary: 'string' },
				defaultValue: { summary: 'undefined' },
				category: 'props',
			},
		},
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
		color: {
			control: { type: 'text' },
			description: 'Couleur du champ',
			table: {
				type: { summary: 'string' },
				defaultValue: { summary: 'primary' },
			},
		},
		variant: {
			control: { type: 'select' },
			options: ['filled', 'outlined', 'underlined'],
			description: 'Type de champ',
			table: {
				type: { summary: 'string' },
				defaultValue: { summary: 'outlined' },
			},
		},
		required: {
			control: { type: 'boolean' },
			description: 'Indique si le champ est requis',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
				category: 'validation',
			},
		},
		rules: {
			control: { type: 'object' },
			description: 'Règles de validation Vuetify (mode useVuetifyValidation=true)',
			table: {
				type: { summary: 'Array<(value: string) => boolean | string>' },
				defaultValue: { summary: '[]' },
				category: 'validation',
			},
		},
		useVuetifyValidation: {
			control: { type: 'boolean' },
			description: 'Active la validation Vuetify (sinon validation unifiée customRules)',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
				category: 'validation',
			},
		},
		isValidateOnBlur: {
			control: { type: 'boolean' },
			description: 'Déclenche la validation au blur (sinon à la saisie)',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'true' },
				category: 'validation',
			},
		},
		disableErrorHandling: {
			control: { type: 'boolean' },
			description: 'Désactive la gestion des messages d\'erreur/alerte/succès',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
				category: 'validation',
			},
		},
		showSuccessMessages: {
			control: { type: 'boolean' },
			description: 'Affiche les messages de succès',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'true' },
				category: 'validation',
			},
		},
		customRules: {
			control: { type: 'object' },
			description: 'Règles d\'erreur pour le mode validation unifiée',
			table: {
				type: { summary: 'ValidationRule[]' },
				defaultValue: { summary: '[]' },
				category: 'validation',
			},
		},
		customWarningRules: {
			control: { type: 'object' },
			description: 'Règles d\'alerte pour le mode validation unifiée',
			table: {
				type: { summary: 'ValidationRule[]' },
				defaultValue: { summary: '[]' },
				category: 'validation',
			},
		},
		customSuccessRules: {
			control: { type: 'object' },
			description: 'Règles de succès pour le mode validation unifiée',
			table: {
				type: { summary: 'ValidationRule[]' },
				defaultValue: { summary: '[]' },
				category: 'validation',
			},
		},
		errorMessages: {
			control: { type: 'object' },
			description: 'Messages d\'erreur externes ajoutés au résultat de validation',
			table: {
				type: { summary: 'string[] | null' },
				defaultValue: { summary: 'null' },
				category: 'validation',
			},
		},
		warningMessages: {
			control: { type: 'object' },
			description: 'Messages d\'alerte externes ajoutés au résultat de validation',
			table: {
				type: { summary: 'string[] | null' },
				defaultValue: { summary: 'null' },
				category: 'validation',
			},
		},
		successMessages: {
			control: { type: 'object' },
			description: 'Messages de succès externes ajoutés au résultat de validation',
			table: {
				type: { summary: 'string[] | null' },
				defaultValue: { summary: 'null' },
				category: 'validation',
			},
		},
		hasError: {
			control: { type: 'boolean' },
			description: 'Force l\'état erreur',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
				category: 'validation',
			},
		},
		hasWarning: {
			control: { type: 'boolean' },
			description: 'Force l\'état alerte',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
				category: 'validation',
			},
		},
		hasSuccess: {
			control: { type: 'boolean' },
			description: 'Force l\'état succès',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
				category: 'validation',
			},
		},
		maxErrors: {
			control: { type: 'number' },
			description: 'Nombre maximum de messages d\'erreur affichés',
			table: {
				type: { summary: 'number' },
				defaultValue: { summary: '1' },
				category: 'validation',
			},
		},
	},
} satisfies Meta<typeof SyTextArea & typeof VTextarea>

export default meta
type Story = StoryObj<Meta<typeof SyTextArea & typeof VTextarea>>

export const Default: Story = {
	args: {
		'label': 'Texte',
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

export const Required: Story = {
	args: {
		'label': 'Texte requis',
		'required': true,
		'onUpdate:modelValue': fn(),
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<SyTextArea
		v-model="text"
		label="Texte requis"
		:required="true"
		style="width: 100%"
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
}

export const Trim: Story = {
	args: {
		'label': 'Trim text area',
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
	<p class="pb-5">Les espaces, tabulations et retours a la lignes de début et fin de champ seront retirés</p>
	<story />
</div>`,
		}),
	],
}

export const ReplaceTabs: Story = {
	args: {
		'label': 'Replace tabs text area',
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
		'label': 'Max lines text area',
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
		'label': 'Auto wrap text area',
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
		'label': 'Normalize text area',
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
