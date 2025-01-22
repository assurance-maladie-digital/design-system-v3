import type { StoryObj, Meta } from '@storybook/vue3'
import PasswordField from './RatingPicker.vue'

const meta = {
	title: 'Composants/Formulaires/PasswordField',
	component: PasswordField,
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
			default: null,
			table: {
				type: {
					summary: 'string | null',
				},
			},
		},
		outlined: {
			description: 'Définit la variante du champ (outlined ou underlined).',
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
		isValidateOnBlur: {
			description: 'Active ou non la validation lors du blur.',
			control: 'boolean',
			default: true,
			table: {
				type: {
					summary: 'boolean',
				},
			},
		},
		customRules: {
			description: 'Règles de validation personnalisées.',
			control: 'object',
			table: {
				type: {
					summary: 'array',
				},
			},
		},
	},
} satisfies Meta<typeof PasswordField>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Story par défaut
 */
export const Default: Story = {
	args: {
		modelValue: '',
		outlined: true,
		required: false,
		isValidateOnBlur: true,
		customRules: [],
	},
	render: (args) => {
		return {
			components: { PasswordField },
			setup() {
				return { args }
			},
			template: `
                <PasswordField v-bind="args" v-model="args.modelValue"/>
            `,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <PasswordField
    v-model="password"
    :required="false"
    :isValidateOnBlur="true"
  />
</template>
        `,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import PasswordField from '@cnamts/synapse'

const password = ref('')
</script>
        `,
			},
		],
	},
}

/**
 * Story avec champ requis
 */
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
  <PasswordField
    v-model="password"
    :required="true"
    :isValidateOnBlur="true"
  />
</template>
        `,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import PasswordField  from '@cnamts/synapse'

const password = ref('')
</script>
        `,
			},
		],
	},
}

export const WithCustomRules: Story = {
	args: {
		...Default.args,
		customRules: [
			{
				type: 'minLength',
				options: {
					length: 8,
					message: 'Le mot de passe doit comporter au moins 8 caractères.',
					successMessage: 'Le mot de passe est suffisamment long.',
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
  <PasswordField
    v-model="password"
    :required="false"
    :isValidateOnBlur="true"
    :customRules="[
      { 
        type: 'minLength', 
        options: { 
          length: 8, 
          message: 'Le mot de passe doit comporter au moins 8 caractères.', 
          successMessage: 'Le mot de passe est suffisamment long.' 
        } 
      },
    ]"
  />
</template>
        `,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import PasswordField  from '@cnamts/synapse'

const password = ref('')
</script>
        `,
			},
		],
	},
}
