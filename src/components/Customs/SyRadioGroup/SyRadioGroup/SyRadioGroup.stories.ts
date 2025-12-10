import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import SyRadioGroup from '@/components/Customs/SyRadioGroup/SyRadioGroup/SyRadioGroup.vue'
import { fn } from '@storybook/test'

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
		modelValue: { control: false },
		label: { control: 'text', description: 'Label du groupe' },
		options: { control: 'object', description: 'Liste des options du radio-group' },
		disabled: { control: 'boolean', description: 'Désactive le groupe' },
		readonly: { control: 'boolean', description: 'Lecture seule' },
		required: { control: 'boolean', description: 'Indique que la sélection est obligatoire' },
		color: {
			control: 'select',
			options: ['primary', 'secondary', 'success', 'error', 'warning'],
		},
		density: {
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
				code: `  <SyRadioGroup v-model="selected" v-bind="args" />`,
			},
		],
	},
	args: {
		'label': 'Choisissez une option',
		'options': [
			{ label: 'Option A', value: 'a' },
			{ label: 'Option B', value: 'b' },
			{ label: 'Option C', value: 'c' },
		],
		'onUpdate:modelValue': fn(),
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

export const ValidationRules: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyRadioGroup
    v-model="selected"
    :options="options"
    label="Choisissez une option"
    :custom-rules="rules"
    :is-validate-on-blur="false"
  />
</template>

<script setup>
import { ref } from 'vue'

const selected = ref(null)

const options = [
  { label: 'Option A', value: 'A' },
  { label: 'Option B', value: 'B' },
]

const rules = [
  {
    type: 'custom',
    options: {
      message: 'Vous devez sélectionner une option.',
      validate: (value) => value != null,
    },
  },
]
</script>`,
			},
			{
				name: 'Script',
				code: `
// Composition API
export default {
  setup() {
    const selected = ref(null)

    const options = [
      { label: 'Option A', value: 'A' },
      { label: 'Option B', value: 'B' },
    ]

    const rules = [
      {
        type: 'custom',
        options: {
          message: 'Vous devez sélectionner une option.',
          validate: (value) => value != null,
        },
      },
    ]

    return {
      selected,
      options,
      rules,
    }
  }
}`,
			},
		],
		docs: {
			description: {
				story: `
### Groupe de boutons radio avec validation personnalisée  
Ce groupe de boutons radio utilise une validation personnalisée pour vérifier qu'une option est sélectionnée.
        `,
			},
		},
	},

	render: args => ({
		components: { SyRadioGroup },
		setup() {
			const selected = ref(null)

			return {
				args,
				selected,
				options: [
					{ label: 'Option A', value: 'A' },
					{ label: 'Option B', value: 'B' },
				],
				rules: [
					{
						type: 'custom',
						options: {
							message: 'Vous devez sélectionner une option.',
							validate: (value: string | null) => value != null,
						},
					},
				],
			}
		},
		template: `
      <SyRadioGroup
        v-model="selected"
        :options="options"
        label="Choisissez une option"
        :custom-rules="rules"
        :is-validate-on-blur="false"
      />
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
		components: { SyRadioGroup },
		setup() {
			const selected = ref(null)
			return { args, selected }
		},
		template: `
      <SyRadioGroup v-model="selected" v-bind="args" />
    `,
	}),
}

export const Disabled: Story = {
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
        <SyRadioGroup v-model="value1" color="primary" label="Couleur primaire (par défaut)" :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]"
        />
        <SyRadioGroup v-model="value2" color="secondary" label="Couleur secondaire" :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]"
        />
        <SyRadioGroup v-model="value3" color="success" label="Couleur succès" :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]"
        />
		  <SyRadioGroup v-model="value4" color="error" label="Couleur erreur" :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]"
        />
		  <SyRadioGroup v-model="value5" color="warning" label="Couleur avertissement" :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]"
        />
      </div>
	`,
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
        <SyRadioGroup v-model="value1" color="primary" label="Couleur primaire (par défaut)" :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]"
        />
        <SyRadioGroup v-model="value2" color="secondary" label="Couleur secondaire" :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]"
        />
        <SyRadioGroup v-model="value3" color="success" label="Couleur succès" :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]"
        />
		  <SyRadioGroup v-model="value4" color="error" label="Couleur erreur" :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]"
        />
		  <SyRadioGroup v-model="value5" color="warning" label="Couleur avertissement" :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]"
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
        />
        <SyRadioGroup
          v-model="val2"
          density="comfortable"
          label="Comfortable"
          :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]"
        />
        <SyRadioGroup
          v-model="val3"
          density="compact"
          label="Compact"
          :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]"
        />
      </div>`,
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
        />
        <SyRadioGroup
          v-model="val2"
          density="comfortable"
          label="Comfortable"
          :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]"
        />
        <SyRadioGroup
          v-model="val3"
          density="compact"
          label="Compact"
          :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]"
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
				code: `<SyRadioGroup v-model="selected" v-bind="args" label="Radio en lecture seule" />`,
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
