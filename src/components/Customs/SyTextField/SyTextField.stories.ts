import type { Meta, StoryObj } from '@storybook/vue3'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
import { VIcon } from 'vuetify/components'
import { ref, watch } from 'vue'
import { mdiAccountBox } from '@mdi/js'
import { VBtn } from 'vuetify/components'

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
		controls: { exclude: ['modelValue', 'appendInnerIconColor', 'errorMessages', 'warningMessages', 'successMessages'] },
		docs: {
			description: {
				component: `SyTextField`,
			},
		},
	},
	argTypes: {
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
		'customRules': {
			description: 'Règles de validation personnalisées',
			control: 'object',
		},
		'customWarningRules': {
			description: 'Règles d\'avertissement personnalisées',
			control: 'object',
		},
		'showSuccessMessages': {
			description: 'Afficher les messages de succès',
			control: 'boolean',
		},
		'isValidateOnBlur': {
			description: 'Vérifie la validité lors de la perte de focus',
			control: 'boolean',
			default: true,
		},
		'disableErrorHandling': {
			control: 'boolean',
			description: 'Désactive complètement la validation des règles et l\'affichage des erreurs',
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
		'required': {
			description: 'Indique si le champ est obligatoire',
			control: 'boolean',
			default: false,
		},
		'displayAsterisk': {
			description: 'Affiche un astérisque à côté du label',
			control: 'boolean',
			default: false,
		},
		'disabled': {
			description: 'Désactive le champ',
			control: 'boolean',
			default: false,
		},
		'disableClickButton': {
			description: 'Désactive le click sur les icônes append et prepend',
			control: 'boolean',
			default: true,
		},
		'readonly': {
			description: 'Rend le champ en lecture seule',
			control: 'boolean',
			default: false,
		},
		'baseColor': {
			description: 'Couleur de base du champ (par défaut hérite de color)',
			control: 'text',
		},
		'bgColor': {
			description: 'Couleur de fond du champ',
			control: 'text',
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
		'loading': {
			description: 'Affiche un indicateur de chargement',
			control: 'boolean',
		},
		'maxErrors': {
			description: 'Nombre maximum de messages d\'erreur à afficher',
			control: { type: 'text' },
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
			description: 'Garde le placeholder visible même avec une valeur',
			control: 'boolean',
			default: false,
		},
		'placeholder': {
			description: 'Texte affiché quand le champ est vide',
			control: 'text',
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
		'validation': {
			description: 'Valide le champ avec la valeur donnée',
			type: '(value: string | number | null) => void',
		},
		'validateOnSubmit': {
			description: 'Valide le champ lors de la soumission du formulaire',
			type: '() => void',
		},
		'checkErrorOnBlur': {
			description: 'Vérifie les erreurs lors de la perte de focus',
			type: '() => void',
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
### Champ requis sans astérisque

Cette story montre un champ requis sans astérisque.
Pour afficher l'astérisque sur un champ requis, il faut activer la prop \`displayAsterisk\`.`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
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

export const ValidationRules: Story = {
	parameters: {
		docs: {
			description: {
				story: `
### Validation avec règles standard

Cette story montre l'utilisation des règles de validation standard. Le champ :
- Est requis
- Doit contenir au moins 3 caractères
- Affiche un message de succès quand valide
`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<SyTextField
	v-model="value"
	label="Champ avec validation"
	:customRules="[
		{
			type: 'minLength',
			options: {
				length: 3,
				message: 'Le champ doit contenir au moins 3 caractères'
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
				label="Champ avec validation"
				:customRules="[
					{
						type: 'minLength',
						options: {
							length: 3,
							message: 'Le champ doit contenir au moins 3 caractères'
						}
					}
				]"
				showSuccessMessages
			/>
		`,
	}),
}

export const ValidationWithWarnings: Story = {
	parameters: {
		docs: {
			description: {
				story: `
### Validation avec avertissements

Cette story montre l'utilisation combinée des règles standard et d'avertissement. Le champ :
- Est requis (règle standard)
- Affiche un avertissement si le texte dépasse 10 caractères
- Les avertissements sont affichés en orange et n'empêchent pas la validation
`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<SyTextField
	v-model="value"
	label="Champ avec avertissements"
	required
	:customWarningRules="[
		{
			type: 'minLength',
			options: {
				length: 10,
				message: 'Le texte doit comporter plus de 10 caracteres'
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
				label="avec avertissements"
				required
				:customWarningRules="[
					{
						type: 'minLength',
						options: {
							length: 10,
							message: 'Le texte doit comporter plus de 10 caracteres'
						}
					}
				]"
				showSuccessMessages
			/>
		`,
	}),
}

export const EmailValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: `
### Validation d'email

Cette story montre un cas d'usage courant : la validation d'une adresse email. Le champ :
- Est requis
- Vérifie le format de l'email
- Affiche un message de succès quand l'email est valide
`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<SyTextField
	v-model="value"
	autocomplete="email"
	label="Email"
	required
	:customRules="[
		{
			type: 'email',
			options: {
				message: 'L'email n'est pas valide',
				successMessage: 'L'email est valide'
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
				label="Email"
				autocomplete="email"
				required
				:customRules="[
					{
						type: 'email',
						options: {
							message: 'L\\'email n\\'est pas valide',
							successMessage: 'L\\'email est valide'
						}
					}
				]"
				showSuccessMessages
			/>
		`,
	}),
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

export const WithTooltips: Story = {
	args: {
		modelValue: '',
		label: 'Champ avec tooltips',
		prependTooltip: 'Information à gauche du champ',
		appendTooltip: 'Information à droite du champ',
		tooltipLocation: 'top',
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

/**
 * Story avec validation désactivée au blur
 */
export const ValidateOnBlur: Story = {
	args: {
		modelValue: '',
		label: 'Champ texte',
		required: true,
		isValidateOnBlur: true,
		customRules: [
			{
				type: 'custom',
				options: {
					message: 'Le champ doit contenir au moins 3 caractères',
					validate: (value: string) => value.length >= 3,
				},
			},
		],
	},
	render: args => ({
		components: { SyTextField, VBtn },
		setup() {
			const value = ref(args.modelValue)
			const fieldRef = ref()

			function handleSubmit() {
				const isValid = fieldRef.value?.validateOnSubmit()
				alert(isValid ? 'Formulaire valide !' : 'Formulaire invalide, veuillez corriger les erreurs.')
			}

			return { args, value, fieldRef, handleSubmit }
		},
		template: `
			<form @submit.prevent="handleSubmit">
				<p class="mb-4">
					La validation ne se déclenche  qu'à la perte de focus ou à la soumission du formulaire.
				</p>
				<SyTextField
					ref="fieldRef"
					v-model="value"
					v-bind="args"
					@update:model-value="args.modelValue = $event"
				/>
				<div class="mt-4">
					<VBtn type="submit" color="primary">
						Valider
					</VBtn>
				</div>
			</form>
		`,
	}),
	parameters: {
		docs: {
			description: {
				story: 'Exemple de champ avec validation désactivée au blur. La validation ne se déclenche que lors de la soumission du formulaire.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<form @submit.prevent="handleSubmit">
		<SyTextField
			ref="fieldRef"
			v-model="value"
			label="Champ texte"
			required
			:is-validate-on-blur="true"
			:custom-rules="[
				{
					type: 'custom',
					options: {
						message: 'Le champ doit contenir au moins 3 caractères',
						validate: value => value.length >= 3
					}
				}
			]"
		/>
		<button type="submit">
			Valider
		</button>
	</form>
</template>
				`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SyTextField } from '@cnamts/synapse'

const value = ref('')
const fieldRef = ref()

function handleSubmit() {
	const isValid = fieldRef.value?.validateOnSubmit()
	if (!isValid) {
		// Gérer l'erreur
		return
	}
	// Continuer avec la soumission
}
</script>
				`,
			},
		],
	},
}

export const FormValidation: Story = {
	render: args => ({
		components: { SyTextField },
		setup() {
			const nomField = ref()
			const prenomField = ref()
			const ageField = ref()
			const nomValue = ref('')
			const prenomValue = ref('')
			const ageValue = ref('')

			// Règle minLength pour le prénom
			const prenomRules = [{
				type: 'minLength',
				options: {
					length: 3,
					message: 'Le prénom doit contenir au moins 3 caractères',
					successMessage: 'Le prénom est valide',
					fieldIdentifier: 'prénom',
				},
			}]

			// Règle pattern pour l'âge (uniquement des chiffres)
			const ageRules = [{
				type: 'matchPattern',
				options: {
					pattern: /^\d+$/,
					message: 'L\'âge doit contenir uniquement des chiffres',
					successMessage: 'L\'âge est valide',
					fieldIdentifier: 'âge',
				},
			}]

			const handleSubmit = () => {
				const fields = [
					{ ref: nomField, name: 'Nom' },
					{ ref: prenomField, name: 'Prénom' },
					{ ref: ageField, name: 'Âge' },
				]

				const invalidFields = fields
					.filter(({ ref }) => !ref.value?.validateOnSubmit())
					.map(({ name }) => name)

				if (invalidFields.length > 0) {
					alert(`Les champs suivants sont invalides :\n${invalidFields.join('\n')}`)
				}
				else {
					alert('Formulaire soumis avec succès !')
				}
			}

			return {
				args,
				nomField,
				prenomField,
				ageField,
				nomValue,
				prenomValue,
				ageValue,
				prenomRules,
				ageRules,
				handleSubmit,
			}
		},
		template: `
			<div style="max-width: 500px;">
				<h3>Validation de formulaire</h3>
				<form @submit.prevent="handleSubmit">
					<div class="mb-4">
						<SyTextField
							ref="nomField"
							v-model="nomValue"
							label="Nom"
							placeholder="Votre nom"
							required
							show-success-messages
							class="mb-4"
						/>

						<SyTextField
							ref="prenomField"
							v-model="prenomValue"
							label="Prénom"
							placeholder="Votre prénom"
							:custom-rules="prenomRules"
							show-success-messages
							class="mb-4"
						/>

						<SyTextField
							ref="ageField"
							v-model="ageValue"
							label="Âge"
							placeholder="Votre âge"
							:custom-rules="ageRules"
							show-success-messages
							class="mb-4"
						/>
					</div>

					<div class="text-caption mb-4">
						<strong>Règles de validation :</strong>
						<ul>
							<li>Nom : Champ requis</li>
							<li>Prénom : Minimum 3 caractères</li>
							<li>Âge : Uniquement des chiffres</li>
						</ul>
					</div>

					<button
						type="submit"
						style="
							background-color: #1976d2;
							color: white;
							padding: 8px 16px;
							border: none;
							border-radius: 4px;
							cursor: pointer;
							font-size: 1rem;
						"
					>
						Soumettre
					</button>
				</form>
			</div>
		`,
	}),
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

export const DisabledErrorHandling: Story = {
	args: {
		label: 'Champ requis',
		required: true,
		customRules: [
			{
				type: 'required',
				options: {
					message: 'Ce champ est obligatoire.',
				},
			},
		],
	},
	render: (args) => {
		return {
			components: { SyTextField },
			setup() {
				const value1 = ref('')
				const value2 = ref('')

				return { args, value1, value2 }
			},
			template: `
        <div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 16px;">
            <div>
              <p class="text-subtitle-2 mb-2">Validation normale</p>
              <SyTextField
                v-model="value1"
                v-bind="args"
                is-validate-on-blur
              />
            </div>
            
            <div>
              <p class="text-subtitle-2 mb-2">Sans gestion d'erreurs</p>
              <SyTextField
                v-model="value2"
                v-bind="args"
                disableErrorHandling
                is-validate-on-blur
              />
            </div>
          </div>
          
          <div class="mt-4 text-body-2">
            <p>Instructions :</p>
            <ol>
              <li class="ml-4">Cliquez dans un champ puis en dehors pour déclencher la validation</li>
              <li class="ml-4">Observez que le champ de gauche affiche un message d'erreur</li>
              <li class="ml-4">Le champ de droite n'affiche aucune erreur malgré les mêmes règles</li>
            </ol>
          </div>
        </div>
      `,
		}
	},
	parameters: {
		docs: {
			description: {
				story: 'La prop `disableErrorHandling` permet de désactiver complètement la gestion des erreurs de validation, même si des règles sont définies.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <!-- Champ avec validation normale -->
  <SyTextField
    v-model="value"
    label="Champ obligatoire"
    required
    :custom-rules="[{
      type: 'required',
      options: { message: 'Ce champ est obligatoire.' }
    }]"
    is-validate-on-blur
  />

  <!-- Champ avec gestion d'erreur désactivée -->
  <SyTextField
    v-model="value"
    label="Champ obligatoire"
    required
    :custom-rules="[{
      type: 'required',
      options: { message: 'Ce champ est obligatoire.' }
    }]"
    disableErrorHandling
    is-validate-on-blur
  />
</template>`,
			},
		],
	},
}

export const WithoutSuccessMessages: Story = {
	args: {
		label: 'Email',
		customRules: [
			{
				type: 'matchPattern',
				options: {
					pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
					message: 'Veuillez entrer une adresse email valide',
					successMessage: 'Le format de l\'email est correct',
					fieldIdentifier: 'Email',
				},
			},
		],
	},
	render: (args) => {
		return {
			components: { SyTextField },
			setup() {
				const value1 = ref('user@example.com')
				const value2 = ref('user@example.com')

				return { args, value1, value2 }
			},
			template: `
        <div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 16px;">
            <div>
              <p class="text-subtitle-2 mb-2">Avec messages de succès (défaut)</p>
              <SyTextField
                v-model="value1"
                v-bind="args"
                showSuccessMessages
              />
            </div>
            
            <div>
              <p class="text-subtitle-2 mb-2">Sans messages de succès</p>
              <SyTextField
                v-model="value2"
                v-bind="args"
                :showSuccessMessages="false"
              />
            </div>
          </div>
          
          <div class="mt-4 text-body-2">
            <p>Les deux champs ont la même valeur et passent la validation :</p>
            <ul >
              <li class="ml-4">Le champ de gauche affiche le message de succès</li>
              <li class="ml-4">Le champ de droite n'affiche aucun message</li>
            </ul>
            <p class="mt-2">Essayez de modifier les valeurs pour voir le comportement.</p>
          </div>
        </div>
      `,
		}
	},
	parameters: {
		docs: {
			description: {
				story: 'La prop `showSuccessMessages` (par défaut: `true`) permet de contrôler l\'affichage des messages de succès lors de la validation.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <!-- Champ avec messages de succès (défaut) -->
  <SyTextField
    v-model="email"
    label="Email"
    :custom-rules="[{
      type: 'matchPattern',
      options: {
        pattern: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,
        message: 'Veuillez entrer une adresse email valide',
        successMessage: 'Le format de l\\'email est correct',
      }
    }]"
  />

  <!-- Champ sans messages de succès -->
  <SyTextField
    v-model="email"
    label="Email"
    :custom-rules="[{
      type: 'matchPattern',
      options: {
        pattern: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,
        message: 'Veuillez entrer une adresse email valide',
        successMessage: 'Le format de l\\'email est correct',
      }
    }]"
    :showSuccessMessages="false"
  />
</template>`,
			},
		],
	},
}