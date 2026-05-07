import type { Meta, StoryObj } from '@storybook/vue3'
import SyAutocomplete from './SyAutocomplete.vue'
import SyForm from '../../SyForm/SyForm.vue'
import AccessibilityDocs from './accessibilite/Accessibility.mdx'
import { ref, onMounted } from 'vue'
import { fn } from '@storybook/test'
import { VBtn } from 'vuetify/components'

const meta: Meta<typeof SyAutocomplete> = {
	title: 'Composants/Formulaires/Selects/SyAutocomplete',
	component: SyAutocomplete,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['selectedValue', 'closeList', 'clearValidation', 'checkErrorOnBlur', 'isOpen', 'selectItem'] },
		docs: {
			page: AccessibilityDocs,
			controls: { sort: 'none' },
		},
	},
	args: {
		'onUpdate:modelValue': fn(),
	},
	argTypes: {
		'bgColor': {
			control: 'text',
			description: 'Couleur de fond du champ',
			table: { category: 'props' },
		},
		'chips': {
			control: 'boolean',
			description: 'Affiche les options sélectionnées sous forme de chips',
			table: { category: 'props' },
		},
		'clearable': {
			control: 'boolean',
			description: 'Permet de vider la sélection',
			table: { category: 'props' },
		},
		'customRules': {
			control: 'object',
			description: 'Règles de validation personnalisées d\'erreur (bloquantes) à appliquer au champ. Elles sont évaluées à partir de la valeur du champ.',
			table: { category: 'props' },
		},
		'customSuccessRules': {
			control: 'object',
			description: 'Règles de validation personnalisées de succès à appliquer au champ. Elles sont évaluées à partir de la valeur du champ.',
			table: { category: 'props' },
		},
		'customWarningRules': {
			control: 'object',
			description: 'Règles de validation personnalisées d\'avertissement (non bloquantes) à appliquer au champ. Elles sont évaluées à partir de la valeur du champ.',
			table: { category: 'props' },
		},
		'debounce': {
			control: 'number',
			description: 'Délai en millisecondes entre la dernière frappe et l\'émission de l\'événement search. Permet de limiter les appels lors d\'une recherche asynchrone.',
			table: { category: 'props' },
		},
		'density': {
			control: 'select',
			options: ['default', 'comfortable', 'compact'],
			description: 'Définit la densité du champ',
			table: { category: 'props' },
		},
		'disableErrorHandling': {
			control: 'boolean',
			description: 'Désactive la gestion des erreurs, utile lorsque vous souhaitez gérer les erreurs manuellement.',
			table: { category: 'props' },
		},
		'disabled': {
			control: 'boolean',
			description: 'Désactive le champ',
			table: { category: 'props' },
		},
		'displayAsterisk': {
			control: 'boolean',
			description: 'Affiche un astérisque pour les champs obligatoires',
			table: { category: 'props' },
		},
		'errorMessages': {
			control: 'object',
			description: 'Permet d\'injecter des messages d\'erreur depuis le parent. Aucun calcul de validation n\'est exécuté.',
			table: { category: 'props' },
		},
		'filter': {
			control: 'boolean',
			description: 'Active le filtrage des options basé sur la saisie',
			table: { category: 'props' },
		},
		'hasError': {
			control: 'boolean',
			description: 'Indique si le champ a une erreur, peut être utilisé pour forcer l\'état d\'erreur.',
			table: { category: 'props' },
		},
		'hasSuccess': {
			control: 'boolean',
			description: 'Indique si le champ a un succès, peut être utilisé pour forcer l\'état de succès.',
			table: { category: 'props' },
		},
		'hasWarning': {
			control: 'boolean',
			description: 'Indique si le champ a un avertissement, peut être utilisé pour forcer l\'état d\'avertissement.',
			table: { category: 'props' },
		},
		'helpText': {
			control: 'text',
			description: 'Texte d\'aide affiché sous le champ',
			table: { category: 'props' },
		},
		'hideNoData': {
			control: 'boolean',
			description: 'Cache le message "aucune option" quand la liste est vide',
			table: { category: 'props' },
		},
		'isValidateOnBlur': {
			control: 'boolean',
			description: 'Détermine si la validation doit être déclenchée lors de la saisie ou du blur de l\'input. Par défaut false sur ce composant : la validation se déclenche dès qu\'une option est sélectionnée.',
			table: { category: 'props' },
		},
		'items': {
			control: 'object',
			table: { category: 'props' },
		},
		'label': {
			control: 'text',
			description: 'Libellé du champ',
			table: { category: 'props' },
		},
		'loading': {
			control: 'boolean',
			description: 'Affiche un indicateur de chargement',
			table: { category: 'props' },
		},
		'menuId': {
			control: 'text',
			description: 'Identifiant HTML du menu déroulant. Utile pour éviter les conflits d\'ID en cas de multiples instances sur la même page.',
			table: { category: 'props' },
		},
		'modelValue': {
			control: 'text',
			table: { category: 'props' },
		},
		'multiple': {
			control: 'boolean',
			description: 'Permet la sélection multiple d\'options',
			table: { category: 'props' },
		},
		'noDataText': {
			control: 'text',
			description: 'Texte affiché quand aucune option n\'est disponible',
			table: { category: 'props' },
		},
		'placeholder': {
			control: 'text',
			description: 'Texte d\'indice affiché quand le champ est vide',
			table: { category: 'props' },
		},
		'plainTextKey': {
			control: 'text',
			description: 'Propriété de l\'objet utilisée pour le filtrage côté client (filter: true). Si absente, c\'est textKey qui est utilisée.',
			table: { category: 'props' },
		},
		'readonly': {
			control: 'boolean',
			description: 'Rend le champ en lecture seule',
			table: { category: 'props' },
		},
		'required': {
			control: 'boolean',
			description: 'Marque le champ comme obligatoire',
			table: { category: 'props' },
		},
		'returnObject': {
			control: 'boolean',
			description: 'Retourne l\'objet complet sélectionné au lieu de la seule valeur de valueKey.',
			table: { category: 'props' },
		},
		'selectionText': {
			control: false,
			description: 'Fonction de personnalisation du texte affiché dans l\'input en mode multiple. Reçoit le tableau des valeurs sélectionnées et retourne une chaîne.',

			table: { category: 'props' },
		},
		'showSuccessMessages': {
			control: 'boolean',
			description: 'Affiche les messages de succès lorsque la validation est réussie. Si false, cache uniquement les messages texte, l\'état visuel reste actif.',
			table: { category: 'props' },
		},
		'successMessages': {
			control: 'object',
			description: 'Permet d\'injecter des messages de succès depuis le parent. Aucun calcul de validation n\'est exécuté.',
			table: { category: 'props' },
		},
		'textKey': {
			control: 'text',
			description: 'Nom de la propriété qui contient le texte à afficher',
			table: { category: 'props' },
		},
		'valueKey': {
			control: 'text',
			description: 'Nom de la propriété qui contient la valeur à retourner',
			table: { category: 'props' },
		},
		'warningMessages': {
			control: 'object',
			description: 'Permet d\'injecter des messages d\'avertissement depuis le parent. Aucun calcul de validation n\'est exécuté.',
			table: { category: 'props' },
		},
		'onSearch': {
			action: 'search',
			description: 'Émis à chaque frappe dans le champ. Reçoit la valeur saisie en paramètre. Utile pour déclencher des recherches asynchrones.',
			table: { category: 'events' },
		},
		'onUpdate:modelValue': {
			action: 'update:modelValue',
			description: 'Émis lors de la sélection d\'une option. Reçoit la valeur sélectionnée.',
			table: { category: 'events' },
		},
		'validateOnSubmit': {
			control: false,
			description: 'Déclenche la validation du champ (équivalent à un submit de formulaire). Retourne une promesse résolue en `true` si le champ est valide.',
			table: { category: 'expose' },
		},
	},
} as Meta<typeof SyAutocomplete>

export default meta

type Story = StoryObj<typeof meta>

const sampleItems = [
	{ text: 'Adrien', value: 'Adrien' },
	{ text: 'Axel', value: 'Axel' },
	{ text: 'Baptiste', value: 'Baptiste' },
	{ text: 'Clement', value: 'Clement' },
	{ text: 'Corentin', value: 'Corentin' },
	{ text: 'Damien', value: 'Damien' },
	{ text: 'David', value: 'David' },
	{ text: 'Eloi', value: 'Eloi' },
	{ text: 'Louis', value: 'Louis' },
	{ text: 'Valentin', value: 'Valentin' },
]

export const Default: Story = {
	parameters: {
		docs: { controls: { sort: 'none' } },
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SyAutocomplete
						v-model="selectedValue"
						:items="items"
						label="Rechercher un prénom"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { SyAutocomplete } from '@cnamts/synapse'

					const selectedValue = ref('')
					const items = [
						{ text: 'Adrien', value: 'Adrien' },
						{ text: 'Axel', value: 'Axel' },
						{ text: 'Baptiste', value: 'Baptiste' },
						{ text: 'Clement', value: 'Clement' },
						{ text: 'Corentin', value: 'Corentin' },
						{ text: 'Damien', value: 'Damien' },
						{ text: 'David', value: 'David' },
						{ text: 'Eloi', value: 'Eloi' },
						{ text: 'Louis', value: 'Louis' },
						{ text: 'Valentin', value: 'Valentin' },
					]
				</script>
				`,
			},
		],
	},
	args: {
		items: sampleItems,
		label: 'Rechercher un prénom',
	},
	render: (args) => {
		return {
			components: { SyAutocomplete },
			setup() {
				const selectedValue = ref('')
				return { args, selectedValue }
			},
			template: `
				<div class="pa-4">
					<SyAutocomplete
						v-model="selectedValue"
						v-bind="args"
					/>
				</div>
			`,
		}
	},
}

export const HelpText: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyAutocomplete
    v-model="selectedValue"
    :items="items"
    label="Rechercher un prénom"
    help-text="Texte d'aide à la saisie"
  />
</template>
				`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SyAutocomplete } from '@cnamts/synapse'

const selectedValue = ref('')
const items = [
  { text: 'Adrien', value: 'Adrien' },
  { text: 'Axel', value: 'Axel' },
  { text: 'Baptiste', value: 'Baptiste' },
  { text: 'Clement', value: 'Clement' },
  { text: 'Corentin', value: 'Corentin' },
  { text: 'Damien', value: 'Damien' },
  { text: 'David', value: 'David' },
  { text: 'Eloi', value: 'Eloi' },
  { text: 'Louis', value: 'Louis' },
  { text: 'Valentin', value: 'Valentin' },
]
</script>
				`,
			},
		],
	},
	args: {
		items: sampleItems,
		label: 'Rechercher un prénom',
		helpText: 'Texte d\'aide à la saisie',
	},
	render: (args) => {
		return {
			components: { SyAutocomplete },
			setup() {
				const selectedValue = ref('')
				return { args, selectedValue }
			},
			template: `
				<div class="pa-4">
					<SyAutocomplete
						v-model="selectedValue"
						v-bind="args"
					/>
				</div>
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
  <SyAutocomplete
    v-model="selectedValue"
    :items="items"
    label="Champ obligatoire"
    required
  />
</template>
        `,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SyAutocomplete } from '@cnamts/synapse'

const selectedValue = ref()
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
		items: [
			{ text: 'Option 1', value: '1' },
			{ text: 'Option 2', value: '2' },
		],
		label: 'Champ obligatoire',
		required: true,
	},
	render: (args) => {
		return {
			components: { SyAutocomplete },
			setup() {
				const selectedValue = ref()
				return { args, selectedValue }
			},
			template: `
				<div class="pa-4">
					<SyAutocomplete
						v-model="selectedValue"
						v-bind="args"
					/>
				</div>
			`,
		}
	},
}

export const RequiredWithAsterisk: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyAutocomplete
    v-model="selectedValue"
    :items="items"
    label="Champ obligatoire"
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
import { SyAutocomplete } from '@cnamts/synapse'

const selectedValue = ref()
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
		items: [
			{ text: 'Option 1', value: '1' },
			{ text: 'Option 2', value: '2' },
		],
		label: 'Champ obligatoire',
		required: true,
		displayAsterisk: true,
	},
	render: (args) => {
		return {
			components: { SyAutocomplete },
			setup() {
				const selectedValue = ref()
				return { args, selectedValue }
			},
			template: `
				<div class="pa-4">
					<SyAutocomplete
						v-model="selectedValue"
						v-bind="args"
					/>
				</div>
			`,
		}
	},
}

export const WithError: Story = {
	parameters: {
		docs: {
			description: {
				story: '« Option 1 » est présélectionnée et déclenche une erreur bloquante au chargement.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyAutocomplete
    ref="autocompleteRef"
    v-model="value"
    :items="items"
    label="Option"
    :customRules="[
      {
        type: 'custom',
        options: {
          validate: (v) => v !== '1',
          message: 'Option 1 n\\'est pas autorisée, choisissez Option 2 ou 3.'
        }
      }
    ]"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SyAutocomplete } from '@cnamts/synapse'

const value = ref('1')
const items = [
  { text: 'Option 1', value: '1' },
  { text: 'Option 2', value: '2' },
  { text: 'Option 3', value: '3' },
]

const autocompleteRef = ref(null)

onMounted(() => {
  autocompleteRef.value?.validateOnSubmit()
})
</script>`,
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
		'filter': false,
		'onUpdate:modelValue': fn(),
	},
	render: args => ({
		components: { SyAutocomplete },
		setup() {
			const value = ref('1')
			const autocompleteRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

			onMounted(() => {
				autocompleteRef.value?.validateOnSubmit()
			})

			return { args, value, autocompleteRef }
		},
		template: `
			<div class="pa-4">
				<SyAutocomplete
					ref="autocompleteRef"
					v-model="value"
					v-bind="args"
					:customRules="[
						{
							type: 'custom',
							options: {
								validate: (v) => v !== '1',
								message: 'Option 1 n\\'est pas autorisée, choisissez Option 2 ou 3.'
							}
						}
					]"
				/>
			</div>
		`,
	}),
}

export const WithWarning: Story = {
	parameters: {
		docs: {
			description: {
				story: '« Option 1 » est présélectionnée et déclenche un avertissement (non bloquant) au chargement.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyAutocomplete
    ref="autocompleteRef"
    v-model="value"
    :items="items"
    label="Option"
    :customWarningRules="[
      {
        type: 'custom',
        options: {
          validate: (v) => v !== '1',
          warningMessage: 'Option 1 est dépréciée, préférez Option 2 ou 3.'
        }
      }
    ]"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SyAutocomplete } from '@cnamts/synapse'

const value = ref('1')
const items = [
  { text: 'Option 1', value: '1' },
  { text: 'Option 2', value: '2' },
  { text: 'Option 3', value: '3' },
]

const autocompleteRef = ref(null)

onMounted(() => {
  autocompleteRef.value?.validateOnSubmit()
})
</script>`,
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
		'filter': false,
		'onUpdate:modelValue': fn(),
	},
	render: args => ({
		components: { SyAutocomplete },
		setup() {
			const value = ref('1')
			const autocompleteRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

			onMounted(() => {
				autocompleteRef.value?.validateOnSubmit()
			})

			return { args, value, autocompleteRef }
		},
		template: `
			<div class="pa-4">
				<SyAutocomplete
					ref="autocompleteRef"
					v-model="value"
					v-bind="args"
					:customWarningRules="[
						{
							type: 'custom',
							options: {
								validate: (v) => v !== '1',
								warningMessage: 'Option 1 est dépréciée, préférez Option 2 ou 3.'
							}
						}
					]"
				/>
			</div>
		`,
	}),
}

export const WithSuccess: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Une option est présélectionnée et déclenche la confirmation de succès au chargement.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyAutocomplete
    ref="autocompleteRef"
    v-model="value"
    :items="items"
    label="Option"
    show-success-messages
    :customSuccessRules="[
      {
        type: 'custom',
        options: {
          validate: (v) => v !== null && v !== undefined,
          successMessage: 'Option sélectionnée avec succès.'
        }
      }
    ]"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SyAutocomplete } from '@cnamts/synapse'

const value = ref('1')
const items = [
  { text: 'Option 1', value: '1' },
  { text: 'Option 2', value: '2' },
  { text: 'Option 3', value: '3' },
]

const autocompleteRef = ref(null)

onMounted(() => {
  autocompleteRef.value?.validateOnSubmit()
})
</script>`,
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
		'filter': false,
		'showSuccessMessages': true,
		'onUpdate:modelValue': fn(),
	},
	render: args => ({
		components: { SyAutocomplete },
		setup() {
			const value = ref('1')
			const autocompleteRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

			onMounted(() => {
				autocompleteRef.value?.validateOnSubmit()
			})

			return { args, value, autocompleteRef }
		},
		template: `
			<div class="pa-4">
				<SyAutocomplete
					ref="autocompleteRef"
					v-model="value"
					v-bind="args"
					:customSuccessRules="[
						{
							type: 'custom',
							options: {
								validate: (v) => v !== null && v !== undefined,
								successMessage: 'Option sélectionnée avec succès.'
							}
						}
					]"
				/>
			</div>
		`,
	}),
}

export const ReturnObjectWithCustomKeys: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Retourne l\'objet complet avec clés personnalisées et required.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyForm @submit="onSubmit">
    <SyAutocomplete
      v-model="value"
      :items="items"
      label="Objet complet"
      text-key="label"
      value-key="id"
      return-object
      required
      display-asterisk
    />
    <VBtn type="submit" class="mt-4" color="primary">Soumettre</VBtn>
  </SyForm>
</template>
        `,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SyAutocomplete, SyForm } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

const value = ref<{ label: string; id: string } | null>(null)
const items = [
  { label: 'Premier choix', id: '1' },
  { label: 'Deuxième choix', id: '2' },
  { label: 'Troisième choix', id: '3' }
]

const onSubmit = (event) => {
  if (event.isValid) {
    alert('Formulaire valide : ' + JSON.stringify(value.value))
  } else {
    alert('Formulaire invalide : veuillez choisir une option.')
  }
}
</script>
        `,
			},
		],
	},
	args: {
		items: [
			{ label: 'Premier choix', id: '1' },
			{ label: 'Deuxième choix', id: '2' },
			{ label: 'Troisième choix', id: '3' },
		],
		label: 'Objet complet',
		textKey: 'label',
		valueKey: 'id',
		returnObject: true,
		required: true,
		displayAsterisk: true,
	},
	render: (args) => {
		return {
			components: { SyAutocomplete, SyForm, VBtn },
			setup() {
				const value = ref<{ label: string, id: string } | null>(null)

				const onSubmit = (event: { isValid: boolean }) => {
					if (event.isValid) {
						alert(`Formulaire valide : ${JSON.stringify(value.value)}`)
					}
					else {
						alert('Formulaire invalide : veuillez choisir une option.')
					}
				}

				return { args, value, onSubmit }
			},
			template: `
				<div class="pa-4">
					<SyForm @submit="onSubmit">
						<SyAutocomplete
							v-model="value"
							v-bind="args"
							class="mb-4"
						/>
						<VBtn type="submit" class="mt-4" color="primary">Soumettre</VBtn>
					</SyForm>
				</div>
			`,
		}
	},
}

export const MultipleSelection: Story = {
	parameters: {

		docs: {
			description: {
				story: 'Exemple de sélection multiple avec SyAutocomplete. Les options sont filtrées en temps réel selon la saisie.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyAutocomplete
    v-model="selectedValues"
    :items="items"
    label="Sélectionner plusieurs prénoms"
    multiple
    clearable
  />
  <div class="mt-4">
    Valeurs sélectionnées: {{ selectedValues }}
  </div>
</template>
        `,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SyAutocomplete } from '@cnamts/synapse'

const selectedValues = ref([])
const items = [
  { text: 'Adrien', value: 'Adrien' },
  { text: 'Axel', value: 'Axel' },
  { text: 'Baptiste', value: 'Baptiste' },
  { text: 'Clement', value: 'Clement' },
  { text: 'Corentin', value: 'Corentin' },
  { text: 'Damien', value: 'Damien' },
  { text: 'David', value: 'David' },
  { text: 'Eloi', value: 'Eloi' },
  { text: 'Louis', value: 'Louis' },
  { text: 'Valentin', value: 'Valentin' },
]
</script>
        `,
			},
		],
	},
	args: {
		items: sampleItems,
		label: 'Sélectionner plusieurs prénoms',
		multiple: true,
		clearable: true,
	},
	render: (args) => {
		return {
			components: { SyAutocomplete },
			setup() {
				const selectedValues = ref([])
				return { args, selectedValues }
			},
			template: `
				<div class="pa-4">
					<SyAutocomplete
						v-model="selectedValues"
						v-bind="args"
					/>
					<div class="mt-4">
						Valeurs sélectionnées: {{ selectedValues }}
					</div>
				</div>
			`,
		}
	},
}

export const ChipsDisplay: Story = {
	parameters: {

		docs: {
			description: {
				story: 'Sélection multiple avec affichage en chips. Les options sélectionnées sont affichées sous forme de chips.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyAutocomplete
    v-model="selectedValues"
    :items="items"
    label="Prénoms sélectionnés"
    multiple
    chips
    clearable
  />
</template>
        `,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SyAutocomplete } from '@cnamts/synapse'

const selectedValues = ref([])
const items = [
  { text: 'Adrien', value: 'Adrien' },
  { text: 'Axel', value: 'Axel' },
  { text: 'Baptiste', value: 'Baptiste' },
  { text: 'Clement', value: 'Clement' },
]
</script>
        `,
			},
		],
	},
	args: {
		items: sampleItems.slice(0, 4),
		label: 'Prénoms sélectionnés',
		multiple: true,
		chips: true,
		clearable: true,
	},
	render: (args) => {
		return {
			components: { SyAutocomplete },
			setup() {
				const selectedValues = ref([])
				return { args, selectedValues }
			},
			template: `
				<div class="pa-4">
					<SyAutocomplete
						v-model="selectedValues"
						v-bind="args"
					/>
				</div>
			`,
		}
	},
}

export const ChipsWithCustomSelectionText: Story = {
	parameters: {
		docs: {
			description: {
				story: 'En mode multiple, `selectionText` permet d\'afficher un texte personnalisé dans l\'input à la place de la liste des éléments sélectionnés. Utile pour indiquer un nombre de sélections (ex : "3 colonnes sélectionnées") plutôt que d\'énumérer chaque valeur.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyAutocomplete
    v-model="selectedColumns"
    :items="columns"
    label="Colonnes affichées"
    multiple
    clearable
    :selection-text="(selected) => \`\${selected.length} colonne\${selected.length > 1 ? 's' : ''} sélectionnée\${selected.length > 1 ? 's' : ''}\`"
  />
  <div class="mt-4">Valeurs : {{ selectedColumns }}</div>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SyAutocomplete } from '@cnamts/synapse'

const selectedColumns = ref([])
const columns = [
  { text: 'Nom', value: 'name' },
  { text: 'Prénom', value: 'firstname' },
  { text: 'Date de naissance', value: 'birthdate' },
  { text: 'Numéro de sécurité sociale', value: 'nss' },
  { text: 'Adresse', value: 'address' },
]
</script>
`,
			},
		],
	},
	args: {
		items: [
			{ text: 'Nom', value: 'name' },
			{ text: 'Prénom', value: 'firstname' },
			{ text: 'Date de naissance', value: 'birthdate' },
			{ text: 'Numéro de sécurité sociale', value: 'nss' },
			{ text: 'Adresse', value: 'address' },
		],
		label: 'Colonnes affichées',
		multiple: true,
		clearable: true,
		selectionText: (selected: unknown[]) => `${selected.length} colonne${selected.length > 1 ? 's' : ''} sélectionnée${selected.length > 1 ? 's' : ''}`,
	},
	render: (args) => {
		return {
			components: { SyAutocomplete },
			setup() {
				const selectedColumns = ref([])
				return { args, selectedColumns }
			},
			template: `
				<div class="pa-4">
					<SyAutocomplete
						v-model="selectedColumns"
						v-bind="args"
					/>
					<div class="mt-4">Valeurs : {{ selectedColumns }}</div>
				</div>
			`,
		}
	},
}

export const LoadingState: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Simule un chargement asynchrone : au clic le dropdown s\'ouvre, le loader s\'active puis les résultats apparaissent.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyAutocomplete
    v-model="selectedValue"
    :items="items"
    label="Recherche avec chargement"
    :loading="isLoading"
	@click="loadOnClick"
  />
</template>
        `,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SyAutocomplete } from '@cnamts/synapse'

const selectedValue = ref('')
const isLoading = ref(false)
const items = ref([])
let timeout = null

const allItems = [
  { text: 'Option 1', value: '1' },
  { text: 'Option 2', value: '2' },
  { text: 'Option 3', value: '3' },
  { text: 'Option 4', value: '4' },
  { text: 'Option 5', value: '5' },
]

const loadOnClick = () => {
  isLoading.value = true
  items.value = []
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => {
    items.value = allItems
    isLoading.value = false
  }, 1000)
}
</script>
        `,
			},
		],
	},
	args: {
		label: 'Recherche avec chargement',
	},
	render: (args) => {
		return {
			components: { SyAutocomplete },
			setup() {
				const selectedValue = ref('')
				const isLoading = ref(false)
				const items = ref<{ text: string, value: string }[]>([])
				let timeout: ReturnType<typeof setTimeout> | null = null

				const allItems = [
					{ text: 'Option 1', value: '1' },
					{ text: 'Option 2', value: '2' },
					{ text: 'Option 3', value: '3' },
					{ text: 'Option 4', value: '4' },
					{ text: 'Option 5', value: '5' },
				]

				const loadOnClick = () => {
					isLoading.value = true
					items.value = []
					if (timeout) clearTimeout(timeout)
					timeout = setTimeout(() => {
						items.value = allItems
						isLoading.value = false
					}, 1000)
				}

				return { args, selectedValue, isLoading, items, loadOnClick }
			},
			template: `
				<div class="pa-4">
					<SyAutocomplete
						v-model="selectedValue"
						v-bind="args"
						:items="items"
						:loading="isLoading"
						@click="loadOnClick"
					/>
				</div>
			`,
		}
	},
}

export const HideDetails: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <div class="d-flex flex-column gap-4">
    <!-- Sans hide-details : la zone de messages est réservée (espace visible) -->
    <SyAutocomplete
      v-model="value1"
      :items="items"
      label="Avec zone de messages (défaut)"
      has-success
      :success-messages="['Sélection valide']"
    />

    <!-- Avec hide-details : la zone est masquée, même en état success -->
    <SyAutocomplete
      v-model="value2"
      :items="items"
      label="Sans zone de messages (hide-details)"
      has-success
      :success-messages="['Sélection valide']"
      hide-details
    />
  </div>
</template>
        `,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SyAutocomplete } from '@cnamts/synapse'

const items = [
  { text: 'Option 1', value: '1' },
  { text: 'Option 2', value: '2' },
  { text: 'Option 3', value: '3' },
]
const value1 = ref('1')
const value2 = ref('1')
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
	},
	render: (args) => {
		return {
			components: { SyAutocomplete },
			setup() {
				const value1 = ref('1')
				const value2 = ref('1')
				return { args, value1, value2 }
			},
			template: `
				<div class="pa-4 d-flex flex-column" style="gap: 16px;">
					<SyAutocomplete
						v-model="value1"
						v-bind="args"
						label="Avec zone de messages (défaut)"
						:has-success="true"
						:success-messages="['Sélection valide']"
					/>
					<SyAutocomplete
						v-model="value2"
						v-bind="args"
						label="Sans zone de messages (hide-details)"
						:has-success="true"
						:success-messages="['Sélection valide']"
						:hide-details="true"
					/>
				</div>
			`,
		}
	},
}

export const DisableErrorHandling: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<div class="d-flex flex-column gap-4">
		<SyAutocomplete
			v-model="value1"
			:items="items"
			label="Avec validation interne (défaut)"
			required
		/>

		<SyAutocomplete
			v-model="value2"
			:items="items"
			label="Validation interne désactivée"
			required
			disable-error-handling
		/>
	</div>
</template>
				`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SyAutocomplete } from '@cnamts/synapse'

const items = [
	{ text: 'Option 1', value: '1' },
	{ text: 'Option 2', value: '2' },
	{ text: 'Option 3', value: '3' },
]

const value1 = ref(null)
const value2 = ref(null)
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
	},
	render: (args) => {
		return {
			components: { SyAutocomplete },
			setup() {
				const value1 = ref(null)
				const value2 = ref(null)
				return { args, value1, value2 }
			},
			template: `
				<div class="pa-4 d-flex flex-column" style="gap: 16px;">
					<SyAutocomplete
						v-model="value1"
						v-bind="args"
						label="Avec validation interne (défaut)"
						required
					/>
					<SyAutocomplete
						v-model="value2"
						v-bind="args"
						label="Validation interne désactivée"
						required
						disable-error-handling
					/>
				</div>
			`,
		}
	},
}

export const ReadonlyField: Story = {
	parameters: {

		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyAutocomplete
    v-model="selectedValue"
    :items="items"
    label="Champ en lecture seule"
    readonly
  />
</template>
        `,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SyAutocomplete } from '@cnamts/synapse'

const selectedValue = ref('Axel')
const items = [
  { text: 'Adrien', value: 'Adrien' },
  { text: 'Axel', value: 'Axel' },
  { text: 'Baptiste', value: 'Baptiste' },
]
</script>
        `,
			},
		],
	},
	args: {
		items: [
			{ text: 'Adrien', value: 'Adrien' },
			{ text: 'Axel', value: 'Axel' },
			{ text: 'Baptiste', value: 'Baptiste' },
		],
		label: 'Champ en lecture seule',
		readonly: true,
	},
	render: (args) => {
		return {
			components: { SyAutocomplete },
			setup() {
				const selectedValue = ref('Axel')
				return { args, selectedValue }
			},
			template: `
				<div class="pa-4">
					<SyAutocomplete
						v-model="selectedValue"
						v-bind="args"
					/>
				</div>
			`,
		}
	},
}

export const DisabledField: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyAutocomplete
    v-model="selectedValue"
    :items="items"
    label="Champ désactivé"
    disabled
  />
</template>
        `,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SyAutocomplete } from '@cnamts/synapse'

const selectedValue = ref('Axel')
const items = [
  { text: 'Adrien', value: 'Adrien' },
  { text: 'Axel', value: 'Axel' },
  { text: 'Baptiste', value: 'Baptiste' },
]
</script>
        `,
			},
		],
	},
	args: {
		items: [
			{ text: 'Adrien', value: 'Adrien' },
			{ text: 'Axel', value: 'Axel' },
			{ text: 'Baptiste', value: 'Baptiste' },
		],
		label: 'Champ désactivé',
		disabled: true,
	},
	render: (args) => {
		return {
			components: { SyAutocomplete },
			setup() {
				const selectedValue = ref('Axel')
				return { args, selectedValue }
			},
			template: `
				<div class="pa-4">
					<SyAutocomplete
						v-model="selectedValue"
						v-bind="args"
					/>
				</div>
			`,
		}
	},
}

export const WithCustomKeys: Story = {
	parameters: {

		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyAutocomplete
    v-model="selectedValue"
    :items="items"
    label="Recherche avec clés personnalisées"
    text-key="label"
    value-key="id"
  />
</template>
        `,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SyAutocomplete } from '@cnamts/synapse'

const selectedValue = ref('')
const items = [
  { label: 'Premier choix', id: '1' },
  { label: 'Deuxième choix', id: '2' },
  { label: 'Troisième choix', id: '3' },
]
</script>
        `,
			},
		],
	},
	args: {
		items: [
			{ label: 'Premier choix', id: '1' },
			{ label: 'Deuxième choix', id: '2' },
			{ label: 'Troisième choix', id: '3' },
		],
		label: 'Recherche avec clés personnalisées',
		textKey: 'label',
		valueKey: 'id',
	},
	render: (args) => {
		return {
			components: { SyAutocomplete },
			setup() {
				const selectedValue = ref('')
				return { args, selectedValue }
			},
			template: `
				<div class="pa-4">
					<SyAutocomplete
						v-model="selectedValue"
						v-bind="args"
					/>
				</div>
			`,
		}
	},
}

export const FormValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Le champ requis ne montre l\'erreur qu\'après interaction (blur/submit), pas au mount.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyForm @submit="onSubmit">
    <SyAutocomplete
      v-model="value"
      :items="items"
      label="Recherche obligatoire"
      required
      display-asterisk
      class="mb-4"
    />
    <VBtn type="submit" color="primary">Soumettre</VBtn>
  </SyForm>
</template>
        `,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SyAutocomplete, SyForm } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

const value = ref('')
const items = [
  { text: 'Option 1', value: '1' },
  { text: 'Option 2', value: '2' },
  { text: 'Option 3', value: '3' }
]

const onSubmit = (event) => {
  if (event.isValid) {
    alert('Formulaire valide : ' + JSON.stringify(value.value))
  } else {
    alert('Formulaire invalide : veuillez choisir une option.')
  }
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
		label: 'Recherche obligatoire',
		required: true,
		displayAsterisk: true,
	},
	render: (args) => {
		return {
			components: { SyAutocomplete, SyForm, VBtn },
			setup() {
				const value = ref('')

				const onSubmit = (event: { isValid: boolean }) => {
					if (event.isValid) {
						alert(`Formulaire valide : ${JSON.stringify(value.value)}`)
					}
					else {
						alert('Formulaire invalide : veuillez choisir une option.')
					}
				}

				return { args, value, onSubmit }
			},
			template: `
				<div class="pa-4">
					<SyForm @submit="onSubmit">
						<SyAutocomplete
							v-model="value"
							v-bind="args"
							class="mb-4"
						/>
						<VBtn type="submit" color="primary">Soumettre</VBtn>
					</SyForm>
				</div>
			`,
		}
	},
}

export const VuetifyValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Exemple d\'utilisation de la validation native Vuetify via la prop `useVuetifyValidation`. Les règles sont définies au format Vuetify : des fonctions retournant `true` ou un message d\'erreur. Soumettez le formulaire pour déclencher la validation.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyForm @submit="onSubmit">
    <SyAutocomplete
      v-model="value"
      :items="items"
      label="Option"
      use-vuetify-validation
      :show-success-messages="false"
      :rules="[v => !!v || 'Ce champ est requis']"
    />
    <VBtn type="submit" color="primary" class="mt-4">
      Soumettre
    </VBtn>
  </SyForm>
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SyAutocomplete, SyForm } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

const value = ref(null)
const items = [
  { text: 'Option 1', value: '1' },
  { text: 'Option 2', value: '2' },
  { text: 'Option 3', value: '3' },
]

function onSubmit(event: { isValid: boolean }) {
  if (event.isValid) {
    alert('Formulaire valide : ' + value.value)
  } else {
    alert('Formulaire invalide : veuillez choisir une option.')
  }
}
</script>`,
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
		'useVuetifyValidation': true,
		'showSuccessMessages': false,
		'onUpdate:modelValue': fn(),
	},
	render: args => ({
		components: { SyAutocomplete, SyForm, VBtn },
		setup() {
			const value = ref(null)

			function onSubmit(event: { isValid: boolean }) {
				if (event.isValid) {
					alert(`Formulaire valide : ${value.value}`)
				}
				else {
					alert('Formulaire invalide : veuillez choisir une option.')
				}
			}

			return { args, value, onSubmit }
		},
		template: `
			<div class="pa-4">
				<SyForm @submit="onSubmit">
					<SyAutocomplete
						v-model="value"
						v-bind="args"
						:rules="[v => !!v || 'Ce champ est requis']"
					/>
					<VBtn
						type="submit"
						color="primary"
						class="mt-4"
					>
						Soumettre
					</VBtn>
				</SyForm>
			</div>
		`,
	}),
}
