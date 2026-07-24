import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
import { ref } from 'vue'
import { fn } from 'storybook/test'
import { getValidationDocumentation } from '@/composables/unifyValidation/documentationValidationProps'
import { useTriStateCheckboxGroup } from './triStateCheckboxGroup'

const meta = {
	title: 'Composants/Formulaires/SyCheckbox',
	component: SyCheckbox,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['modelValue', 'errorMessages', 'warningMessages', 'successMessages', 'onUpdate:modelValue', 'onUpdate:indeterminate', 'undefined'] },
		docs: {
			description: {
				component: `SyCheckbox est un composant de case à cocher tri-état qui étend le composant VCheckbox de Vuetify avec des fonctionnalités supplémentaires comme la validation personnalisée et l'état indéterminé.`,
			},
		},
	},
	argTypes: {
		...getValidationDocumentation(),
		'locales': {
			description: 'Surcharge des chaînes affichées à l\'utilisateur (messages de validation). Les valeurs par défaut sont définies dans le fichier `locales.ts` du composant. La prop accepte un objet partiel : seules les clés renseignées surchargent les valeurs par défaut, le reste est conservé.',
			control: 'object',
			table: {
				type: { summary: 'object', detail: `{
	requiredField: (label: string) => string,
}` },
				category: 'props',
			},
		},
		'modelValue': { control: 'boolean' },
		'label': {
			description: 'Texte affiché comme label de la case à cocher',
			control: 'text',
		},
		'helpText': {
			description: 'Texte d\'aide affiché sous la case (masqué quand un message de validation est présent)',
			control: 'text',
		},
		'color': {
			control: 'select',
			options: ['primary', 'success', 'error', 'warning'],
			description: 'Couleur de la case à cocher',
		},
		'indeterminate': {
			description: 'État indéterminé de la case à cocher',
			control: 'boolean',
		},
		'hideDetails': {
			description: 'Masque les détails (messages d\'erreur, etc.)',
			control: 'boolean',
		},
		'density': {
			control: 'select',
			options: ['default', 'comfortable', 'compact'],
			description: 'Densité de la case à cocher',
		},
		'value': {
			description: 'Valeur associée à la case à cocher, utile lorsqu\'elle fait partie d\'un groupe de cases à cocher ou en mode `multiple`',
			control: 'text',
			table: {
				type: { summary: 'unknown' },
				defaultValue: { summary: 'undefined' },
			},
		},
		'multiple': {
			description: 'Active le mode sélection multiple : `modelValue` est alors un tableau dans lequel `value` est ajouté ou retiré. Inféré automatiquement quand `modelValue` est un tableau.',
			control: 'boolean',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		'trueValue': {
			description: 'Valeur émise lorsque la case à cocher est cochée',
			control: 'text',
			table: {
				type: { summary: 'unknown' },
				defaultValue: { summary: 'undefined (replie sur true, ou value en mode multiple)' },
			},
		},
		'falseValue': {
			description: 'Valeur émise lorsque la case à cocher est décochée',
			control: 'text',
			table: {
				type: { summary: 'unknown' },
				defaultValue: { summary: 'undefined (replie sur false)' },
			},
		},
		'cycleIndeterminate': {
			description: 'Inclut l\'état indéterminé dans la rotation du parent et remplace l\'ancienne prop controlsIds',
			control: 'boolean',
		},
		'displayAsterisk': {
			description: 'Afficher l\'astérisque (*) pour indiquer un champ obligatoire',
			control: 'boolean',
		},
		'update:modelValue': {
			action: 'update:modelValue',
			description: 'Événement émis lorsque la valeur de la case à cocher devient true ou false. Remplace l\'ancien événement change.',
			table: {
				category: 'events',
				type: {
					summary: 'boolean',
				},
			},
		},
		'update:indeterminate': {
			action: 'update:indeterminate',
			description: 'Événement émis lorsque l\'état indéterminé de la case à cocher change',
			table: {
				category: 'events',
				type: {
					summary: 'boolean',
				},
			},
		},
	},
} as Meta<typeof SyCheckbox>

export default meta

type Story = StoryObj<typeof SyCheckbox>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<SyCheckbox v-model="checked" label="Case à cocher" />`,
			},
		],
	},
	args: {
		'onUpdate:modelValue': fn(),
		'onUpdate:indeterminate': fn(),
	},
	render: args => ({
		components: { SyCheckbox },
		setup() {
			const checked = ref(false)
			return { args, checked }
		},
		template: `<SyCheckbox v-model="checked" v-bind="args" label="Case à cocher" />`,
	}),
}

export const Required: Story = {
	args: {
		...Default.args,
		required: true,
		isValidateOnBlur: false,
	},
	render: args => ({
		components: { SyCheckbox },
		setup() {
			const checked = ref(false)
			return { args, checked }
		},
		template: `<SyCheckbox v-model="checked" v-bind="args" label="Case à cocher obligatoire" :is-validate-on-blur="false" />`,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<SyCheckbox v-model="checked" label="Case à cocher obligatoire" required :is-validate-on-blur="false" />`,
			},
		],
		docs: {
			description: {
				story: `
### Case à cocher obligatoire
Cette case à cocher est marquée comme obligatoire, ce qui déclenchera une validation si elle n'est pas cochée.
				`,
			},
		},
	},
}

export const Indeterminate: Story = {
	args: {
		...Default.args,
		indeterminate: true,
	},
	render: args => ({
		components: { SyCheckbox },
		setup() {
			const checked = ref(false)
			const indeterminate = ref(true)
			return { args, checked, indeterminate }
		},
		template: `<SyCheckbox v-model="checked" :indeterminate="indeterminate" v-bind="args" label="Case à cocher indéterminée" />`,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyCheckbox 
    v-model="checked" 
    :indeterminate="indeterminate" 
    label="Case à cocher indéterminée" 
  />
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup>
import { ref } from 'vue'

const checked = ref(false)
const indeterminate = ref(true)
</script>`,
			},
		],
		docs: {
			description: {
				story: `
### Case à cocher avec état indéterminé
Cette case à cocher est dans un état indéterminé, généralement utilisé lorsque certains éléments d'un groupe sont sélectionnés mais pas tous.
				`,
			},
		},
	},
}

export const HelpText: Story = {
	args: {
		...Default.args,
		helpText: 'Cochez cette case pour accepter les conditions générales.',
	},
	render: args => ({
		components: { SyCheckbox },
		setup() {
			const checked = ref(false)
			return { args, checked }
		},
		template: `<SyCheckbox v-model="checked" v-bind="args" label="Case à cocher" />`,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<SyCheckbox
  v-model="checked"
  label="Case à cocher"
  help-text="Cochez cette case pour accepter les conditions générales."
/>`,
			},
		],
		docs: {
			description: {
				story: `
### Case à cocher avec texte d'aide
Un texte d'aide (\`helpText\`) s'affiche sous la case pour guider l'utilisateur, tant qu'aucun message de validation (erreur, avertissement, succès) n'est présent.
				`,
			},
		},
	},
}

export const WithCycleIndeterminate: Story = {
	args: Default.args,
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <div>
    <SyCheckbox 
      :model-value="parentChecked" 
      :indeterminate="parentIndeterminate" 
      @update:model-value="handleParentModelUpdate"
      @update:indeterminate="handleParentIndeterminateUpdate"
      :cycle-indeterminate="canCycleIndeterminate"
      label="Parent"
    />
    <ul style="list-style: none; margin: 0; padding-left: 24px;">
      <li v-for="(child, index) in children" :key="childrenIds[index]">
        <SyCheckbox v-model="child.value" :id="childrenIds[index]" :label="'Enfant ' + (index + 1)" />
      </li>
    </ul>
  </div>
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup>
import { computed, ref, watch } from 'vue'

const childCount = 3
const initialState = Array.from({ length: childCount }, (_, index) => index === 0)

const parentChecked = ref(false)
const parentIndeterminate = ref(false)
const lastMixedState = ref(null)
const canCycleIndeterminate = computed(() => lastMixedState.value !== null)
let isApplyingChildState = false

const children = initialState.map(value => ref(value))
const childrenIds = children.map((_, index) => 'child-' + (index + 1))

const getChildState = () => children.map(child => child.value)

const setChildren = (state) => {
  isApplyingChildState = true
  children.forEach((child, index) => { child.value = state[index] ?? false })
  isApplyingChildState = false
}

// Recalcule l'état du parent depuis les enfants (action individuelle sur un enfant)
const recomputeParentFromChildren = () => {
  const childState = getChildState()
  const checkedCount = childState.filter(Boolean).length

  if (checkedCount === 0) {
    lastMixedState.value = null
    parentChecked.value = false
    parentIndeterminate.value = false
  } else if (checkedCount === childState.length) {
    lastMixedState.value = null
    parentChecked.value = true
    parentIndeterminate.value = false
  } else {
    lastMixedState.value = [...childState]
    parentChecked.value = false
    parentIndeterminate.value = true
  }
}

children.forEach(child => watch(child, () => {
  if (!isApplyingChildState) recomputeParentFromChildren()
}, { flush: 'sync' }))

// L'état initial du parent est dérivé de l'état des enfants fourni
recomputeParentFromChildren()

// Le parent coche/décoche tous les enfants sans oublier la combinaison partielle mémorisée
const handleParentModelUpdate = (value) => {
  setChildren(children.map(() => value))
  parentChecked.value = value
  parentIndeterminate.value = false
}

// Le parent revient à l'état indéterminé : on restaure la dernière combinaison partielle
const handleParentIndeterminateUpdate = (isIndeterminate) => {
  if (isIndeterminate && lastMixedState.value !== null) {
    setChildren(lastMixedState.value)
    parentChecked.value = false
    parentIndeterminate.value = true
  } else {
    parentIndeterminate.value = false
  }
}
</script>
`,
			},
		],
		docs: {
			description: {
				story: `
### Case à cocher avec contrôle d'éléments enfants
Cette case à cocher contrôle un groupe d'éléments enfants. L'application synchronise les valeurs des enfants, dérive l'état \`indeterminate\` du parent et applique \`update:modelValue\` à tous les enfants.

L'événement \`update:modelValue\` remplace l'ancien événement \`change\`. La prop \`controlsIds\` n'est plus utilisée par SyCheckbox ; le groupe applicatif porte la structure et les relations nécessaires autour des cases à cocher.

Dans cet exemple, la prop \`cycleIndeterminate\` est activée pour permettre au parent de réintroduire la dernière sélection partielle dans sa rotation. Cette sélection partielle mémorisée est supprimée si l'utilisateur coche ou décoche individuellement tous les enfants. Sans cette prop, le parent contrôlant des enfants reste binaire : depuis non coché ou indéterminé, l'activation coche tous les enfants ; depuis coché, elle les décoche tous.
				`,
			},
		},
	},
	render: args => ({
		components: { SyCheckbox },
		setup() {
			const group = useTriStateCheckboxGroup(3)
			const childrenIds = group.childrenChecked.map((_, index) => `child-${index + 1}`)

			return {
				args,
				...group,
				childrenIds,
			}
		},
		template: `
			<div>
				<SyCheckbox 
					v-bind="args"
					:model-value="parentChecked" 
					:indeterminate="parentIndeterminate" 
					@update:model-value="handleParentModelUpdate"
					@update:indeterminate="handleParentIndeterminateUpdate"
					:cycle-indeterminate="canCycleIndeterminate"
					label="Parent"
				/>
				<ul style="list-style: none; margin: 0; padding-left: 24px;">
					<li v-for="(child, index) in childrenChecked" :key="childrenIds[index]">
						<SyCheckbox v-bind="args" v-model="child.value" :id="childrenIds[index]" :label="'Enfant ' + (index + 1)" />
					</li>
				</ul>
			</div>
		`,
	}),
}

export const ValidationRules: Story = {
	args: Default.args,
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyCheckbox
    v-model="checked"
    label="J'accepte les conditions générales d'utilisation"
    :custom-rules="rules"
    :is-validate-on-blur="false"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup>
import { ref } from 'vue'

const checked = ref(false)
const rules = [
  {
    type: 'custom',
    options: {
      message: 'Cette case doit être cochée pour continuer.',
      validate: (value) => value === true,
    },
  },
]
</script>`,
			},
		],
		docs: {
			description: {
				story: `
### Case à cocher avec règles de validation personnalisées
Cette case à cocher utilise des règles de validation personnalisées pour vérifier si elle est cochée.
				`,
			},
		},
	},
	render: args => ({
		components: { SyCheckbox },
		setup() {
			const checked = ref(false)
			return {
				args,
				checked,
				rules: [
					{
						type: 'custom',
						options: {
							message: 'Cette case doit être cochée pour continuer.',
							validate: (value: boolean) => value === true,
						},
					},
				],
				isValidateOnBlur: false,
			}
		},
		template: `
			<SyCheckbox
				v-bind="args"
				v-model="checked"
				label="J'accepte les conditions générales d'utilisation"
				:custom-rules="rules"
                :is-validate-on-blur="false"
			/>
		`,
	}),
}

export const DisabledState: Story = {
	args: {
		...Default.args,
		disabled: true,
	},
	render: args => ({
		components: { SyCheckbox },
		setup() {
			const checked = ref(true)
			return { args, checked }
		},
		template: `<SyCheckbox v-model="checked" v-bind="args" label="Case à cocher désactivée" />`,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<SyCheckbox v-model="checked" disabled label="Case à cocher désactivée" />`,
			},
		],
		docs: {
			description: {
				story: `
### Case à cocher désactivée
Cette case à cocher est désactivée et ne peut pas être modifiée par l'utilisateur.
				`,
			},
		},
	},
}

export const ReadonlyState: Story = {
	args: {
		...Default.args,
		readonly: true,
	},
	render: args => ({
		components: { SyCheckbox },
		setup() {
			const checked = ref(true)
			return { args, checked }
		},
		template: `<SyCheckbox v-model="checked" v-bind="args" label="Case à cocher en lecture seule" />`,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<SyCheckbox v-model="checked" readonly label="Case à cocher en lecture seule" />`,
			},
		],
		docs: {
			description: {
				story: `
### Case à cocher en lecture seule
Cette case à cocher est en lecture seule et ne peut pas être modifiée par l'utilisateur, mais elle n'est pas visuellement désactivée comme la version disabled.
				`,
			},
		},
	},
}

export const DifferentDensities: Story = {
	args: Default.args,
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<ul style="list-style: none; margin: 0; padding: 0;">
					<li><SyCheckbox v-model="checked1" label="Densité par défaut" /></li>
					<li><SyCheckbox v-model="checked2" label="Densité confortable" density="comfortable" /></li>
					<li><SyCheckbox v-model="checked3" label="Densité compacte" density="compact" /></li>
				</ul>`,
			},
		],
		docs: {
			description: {
				story: `
### Différentes densités
Le composant SyCheckbox prend en charge différentes densités pour s'adapter à différents contextes d'interface utilisateur.
				`,
			},
		},
	},
	render: args => ({
		components: { SyCheckbox },
		setup() {
			const checked1 = ref(false)
			const checked2 = ref(false)
			const checked3 = ref(false)
			return { args, checked1, checked2, checked3 }
		},
		template: `
			<ul style="list-style: none; margin: 0; padding: 0;">
				<li><SyCheckbox v-bind="args" v-model="checked1" label="Densité par défaut" /></li>
				<li><SyCheckbox v-bind="args" v-model="checked2" label="Densité confortable" density="comfortable" /></li>
				<li><SyCheckbox v-bind="args" v-model="checked3" label="Densité compacte" density="compact" /></li>
			</ul>
		`,
	}),
}

export const CustomColors: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<ul style="list-style: none; margin: 0; padding: 0;">
	<li><SyCheckbox v-model="checked1" label="Couleur primaire (par défaut)" /></li>
	<li><SyCheckbox v-model="checked3" label="Couleur succès" color="onSuccessVariant" /></li>
	<li><SyCheckbox v-model="checked4" label="Couleur erreur" color="error" /></li>
	<li><SyCheckbox v-model="checked5" label="Couleur avertissement" color="onWarningVariant" /></li>
</ul>`,
			},
		],
		docs: {
			description: {
				story: `
### Couleurs personnalisées
Le composant SyCheckbox peut être personnalisé avec différentes couleurs pour s'adapter à votre thème.
				`,
			},
		},
	},
	render: args => ({
		components: { SyCheckbox },
		setup() {
			const checked1 = ref(true)
			const checked2 = ref(true)
			const checked3 = ref(true)
			const checked4 = ref(true)
			const checked5 = ref(true)
			return { args, checked1, checked2, checked3, checked4, checked5 }
		},
		template: `
			<ul style="list-style: none; margin: 0; padding: 0;">
				<li><SyCheckbox v-model="checked1" label="Couleur primaire (par défaut)" /></li>
				<li><SyCheckbox v-model="checked3" label="Couleur succès" color="onSuccessVariant" /></li>
				<li><SyCheckbox v-model="checked4" label="Couleur erreur" color="error" /></li>
				<li><SyCheckbox v-model="checked5" label="Couleur avertissement" color="onWarningVariant" /></li>
			</ul>
		`,
	}),
}

export const Multiple: Story = {
	args: {
		...Default.args,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <fieldset>
    <legend>Objet de la demande</legend>
    <SyCheckbox v-model="selected" value="identity" label="Identité du demandeur" />
    <SyCheckbox v-model="selected" value="nir" label="Numéro de sécurité sociale" />
    <SyCheckbox v-model="selected" value="other" label="Autre" />
  </fieldset>
  <p>Sélection : {{ selected }}</p>
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup>
import { ref } from 'vue'

const selected = ref([])
</script>`,
			},
		],
		docs: {
			description: {
				story: `
### Sélection multiple
Quand \`v-model\` est un tableau, le composant bascule automatiquement en mode multiple (comme le \`VCheckbox\` de Vuetify). La prop \`value\` de chaque case est alors ajoutée ou retirée du tableau.

La prop \`multiple\` peut être passée explicitement pour forcer ce comportement, mais elle est inférée dès que \`modelValue\` est un tableau.
				`,
			},
		},
	},
	render: args => ({
		components: { SyCheckbox },
		setup() {
			const selected = ref<string[]>([])
			return { selected, args }
		},
		template: `
			<div>
				<fieldset style="border: none; padding: 0; margin: 0;">
					<legend style="padding: 0; margin-bottom: 8px;">Objet de la demande</legend>
					<ul style="list-style: none; margin: 0; padding: 0;">
						<li><SyCheckbox v-bind="args" v-model="selected" value="identity" label="Identité du demandeur" /></li>
						<li><SyCheckbox v-bind="args" v-model="selected" value="nir" label="Numéro de sécurité sociale" /></li>
						<li><SyCheckbox v-bind="args" v-model="selected" value="other" label="Autre" /></li>
					</ul>
				</fieldset>
				<p style="margin-top: 16px;">Sélection : {{ selected }}</p>
			</div>
		`,
	}),
}
