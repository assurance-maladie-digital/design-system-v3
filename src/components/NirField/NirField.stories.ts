import type { StoryObj, Meta } from '@storybook/vue3'
import NirField from './NirField.vue'

const meta: Meta<typeof NirField> = {
	title: 'Composants/Formulaires/NirField',
	component: NirField,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		modelValue: {
			description: 'La valeur du modèle pour le champ.',
			control: 'text',
			table: {
				type: {
					summary: 'string',
				},
			},
		},
		outlined: {
			description: 'Indique si le champ est encadré.',
			control: 'boolean',
			default: true,
			table: {
				type: {
					summary: 'boolean',
				},
			},
		},
		required: {
			description: 'Indique si le champ est requis.',
			control: 'boolean',
			default: false,
			table: {
				type: {
					summary: 'boolean',
				},
			},
		},
		nirTooltip: {
			description: 'Infobulle pour le champ NIR.',
			control: 'text',
			table: {
				type: {
					summary: 'string',
				},
			},
		},
		keyTooltip: {
			description: 'Infobulle pour le champ clé.',
			control: 'text',
			table: {
				type: {
					summary: 'string',
				},
			},
		},
		numberLabel: {
			description: 'Étiquette pour le champ numéro.',
			control: 'text',
			default: 'Numéro de sécurité sociale',
			table: {
				type: {
					summary: 'string',
				},
			},
		},
		keyLabel: {
			description: 'Étiquette pour le champ clé.',
			control: 'text',
			default: 'Clé',
			table: {
				type: {
					summary: 'string',
				},
			},
		},
		displayKey: {
			description: 'Indique si le champ clé est affiché.',
			control: 'boolean',
			default: true,
			table: {
				type: {
					summary: 'boolean',
				},
			},
		},
		showSuccessMessages: {
			description: 'Indique si les messages de succès sont affichés.',
			control: 'boolean',
			default: false,
			table: {
				type: {
					summary: 'boolean',
				},
			},
		},
		customNumberRules: {
			description: 'Règles de validation personnalisées pour le champ numéro.',
			control: 'object',
			table: {
				type: {
					summary: 'array',
				},
			},
		},
		customKeyRules: {
			description: 'Règles de validation personnalisées pour le champ clé.',
			control: 'object',
			table: {
				type: {
					summary: 'array',
				},
			},
		},
	},
} satisfies Meta<typeof NirField>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		modelValue: '',
		outlined: true,
		required: false,
		numberLabel: 'Numéro de sécurité sociale',
		keyLabel: 'Clé',
		displayKey: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
    <template>
     <NirField
      v-model="value"
      :required="false"
      numberLabel="Numéro de sécurité sociale"
      keyLabel="Clé"
      :displayKey="true"
     />
    </template>
    `,
			},
			{
				name: 'Script',
				code: `
    <script setup lang="ts">
     import NirField  from '@cnamts/synapse'
     import { ref } from 'vue'
     
     const value = ref('')
    </script>
    `,
			},
		],
	},
}

export const Required: Story = {
	args: {
		...Default.args,
		required: true,
	},
	parameters: {
		...Default.parameters,
		sourceCode: [
			{
				name: 'Template',
				code: `
    <template>
     <NirField
      v-model="value"
      :required="true"
      numberLabel="Numéro de sécurité sociale"
      keyLabel="Clé"
      :displayKey="true"
     />
    </template>
    `,
			},
			{
				name: 'Script',
				code: `
    <script setup lang="ts">
     import NirField  from '@cnamts/synapse'
     import { ref } from 'vue'
     
     const value = ref('')
    </script>
    `,
			},
		],
	},
}

export const WithoutKey: Story = {
	args: {
		...Default.args,
		displayKey: false,
	},
	parameters: {
		...Default.parameters,
		sourceCode: [
			{
				name: 'Template',
				code: `
    <template>
     <NirField
      v-model="value"
      :required="false"
      numberLabel="Numéro de sécurité sociale"
      keyLabel="Clé"
      :displayKey="false"
     />
    </template>
    `,
			},
			{
				name: 'Script',
				code: `
    <script setup lang="ts">
     import NirField  from '@cnamts/synapse'
     import { ref } from 'vue'
     
     const value = ref('')
    </script>
    `,
			},
		],
	},
}

export const WithSuccessMessages: Story = {
	args: {
		...Default.args,
		showSuccessMessages: true,
	},
	parameters: {
		...Default.parameters,
		sourceCode: [
			{
				name: 'Template',
				code: `
    <template>
     <NirField
      v-model="value"
      :required="false"
      numberLabel="Numéro de sécurité sociale"
      keyLabel="Clé"
      :showSuccessMessages="true"
     />
    </template>
    `,
			},
			{
				name: 'Script',
				code: `
    <script setup lang="ts">
     import NirField  from '@cnamts/synapse'
     import { ref } from 'vue'
     
     const value = ref('')
    </script>
    `,
			},
		],
	},
}

export const CustomRules: Story = {
	args: {
		...Default.args,
		customNumberRules: [
			{
				type: 'minLength',
				options: {
					length: 10,
					message: 'Le numéro de sécurité sociale doit avoir au moins 10 caractères.',
					successMessage: 'Le numéro de sécurité sociale a une longueur valide.',
					ignoreSpace: true,
				},
			},
		],
		customKeyRules: [
			{
				type: 'minLength',
				options: {
					length: 1,
					message: 'La clé doit avoir au moins 1 caractère.',
					successMessage: 'La clé a une longueur valide.',
				},
			},
		],
	},
	parameters: {
		...Default.parameters,
		sourceCode: [
			{
				name: 'Template',
				code: `
    <template>
     <NirField
      v-model="value"
      :required="false"
      numberLabel="Numéro de sécurité sociale"
      keyLabel="Clé"
      :displayKey="true"
      :customNumberRules="[{ type: 'minLength', options: { length: 10, ignoreSpace: true, message: 'Le numéro de sécurité sociale doit avoir au moins 10 caractères.', successMessage: 'Le numéro de sécurité sociale a une longueur valide.' } }]"
      :customKeyRules="[{ type: 'minLength', options: { length: 1, message: 'La clé doit avoir au moins 1 caractère.', successMessage: 'La clé a une longueur valide.' } }]"
     />
    </template>
    `,
			},
			{
				name: 'Script',
				code: `
    <script setup lang="ts">
     import NirField  from '@cnamts/synapse'
     import { ref } from 'vue'
     
     const value = ref('')
    </script>
    `,
			},
		],
	},
}

export const WithNumberTooltip: Story = {
	args: {
		...Default.args,
		nirTooltip: 'Ceci est un tooltip pour le champs numéro de sécurité sociale',
	},
	parameters: {
		...Default.parameters,
		sourceCode: [
			{
				name: 'Template',
				code: `
    <template>
     <NirField
      v-model="value"
      :required="false"
      numberLabel="Numéro de sécurité sociale"
      keyLabel="Clé"
      :displayKey="true"
      nirTooltip="Ceci est un tooltip pour le champs numéro de sécurité sociale"
     />
    </template>
    `,
			},
			{
				name: 'Script',
				code: `
    <script setup lang="ts">
     import NirField  from '@cnamts/synapse'
     import { ref } from 'vue'
     
     const value = ref('')
    </script>
    `,
			},
		],
	},
}

export const WithKeyTooltip: Story = {
	args: {
		...Default.args,
		keyTooltip: 'Ceci est un tooltip pour la clef du numéro de sécurité sociale',
	},
	parameters: {
		...Default.parameters,
		sourceCode: [
			{
				name: 'Template',
				code: `
    <template>
     <NirField
      v-model="value"
      :required="false"
      numberLabel="Numéro de sécurité sociale"
      keyLabel="Clé"
      :displayKey="true"
      keyTooltip="Ceci est un tooltip pour la clef du numéro de sécurité sociale"
     />
    </template>
    `,
			},
			{
				name: 'Script',
				code: `
    <script setup lang="ts">
     import NirField from '@cnamts/synapse'
     import { ref } from 'vue'
     
     const value = ref('')
    </script>
    `,
			},
		],
	},
}
