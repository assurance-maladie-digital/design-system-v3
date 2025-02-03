import type { Meta, StoryObj } from '@storybook/vue3'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
import { VIcon } from 'vuetify/components'
import { ref } from 'vue'
import { mdiAccountBox } from '@mdi/js'

const meta = {
	title: 'Composants/Formulaires/SyTextField',
	component: SyTextField,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['modelValue', 'appendInnerIconColor'] },
	},
	argTypes: {
		modelValue: { control: 'text' },
		label: { control: 'text' },
		prependIcon: {
			control: 'select',
			options: ['info', 'success', 'warning', 'error', 'close'],
		},
		appendIcon: {
			control: 'select',
			options: ['info', 'success', 'warning', 'error', 'close'],
		},
		prependInnerIcon: {
			control: 'select',
			options: ['info', 'success', 'warning', 'error', 'close'],
		},
		appendInnerIcon: {
			control: 'select',
			options: ['info', 'success', 'warning', 'error', 'close'],
		},
		variantStyle: {
			control: 'select',
			options: ['outlined', 'plain', 'underlined', 'filled', 'solo', 'solo-inverted', 'solo-filled'],
		},
		color: {
			control: 'select',
			options: ['primary', 'secondary', 'success', 'error', 'warning'],
			description: 'Couleur du champ',
		},
		density: {
			control: 'select',
			options: ['default', 'comfortable', 'compact'],
			description: 'Densité du champ',
		},
		direction: {
			control: 'select',
			options: ['horizontal', 'vertical'],
			description: 'Direction d\'affichage',
		},
		type: {
			control: 'select',
			options: ['text', 'number', 'password', 'email', 'tel', 'url', 'search', 'date', 'time', 'datetime-local'],
			description: 'Type d\'input HTML',
		},
		baseColor: {
			control: 'color',
			description: 'Couleur de base personnalisée',
		},
		bgColor: {
			control: 'color',
			description: 'Couleur de fond personnalisée',
		},
		width: {
			control: 'text',
			description: 'Largeur du champ (px, %, vh, etc.)',
		},
		maxWidth: {
			control: 'text',
			description: 'Largeur maximale (px, %, vh, etc.)',
		},
		minWidth: {
			control: 'text',
			description: 'Largeur minimale (px, %, vh, etc.)',
		},
		rounded: {
			control: 'select',
			options: [true, false, 0, 'sm', 'lg', 'xl', 'pill'],
			description: 'Style des coins arrondis',
		},
		required: {
			control: 'boolean',
			description: 'Champ obligatoire',
		},
		isReadOnly: {
			control: 'boolean',
			description: 'Mode lecture seule',
		},
		isDisabled: {
			control: 'boolean',
			description: 'Désactive le champ',
		},
		isClearable: {
			control: 'boolean',
			description: 'Affiche un bouton pour effacer',
		},
		isTiled: {
			control: 'boolean',
			description: 'Style tuile',
		},
		isFlat: {
			control: 'boolean',
			description: 'Sans élévation',
		},
		isActive: {
			control: 'boolean',
			description: 'Force l\'état actif',
		},
		isFocused: {
			control: 'boolean',
			description: 'Force l\'état focus',
		},
		isDirty: {
			control: 'boolean',
			description: 'Indique si modifié',
		},
		isOnError: {
			control: 'boolean',
			description: 'Force l\'état erreur',
		},
		displayAsterisk: {
			control: 'boolean',
			description: 'Affiche l\'astérisque requis',
		},
		displayPersistentClear: {
			control: 'boolean',
			description: 'Bouton effacer toujours visible',
		},
		displayPersistentCounter: {
			control: 'boolean',
			description: 'Compteur toujours visible',
		},
		displayPersistentHint: {
			control: 'boolean',
			description: 'Aide toujours visible',
		},
		displayPersistentPlaceholder: {
			control: 'boolean',
			description: 'Placeholder toujours visible',
		},
		areDetailsHidden: {
			control: 'select',
			options: [true, false, 'auto'],
			description: 'Masque les détails',
		},
		areSpinButtonsHidden: {
			control: 'boolean',
			description: 'Masque les boutons number',
		},
		noIcon: {
			control: 'boolean',
			description: 'Masque toutes les icônes',
		},
		centerAffix: {
			control: 'boolean',
			description: 'Centre les affixes',
		},
		counter: {
			control: 'select',
			options: [true, false, 'words', 'characters'],
			description: 'Type de compteur',
		},
		counterValue: {
			control: 'number',
			description: 'Valeur du compteur',
		},
		maxErrors: {
			control: 'number',
			description: 'Nombre max d\'erreurs',
		},
		errorMessages: {
			control: 'object',
			description: 'Messages d\'erreur',
		},
		messages: {
			control: 'object',
			description: 'Messages additionnels',
		},
		hint: {
			control: 'text',
			description: 'Message d\'aide',
		},
		placeholder: {
			control: 'text',
			description: 'Texte indicatif',
		},
		prefix: {
			control: 'text',
			description: 'Texte avant la valeur',
		},
		suffix: {
			control: 'text',
			description: 'Texte après la valeur',
		},
		id: {
			control: 'text',
			description: 'ID HTML',
		},
		name: {
			control: 'text',
			description: 'Nom du champ',
		},
		role: {
			control: 'text',
			description: 'Rôle ARIA',
		},
		theme: {
			control: 'text',
			description: 'Thème personnalisé',
		},
		loading: {
			control: 'boolean',
			description: 'État de chargement',
		},
	},
} as Meta<typeof SyTextField>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SyTextField v-model="value" />
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { SyTextField } from '@cnamts/synapse'
				</script>
				`,
			},
		],
	},
	args: {
		showDivider: false,
		variantStyle: 'outlined',
		color: 'primary',
		isClearable: true,
		label: 'Label',
		modelValue: '',
	},
	render: (args) => {
		return {
			components: { SyTextField, VIcon },
			setup() {
				const value = ref('')
				return { args, value }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<SyTextField v-bind="args" v-model="value" />
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
					<SyTextField 
						v-model="value" 
						required
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { SyTextField } from '@cnamts/synapse'
				</script>
				`,
			},
		],
	},
	args: {
		showDivider: false,
		variantStyle: 'outlined',
		color: 'primary',
		isClearable: true,
		label: 'Label',
		required: true,
		modelValue: '',
	},
	render: (args) => {
		return {
			components: { SyTextField, VIcon },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<SyTextField v-bind="args" />
				</div>
			`,
		}
	},
}

export const WithCustomError: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SyTextField 
						v-model="value" 
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
					import { SyTextField } from '@cnamts/synapse'
					
					const errorMessages = ref([])
					
					const triggerError = () => {
						errorMessages.value = ['This is a test error message']
					}
				</script>
				`,
			},
		],
	},
	args: {
		showDivider: false,
		variantStyle: 'outlined',
		color: 'primary',
		isClearable: true,
		label: 'Label',
		required: false,
		modelValue: '',
	},
	render: (args) => {
		return {
			components: { SyTextField, VIcon },
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
					<SyTextField v-bind="args" :error-messages="errorMessages" />
				</div>
				<VBtn class="ml-8" @click="triggerError">
					Trigger Error
				</VBtn>
			`,
		}
	},
}

export const SlotPrepend: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SyTextField 
						v-model="value" 
						prepend-icon="info"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { SyTextField } from '@cnamts/synapse'
				</script>
				`,
			},
		],
	},
	args: {
		variantStyle: 'outlined',
		isClearable: true,
		showDivider: false,
		label: 'Label',
		color: 'primary',
		prependIcon: 'info',
		modelValue: '',
	},
	render: (args) => {
		return {
			components: { SyTextField, VIcon },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<SyTextField
						v-bind="args"
						:label="args.label"
						:prepend-icon="args.prependIcon"
					/>
				</div>
			`,
		}
	},
}

export const SlotAppend: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SyTextField 
						v-model="value" 
						append-icon="success"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { SyTextField } from '@cnamts/synapse'
				</script>
				`,
			},
		],
	},
	args: {
		variantStyle: 'outlined',
		isClearable: true,
		showDivider: false,
		label: 'champs de text',
		color: 'primary',
		appendIcon: 'success',
		modelValue: '',
	},
	render: (args) => {
		return {
			components: { SyTextField, VIcon },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<SyTextField
						v-bind="args"
						:append-icon="args.appendIcon"
					/>
				</div>
			`,
		}
	},
}

export const SlotPrependInner: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SyTextField 
						v-model="value" 
						prepend-inner-icon="info"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { SyTextField } from '@cnamts/synapse'
				</script>
				`,
			},
		],
	},
	args: {
		variantStyle: 'outlined',
		isClearable: true,
		showDivider: false,
		label: 'Label',
		color: 'primary',
		prependInnerIcon: 'info',
		modelValue: '',
	},
	render: (args) => {
		return {
			components: { SyTextField, VIcon },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<SyTextField
						v-bind="args"
						:prepend-inner-icon="args.prependInnerIcon"
					/>
				</div>
			`,
		}
	},
}

export const SlotPrependInnerDivider: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SyTextField 
						v-model="value" 
						prepend-inner-icon="info"
						show-divider
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { SyTextField } from '@cnamts/synapse'
				</script>
				`,
			},
		],
	},
	args: {
		variantStyle: 'outlined',
		isClearable: true,
		showDivider: true,
		label: 'Label',
		color: 'primary',
		prependInnerIcon: 'info',
		modelValue: '',
	},
	render: (args) => {
		return {
			components: { SyTextField, VIcon },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<SyTextField
						v-bind="args"
						:prepend-inner-icon="args.prependInnerIcon"
						:show-divider="args.showDivider"
					/>
				</div>
			`,
		}
	},
}

export const SlotAppendInner: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SyTextField 
						v-model="value" 
						append-inner-icon="success"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { SyTextField } from '@cnamts/synapse'
				</script>
				`,
			},
		],
	},
	args: {
		variantStyle: 'outlined',
		isClearable: true,
		showDivider: false,
		label: 'Label',
		color: 'primary',
		appendInnerIcon: 'success',
		modelValue: '',
	},
	render: (args) => {
		return {
			components: { SyTextField, VIcon },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<SyTextField
						v-bind="args"
						:append-inner-icon="args.appendInnerIcon"
					/>
				</div>
			`,
		}
	},
}

export const SlotCustomIcon: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SyTextField v-model="value">
						<template #append-inner>
							<VIcon>
								{{ iconName }}
							</VIcon>
						</template>
					</SyTextField>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { SyTextField } from '@cnamts/synapse'
					import { mdiAccountBox } from '@mdi/js'
					
					const iconName = mdiAccountBox
				</script>
				`,
			},
		],
	},
	args: {
		variantStyle: 'outlined',
		isClearable: true,
		showDivider: false,
		label: 'Label',
		color: 'primary',
		modelValue: '',
	},
	render: (args) => {
		return {
			components: { SyTextField, VIcon },
			setup() {
				const iconName = ref(mdiAccountBox)

				return { args, iconName }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<SyTextField
						v-bind="args"
					>
						<template #append-inner>
							<VIcon>
								{{ iconName }}
							</VIcon>
						</template>
					</SyTextField>
				</div>
			`,
		}
	},
}
