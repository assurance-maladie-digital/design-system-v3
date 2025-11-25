import type { Meta, StoryObj } from '@storybook/vue3'
import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
import { ref, watch } from 'vue'
import { fn } from '@storybook/test'

// Interface pour typer correctement le composant SyCheckbox avec sa méthode validateOnSubmit
interface SyCheckboxInstance {
	validateOnSubmit: () => boolean
}

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
		controls: { exclude: ['modelValue', 'errorMessages', 'warningMessages', 'successMessages'] },
		docs: {
			description: {
				component: `SyCheckbox est un composant de case à cocher tri-état qui étend le composant VCheckbox de Vuetify avec des fonctionnalités supplémentaires comme la validation personnalisée et l'état indéterminé.`,
			},
		},
	},
	argTypes: {
		modelValue: { control: 'boolean' },
		label: {
			description: 'Texte affiché comme label de la case à cocher',
			control: 'text',
		},
		color: {
			control: 'select',
			options: ['primary', 'secondary', 'success', 'error', 'warning'],
			description: 'Couleur de la case à cocher',
		},
		indeterminate: {
			description: 'État indéterminé de la case à cocher',
			control: 'boolean',
		},
		disabled: {
			description: 'Désactive la case à cocher',
			control: 'boolean',
		},
		readonly: {
			description: 'Rend la case à cocher en lecture seule',
			control: 'boolean',
		},
		required: {
			description: 'Rend la case à cocher obligatoire',
			control: 'boolean',
		},
		hideDetails: {
			description: 'Masque les détails (messages d\'erreur, etc.)',
			control: 'boolean',
		},
		density: {
			control: 'select',
			options: ['default', 'comfortable', 'compact'],
			description: 'Densité de la case à cocher',
		},
		customRules: {
			description: 'Règles de validation personnalisées',
			control: 'object',
		},
		customWarningRules: {
			description: 'Règles d\'avertissement personnalisées',
			control: 'object',
		},
		customSuccessRules: {
			description: 'Règles de succès personnalisées',
			control: 'object',
		},
		showSuccessMessages: {
			description: 'Afficher les messages de succès',
			control: 'boolean',
		},
		isValidateOnBlur: {
			description: 'Vérifie la validité lors de la perte de focus',
			control: 'boolean',
			default: true,
		},
		disableErrorHandling: {
			control: 'boolean',
			description: 'Désactive complètement la validation des règles et l\'affichage des erreurs',
		},
		controlsIds: {
			description: 'IDs des éléments contrôlés par cette case à cocher (pour l\'état indéterminé)',
			control: 'object',
		},
		displayAsterisk: {
			description: 'Afficher l\'astérisque (*) pour indiquer un champ obligatoire',
			control: 'boolean',
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
</template>

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

export const WithControlsIds: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <div>
    <SyCheckbox 
      v-model="parentChecked" 
      :indeterminate="parentIndeterminate" 
      @update:indeterminate="parentIndeterminate = $event"
      :controls-ids="['child-1', 'child-2', 'child-3']"
      label="Parent" 
    />
    <div style="margin-left: 24px;">
      <SyCheckbox v-model="childChecked1" id="child-1" label="Enfant 1" />
      <SyCheckbox v-model="childChecked2" id="child-2" label="Enfant 2" />
      <SyCheckbox v-model="childChecked3" id="child-3" label="Enfant 3" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const parentChecked = ref(false)
const parentIndeterminate = ref(false)
const childChecked1 = ref(false)
const childChecked2 = ref(false)
const childChecked3 = ref(false)

// Logique pour gérer l'état indéterminé du parent
const updateParentState = () => {
  const checkedCount = [childChecked1.value, childChecked2.value, childChecked3.value].filter(Boolean).length
  
  if (checkedCount === 0) {
    parentChecked.value = false
    parentIndeterminate.value = false
  } else if (checkedCount === 3) {
    parentChecked.value = true
    parentIndeterminate.value = false
  } else {
    parentChecked.value = false
    parentIndeterminate.value = true
  }
}

// Observer les changements des enfants
watch(childChecked1, updateParentState)
watch(childChecked2, updateParentState)
watch(childChecked3, updateParentState)

// Mettre à jour les enfants lorsque le parent change
watch(parentChecked, () => {
  if (!parentIndeterminate.value) {
    childChecked1.value = parentChecked.value
    childChecked2.value = parentChecked.value
    childChecked3.value = parentChecked.value
  }
})
</script>`,
			},
			{
				name: 'Script',
				code: `
<script setup>
import { ref, watch } from 'vue'

const parentChecked = ref(false)
const parentIndeterminate = ref(false)
const childChecked1 = ref(false)
const childChecked2 = ref(false)
const childChecked3 = ref(false)

// Logique pour gérer l'état indéterminé du parent
const updateParentState = () => {
  const checkedCount = [childChecked1.value, childChecked2.value, childChecked3.value].filter(Boolean).length
  
  if (checkedCount === 0) {
    parentChecked.value = false
    parentIndeterminate.value = false
  } else if (checkedCount === 3) {
    parentChecked.value = true
    parentIndeterminate.value = false
  } else {
    parentChecked.value = false
    parentIndeterminate.value = true
  }
}

// Observer les changements des enfants
watch(childChecked1, updateParentState)
watch(childChecked2, updateParentState)
watch(childChecked3, updateParentState)

// Mettre à jour les enfants lorsque le parent change
watch(parentChecked, () => {
  if (!parentIndeterminate.value) {
    childChecked1.value = parentChecked.value
    childChecked2.value = parentChecked.value
    childChecked3.value = parentChecked.value
  }
})
</script>
`,
			},
		],
		docs: {
			description: {
				story: `
### Case à cocher avec contrôle d'éléments enfants
Cette case à cocher contrôle un groupe d'éléments enfants. Elle utilise la propriété \`controlsIds\` pour établir la relation entre le parent et les enfants. 
Lorsque certains enfants sont cochés mais pas tous, le parent passe automatiquement en état indéterminé.

La propriété \`controlsIds\` permet de créer une relation sémantique entre une case à cocher parent et ses enfants, ce qui est important pour l'accessibilité. Cette relation est établie via les attributs \`aria-controls\` et les identifiants des cases à cocher enfants.
				`,
			},
		},
	},
	render: args => ({
		components: { SyCheckbox },
		setup() {
			const parentChecked = ref(false)
			const parentIndeterminate = ref(false)
			const childChecked1 = ref(false)
			const childChecked2 = ref(false)
			const childChecked3 = ref(false)

			// Logique pour gérer l'état indéterminé du parent
			function updateParentState() {
				const checkedCount = [
					childChecked1.value,
					childChecked2.value,
					childChecked3.value,
				].filter(Boolean).length

				if (checkedCount === 0) {
					parentChecked.value = false
					parentIndeterminate.value = false
				}
				else if (checkedCount === 3) {
					parentChecked.value = true
					parentIndeterminate.value = false
				}
				else {
					parentChecked.value = false
					parentIndeterminate.value = true
				}
			}

			// Observer les changements des enfants
			const watchChild = () => {
				updateParentState()
			}

			// Mettre à jour les enfants lorsque le parent change
			const watchParent = () => {
				if (!parentIndeterminate.value) {
					childChecked1.value = parentChecked.value
					childChecked2.value = parentChecked.value
					childChecked3.value = parentChecked.value
				}
			}

			// Configurer les observateurs
			watch(childChecked1, watchChild)
			watch(childChecked2, watchChild)
			watch(childChecked3, watchChild)
			watch(parentChecked, watchParent)

			return {
				args,
				parentChecked,
				parentIndeterminate,
				childChecked1,
				childChecked2,
				childChecked3,
			}
		},
		template: `
			<div>
				<SyCheckbox 
					v-model="parentChecked" 
					:indeterminate="parentIndeterminate" 
					@update:indeterminate="parentIndeterminate = $event"
					:controls-ids="['child-1', 'child-2', 'child-3']"
					label="Parent"
				/>
				<div style="margin-left: 24px;">
					<SyCheckbox v-model="childChecked1" id="child-1" label="Enfant 1" />
					<SyCheckbox v-model="childChecked2" id="child-2" label="Enfant 2" />
					<SyCheckbox v-model="childChecked3" id="child-3" label="Enfant 3" />
				</div>
			</div>
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
  <SyCheckbox
    v-model="checked"
    label="J'accepte les conditions générales d'utilisation"
    :custom-rules="rules"
    :is-validate-on-blur="false"
  />
</template>

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
			{
				name: 'Script',
				code: `
// Composition API
export default {
  setup() {
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

    return {
      checked,
      rules,
    }
  }
}`,
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
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
                <div>
                <SyCheckbox v-model="checked1" label="Densité par défaut" />
                <SyCheckbox v-model="checked2" label="Densité confortable" density="comfortable" />
                <SyCheckbox v-model="checked3" label="Densité compacte" density="compact" />
                </div>`,
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
			<div>
				<SyCheckbox v-model="checked1" label="Densité par défaut" />
				<SyCheckbox v-model="checked2" label="Densité confortable" density="comfortable" />
				<SyCheckbox v-model="checked3" label="Densité compacte" density="compact" />
			</div>
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
  <SyCheckbox v-model="checked1" label="Couleur primaire (par défaut)" />
  <SyCheckbox v-model="checked2" label="Couleur secondaire" color="secondary" />
  <SyCheckbox v-model="checked3" label="Couleur succès" color="success" />
  <SyCheckbox v-model="checked4" label="Couleur erreur" color="error" />
  <SyCheckbox v-model="checked5" label="Couleur avertissement" color="warning" />
</div>`,
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
			<div>
				<SyCheckbox v-model="checked1" label="Couleur primaire (par défaut)" />
				<SyCheckbox v-model="checked2" label="Couleur secondaire" color="secondary" />
				<SyCheckbox v-model="checked3" label="Couleur succès" color="success" />
				<SyCheckbox v-model="checked4" label="Couleur erreur" color="error" />
				<SyCheckbox v-model="checked5" label="Couleur avertissement" color="warning" />
			</div>
		`,
	}),
}

export const FormValidation: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <form @submit.prevent="validateForm">
    <h3>Validation avec règles personnalisées</h3>
    <SyCheckbox
      ref="checkbox"
      v-model="checked"
      label="J'accepte les conditions générales d'utilisation"
      :custom-rules="rules"
      validate-on-submit
    />
    <h3>Validation avec la prop required</h3>
    <SyCheckbox
      ref="checkbox2"
      v-model="checked2"
      label="J'accepte les conditions générales d'utilisation"
	  display-asterisk
      required
    />
    <VBtn 
      type="submit" 
      color="primary"
      class="mt-4"
    >
      Soumettre
    </VBtn>
    <p v-if="formSubmitted" style="margin-top: 16px; color: var(--v-success-base);">Formulaire soumis avec succès!</p>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const checkbox = ref<SyCheckboxInstance | null>(null)
const checkbox2 = ref<SyCheckboxInstance | null>(null)
const checked = ref(false)
const checked2 = ref(false)
const formSubmitted = ref(false)
const hasError = ref(false)

const rules = [
  {
    type: 'custom',
    options: {
      message: 'Cette case doit être cochée pour continuer.',
      validate: (value: boolean) => value === true,
    },
  },
]

const validateForm = () => {
  if (!checkbox.value || !checkbox2.value) return
  hasError.value = true
  const isValid = checkbox.value.validateOnSubmit()
  const isValid2 = checkbox2.value.validateOnSubmit()
  if (isValid && isValid2) {
    formSubmitted.value = true
    hasError.value = false
  }
}
</script>`,
			},
		],
		docs: {
			description: {
				story: `
### Case à cocher avec validation au moment de la soumission
Cette case à cocher utilise des règles de validation personnalisées et valide le formulaire lors de la soumission grâce à la propriété \`validateOnSubmit\`. Le bouton de soumission déclenche la validation et affiche un message de succès si la case est cochée.
				`,
			},
		},
	},
	render: args => ({
		components: { SyCheckbox },
		setup() {
			const checkbox = ref<SyCheckboxInstance | null>(null)
			const checkbox2 = ref<SyCheckboxInstance | null>(null)
			const checked = ref(false)
			const checked2 = ref(false)
			const formSubmitted = ref(false)
			const hasError = ref(false)

			// Revalider quand les valeurs changent
			watch([checked, checked2], () => {
				if (hasError.value && checkbox.value && checkbox2.value) {
					checkbox.value.validateOnSubmit()
					checkbox2.value.validateOnSubmit()
				}
			})

			const validateForm = () => {
				if (!checkbox.value || !checkbox2.value) return
				hasError.value = true
				const isValid = checkbox.value.validateOnSubmit()
				const isValid2 = checkbox2.value.validateOnSubmit()
				if (isValid && isValid2) {
					formSubmitted.value = true
					hasError.value = false
				}
			}

			return {
				args,
				checkbox,
				checked,
				checkbox2,
				checked2,
				formSubmitted,
				hasError,
				rules: [
					{
						type: 'custom',
						options: {
							message: 'Cette case doit être cochée pour continuer.',
							validate: (value: boolean) => value === true,
						},
					},
				],
				validateForm,
			}
		},
		template: `
			<form @submit.prevent="validateForm">
				<h3>Validation avec règles personnalisées</h3>
				<SyCheckbox
					ref="checkbox"
					v-model="checked"
					label="J'accepte les conditions générales d'utilisation"
					:custom-rules="rules"
				/>
				<h3>Validation avec la prop required et display-asterisk</h3>
				<SyCheckbox
					ref="checkbox2"
					v-model="checked2"
					label="J'accepte les conditions générales d'utilisation"
					required
					display-asterisk
				/>
				<VBtn 
					type="submit" 
					color="primary"
					class="mt-4"
				>
					Soumettre
				</VBtn>
				<p v-if="formSubmitted" style="margin-top: 16px; color: var(--v-success-base);">Formulaire soumis avec succès!</p>
			</form>
		`,
	}),
}
