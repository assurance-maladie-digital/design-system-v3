import type { Meta, StoryObj } from '@storybook/vue3'
import SyAutocomplete from './SyAutocomplete.vue'
import SyForm from '../../SyForm/SyForm.vue'
import AccessibilityDocs from './accessibilite/Accessibility.mdx'
import { ref } from 'vue'
import { fn } from '@storybook/test'
import { VBtn } from 'vuetify/components'

const meta: Meta<typeof SyAutocomplete> = {
	title: 'Composants/Formulaires/Selects/SyAutocomplete',
	component: SyAutocomplete,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['selectedValue', 'isOpen', 'closeList'] },
		docs: { page: AccessibilityDocs },
	},
	args: {
		'onUpdate:modelValue': fn(),
	},
	argTypes: {
		'bgColor': {
			control: 'text',
			description: 'Couleur de fond du champ',
		},
		'chips': {
			control: 'boolean',
			description: 'Affiche les options sélectionnées sous forme de chips',
		},
		'clearable': {
			control: 'boolean',
			description: 'Permet de vider la sélection',
		},
		'customRules': {
			control: 'object',
			description: 'Règles de validation personnalisées',
		},
		'customSuccessRules': {
			control: 'object',
			description: 'Règles de succès personnalisées',
		},
		'customWarningRules': {
			control: 'object',
			description: 'Règles d\'avertissement personnalisées',
		},
		'debounce': {
			control: 'number',
			description: 'Délai en millisecondes avant le filtrage (défaut: 200)',
		},
		'density': {
			control: 'select',
			options: ['default', 'comfortable', 'compact'],
			description: 'Définit la densité du champ',
		},
		'disableErrorHandling': {
			control: 'boolean',
			description: 'Désactive la gestion des erreurs',
		},
		'displayAsterisk': {
			control: 'boolean',
			description: 'Affiche un astérisque pour les champs obligatoires',
		},
		'errorMessages': {
			control: 'object',
			description: 'Messages d\'erreur personnalisés',
		},
		'filter': {
			control: 'boolean',
			description: 'Active le filtrage des options basé sur la saisie',
		},
		'hasError': {
			control: 'boolean',
			description: 'Indique si le champ a une erreur',
		},
		'hasSuccess': {
			control: 'boolean',
			description: 'Indique si le champ est en succès',
		},
		'hasWarning': {
			control: 'boolean',
			description: 'Indique si le champ a un avertissement',
		},
		'hideNoData': {
			control: 'boolean',
			description: 'Cache le message "aucune option" quand la liste est vide',
		},
		'isValidateOnBlur': {
			control: 'boolean',
			description: 'Valide le champ à la perte de focus',
		},
		'items': { control: 'object' },
		'label': {
			control: 'text',
			description: 'Libellé du champ',
		},
		'loading': {
			control: 'boolean',
			description: 'Affiche un indicateur de chargement',
		},
		'menuId': {
			control: 'text',
			description: 'ID personnalisé pour le menu',
		},
		'modelValue': { control: 'text' },
		'multiple': {
			control: 'boolean',
			description: 'Permet la sélection multiple d\'options',
		},
		'noDataText': {
			control: 'text',
			description: 'Texte affiché quand aucune option n\'est disponible',
		},
		'placeholder': {
			control: 'text',
			description: 'Texte d\'indice affiché quand le champ est vide',
		},
		'plainTextKey': {
			control: 'text',
			description: 'Nom de la propriété pour le texte brut de filtrage',
		},
		'onSearch': {
			action: 'search',
			description: 'Émis à chaque frappe dans le champ. Reçoit la valeur saisie en paramètre. Utile pour déclencher des recherches asynchrones.',
		},
		'onUpdate:modelValue': {
			action: 'update:modelValue',
			description: 'Émis lors de la sélection d\'une option. Reçoit la valeur sélectionnée.',
		},
		'readonly': {
			control: 'boolean',
			description: 'Rend le champ en lecture seule',
		},
		'required': {
			control: 'boolean',
			description: 'Marque le champ comme obligatoire',
		},
		'returnObject': {
			control: 'boolean',
			description: 'Retourne l\'objet complet sélectionné',
		},
		'showSuccessMessages': {
			control: 'boolean',
			description: 'Affiche les messages de succès',
		},
		'successMessages': {
			control: 'object',
			description: 'Messages de succès personnalisés',
		},
		'textKey': {
			control: 'text',
			description: 'Nom de la propriété qui contient le texte à afficher',
		},
		'valueKey': {
			control: 'text',
			description: 'Nom de la propriété qui contient la valeur à retourner',
		},
		'selectionText': {
			control: false,
			description: 'Fonction de personnalisation du texte affiché dans l\'input en mode multiple. Reçoit le tableau des valeurs sélectionnées et retourne une chaîne.',
		},
		'warningMessages': {
			control: 'object',
			description: 'Messages d\'avertissement personnalisés',
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

export const ExternalErrorToggle: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Démontre l\'affichage d\'un message d\'erreur externe injecté via `error-messages`.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyAutocomplete
    v-model="value"
    :items="items"
    label="Erreur serveur"
    :error-messages="errorMessages"
  />
  <VBtn class="mt-2" @click="triggerError">Déclencher l'erreur</VBtn>
  <VBtn class="mt-2 ml-2" variant="text" @click="clearError">Effacer</VBtn>
</template>
        `,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SyAutocomplete } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

const value = ref('')
const items = [
  { text: 'Option 1', value: '1' },
  { text: 'Option 2', value: '2' }
]
const errorMessages = ref<string[]>([])

const triggerError = () => {
  errorMessages.value = ['Erreur serveur : sélection invalide']
}

const clearError = () => {
  errorMessages.value = []
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
		],
		label: 'Erreur serveur',
	},
	render: (args) => {
		return {
			components: { SyAutocomplete, VBtn },
			setup() {
				const value = ref('')
				const errorMessages = ref<string[]>([])
				const triggerError = () => {
					errorMessages.value = ['Erreur serveur : sélection invalide']
				}
				const clearError = () => {
					errorMessages.value = []
				}
				return { args, value, errorMessages, triggerError, clearError }
			},
			template: `
				<div class="pa-4 d-flex flex-column gap-2">
					<SyAutocomplete
						v-model="value"
						v-bind="args"
						:error-messages="errorMessages"
					/>
					<div class="d-flex align-center gap-2">
						<VBtn color="error" @click="triggerError">Déclencher l'erreur</VBtn>
						<VBtn variant="text" @click="clearError">Effacer</VBtn>
					</div>
				</div>
			`,
		}
	},
}

export const WarningSuccessMessages: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Déclenche un warning si "Option 1" est choisi et un succès si "Option 2" est choisi.',
			},
		},
	},
	args: {
		items: [
			{ text: 'Option 1', value: '1' },
			{ text: 'Option 2', value: '2' },
		],
		label: 'Avec warning & succès',
	},
	render: (args) => {
		return {
			components: { SyAutocomplete },
			setup() {
				const value = ref('')
				const warningMessages = ref<string[]>([])
				const successMessages = ref<string[]>([])

				const handleChange = (newVal: unknown) => {
					value.value = newVal as string
					warningMessages.value = newVal === '1' ? ['Attention: Option 1 choisie'] : []
					successMessages.value = newVal === '2' ? ['Succès: Option 2 valide'] : []
				}

				return { args, value, warningMessages, successMessages, handleChange }
			},
			template: `
				<div class="pa-4">
					<SyAutocomplete
						v-model="value"
						v-bind="args"
						:warning-messages="warningMessages"
						:success-messages="successMessages"
						@update:modelValue="handleChange"
					/>
				</div>
			`,
		}
	},
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

export const RequiredField: Story = {
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
