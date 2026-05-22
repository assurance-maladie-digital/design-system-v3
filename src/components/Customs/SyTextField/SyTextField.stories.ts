import type { Meta, StoryObj } from '@storybook/vue3'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
import { VIcon } from 'vuetify/components'
import { ref, watch } from 'vue'
import { mdiAccountBox } from '@mdi/js'
import { getValidationDocumentation } from '@/composables/unifyValidation/documentationValidationProps'
import { fn } from '@storybook/test'
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
		'modelValue': { control: 'text' },
		'label': {
			description: 'Texte affiché comme label du champ',
			control: 'text',
		},
		'autocomplete': {
			description: 'Valeur de l\'attribut autocomplete',
			control: 'text',
		},
		'prependIcon': {
			control: 'select',
			options: ['info', 'success', 'warning', 'error', 'close'],
		},
		'appendIcon': {
			control: 'select',
			options: ['info', 'success', 'warning', 'error', 'close'],
		},
		'prependInnerIcon': {
			control: 'select',
			options: ['info', 'success', 'warning', 'error', 'close'],
		},
		'appendInnerIcon': {
			control: 'select',
			options: ['info', 'success', 'warning', 'error', 'close'],
		},
		'variantStyle': {
			control: 'select',
			options: ['outlined', 'plain', 'underlined', 'filled', 'solo', 'solo-inverted', 'solo-filled'],
		},
		'color': {
			control: 'select',
			options: ['primary', 'secondary', 'success', 'error', 'warning'],
			description: 'Couleur du champ',
		},
		'density': {
			control: 'select',
			options: ['default', 'comfortable', 'compact'],
			description: 'Densité du champ',
		},
		'isActive': {
			description: 'Force l\'état actif du champ (label flottant et styles visuels)',
			control: 'boolean',
			default: false,
		},
		'isClearable': {
			description: 'Affiche un bouton pour effacer le contenu du champ',
			control: 'boolean',
			default: false,
		},
		'prependTooltip': {
			description: 'Si le texte du prepend tooltip est renseigné alors l\'icône du  tooltip s\'affiche',
			control: 'text',
		},
		'appendTooltip': {
			description: 'Si le texte du append tooltip est renseigné alors l\'icône du  tooltip s\'affiche',
			control: 'text',
		},
		'tooltipLocation': {
			description: 'Position des tooltips',
			control: 'select',
			options: ['top', 'bottom', 'start', 'end'],
			default: 'top',
		},
		'displayAsterisk': {
			description: 'Affiche un astérisque à côté du label',
			control: 'boolean',
			default: false,
		},
		'disableClickButton': {
			description: 'Désactive le click sur les icônes append et prepend',
			control: 'boolean',
			default: true,
		},
		'baseColor': {
			description: 'Couleur de base du champ (par défaut hérite de color)',
			control: 'text',
		},
		'bgColor': {
			description: 'Couleur de fond du champ',
			control: 'color',
		},
		'centerAffix': {
			description: 'Centre verticalement les éléments ajoutés avant/après le champ',
			control: 'boolean',
		},
		'counter': {
			description: 'Affiche un compteur de caractères',
			control: 'boolean',
		},
		'counterValue': {
			description: 'Fonction personnalisée pour calculer la valeur du compteur',
			control: 'object',
		},
		'direction': {
			description: 'Direction du champ (horizontal ou vertical)',
			control: 'select',
			options: ['horizontal', 'vertical'],
		},
		'isDirty': {
			description: 'Indique si le champ a été modifié',
			control: 'boolean',
		},
		'isFlat': {
			description: 'Supprime l\'élévation du champ',
			control: 'boolean',
		},
		'isFocused': {
			description: 'Force l\'état focus du champ',
			control: 'boolean',
		},
		'areDetailsHidden': {
			description: 'Masque la section des détails (messages d\'erreur, compteur)',
			control: 'boolean',
		},
		'areSpinButtonsHidden': {
			description: 'Masque les boutons d\'incrémentation pour les champs numériques',
			control: 'boolean',
		},
		'hint': {
			description: 'Texte d\'aide affiché sous le champ',
			control: 'text',
		},
		'helpText': {
			description: 'Texte d\'aide affiché sous le champ',
			control: 'text',
		},
		'maxlength': {
			description: 'Nombre maximal de caractères autorisés dans le champ',
			control: { type: 'text' },
		},
		'loading': {
			description: 'Affiche un indicateur de chargement',
			control: 'boolean',
		},
		'maxWidth': {
			description: 'Largeur maximale du champ',
			control: { type: 'text' },
		},
		'minWidth': {
			description: 'Largeur minimale du champ',
			control: { type: 'text' },
		},
		'name': {
			description: 'Nom du champ pour les formulaires',
			control: 'text',
		},
		'displayPersistentClear': {
			description: 'Affiche toujours le bouton de réinitialisation',
			control: 'boolean',
			default: false,
		},
		'displayPersistentCounter': {
			description: 'Affiche toujours le compteur',
			control: 'boolean',
			default: false,
		},
		'displayPersistentHint': {
			description: 'Affiche toujours le texte d\'aide',
			control: 'boolean',
			default: false,
		},
		'displayPersistentPlaceholder': {
			description: 'Garde le placeholder visible. Si le champ est vide, le placeholder reste affiché',
			control: 'boolean',
			default: false,
		},
		'placeholder': {
			description: 'Texte affiché quand le champ est vide',
			control: 'text',
			default: 'Placeholder',
		},
		'prefix': {
			description: 'Texte affiché avant la valeur: prefix="€" : affichera "€" avant la valeur saisie',
			control: 'text',
		},
		'isReversed': {
			description: 'Inverse l\'ordre des éléments',
			control: 'boolean',
			default: false,
		},
		'role': {
			description: 'Rôle ARIA du champ',
			control: 'text',
		},
		'rounded': {
			description: 'Arrondit les coins du champ',
			control: { type: 'text' },
		},
		'isOnSingleLine': {
			description: 'Force l\'affichage sur une seule ligne',
			control: 'boolean',
			default: false,
		},
		'suffix': {
			description: 'Texte affiché après la valeur',
			control: 'text',
		},
		'theme': {
			description: 'Thème à appliquer au champ',
			control: 'text',
		},
		'isTiled': {
			description: 'Applique un style tuile',
			control: 'boolean',
			default: false,
		},
		'type': {
			description: 'Type du champ de saisie',
			control: 'select',
			options: ['text', 'number', 'password', 'email', 'tel', 'url', 'search'],
			default: 'text',
		},
		'width': {
			description: 'Largeur du champ',
			control: { type: 'text' },
		},
		'validateOnSubmit': {
			description: 'Valide le champ avec la valeur donnée',
			type: '(value: string | number | null) => Promise<void>',
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
