import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import SyRadioGroup from '@/components/Customs/SyRadioGroup/SyRadioGroup.vue'
import SyForm from '../SyForm/SyForm.vue'
import { VBtn } from 'vuetify/components'

const meta: Meta<typeof SyRadioGroup> = {
	title: 'Composants/Formulaires/SyRadioGroup',
	component: SyRadioGroup,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: `
SyRadioGroup est un composant de groupe de boutons radio.
Il permet de choisir **une seule valeur** parmi une liste d’options.
        `,
			},
		},
	},
	argTypes: {
		'modelValue': { control: false },
		'onUpdate:modelValue': { action: 'update:modelValue' },
		'onChange': { action: 'change' },
		'label': { control: 'text', description: 'Label du groupe' },
		'options': { control: 'object', description: 'Liste des options du radio-group' },
		'disabled': { control: 'boolean', description: 'Désactive le groupe' },
		'readonly': { control: 'boolean', description: 'Lecture seule' },
		'required': { control: 'boolean', description: 'Indique que la sélection est obligatoire' },
		'color': {
			control: 'select',
			options: ['primary', 'secondary', 'success', 'error', 'warning'],
		},
		'density': {
			control: 'select',
			options: ['default', 'comfortable', 'compact'],
		},
	},
}

export default meta
type Story = StoryObj<typeof SyRadioGroup>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
                  <SyRadioGroup
                    v-model="selected"
                    label="Choisissez une option"
                    :options="options"
                  />
                `,
			},
			{
				name: 'Script',
				code: `
              <script setup lang="ts">
                import { ref } from 'vue'
                import { SyRadioGroup } from '@cnamts/synapse'

                const selected = ref('a')

                const options = [
                    { label: 'Option A', value: 'a' },
                    { label: 'Option B', value: 'b' },
                    { label: 'Option C', value: 'c' },
                ]
              </script>
            `,
			},
		],
	},
	args: {
		label: 'Choisissez une option',
		options: [
			{ label: 'Option A', value: 'a' },
			{ label: 'Option B', value: 'b' },
			{ label: 'Option C', value: 'c' },
		],
		showSuccessMessages: true,
	},

	render: args => ({
		components: { SyRadioGroup },
		setup() {
			const selected = ref('a')
			return { args, selected }
		},
		template: `
      <SyRadioGroup v-model="selected" v-bind="args" />
    `,
	}),
}

export const Required: Story = {
	args: {
		label: 'Choisissez une option (obligatoire)',
		required: true,
		options: [
			{ label: 'Option A', value: 'a' },
			{ label: 'Option B', value: 'b' },
		],
	},

	render: args => ({
		components: { SyRadioGroup, SyForm, VBtn },
		setup() {
			const selected = ref(null)
			return { args, selected }
		},
		template: `
		<SyForm ref="form" @submit="onSubmit">
          <SyRadioGroup v-model="selected" required v-bind="args" />
          <v-btn type="submit" class="mt-2 mr-2" color="primary">Valider</v-btn>
          </SyForm>
        `,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
                <SyForm ref="form" @submit="onSubmit">
      			  <SyRadioGroup
      			    v-model="selected"
      			    label="Choisissez une option (obligatoire)"
      			    :options="options"
      			    required
      			  />
      			  <VBtn type="submit" class="mt-2 mr-2" color="primary">Valider</VBtn>
      			</SyForm>`,
			},
			{
				name: 'Script',
				code: `
              <script setup lang="ts">
                import { ref } from 'vue'
                import { VBtn } from 'vuetify/components'
                import { SyForm, SyRadioGroup } from '@cnamts/synapse'

                const selected = ref<string | null>(null)

                const options = [
                    { label: 'Option A', value: 'a' },
                    { label: 'Option B', value: 'b' },
                ]

                const onSubmit = (event: { isValid: boolean }) => {
                    if (event.isValid) {
                        alert('Formulaire valide !')
                    }
                }
             </script>
            `,
			},
		],
	},
}

export const formValidation: Story = {
	args: {
		label: 'Choisissez une option (obligatoire)',
		required: true,
		options: [
			{ label: 'Option A', value: 'a' },
			{ label: 'Option B', value: 'b' },
		],
		showSuccessMessages: true,
	},

	render: args => ({
		components: { SyRadioGroup, SyForm, VBtn },
		setup() {
			const selected = ref(null)
			const onSubmit = (event: { isValid: boolean }) => {
				if (event.isValid) {
					alert('Inscription réussie !')
				}
			}
			return { args, selected, onSubmit }
		},
		template: `
		<SyForm ref="form" @submit="onSubmit">
          <SyRadioGroup v-model="selected" required v-bind="args" />
          <v-btn type="submit" class="mt-2 mr-2" color="primary">Valider</v-btn>
        </SyForm>
    `,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
                <SyForm ref="form" @submit="onSubmit">
      			  <SyRadioGroup
      			    v-model="selected"
      			    label="Choisissez une option (obligatoire)"
      			    :options="options"
      			    required
      			  />
      			  <VBtn type="submit" class="mt-2 mr-2" color="primary">Valider</VBtn>
      			</SyForm>`,
			},
			{
				name: 'Script',
				code: `
              <script setup lang="ts">
                import { ref } from 'vue'
                import { VBtn } from 'vuetify/components'
                import { SyForm, SyRadioGroup } from '@cnamts/synapse'

                const selected = ref<string | null>(null)

                const options = [
                    { label: 'Option A', value: 'a' },
                    { label: 'Option B', value: 'b' },
                ]

                const onSubmit = (event: { isValid: boolean }) => {
                    if (event.isValid) {
                        alert('Formulaire valide !')
                    }
                }
             </script>
            `,
			},
		],
	},
}

export const Disabled: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
                <SyRadioGroup
                  v-model="selected"
                  disabled
                  label="Radio-group désactivé"
                  :options="options"
                />
              `,
			},
			{
				name: 'Script',
				code: `
              <script setup lang="ts">
                import { ref } from 'vue'
                import { SyRadioGroup } from '@cnamts/synapse'

                const selected = ref('a')

                const options = [
                    { label: 'Option A', value: 'a' },
                    { label: 'Option B', value: 'b' },
                ]
              </script>
            `,
			},
		],
	},
	args: {
		label: 'Radio-group désactivé',
		disabled: true,
		options: [
			{ label: 'Option A', value: 'a' },
			{ label: 'Option B', value: 'b' },
		],
	},

	render: args => ({
		components: { SyRadioGroup },
		setup() {
			const selected = ref('a')
			return { args, selected }
		},
		template: `
      <SyRadioGroup v-model="selected" v-bind="args" />
    `,
	}),
}

export const CustomColors: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
                <div>
                    <SyRadioGroup 
                      v-model="value1" 
                      color="primary" 
                      label="Couleur primaire (par défaut)" 
                      :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]" 
                      :show-success-messages="false"
                    />
                    <SyRadioGroup 
                      v-model="value2" 
                      color="secondary" 
                      label="Couleur secondaire" 
                      :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]"  
                      :show-success-messages="false"
                    />
                    <SyRadioGroup 
                      v-model="value3" 
                      color="success" 
                      label="Couleur succès" 
                      :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]" 
                      :show-success-messages="false"
                    />
                      <SyRadioGroup 
                        v-model="value4" 
                        color="error" 
                        label="Couleur erreur" 
                        :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]" 
                        :show-success-messages="false"
                    />
                      <SyRadioGroup 
                        v-model="value5" 
                        color="warning" 
                        label="Couleur avertissement" 
                        :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]" 
                        :show-success-messages="false"
                    />
                </div>
	`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SyRadioGroup } from '@cnamts/synapse'

const value1 = ref('a')
const value2 = ref('a')
const value3 = ref('a')
const value4 = ref('a')
const value5 = ref('a')
</script>`,
			},
		],
		docs: {
			description: {
				story: `
### Couleurs personnalisées
Le composant SyRadioGroup peut être personnalisé avec différentes couleurs pour s'adapter à votre thème.
				`,
			},
		},
	},
	render: args => ({
		components: { SyRadioGroup },
		setup() {
			const value1 = ref('a')
			const value2 = ref('a')
			const value3 = ref('a')
			const value4 = ref('a')
			const value5 = ref('a')
			return { args, value1, value2, value3, value4, value5 }
		},
		template: `
			<div>
                <SyRadioGroup 
                    v-model="value1"
                    color="primary"
                    label="Couleur primaire (par défaut)" 
                    :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]" 
                    :show-success-messages="false" 
                />
              <SyRadioGroup
                  v-model="value2"
                  color="secondary"
                    label="Couleur secondaire" 
                    :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]"  
                    :show-success-messages="false" 
                />
              <SyRadioGroup
                  v-model="value3"
                  color="success"
                    label="Couleur succès" 
                    :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]" 
                    :show-success-messages="false" 
                />
              <SyRadioGroup
                  v-model="value4"
                  color="error"
                      label="Couleur erreur" 
                      :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]" 
                      :show-success-messages="false" 
                />
                  <SyRadioGroup
                      v-model="value5"
                      color="warning"
                      label="Couleur avertissement" 
                      :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]" 
                      :show-success-messages="false" 
                />
              </div>
		`,
	}),
}

export const DifferentDensities: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
                <div>
                    <SyRadioGroup
                      v-model="val1"
                      density="default"
                      label="Default density"
                      :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]"
                      :show-success-messages="false" 
                    />
                    <SyRadioGroup
                      v-model="val2"
                      density="comfortable"
                      label="Comfortable"
                      :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]"
                      :show-success-messages="false" 
                    />
                    <SyRadioGroup
                      v-model="val3"
                      density="compact"
                      label="Compact"
                      :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]"
                      :show-success-messages="false" 
                    />
                </div>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SyRadioGroup } from '@cnamts/synapse'

const val1 = ref<string | null>(null)
const val2 = ref<string | null>(null)
const val3 = ref<string | null>(null)
</script>`,
			},
		],
		docs: {
			description: {
				story: `
### Différentes densités
Le composant SyRadioGroup prend en charge différentes densités pour s'adapter à différents contextes d'interface utilisateur.
				`,
			},
		},
	},
	render: () => ({
		components: { SyRadioGroup },
		setup() {
			const val1 = ref(null)
			const val2 = ref(null)
			const val3 = ref(null)
			return { val1, val2, val3 }
		},
		template: `
        <div>
        <SyRadioGroup
          v-model="val1"
          density="default"
          label="Default density"
          :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]"
		  :show-success-messages="false" 
        />
        <SyRadioGroup
          v-model="val2"
          density="comfortable"
          label="Comfortable"
          :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]"
		  :show-success-messages="false" 
        />
        <SyRadioGroup
          v-model="val3"
          density="compact"
          label="Compact"
          :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]"
		  :show-success-messages="false" 
        />
      </div>
    `,
	}),
}

export const Readonly: Story = {
	args: {
		readonly: true,
		options: [
			{ label: 'Option A', value: 'a' },
		],
	},
	render: args => ({
		components: { SyRadioGroup },
		setup() {
			const selected = ref('a')
			return { args, selected }
		},
		template: `<SyRadioGroup v-model="selected" v-bind="args" label="Radio en lecture seule" />`,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<SyRadioGroup 
                  v-model="selected" 
                  label="Radio en lecture seule" 
                  :options="options"
                  readonly
                />`,
			},
			{
				name: 'Script',
				code: `
              <script setup lang="ts">
                import { ref } from 'vue'
                import { SyRadioGroup } from '@cnamts/synapse'

                const selected = ref('a')

                const options = [
                    { label: 'Option A', value: 'a' },
                ]
             </script>
            `,
			},
		],
		docs: {
			description: {
				story: `
### VRadio en lecture seule
Ce button radio est en lecture seule et ne peut pas être modifiée par l'utilisateur, mais elle n'est pas visuellement désactivée comme la version disabled.
				`,
			},
		},
	},

}

export const CustomRules: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
				<SyRadioGroup
					v-model="selected"
					:options="options"
					label="Options"
					:custom-warning-rules="rules"
					:custom-success-rules="successRules"
					:is-validate-on-blur="false"
				/>
				</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SyRadioGroup } from '@cnamts/synapse'

const selected = ref('A')

const options = [
	{ label: 'Option A', value: 'A' },
	{ label: 'Option B', value: 'B' },
]

const warningRules = [
	{
		type: 'custom',
		options: {
			validate: (value: string | null) => {
				if (value !== 'A') {
					return 'Vous devez sélectionner l’option A'
				}
				return true
			},
			fieldIdentifier: 'option',
		},
	},
]

const successRules = [
	{
		type: 'custom',
		options: {
			validate: (value: string | null) => value === 'A',
			successMessage: 'Option A sélectionnée',
			fieldIdentifier: 'option',
		},
	},
]
</script>`,
			},
		],
	},

	render: args => ({
		components: { SyRadioGroup },
		setup() {
			const selected = ref('A')

			const options = [
				{ label: 'Option A', value: 'A' },
				{ label: 'Option B', value: 'B' },
			]

			const warningRules = [
				{
					type: 'custom',
					options: {
						validate: (value: string | null) => {
							if (value !== 'A') {
								return 'Vous devez sélectionner l’option A'
							}
							return true
						},
					},
				},
			]

			const successRules = [
				{
					type: 'custom',
					options: {
						validate: (value: string | null) => value === 'A',
						successMessage: 'Option A sélectionnée',
					},
				},
			]
			return {
				args,
				selected,
				options,
				warningRules,
				successRules,
			}
		},
		template: `
			<SyRadioGroup
				v-model="selected"
				label="Options"
				:options="options"
			    :custom-warning-rules="warningRules"
				:custom-success-rules="successRules"
				:is-validate-on-blur="false"
			/>
    `,
	}),
}
