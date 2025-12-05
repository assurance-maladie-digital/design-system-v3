import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import SyRadioGroup from '@/components/Customs/SyRadioGroup/SyRadioGroup/SyRadioGroup.vue'

const meta: Meta<typeof SyRadioGroup> = {
	title: 'Composants/Formulaires/SyRadioGroup',
	component: SyRadioGroup,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'centered',
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

/* -----------------------------------------------------------
 * STORY : Par défaut
 * ----------------------------------------------------------- */
export const Default: Story = {
	args: {
		label: 'Choisissez une option',
		options: [
			{ label: 'Option A', value: 'a' },
			{ label: 'Option B', value: 'b' },
			{ label: 'Option C', value: 'c' },
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

/* -----------------------------------------------------------
 * STORY : Required
 * ----------------------------------------------------------- */
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

/* -----------------------------------------------------------
 * STORY : Disabled
 * ----------------------------------------------------------- */
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

/* -----------------------------------------------------------
 * STORY : Différentes couleurs
 * ----------------------------------------------------------- */
export const CustomColors: Story = {
	render: () => ({
		components: { SyRadioGroup },
		setup() {
			const value1 = ref('a')
			const value2 = ref('a')
			const value3 = ref('a')
			return { value1, value2, value3 }
		},
		template: `
      <div>
        <SyRadioGroup v-model="value1" color="primary" label="Couleur primaire"
          :options="[{label:'A',value:'a'},{label:'B',value:'b'}]"
        />
        <SyRadioGroup v-model="value2" color="success" label="Success"
          :options="[{label:'A',value:'a'},{label:'B',value:'b'}]"
        />
        <SyRadioGroup v-model="value3" color="error" label="Erreur"
          :options="[{label:'A',value:'a'},{label:'B',value:'b'}]"
        />
      </div>
    `,
	}),
}

/* -----------------------------------------------------------
 * STORY : Densités
 * ----------------------------------------------------------- */
export const DifferentDensities: Story = {
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
          :options="[{label:'A',value:'a'},{label:'B',value:'b'}]"
        />
        <SyRadioGroup
          v-model="val2"
          density="comfortable"
          label="Comfortable"
          :options="[{label:'A',value:'a'},{label:'B',value:'b'}]"
        />
        <SyRadioGroup
          v-model="val3"
          density="compact"
          label="Compact"
          :options="[{label:'A',value:'a'},{label:'B',value:'b'}]"
        />
      </div>
    `,
	}),
}
