import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
import { VIcon } from 'vuetify/components'
import { ref, watch } from 'vue'
import { mdiAccountBox } from '@mdi/js'
import { getValidationDocumentation } from '@/composables/unifyValidation/documentationValidationProps'
import { fn } from 'storybook/test'
import type { SyTextFieldProps } from './types'

const meta = {
	title: 'Composants/Formulaires/SyTextField',
	component: SyTextField,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: `SyTextField`,
			},
		},
		controls: {
			exclude: /^on*/,
		},
	},
	argTypes: {
		...getValidationDocumentation('string'),
		'locales': {
			description: 'Surcharge des chaînes affichées à l\'utilisateur (libellés d\'accessibilité et messages de validation). Les valeurs par défaut sont définies dans le fichier `locales.ts` du composant. La prop accepte un objet partiel : seules les clés renseignées surchargent les valeurs par défaut, le reste est conservé.',
			control: 'object',
			table: {
				type: { summary: 'SyTextFieldLocales', detail: `{
	requiredField: (label: string) => string,
	increment: (label: string) => string,
	decrement: (label: string) => string,
	clear: (label: string) => string,
	loading: (label: string) => string,
}` },
				category: 'props',
			},
		},
		'modelValue': { control: 'text' },
		'label': {
			description: 'Texte affiché comme label du champ',
			control: 'text',
			table: {
				type: { summary: 'string' },
			},
		},
		'autocomplete': {
			description: 'Valeur de l\'attribut autocomplete',
			control: 'text',
			table: {
				type: { summary: 'on|off' },
			},
		},
		'prependIcon': {
			control: 'select',
			options: ['info', 'success', 'warning', 'error', 'close'],
			table: {
				type: { summary: 'string' },
			},
		},
		'appendIcon': {
			control: 'select',
			options: ['info', 'success', 'warning', 'error', 'close'],
			table: {
				type: { summary: 'string' },
			},
		},
		'prependInnerIcon': {
			control: 'select',
			options: ['info', 'success', 'warning', 'error', 'close'],
			table: {
				type: { summary: 'string' },
			},
		},
		'appendInnerIcon': {
			control: 'select',
			options: ['info', 'success', 'warning', 'error', 'close'],
			table: {
				type: { summary: 'string' },
			},
		},
		'variantStyle': {
			control: 'select',
			options: ['outlined', 'plain', 'underlined', 'filled', 'solo', 'solo-inverted', 'solo-filled'],
			table: {
				type: { summary: 'string' },
			},
		},
		'color': {
			control: 'select',
			options: ['primary', 'secondary', 'success', 'error', 'warning'],
			description: 'Couleur du champ',
			table: {
				type: { summary: 'string' },
			},
		},
		'density': {
			control: 'select',
			options: ['default', 'comfortable', 'compact'],
			description: 'Densité du champ',
			table: {
				type: { summary: 'string' },
			},
		},
		'isActive': {
			description: 'Force l\'état actif du champ (label flottant et styles visuels)',
			control: 'boolean',
			default: false,
			table: {
				type: { summary: 'boolean' },
			},
		},
		'isClearable': {
			description: 'Affiche un bouton pour effacer le contenu du champ',
			control: 'boolean',
			default: false,
			table: {
				type: { summary: 'boolean' },
			},
		},
		'prependTooltip': {
			description: 'Si le texte du prepend tooltip est renseigné alors l\'icône du  tooltip s\'affiche',
			control: 'text',
			table: {
				type: { summary: 'string' },
			},
		},
		'appendTooltip': {
			description: 'Si le texte du append tooltip est renseigné alors l\'icône du  tooltip s\'affiche',
			control: 'text',
			table: {
				type: { summary: 'string' },
			},
		},
		'tooltipLocation': {
			description: 'Position des tooltips',
			control: 'select',
			options: ['top', 'bottom', 'start', 'end'],
			default: 'top',
			table: {
				type: { summary: 'string' },
			},
		},
		'displayAsterisk': {
			description: 'Affiche un astérisque à côté du label',
			control: 'boolean',
			default: false,
			table: {
				type: { summary: 'boolean' },
			},
		},
		'disableClickButton': {
			description: 'Désactive le click sur les icônes append et prepend',
			control: 'boolean',
			default: true,
			table: {
				type: { summary: 'boolean' },
			},
		},
		'baseColor': {
			description: 'Couleur de base du champ (par défaut hérite de color)',
			control: 'text',
			table: {
				type: { summary: 'string' },
			},
		},
		'bgColor': {
			description: 'Couleur de fond du champ',
			control: 'color',
			table: {
				type: { summary: 'string' },
			},
		},
		'centerAffix': {
			description: 'Centre verticalement les éléments ajoutés avant/après le champ',
			control: 'boolean',
			table: {
				type: { summary: 'boolean' },
			},
		},
		'counter': {
			description: 'Affiche un compteur de caractères',
			control: 'boolean',
			table: {
				type: { summary: 'boolean' },
			},
		},
		'counterValue': {
			description: 'Fonction personnalisée pour calculer la valeur du compteur',
			control: 'object',
			table: {
				type: { summary: '(value: unknown) => number' },
			},
		},
		'direction': {
			description: 'Direction du champ (horizontal ou vertical)',
			control: 'select',
			options: ['horizontal', 'vertical'],
			table: {
				type: { summary: 'horizontal | vertical' },
			},
		},
		'isDirty': {
			description: 'Indique si le champ a été modifié',
			control: 'boolean',
			table: {
				type: { summary: 'boolean' },
			},
		},
		'isFlat': {
			description: 'Supprime l\'élévation du champ',
			control: 'boolean',
			table: {
				type: { summary: 'boolean' },
			},
		},
		'isFocused': {
			description: 'Force l\'état focus du champ',
			control: 'boolean',
			table: {
				type: { summary: 'boolean' },
			},
		},
		'hideDetails': {
			description: 'Masque la section des détails (messages d\'erreur, compteur)',
			control: 'boolean',
			table: {
				type: { summary: 'boolean' },
			},
		},
		'areSpinButtonsHidden': {
			description: 'Masque les boutons d\'incrémentation pour les champs numériques',
			control: 'boolean',
			table: {
				type: { summary: 'boolean' },
			},
		},
		'hint': {
			description: 'Texte d\'aide affiché sous le champ',
			control: 'text',
			table: {
				type: { summary: 'string' },
			},
		},
		'helpText': {
			description: 'Texte d\'aide affiché sous le champ',
			control: 'text',
			table: {
				type: { summary: 'string' },
			},
		},
		'maxlength': {
			description: 'Nombre maximal de caractères autorisés dans le champ',
			control: { type: 'text' },
			table: {
				type: { summary: 'number' },
			},
		},
		'loading': {
			description: 'Affiche un indicateur de chargement',
			control: 'boolean',
			table: {
				type: { summary: 'boolean' },
			},
		},
		'maxWidth': {
			description: 'Largeur maximale du champ',
			control: { type: 'text' },
			table: {
				type: { summary: 'string' },
			},
		},
		'minWidth': {
			description: 'Largeur minimale du champ',
			control: { type: 'text' },
			table: {
				type: { summary: 'string' },
			},
		},
		'name': {
			description: 'Nom du champ pour les formulaires',
			control: 'text',
			table: {
				type: { summary: 'string' },
			},
		},
		'displayPersistentClear': {
			description: 'Affiche toujours le bouton de réinitialisation',
			control: 'boolean',
			default: false,
			table: {
				type: { summary: 'boolean' },
			},
		},
		'displayPersistentCounter': {
			description: 'Affiche toujours le compteur',
			control: 'boolean',
			default: false,
			table: {
				type: { summary: 'boolean' },
			},
		},
		'displayPersistentHint': {
			description: 'Affiche toujours le texte d\'aide',
			control: 'boolean',
			default: false,
			table: {
				type: { summary: 'boolean' },
			},
		},
		'displayPersistentPlaceholder': {
			description: 'Garde le placeholder visible. Si le champ est vide, le placeholder reste affiché',
			control: 'boolean',
			default: false,
			table: {
				type: { summary: 'boolean' },
			},
		},
		'placeholder': {
			description: 'Texte affiché quand le champ est vide',
			control: 'text',
			default: 'Placeholder',
			table: {
				type: { summary: 'string' },
			},
		},
		'prefix': {
			description: 'Texte affiché avant la valeur: prefix="€" : affichera "€" avant la valeur saisie',
			control: 'text',
			table: {
				type: { summary: 'string' },
			},
		},
		'isReversed': {
			description: 'Inverse l\'ordre des éléments',
			control: 'boolean',
			default: false,
			table: {
				type: { summary: 'boolean' },
			},
		},
		'role': {
			description: 'Rôle ARIA du champ',
			control: 'text',
			table: {
				type: { summary: 'string' },
			},
		},
		'rounded': {
			description: 'Arrondit les coins du champ',
			control: { type: 'text' },
			table: {
				type: { summary: 'string' },
			},
		},
		'isOnSingleLine': {
			description: 'Force l\'affichage sur une seule ligne',
			control: 'boolean',
			default: false,
			table: {
				type: { summary: 'boolean' },
			},
		},
		'suffix': {
			description: 'Texte affiché après la valeur',
			control: 'text',
			table: {
				type: { summary: 'string' },
			},
		},
		'theme': {
			description: 'Thème à appliquer au champ',
			control: 'text',
			table: {
				type: { summary: 'string' },
			},
		},
		'isTiled': {
			description: 'Applique un style tuile',
			control: 'boolean',
			default: false,
			table: {
				type: { summary: 'boolean' },
			},
		},
		'type': {
			description: 'Type du champ de saisie',
			control: 'select',
			options: ['text', 'number', 'password', 'email', 'tel', 'url', 'search'],
			default: 'text',
			table: {
				type: {
					summary: 'string',
					detail: 'text | number | password | email | tel | url | search',
				},
			},
		},
		'width': {
			description: 'Largeur du champ',
			control: { type: 'text' },
			table: {
				type: { summary: 'string' },
			},
		},
		'validateOnSubmit': {
			description: 'Valide le champ avec la valeur donnée',
			table: {
				type: { summary: '(value: string | number | null) => Promise<void>' },
			},
		},
		'append': {
			description: 'Slot pour ajouter du contenu à droite du champ',
			control: false,
			table: {
				type: { summary: 'VNode' },
				category: 'slots',
			},
		},
		'prepend': {
			description: 'Slot pour ajouter du contenu à gauche du champ',
			control: false,
			table: {
				type: { summary: 'VNode' },
				category: 'slots',
			},
		},
		'append-inner': {
			description: 'Slot pour ajouter du contenu à droite dans le champ',
			control: false,
			table: {
				type: { summary: 'VNode' },
				category: 'slots',
			},
		},
		'prepend-inner': {
			description: 'Slot pour ajouter du contenu à gauche dans le champ',
			control: false,
			table: {
				type: { summary: 'VNode' },
				category: 'slots',
			},
		},
		'details': {
			description: 'Slot pour personnaliser la section des détails (messages d\'erreur, compteur)',
			control: false,
			table: {
				type: { summary: 'VNode' },
				category: 'slots',
			},
		},
		'showDivider': {
			description: 'Affiche une ligne de séparation entre le champ et les icônes prepend-inner et append-inner',
			control: 'boolean',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
				category: 'props',
			},
		},
	},
	args: {
		'onUpdate:modelValue': fn(),
		'onKeydown': fn(),
		'onClear': fn(),
		'onPrependIconClick': fn(),
		'onAppendIconClick': fn(),
		'onFocus': fn(),
		'onBlur': fn(),
	},
} as Meta<typeof SyTextField>

export default meta

type Story = StoryObj<SyTextFieldProps>
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
			components: { SyTextField },
			setup() {
				const value = ref(args.modelValue)
				watch(() => args.modelValue, (newValue) => {
					value.value = newValue
				})
				return { args, value }
			},
			template: `
				<div class="d-flex flex-wrap align-center">
					<SyTextField v-bind="args" v-model="value" />
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
					<SyTextField 
					v-model="value" 
					help-text="Texte d'aide à la saisie"
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
		modelValue: '',
		helpText: 'Texte d\'aide à la saisie',
	},
	render: (args) => {
		return {
			components: { SyTextField, VIcon },
			setup() {
				const value = ref(args.modelValue)
				watch(() => args.modelValue, (newValue) => {
					value.value = newValue
				})
				return { args, value }
			},
			template: `
				<div>
					<SyTextField v-bind="args" v-model="value" />
				</div>
			`,
		}
	},
}

export const Required: Story = {
	args: {
		...Default.args,
		required: true,
	},
	render: (args) => {
		return {
			components: { SyTextField, VIcon },
			setup() {
				const value = ref(args.modelValue)
				watch(() => args.modelValue, (newValue) => {
					value.value = newValue
				})
				return { args, value }
			},
			template: `
    <div>
		<p class="mb-2 text-caption text-grey-darken-2">Ce champ est obligatoire</p>
     <SyTextField v-bind="args" v-model="value" />
    </div>
   `,
		}
	},
	parameters: {
		docs: {
			description: {
				story: `
### Champ requis sans astérisque

Cette story montre un champ requis sans astérisque.
Pour afficher l'astérisque sur un champ requis, il faut activer la prop \`displayAsterisk\`.`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p class="mb-2 text-caption text-grey-darken-2">Ce champ est obligatoire</p>
	<SyTextField
		v-model="value"
		required
		label="Champ requis sans astérisque"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { SyTextField } from '@cnamts/synapse'
	import { ref } from 'vue'

	const value = ref('')
</script>`,
			},
		],
	},
}

export const RequiredWithAsterisk: Story = {
	args: {
		...Default.args,
		required: true,
		displayAsterisk: true,
	},
	render: (args) => {
		return {
			components: { SyTextField, VIcon },
			setup() {
				const value = ref(args.modelValue)
				watch(() => args.modelValue, (newValue) => {
					value.value = newValue
				})
				return { args, value }
			},
			template: `
    <div class="d-flex flex-wrap align-center">
     	<SyTextField v-bind="args" v-model="value" />
    </div>
   `,
		}
	},
	parameters: {
		docs: {
			description: {
				story: `
### Champ requis avec astérisque

Cette story montre un champ requis avec astérisque.
L'astérisque ne peut être affiché que sur un champ requis, en activant la prop \`displayAsterisk\`.`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<SyTextField
		v-model="value"
		required
		display-asterisk
		label="Champ requis avec astérisque"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { SyTextField } from '@cnamts/synapse'
	import { ref } from 'vue'

	const value = ref('')
</script>`,
			},
		],
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
				const value = ref(args.modelValue)
				watch(() => args.modelValue, (newValue) => {
					value.value = newValue
				})
				return { args, value }
			},
			template: `
				<div class="d-flex flex-wrap align-center">
					<SyTextField v-bind="args" v-model="value" />
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
				const value = ref(args.modelValue)
				watch(() => args.modelValue, (newValue) => {
					value.value = newValue
				})
				return { args, value }
			},
			template: `
				<div class="d-flex flex-wrap align-center">
					<SyTextField v-bind="args" v-model="value" />
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
				const value = ref(args.modelValue)
				watch(() => args.modelValue, (newValue) => {
					value.value = newValue
				})
				return { args, value }
			},
			template: `
				<div class="d-flex flex-wrap align-center">
					<SyTextField v-bind="args" v-model="value" />
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
				const value = ref(args.modelValue)
				watch(() => args.modelValue, (newValue) => {
					value.value = newValue
				})
				return { args, value }
			},
			template: `
				<div class="d-flex flex-wrap align-center">
					<SyTextField v-bind="args" v-model="value" />
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
				const value = ref(args.modelValue)
				watch(() => args.modelValue, (newValue) => {
					value.value = newValue
				})
				return { args, value }
			},
			template: `
				<div class="d-flex flex-wrap align-center">
					<SyTextField v-bind="args" v-model="value" />
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
				const value = ref(args.modelValue)
				watch(() => args.modelValue, (newValue) => {
					value.value = newValue
				})
				const iconName = ref(mdiAccountBox)

				return { args, value, iconName }
			},
			template: `
				<div class="d-flex flex-wrap align-center">
					<SyTextField v-bind="args" v-model="value">
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

export const PatternValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: `
### Validation par expression régulière

Cette story montre l'utilisation de la règle \`matchPattern\` pour valider un format spécifique. Ici, un code postal français :
- Doit contenir exactement 5 chiffres
- Utilise une expression régulière pour la validation
- Affiche des messages personnalisés
`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<SyTextField
	v-model="value"
	label="Code postal"
	helpText="Exemple : 31000"
	autocomplete="postal-code"
	required
	:customRules="[
		{
			type: 'matchPattern',
			options: {
				pattern: /^\\d{5}$/,
				message: 'Le code postal doit contenir exactement 5 chiffres',
				successMessage: 'Le format du code postal est valide'
			}
		}
	]"
	showSuccessMessages
/>`,
			},
		],
	},
	render: args => ({
		components: { SyTextField },
		setup() {
			const value = ref('')
			return { args, value }
		},
		template: `
			<SyTextField
				v-model="value"
				v-bind="args"
				label="Code postal"
				helpText="Exemple : 31000"
				autocomplete="postal-code"
				required
				:customRules="[
					{
						type: 'matchPattern',
						options: {
							pattern: /^\\d{5}$/,
							message: 'Le code postal doit contenir exactement 5 chiffres',
							successMessage: 'Le format du code postal est valide'
						}
					}
				]"
				showSuccessMessages
			/>
		`,
	}),
}

// Persistent value for WithTooltips
const withTooltipsValueMain = ref('')

export const WithTooltips: Story = {
	args: {
		label: 'Champ avec tooltips',
		prependTooltip: 'Information à gauche du champ',
		appendTooltip: 'Information à droite du champ',
		tooltipLocation: 'top',
		isClearable: true,
		disableClickButton: true,
	},
	render: args => ({
		components: { SyTextField },
		setup() {
			return { args, value: withTooltipsValueMain }
		},
		template: `
			<div>
				<p class="mb-4">
					Des icônes d'information avec tooltips sont affichées de chaque côté du champ.
					Survolez-les pour voir les messages d'aide qui apparaissent en haut grâce à la prop tooltipLocation="top".
				</p>
				<SyTextField
					v-model="value"
					v-bind="args"
				/>
			</div>
		`,
	}),
	parameters: {
		docs: {
			description: {
				story: 'Exemple de champ avec des tooltips d\'information. Les icônes d\'information apparaissent automatiquement lorsque les props prependTooltip et/ou appendTooltip sont renseignées. La position des tooltips peut être contrôlée avec la prop tooltipLocation.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyTextField
		v-model="value"
		label="Champ avec tooltips"
		prependTooltip="Information à gauche du champ"
		appendTooltip="Information à droite du champ"
		tooltipLocation="top"
	/>
</template>
				`,
			},
		],
	},
}

export const WithPrefixAndSuffix: Story = {
	args: {
		modelValue: '42',
		label: 'Montant',
		prefix: '€',
		suffix: 'TTC',
	},
	render: args => ({
		components: { SyTextField },
		setup() {
			const value = ref(args.modelValue)
			return { args, value }
		},
		template: `
			<div>
				<p class="mb-4">
					Utilisation des props prefix et suffix pour ajouter des unités ou des informations complémentaires
					directement dans le champ.
				</p>
				<SyTextField
					v-model="value"
					v-bind="args"
				/>
			</div>
		`,
	}),
	parameters: {
		docs: {
			description: {
				story: 'Exemple d\'utilisation des props prefix et suffix pour ajouter des informations complémentaires directement dans le champ de saisie.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyTextField
		v-model="value"
		label="Montant"
		prefix="€"
		suffix="TTC"
	/>
</template>
				`,
			},
		],
	},
}
