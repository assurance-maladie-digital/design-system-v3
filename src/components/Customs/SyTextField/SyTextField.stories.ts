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
		docs: {
			description: {
				component: `
# SyTextField

Le composant SyTextField est un champ de texte enrichi qui étend les fonctionnalités de base de Vuetify avec :
- Un système de validation avancé
- Des états visuels (erreur, avertissement, succès)
- Des icônes de validation automatiques
- Une personnalisation poussée des messages

## Validation

Le composant supporte trois types de validation :
- Règles d'erreur standard (\`customRules\`)
- Règles d'avertissement (\`customWarningRules\`)
- Messages de succès (\`showSuccessMessages\`)

### Exemples de règles :
\`\`\`vue
<SyTextField
  v-model="value"
  :customRules="[
    {
      type: 'required',
      options: {
        message: 'Ce champ est requis'
      }
    }
  ]"
  :customWarningRules="[
    {
      type: 'maxLength',
      options: {
        length: 10,
        message: 'Le texte est un peu long'
      }
    }
  ]"
  showSuccessMessages
/>
\`\`\`

### Types de règles disponibles :
- required
- min/max (valeurs numériques)
- minLength/maxLength/exactLength
- email
- matchPattern (expression régulière)
- custom (validation personnalisée)

### États visuels :
Le champ adapte automatiquement son apparence selon son état :
- Rouge pour les erreurs
- Orange pour les avertissements
- Vert pour les succès
`,
			},
		},
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
		customRules: {
			description: 'Règles de validation personnalisées',
			control: 'object',
		},
		customWarningRules: {
			description: 'Règles d\'avertissement personnalisées',
			control: 'object',
		},
		showSuccessMessages: {
			description: 'Afficher les messages de succès',
			control: 'boolean',
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
			type: 'required',
			options: {
				message: 'Ce champ est requis',
				fieldIdentifier: 'mon champ'
			}
		},
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
						type: 'required',
						options: {
							message: 'Ce champ est requis',
							fieldIdentifier: 'mon champ'
						}
					},
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
	:customRules="[
		{
			type: 'required',
			options: {
				message: 'Ce champ est requis',
				fieldIdentifier: 'mon champ'
			}
		}
	]"
	:customWarningRules="[
		{
			type: 'maxLength',
			options: {
				length: 10,
				message: 'Le texte commence à être un peu long'
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
				label="Champ avec avertissements"
				:customRules="[
					{
						type: 'required',
						options: {
							message: 'Ce champ est requis',
							fieldIdentifier: 'mon champ'
						}
					}
				]"
				:customWarningRules="[
					{
						type: 'maxLength',
						options: {
							length: 10,
							message: 'Le texte comporte plus de 10 caracteres'
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
	label="Email"
	:customRules="[
		{
			type: 'required',
			options: {
				message: 'L'email est requis',
				fieldIdentifier: 'l'email'
			}
		},
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
				:customRules="[
					{
						type: 'required',
						options: {
							message: 'L\\'email est requis',
							fieldIdentifier: 'l\\'email'
						}
					},
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
