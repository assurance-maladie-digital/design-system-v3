import type { Meta, StoryObj } from '@storybook/vue3'
import SyInputSelect from './SyInputSelect.vue'
import { VBtn, VMenu, VList, VListItem, VListItemTitle, VForm } from 'vuetify/components'
import { ref } from 'vue'
import SyAlert from '../../../SyAlert/SyAlert.vue'

const meta = {
	title: 'Composants/Formulaires/Selects/SyInputSelect',
	component: SyInputSelect,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['selectedValue', 'isOpen', 'toggleMenu', 'closeList', 'selectItem', 'selectedItem', 'getItemText'] },
	},
	argTypes: {
		selectedValue: { control: 'text' },
		items: { control: 'object' },
		errorMessages: { control: 'object' },
		required: { control: 'boolean' },
		outlined: { control: 'boolean' },
		textKey: { control: 'text' },
		valueKey: { control: 'text' },
		vuetifyOptions: { control: 'object' },
		displayAsterisk: { control: 'boolean' },
		readonly: { control: 'boolean' },
		bgColor: { control: 'color' },
	},
} as Meta<typeof SyInputSelect>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SyInputSelect
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
					import SyInputSelect from '@cnamts/synapse'
					import { ref } from 'vue'
					
					const items =  [
						{ text: 'Option 1', value: '1' },
						{ text: 'Option 2', value: '2' },
					],
					
					const value = ref(undefined)
				</script>
				`,
			},
		],
	},
	args: {
		items: [
			{ text: 'Option 1', value: '1' },
			{ text: 'Option 2', value: '2' },
		],
		vuetifyOptions: {
			menu: {
				color: 'primary',
			},
			option: {
				color: 'primary',
			},
		},
		readonly: false,
	},
	render: (args) => {
		return {
			components: { SyInputSelect, VBtn, VMenu, VList, VListItem, VListItemTitle },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<SyInputSelect
						v-bind="args"
						:vuetify-options="args.vuetifyOptions"
						:readonly="args.readonly"
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
					<SyInputSelect
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
					import SyInputSelect from '@cnamts/synapse'
					import { ref } from 'vue'
					
					const items =  [
						{ text: 'Option 1', value: '1' },
						{ text: 'Option 2', value: '2' },
					],
					
					const value = ref(undefined)
				</script>
				`,
			},
		],
	},
	args: {
		items: [
			{ text: 'Option 1', value: '1' },
			{ text: 'Option 2', value: '2' },
		],
		required: true,
	},
	render: (args) => {
		return {
			components: { SyInputSelect, VBtn, VMenu, VList, VListItem, VListItemTitle },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<SyInputSelect
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
  <SyInputSelect
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
import SyInputSelect from '@cnamts/synapse'

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
		label: 'Sélectionnez une option',
		required: true,
		displayAsterisk: true,
	},
	render: (args) => {
		return {
			components: { SyInputSelect },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
					<SyInputSelect
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
					<SyInputSelect
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
					import SyInputSelect from '@cnamts/synapse'
					import { ref } from 'vue'
					
					const items =  [
						{ text: 'Option 1', value: '1' },
						{ text: 'Option 2', value: '2' },
					]
					
					const errorMessages = ref([])
					
					const triggerError = () => {
						errorMessages.value = ['This is a test error message']
					}
                    
                    const value = ref(undefined)
				</script>
				`,
			},
		],
	},
	args: {
		items: [
			{ text: 'Option 1', value: '1' },
			{ text: 'Option 2', value: '2' },
		],
	},
	render: (args) => {
		return {
			components: { SyInputSelect, VBtn, VMenu, VList, VListItem, VListItemTitle },
			setup() {
				const errorMessages = ref([])
				const triggerError = () => {
					// @ts-expect-error test error message
					errorMessages.value = ['This is a test error message']
				}
				return { args, errorMessages, triggerError }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<SyInputSelect
						v-bind="args"
						:error-messages="errorMessages"
					/>
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
					<SyInputSelect
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
					import SyInputSelect from '@cnamts/synapse'
					import { ref } from 'vue'
					
					const items =  [
						{ customKey: 'Choix 1', value: '1' },
						{ customKey: 'Choix 2', value: '2' }
					]
					
					const value = ref(undefined)
				</script>
				`,
			},
		],
	},
	args: {
		items: [
			{ customKey: 'Choix 1', value: '1' },
			{ customKey: 'Choix 2', value: '2' },
		],
	},
	render: (args) => {
		return {
			components: { SyInputSelect, VBtn, VMenu, VList, VListItem, VListItemTitle },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<SyInputSelect
						v-bind="args"
						text-key="customKey"
					/>
				</div>
			`,
		}
	},
}

export const withCustomStyles: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SyInputSelect
						v-model="value"
						:items="items"
						:vuetify-options="vuetifyOptions
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import SyInputSelect from '@cnamts/synapse'
					import { ref } from 'vue'
					
					const items =  [
						{ text: 'Option 1', value: '1' },
						{ text: 'Option 2', value: '2' },
					]
					
					const vuetifyOptions = {
						menu: {
							color: 'secondary',
						},
						option: {
							color: 'secondary',
						},
					}
                    
                    const value = ref(undefined)
				</script>
				`,
			},
		],
	},
	args: {
		items: [
			{ text: 'Option 1', value: '1' },
			{ text: 'Option 2', value: '2' },
		],
		vuetifyOptions: {
			menu: {
				color: 'secondary',
			},
			option: {
				color: 'secondary',
			},
		},
	},
	render: (args) => {
		return {
			components: { SyInputSelect, VBtn, VMenu, VList, VListItem, VListItemTitle },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<SyInputSelect
						v-bind="args"
						:items="args.items"
						:vuetify-options="args.vuetifyOptions"
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
				story: 'Exemple d\'utilisation du SyInputSelect dans un formulaire avec validation.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <VForm ref="form" @submit.prevent="validateForm">
    <SyInputSelect
      ref="selectField"
      v-model="formData.option"
      :items="options"
      label="Option"
      required
      display-asterisk
      :error-messages="errorMessages"
      class="mb-1"
    />
    <VBtn
      type="submit"
      color="primary"
      class="mt-1"
    >
      Valider
    </VBtn>
  </VForm>
  <div v-if="formSubmitted" class="mt-1 success--text">
    Formulaire validé avec succès !
  </div>
</template>
        `,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import SyInputSelect from '@cnamts/synapse'
import { VBtn, VForm } from 'vuetify/components'

const form = ref(null)
const selectField = ref(null)
const formData = ref({
  option: ''
})

const errorMessages = ref([])
const formSubmitted = ref(false)

const options = [
  { text: 'Option 1', value: '1' },
  { text: 'Option 2', value: '2' },
  { text: 'Option 3', value: '3' },
]

const validateForm = () => {
  // Réinitialiser
  formSubmitted.value = false
  
  // Valider le champ avec la méthode validateOnSubmit
  const isValid = selectField.value.validateOnSubmit()
  
  if (!isValid) {
    return
  }
  
  // Si tout est valide
  formSubmitted.value = true
  console.log('Formulaire soumis:', formData.value)
}
</script>
        `,
			},
		],
	},
	args: {
		items: [
			{ text: 'Option 1', value: '1' },
			{ text: 'Option 2', value: '2' },
			{ text: 'Option 3', value: '3' },
		],
		label: 'Option',
		required: true,
		displayAsterisk: true,
	},
	render: (args) => {
		return {
			components: { SyInputSelect, VBtn, VForm },
			setup() {
				const form = ref(null)
				const selectField = ref<InstanceType<typeof SyInputSelect> | null>(null)
				const formData = ref({
					option: '',
				})

				const errorMessages = ref([])
				const formSubmitted = ref(false)

				const validateForm = () => {
					// Réinitialiser
					formSubmitted.value = false

					// Vérifier que selectField n'est pas null avant d'appeler validateOnSubmit
					if (!selectField.value) {
						console.error('La référence au champ de sélection est nulle')
						return
					}

					// Valider le champ avec la méthode validateOnSubmit
					const isValid = selectField.value.validateOnSubmit()

					if (!isValid) {
						return
					}

					// Si tout est valide
					formSubmitted.value = true
					console.log('Formulaire soumis:', formData.value)
				}

				return { args, form, selectField, formData, errorMessages, formSubmitted, validateForm }
			},
			template: `
				<div class="pa-4">
					<VForm ref="form" @submit.prevent="validateForm">
						<SyInputSelect
							ref="selectField"
							v-model="formData.option"
							v-bind="args"
							:error-messages="errorMessages"
							class="mb-1"
						/>
						<VBtn
							type="submit"
							color="primary"
							class="mt-1"
						>
							Valider
						</VBtn>
					</VForm>
					<div v-if="formSubmitted" class="mt-1 success--text">
						Formulaire validé avec succès !
					</div>
				</div>
			`,
		}
	},
}

// depreciation notice
export const DeprecationNotice = {
	render: () => ({
		components: { SyAlert },
		template: `
			<SyAlert type="warning" variant="tonal" :closable="false">
				<b>Ce composant est déprécié</b>, il ne sera plus maintenu ou mis à jour.<br/>
				Nous vous recommandons d'utiliser à la place le composant <a href="/?path=/docs/composants-formulaires-selects-syselect--docs"><code>SySelect</code></a>.
			</SyAlert>
		`,
	}),
	tags: ['!dev'],
}
