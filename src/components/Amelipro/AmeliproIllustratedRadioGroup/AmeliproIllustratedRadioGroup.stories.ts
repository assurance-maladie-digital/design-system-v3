import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'
import AmeliproIllustratedRadioGroup from './AmeliproIllustratedRadioGroup.vue'
import AmeliproTooltips from '../AmeliproTooltips/AmeliproTooltips.vue'
import AmeliproBtn from '../AmeliproBtn/AmeliproBtn.vue'

const meta = {
	argTypes: {
		'ariaRequired': { description: 'Permet de rendre la selection obligatoire' },
		'change:selected': { description: 'Événement émis au click sur un bouton radio retourne la valeur sélectionnée' },
		'disabled': { description: 'Permet de désactiver le groupe de boutons radios' },
		'error': { description: 'Permet de mettre le champ en erreur' },
		'groupLabel': { description: 'Libellé du groupe de boutons radios' },
		'iconSize': { description: 'Taille des icones dans le groupe' },
		'labelInfo': { description: 'Slot pour ajouter une tooltip après le label du groupe si besoin' },
		'modelValue': {
			description: 'Tableau d’objets qui permet de générer les boutons radios',
			table: {
				type: {
					detail: `Array<{
	icon: string;
    iconDefaultColor: string;
	isChecked: boolean;
    label: string;
    value: string;
}[]>`,
					summary: 'AmeliproIllustratedRadioGroupItem[]',
				},
			},
		},
		'uniqueId': { description: 'Id du groupe de boutons radios, il doit être unique' },
		'update:model-value': { description: 'Événement émis au changement du v-model' },
	},
	component: AmeliproIllustratedRadioGroup,
	title: 'Composants/Amelipro/Formulaires/AmeliproIllustratedRadioGroup',
} as Meta<typeof AmeliproIllustratedRadioGroup>

export default meta

type Story = StoryObj<typeof AmeliproIllustratedRadioGroup>

const items = [
	{
		icon: 'vaccination',
		iconDefaultColor: 'ap-yellow',
		isChecked: true,
		label: '1',
		value: 'Valeur 1',
	},
	{
		icon: 'vaccination',
		iconDefaultColor: 'ap-green',
		isChecked: false,
		label: '2',
		value: 'Valeur 2',
	},
	{
		icon: 'vaccination',
		iconDefaultColor: 'ap-red',
		isChecked: false,
		label: '3',
		value: 'Valeur 3',
	},
	{
		icon: 'vaccination',
		iconDefaultColor: 'ap-yellow',
		isChecked: false,
		label: '4',
		value: 'Valeur 4',
	},
	{
		icon: 'vaccination',
		iconDefaultColor: 'ap-yellow',
		isChecked: false,
		label: '5',
		value: 'Valeur 5',
	},
]

export const Default: Story = {
	args: {
		groupLabel: 'Libellé du groupe',
		modelValue: items,
		uniqueId: 'unique-id',
	},
	parameters: {
		args: {},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproIllustratedRadioGroup
		v-model="value"
		group-label="Libellé du groupe"
		unique-id="unique-id"
	/>
</template>`,
			},
			{
				name: 'Scripts',
				code: `
<script setup lang="ts">
	import { inject, ref } from 'vue'
	import { AmeliproIllustratedRadioGroup } from '@cnamts/synapse'

	const value = ref([
		{
			icon: 'vaccination',
			iconDefaultColor: 'ap-yellow',
			isChecked: true,
			label: '1',
			value: 'Valeur 1',
		},
		{
			icon: 'vaccination',
			iconDefaultColor: 'ap-green',
			isChecked: false,
			label: '2',
			value: 'Valeur 2',
		},
		{
			icon: 'vaccination',
			iconDefaultColor: 'ap-red',
			isChecked: false,
			label: '3',
			value: 'Valeur 3',
		},
		{
			icon: 'vaccination',
			iconDefaultColor: 'ap-yellow',
			isChecked: false,
			label: '4',
			value: 'Valeur 4',
		},
		{
			icon: 'vaccination',
			iconDefaultColor: 'ap-yellow',
			isChecked: false,
			label: '5',
			value: 'Valeur 5',
		},
	])
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproIllustratedRadioGroup },
		setup() {
			const model = ref(args.modelValue)

			// Optional: Keeps v-model in sync with storybook args
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
<AmeliproIllustratedRadioGroup
	v-bind="args"
	v-model="model"
/>`,
	}),
}

export const Disabled: Story = {
	args: {
		groupLabel: 'Groupe désactivé',
		modelValue: items,
		uniqueId: 'illustrated-radio-disabled',
		disabled: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le groupe de boutons radios est entièrement désactivé grâce à la prop <code>disabled</code>.</p>
  <AmeliproIllustratedRadioGroup
    v-model="value"
    group-label="Groupe désactivé"
    unique-id="illustrated-radio-disabled"
    disabled
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { AmeliproIllustratedRadioGroup } from '@cnamts/synapse'
  const value = ref(${JSON.stringify(items, null, 2)})
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproIllustratedRadioGroup },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Le groupe de boutons radios est entièrement désactivé grâce à la prop <code>disabled</code>.</p>
<AmeliproIllustratedRadioGroup v-bind="args" v-model="model" />`,
	}),
}

export const Required: Story = {
	args: {
		groupLabel: 'Sélection obligatoire',
		modelValue: items,
		uniqueId: 'illustrated-radio-required',
		ariaRequired: true,
		error: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>La sélection d’un bouton est obligatoire grâce à la prop <code>ariaRequired</code>.</p>
  <AmeliproIllustratedRadioGroup
    v-model="value"
    group-label="Sélection obligatoire"
    unique-id="illustrated-radio-required"
    aria-required
    error
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { AmeliproIllustratedRadioGroup } from '@cnamts/synapse'
  const value = ref(${JSON.stringify(items, null, 2)})
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproIllustratedRadioGroup, AmeliproBtn },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			const deselect = () => {
				model.value = model.value.map(item => ({
					...item,
					isChecked: false,
				}))
			}
			return { args, model, deselect }
		},
		template: `<p class="mb-2">La sélection d’un bouton est obligatoire grâce à la prop <code>ariaRequired</code>.</p>
        <AmeliproIllustratedRadioGroup v-bind="args" v-model="model"/>
        <AmeliproBtn class="mt-4" @click="deselect">Tout désélectionner</AmeliproBtn>`,
	}),
}

export const IconSize: Story = {
	args: {
		groupLabel: 'Taille d’icône personnalisée',
		modelValue: items,
		uniqueId: 'illustrated-radio-iconsize',
		iconSize: '100px',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>La taille des icônes est personnalisée via la prop <code>iconSize</code>.</p>
  <AmeliproIllustratedRadioGroup
    v-model="value"
    group-label="Taille d’icône personnalisée"
    unique-id="illustrated-radio-iconsize"
    icon-size="100px"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { AmeliproIllustratedRadioGroup } from '@cnamts/synapse'
  const value = ref(${JSON.stringify(items, null, 2)})
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproIllustratedRadioGroup },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">La taille des icônes est personnalisée via la prop <code>iconSize</code>.</p>
<AmeliproIllustratedRadioGroup v-bind="args" v-model="model" />`,
	}),
}

export const LabelInfo: Story = {
	args: {
		groupLabel: 'Label avec info-bulle',
		modelValue: items,
		uniqueId: 'illustrated-radio-labelinfo',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le slot <code>labelInfo</code> permet d’ajouter une info-bulle au label du groupe.</p>
  <AmeliproIllustratedRadioGroup
    v-model="value"
    group-label="Label avec info-bulle"
    unique-id="illustrated-radio-labelinfo"
  >
	<template #labelInfo>
		<AmeliproTooltips
			tooltip-text="Info-bulle personnalisée"
			unique-id="amelipro-tooltip-id"
		/>
	</template>
  </AmeliproIllustratedRadioGroup>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { AmeliproIllustratedRadioGroup } from '@cnamts/synapse'
  const value = ref(${JSON.stringify(items, null, 2)})
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproIllustratedRadioGroup, AmeliproTooltips },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Le slot <code>labelInfo</code> permet d’ajouter une info-bulle au label du groupe.</p>
<AmeliproIllustratedRadioGroup v-bind="args" v-model="model">
  <template #labelInfo>
    <AmeliproTooltips
        tooltip-text="Info-bulle personnalisée"
        unique-id="amelipro-tooltip-id"
    />
  </template>
</AmeliproIllustratedRadioGroup>`,
	}),
}
