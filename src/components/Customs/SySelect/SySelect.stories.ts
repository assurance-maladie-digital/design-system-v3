import type { Meta, StoryObj } from '@storybook/vue3'
import SySelect from '@/components/Customs/SySelect/SySelect.vue'
import SyAlert from '@/components/SyAlert/SyAlert.vue'
import { VBtn, VMenu, VList, VListItem, VListItemTitle, VForm } from 'vuetify/components'
import { ref } from 'vue'
import { fn } from '@storybook/test'

const meta: Meta<typeof SySelect> = {
	title: 'Composants/Formulaires/SySelect',
	component: SySelect,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['selectedValue', 'isOpen', 'closeList'] },
	},
	argTypes: {
		selectedValue: { control: 'text' },
		items: { control: 'object' },
		errorMessages: { control: 'object' },
		required: { control: 'boolean' },
		displayAsterisk: { control: 'boolean' },
		textKey: {
			control: 'text',
			description: 'Nom de la propriété qui contient le texte à afficher',
		},
		valueKey: {
			control: 'text',
			description: 'Nom de la propriété qui contient la valeur à retourner',
		},
		returnObject: {
			control: 'boolean',
			description: 'Retourne l\'objet complet sélectionné',
		},
		clearable: {
			control: 'boolean',
			description: 'Permet de vider la sélection',
		},
		hideMessages: {
			control: 'boolean',
			description: 'Masque les messages d\'erreur',
		},
		density: {
			control: 'select',
			options: ['default', 'comfortable', 'compact'],
			description: 'Définit la densité du champ de sélection',
		},
		width: {
			control: 'text',
			description: 'Permet de définir une largeur personnalisée pour le champ de sélection (en px)',
		},
	},
} as Meta<typeof SySelect>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SySelect
						v-model="value"
						:items="items"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import SySelect from '@cnamts/SySelect'
					
					const items =  [
						{ text: 'Option 1', value: '1' },
						{ text: 'Option 2', value: '2' },
					],
				</script>
				`,
			},
		],
	},
	args: {
		'items': [
			{ text: 'Option 1', value: '1' },
			{ text: 'Option 2', value: '2' },
		],
		'onUpdate:modelValue': fn(),
	},
	render: (args) => {
		return {
			components: { SySelect, VBtn, VMenu, VList, VListItem, VListItemTitle },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
					<SySelect
						v-bind="args"
					/>
				</div>
				<br/><br/><br/><br/>
			`,
		}
	},
}

export const Required: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SySelect
						v-model="value"
						:items="items"
						required
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import SySelect from '@cnamts/SySelect'
					
					const items =  [
						{ text: 'Option 1', value: '1' },
						{ text: 'Option 2', value: '2' },
					],
				</script>
				`,
			},
		],
	},
	args: {
		'items': [
			{ text: 'Option 1', value: '1' },
			{ text: 'Option 2', value: '2' },
		],
		'required': true,
		'onUpdate:modelValue': fn(),
	},
	render: (args) => {
		return {
			components: { SySelect },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
					<SySelect
						v-bind="args"
						:required="args.required"
					/>
				</div>
			`,
		}
	},
}

export const RequiredWithAsterisk: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Version du champ de sélection requis avec un astérisque visuel.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SySelect
    v-model="value"
    :items="items"
    label="Sélectionnez une option"
    required
    display-asterisk
  />
</template>
        `,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import SySelect from '@cnamts/synapse'

const value = ref('')
const items = [
  { text: 'Option 1', value: '1' },
  { text: 'Option 2', value: '2' },
]
</script>
        `,
			},
		],
	},
	args: {
		...Default.args,
		'label': 'Sélectionnez une option',
		'required': true,
		'displayAsterisk': true,
		'onUpdate:modelValue': fn(),
	},
	render: (args) => {
		return {
			components: { SySelect },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
					<SySelect
						v-bind="args"
						:required="args.required"
						:display-asterisk="args.displayAsterisk"
					/>
				</div>
			`,
		}
	},
}

export const withCustomError: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SySelect
						v-model="value"
						:items="items"
						:error-messages="errorMessages"
					/>
					<VBtn @click="triggerError">
						Trigger Error
					</VBtn>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import SySelect from '@cnamts/SySelect'
					import { ref } from 'vue'
					
					const items =  [
						{ text: 'Option 1', value: '1' },
						{ text: 'Option 2', value: '2' },
					],
					
					const errorMessages = ref([])
					
					const triggerError = () => {
						errorMessages.value = ['This is a test error message']
					}
				</script>
				`,
			},
		],
	},
	args: {
		'items': [
			{ text: 'Option 1', value: '1' },
			{ text: 'Option 2', value: '2' },
		],
		'onUpdate:modelValue': fn(),
	},
	render: (args) => {
		return {
			components: { SySelect, VBtn, VMenu, VList, VListItem, VListItemTitle },
			setup() {
				const errorMessages = ref([])
				const triggerError = () => {
					// @ts-expect-error test error message
					errorMessages.value = ['This is a test error message']
				}
				return { args, errorMessages, triggerError }
			},
			template: `
				<div class="pa-4">
					<SySelect
						v-bind="args"
						:error-messages="errorMessages"
					/>
				</div>
				<div class="px-4">
					<VBtn @click="triggerError">
						Trigger Error
					</VBtn>
				</div>
			`,
		}
	},
}

export const withCustomKey: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
					<template>
						<SySelect
							v-model="value"
							:items="items"
							text-key="customKey"
						/>
					</template>
					`,
			},
			{
				name: 'Script',
				code: `
					<script setup lang="ts">
						import SySelect from '@cnamts/SySelect'
						
						const items =  [
							{ customKey: 'Choix 1', value: '1' },
							{ customKey: 'Choix 2', value: '2' },
						],
					</script>
					`,
			},
		],
	},
	args: {
		'items': [
			{ customKey: 'Choix 1', value: '1' },
			{ customKey: 'Choix 2', value: '2' },
		],
		'onUpdate:modelValue': fn(),
	},
	render: (args) => {
		return {
			components: { SySelect, VBtn, VMenu, VList, VListItem, VListItemTitle },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
					<SySelect
						v-bind="args"
						text-key="customKey"
					/>
				</div>
			`,
		}
	},
}

export const Info: Story = {
	render: (args) => {
		return {
			components: { SyAlert },
			setup() {
				return { args }
			},
			template: `
				<SyAlert v-model="args.modelValue" :type="args.type" :variant="tonal" :closable="false">
					<template #default>
						<b>Format des items :</b>
						<ul>
							<li>- Si les items passés en props sont des objets, le composant les utilisera directement.</li>
							<li>- Si les items sont un tableau de string, le composant les utilisera directement.</li>
						</ul>
					</template>
					</SyAlert>
			`,
		}
	},
	tags: ['!dev'],
}

export const FormValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Exemple d\'utilisation du SySelect dans un formulaire.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <VForm @submit.prevent="submitForm">
    <SySelect
      v-model="formData.option"
      :items="options"
      label="Option"
      required
      display-asterisk
      class="mb-4"
    />
    <VBtn
      type="submit"
      color="primary"
      class="mt-4"
    >
      Soumettre
    </VBtn>
  </VForm>
</template>
        `,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import SySelect from '@cnamts/synapse'
import { VBtn, VForm } from 'vuetify/components'

const formData = ref({
  option: ''
})

const options = [
  { text: 'Option 1', value: '1' },
  { text: 'Option 2', value: '2' },
  { text: 'Option 3', value: '3' },
]

const submitForm = () => {
  // Traitement du formulaire
  console.log('Formulaire soumis:', formData.value)
}
</script>
        `,
			},
		],
	},
	args: {
		'items': [
			{ text: 'Option 1', value: '1' },
			{ text: 'Option 2', value: '2' },
			{ text: 'Option 3', value: '3' },
		],
		'label': 'Option',
		'required': true,
		'displayAsterisk': true,
		'onUpdate:modelValue': fn(),
	},
	render: (args) => {
		return {
			components: { SySelect, VBtn, VForm },
			setup() {
				const formData = ref({
					option: '',
				})

				const submitForm = () => {
					console.log('Formulaire soumis:', formData.value)
				}

				return { args, formData, submitForm }
			},
			template: `
				<div class="pa-4">
					<VForm @submit.prevent="submitForm">
						<SySelect
							v-model="formData.option"
							v-bind="args"
							class="mb-4"
						/>
						<VBtn
							type="submit"
							color="primary"
							class="mt-4"
						>
							Soumettre
						</VBtn>
					</VForm>
				</div>
			`,
		}
	},
}
