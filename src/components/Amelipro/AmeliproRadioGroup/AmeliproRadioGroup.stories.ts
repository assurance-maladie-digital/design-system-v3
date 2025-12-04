import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'
import AmeliproRadioGroup from './AmeliproRadioGroup.vue'
// --- LabelInfo ---
import AmeliproTooltips from '../AmeliproTooltips/AmeliproTooltips.vue'
import AmeliproBtn from '../AmeliproBtn/AmeliproBtn.vue'

const meta = {
	argTypes: {
		'`append-${index}`': { description: 'Permet de rajouter un élément après le label des boutons radios, il y a un slot par item de la liste' },
		'`subItem-${index}`': { description: 'Permet de rajouter un élément sous un bouton radio seulement lorsqu’il est coché (existe seulement si les props horizontal et fullHorizontal sont à false)' },
		'append': { description: 'Permet de rajouter un élément générique après le label des boutons radios' },
		'required': { description: 'Permet de rendre la selection obligatoire' },
		'change:selected': { description: 'Événement émis au click sur un bouton radio retourne la valeur sélectionnée' },
		'disabled': { description: 'Permet de désactiver le groupe de boutons radios' },
		'error': { description: 'Permet de mettre le champ en erreur' },
		'fullHorizontal': { description: 'Permet d’afficher le radioGroup ainsi que le titre a l’horizontal' },
		'groupLabel': { description: 'Libellé du groupe de boutons radios' },
		'hiddenLabel': { description: 'Permet de masquer le label du groupe de checkbox, dans une démarche d’amélioration de l’accessibilité, il est recommandé de ne pas utiliser cette property dans la mesure du possible' },
		'horizontal': { description: 'Permet d’afficher le radioGroup à l’horizontal' },
		'horizontalLabel': { description: 'Permet d’afficher le radioGroup avec le label à l’horizontal tout en gardant les boutons radios sous forme de colonnes' },
		'labelInfo': { description: 'Slot pour ajouter une tooltip après le label du groupe si besoin' },
		'modelValue': {
			description: 'Tableau d’objets qui permet de générer les boutons radios',
			table: {
				type: {
					detail: `Array<{
	isChecked: boolean;
	label: string;
    value: string;
}[]>`,
					summary: 'AmeliproRadioGroupItem[]',
				},
			},
		},
		'pills': { description: 'Change le style du groupe de bouttons radio' },
		'requiredErrorMessage': { description: 'Message d’erreur qui s’affiche si le champ est obligatoire et qu’aucune valeur n’est sélectionnée' },
		'subItem': { description: 'Permet de rajouter un élément générique sous un bouton radio seulement lorsqu’il est coché (existe seulement si les props horizontal et fullHorizontal sont à false)' },
		'uniqueId': { description: 'Id du groupe de boutons radios, il doit être unique' },
		'update:model-value': { description: 'Événement émis au changement du v-model' },
	},
	component: AmeliproRadioGroup,
	title: 'Composants/Amelipro/Formulaires/AmeliproRadioGroup',
} as Meta<typeof AmeliproRadioGroup>

export default meta

type Story = StoryObj<typeof AmeliproRadioGroup>

const items = [
	{
		isChecked: false,
		label: '1',
		value: 'Valeur 1',
	},
	{
		isChecked: false,
		label: '2',
		value: 'Valeur 2',
	},
	{
		isChecked: true,
		label: '3',
		value: 'Valeur 3',
	},
	{
		isChecked: false,
		label: '4',
		value: 'Valeur 4',
	},
	{
		isChecked: false,
		label: '5',
		value: 'Valeur 5',
	},
]

export const Default: Story = {
	args: {
		groupLabel: 'Libellé du groupe',
		modelValue: items,
		uniqueId: 'radio-id',
	},
	parameters: {
		args: {},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproRadioGroup
		v-model="items"
		group-label="Libellé du groupe"
		unique-id="radio-id"
	/>
</template>`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	import { ref } from 'vue'
	import { AmeliproRadioGroup } from '@cnamts/synapse'

	const items = ref([
		{
			isChecked: false,
			label: '1',
			value: 'Valeur 1',
		},
		{
			isChecked: false,
			label: '2',
			value: 'Valeur 2',
		},
		{
			isChecked: true,
			label: '3',
			value: 'Valeur 3',
		},
		{
			isChecked: false,
			label: '4',
			value: 'Valeur 4',
		},
		{
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
		components: { AmeliproRadioGroup },
		setup() {
			const model = ref(args.modelValue)

			// Optional: Keeps v-model in sync with storybook args
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
<AmeliproRadioGroup
	v-bind="args"
	v-model="model"
/>`,
	}),
}

// --- Disabled ---
export const Disabled: Story = {
	args: {
		groupLabel: 'Groupe désactivé',
		modelValue: items,
		uniqueId: 'radio-disabled',
		disabled: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le groupe de boutons radios est entièrement désactivé grâce à la prop <code>disabled</code>.</p>
  <AmeliproRadioGroup
    v-model="value"
    group-label="Groupe désactivé"
    unique-id="radio-disabled"
    disabled
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { AmeliproRadioGroup } from '@cnamts/synapse'
  const value = ref(${JSON.stringify(items, null, 2)})
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproRadioGroup },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Le groupe de boutons radios est entièrement désactivé grâce à la prop <code>disabled</code>.</p>
<AmeliproRadioGroup v-bind="args" v-model="model" />`,
	}),
}

// --- Required ---
export const Required: Story = {
	args: {
		groupLabel: 'Sélection obligatoire',
		modelValue: items,
		uniqueId: 'radio-required',
		required: true,
		error: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>La sélection d’un bouton est obligatoire grâce à la prop <code>required</code>.</p>
  <AmeliproRadioGroup
    v-model="value"
    group-label="Sélection obligatoire"
    unique-id="radio-required"
    required
    :error:"true"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { AmeliproRadioGroup } from '@cnamts/synapse'
  const value = ref(${JSON.stringify(items, null, 2)})
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproRadioGroup, AmeliproBtn },
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
		template: `<p class="mb-2">La sélection d’un bouton est obligatoire grâce à la prop <code>required</code>.</p>
        <AmeliproRadioGroup v-bind="args" v-model="model"/>
        <AmeliproBtn class="mt-4" @click="deselect">Tout désélectionner</AmeliproBtn>`,
	}),
}

// --- Erreur personnalisée ---
export const RequiredErrorMessage: Story = {
	args: {
		groupLabel: 'Erreur personnalisée',
		modelValue: items,
		uniqueId: 'radio-errormsg',
		required: true,
		requiredErrorMessage: 'Veuillez sélectionner une option',
		error: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Message d’erreur personnalisé via la prop <code>requiredErrorMessage</code>.</p>
  <AmeliproRadioGroup
    v-model="value"
    group-label="Erreur personnalisée"
    unique-id="radio-errormsg"
    required
    :error="true"
    required-error-message="Veuillez sélectionner une option"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { AmeliproRadioGroup } from '@cnamts/synapse'
  const value = ref(${JSON.stringify(items, null, 2)})
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproRadioGroup, AmeliproBtn },
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
		template: `<p class="mb-2">Message d’erreur personnalisé via la prop <code>requiredErrorMessage</code>.</p>
        <AmeliproRadioGroup v-bind="args" v-model="model"/>
        <AmeliproBtn class="mt-4" @click="deselect">Tout désélectionner</AmeliproBtn>`,
	}),
}

// --- Pills ---
export const Pills: Story = {
	args: {
		groupLabel: 'Affichage pills',
		modelValue: items,
		uniqueId: 'radio-pills',
		pills: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Affichage du groupe en mode <code>pills</code> grâce à la prop <code>pills</code>.</p>
  <AmeliproRadioGroup
    v-model="value"
    group-label="Affichage pills"
    unique-id="radio-pills"
    pills
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { AmeliproRadioGroup } from '@cnamts/synapse'
  const value = ref(${JSON.stringify(items, null, 2)})
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproRadioGroup },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Affichage du groupe en mode <code>pills</code> grâce à la prop <code>pills</code>.</p>
<AmeliproRadioGroup v-bind="args" v-model="model" />`,
	}),
}

// --- Horizontal ---
export const Horizontal: Story = {
	args: {
		groupLabel: 'Affichage horizontal',
		modelValue: items,
		uniqueId: 'radio-horizontal',
		horizontal: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Affichage horizontal du groupe grâce à la prop <code>horizontal</code>.</p>
  <AmeliproRadioGroup
    v-model="value"
    group-label="Affichage horizontal"
    unique-id="radio-horizontal"
    horizontal
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { AmeliproRadioGroup } from '@cnamts/synapse'
  const value = ref(${JSON.stringify(items, null, 2)})
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproRadioGroup },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Affichage horizontal du groupe grâce à la prop <code>horizontal</code>.</p>
<AmeliproRadioGroup v-bind="args" v-model="model" />`,
	}),
}

// --- FullHorizontal ---
export const FullHorizontal: Story = {
	args: {
		groupLabel: 'Affichage full horizontal',
		modelValue: items,
		uniqueId: 'radio-fullhorizontal',
		fullHorizontal: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Affichage full horizontal du groupe grâce à la prop <code>fullHorizontal</code>.</p>
  <AmeliproRadioGroup
    v-model="value"
    group-label="Affichage full horizontal"
    unique-id="radio-fullhorizontal"
    full-horizontal
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { AmeliproRadioGroup } from '@cnamts/synapse'
  const value = ref(${JSON.stringify(items, null, 2)})
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproRadioGroup },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Affichage full horizontal du groupe grâce à la prop <code>fullHorizontal</code>.</p>
<AmeliproRadioGroup v-bind="args" v-model="model" />`,
	}),
}

// --- HorizontalLabel ---
export const HorizontalLabel: Story = {
	args: {
		groupLabel: 'Label à l’horizontal',
		modelValue: items,
		uniqueId: 'radio-horizontal-label',
		horizontalLabel: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Affichage du label à l’horizontal grâce à la prop <code>horizontalLabel</code>.</p>
  <AmeliproRadioGroup
    v-model="value"
    group-label="Label à l’horizontal"
    unique-id="radio-horizontal-label"
    horizontal-label
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { AmeliproRadioGroup } from '@cnamts/synapse'
  const value = ref(${JSON.stringify(items, null, 2)})
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproRadioGroup },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Affichage du label à l’horizontal grâce à la prop <code>horizontalLabel</code>.</p>
<AmeliproRadioGroup v-bind="args" v-model="model" />`,
	}),
}

// --- HiddenLabel ---
export const HiddenLabel: Story = {
	args: {
		groupLabel: 'Label masqué',
		modelValue: items,
		uniqueId: 'radio-hidden-label',
		hiddenLabel: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le label du groupe est masqué grâce à la prop <code>hiddenLabel</code>.</p>
  <AmeliproRadioGroup
    v-model="value"
    group-label="Label masqué"
    unique-id="radio-hidden-label"
    hidden-label
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { AmeliproRadioGroup } from '@cnamts/synapse'
  const value = ref(${JSON.stringify(items, null, 2)})
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproRadioGroup },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Le label du groupe est masqué grâce à la prop <code>hiddenLabel</code>.</p>
<AmeliproRadioGroup v-bind="args" v-model="model" />`,
	}),
}

export const LabelInfo: Story = {
	args: {
		groupLabel: 'Label avec info-bulle',
		modelValue: items,
		uniqueId: 'radio-labelinfo',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le slot <code>labelInfo</code> permet d’ajouter une info-bulle au label du groupe.</p>
  <AmeliproRadioGroup
    v-model="value"
    group-label="Label avec info-bulle"
    unique-id="radio-labelinfo"
  >
    <template #labelInfo>
      <AmeliproTooltips
        tooltip-text="Info-bulle personnalisée"
        unique-id="amelipro-tooltip-id"
      />
    </template>
  </AmeliproRadioGroup>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { AmeliproRadioGroup } from '@cnamts/synapse'
  import { AmeliproTooltips } from '@cnamts/synapse'
  const value = ref(${JSON.stringify(items, null, 2)})
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproRadioGroup, AmeliproTooltips },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Le slot <code>labelInfo</code> permet d’ajouter une info-bulle au label du groupe.</p>
<AmeliproRadioGroup v-bind="args" v-model="model">
  <template #labelInfo>
    <AmeliproTooltips
      tooltip-text="Info-bulle personnalisée"
      unique-id="amelipro-tooltip-id"
    />
  </template>
</AmeliproRadioGroup>`,
	}),
}

// --- Append ---
export const Append: Story = {
	args: {
		groupLabel: 'Append générique',
		modelValue: items,
		uniqueId: 'radio-append',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le slot <code>append</code> permet d’ajouter un élément générique après chaque bouton radio.</p>
  <AmeliproRadioGroup
    v-model="value"
    group-label="Append générique"
    unique-id="radio-append"
  >
    <template #append>
      <span style="color: #0072c6;">(append générique)</span>
    </template>
  </AmeliproRadioGroup>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { AmeliproRadioGroup } from '@cnamts/synapse'
  const value = ref(${JSON.stringify(items, null, 2)})
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproRadioGroup },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Le slot <code>append</code> permet d’ajouter un élément générique après chaque bouton radio.</p>
<AmeliproRadioGroup v-bind="args" v-model="model">
  <template #append>
    <span style="color: #0072c6;">(append générique)</span>
  </template>
</AmeliproRadioGroup>`,
	}),
}

// --- Append par item ---
export const AppendPerItem: Story = {
	args: {
		groupLabel: 'Append par item',
		modelValue: items,
		uniqueId: 'radio-append-item',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le slot dynamique <code>append-\${index}</code> permet d’ajouter un élément après le label d’un bouton radio spécifique.</p>
  <AmeliproRadioGroup
    v-model="value"
    group-label="Append par item"
    unique-id="radio-append-item"
  >
    <template #append-2>
      <span style="color: #e74c3c;">(append sur le 3e item)</span>
    </template>
  </AmeliproRadioGroup>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { AmeliproRadioGroup } from '@cnamts/synapse'
  const value = ref(${JSON.stringify(items, null, 2)})
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproRadioGroup },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Le slot dynamique <code>append-\${index}</code> permet d’ajouter un élément après le label d’un bouton radio spécifique.</p>
<AmeliproRadioGroup v-bind="args" v-model="model">
  <template #append-2>
    <span style="color: #e74c3c;">(append sur le 3e item)</span>
  </template>
</AmeliproRadioGroup>`,
	}),
}

// --- SubItem ---
export const SubItem: Story = {
	args: {
		groupLabel: 'SubItem générique',
		modelValue: items,
		uniqueId: 'radio-subitem',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le slot <code>subItem</code> permet d’ajouter un élément générique sous le bouton radio coché.</p>
  <AmeliproRadioGroup
    v-model="value"
    group-label="SubItem générique"
    unique-id="radio-subitem"
  >
    <template #subItem>
      <span style="color: #16a085;">(subItem générique)</span>
    </template>
  </AmeliproRadioGroup>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { AmeliproRadioGroup } from '@cnamts/synapse'
  const value = ref(${JSON.stringify(items, null, 2)})
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproRadioGroup },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Le slot <code>subItem</code> permet d’ajouter un élément générique sous le bouton radio coché.</p>
<AmeliproRadioGroup v-bind="args" v-model="model">
  <template #subItem>
    <span style="color: #16a085;">(subItem générique)</span>
  </template>
</AmeliproRadioGroup>`,
	}),
}

// --- SubItem par item ---
export const SubItemPerItem: Story = {
	args: {
		groupLabel: 'SubItem par item',
		modelValue: items,
		uniqueId: 'radio-subitem-item',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le slot dynamique <code>subItem-\${index}</code> permet d’ajouter un élément sous un bouton radio spécifique coché.</p>
  <AmeliproRadioGroup
    v-model="value"
    group-label="SubItem par item"
    unique-id="radio-subitem-item"
  >
    <template #subItem-2>
      <span style="color: #f39c12;">(subItem sur le 3e item)</span>
    </template>
  </AmeliproRadioGroup>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { AmeliproRadioGroup } from '@cnamts/synapse'
  const value = ref(${JSON.stringify(items, null, 2)})
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproRadioGroup },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Le slot dynamique <code>subItem-\${index}</code> permet d’ajouter un élément sous un bouton radio spécifique coché.</p>
<AmeliproRadioGroup v-bind="args" v-model="model">
  <template #subItem-2>
    <span style="color: #f39c12;">(subItem sur le 3e item)</span>
  </template>
</AmeliproRadioGroup>`,
	}),
}
