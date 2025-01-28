import type { StoryObj, Meta } from '@storybook/vue3'
import RatingPicker from './RatingPicker.vue'

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
