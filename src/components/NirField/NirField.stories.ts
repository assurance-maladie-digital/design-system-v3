import type { StoryObj, Meta } from '@storybook/vue3'
import { ref } from 'vue'
import { VBtn } from 'vuetify/components'
import NirField from './NirField.vue'

const meta: Meta<typeof NirField> = {
	title: 'Composants/Formulaires/NirField',
	component: NirField,
	decorators: [
		() => ({
			template: '<div style="padding:20px; max-width: 600px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		modelValue: {
			description: 'La valeur du modèle pour le champ.',
			control: 'text',
			table: {
				type: {
					summary: 'string',
				},
			},
		},
		outlined: {
			description: 'Indique si le champ est encadré.',
			control: 'boolean',
			default: true,
			table: {
				type: {
					summary: 'boolean',
				},
			},
		},
		required: {
			description: 'Indique si le champ est requis.',
			control: 'boolean',
			default: false,
			table: {
				type: {
					summary: 'boolean',
				},
			},
		},
		nirTooltip: {
			description: 'Infobulle pour le champ NIR.',
			control: 'text',
			table: {
				type: {
					summary: 'string',
				},
			},
		},
		nirTooltipPosition: {
			description: 'Position de l\'infobulle pour le champ NIR, si le `nirTooltip` est renseigné',
			control: 'select',
			options: ['prepend', 'append'],
			default: 'append',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: {
					summary: 'append',
				},
			},
		},
		keyTooltip: {
			description: 'Infobulle pour le champ clé.',
			control: 'text',
			table: {
				type: {
					summary: 'string',
				},
			},
		},
		keyTooltipPosition: {
			description: 'Position de l\'infobulle pour le champ clé, si le `keyTooltip` est renseigné',
			control: 'select',
			options: ['prepend', 'append'],
			default: 'append',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: {
					summary: 'append',
				},
			},
		},
		numberLabel: {
			description: 'Label pour le champ numéro.',
			control: 'text',
			default: 'Numéro de sécurité sociale',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: {
					summary: 'Numéro de sécurité sociale',
				},
			},
		},
		keyLabel: {
			description: 'Label pour le champ clé.',
			control: 'text',
			default: 'Clé',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: {
					summary: 'Clé',
				},
			},
		},
		displayKey: {
			description: 'Indique si le champ clé est affiché.',
			control: 'boolean',
			default: true,
			table: {
				type: {
					summary: 'boolean',
				},
			},
		},
		showSuccessMessages: {
			description: 'Indique si les messages de succès sont affichés.',
			control: 'boolean',
			default: false,
			table: {
				type: {
					summary: 'boolean',
				},
			},
		},
		customNumberRules: {
			description: 'Règles de validation personnalisées pour le champ numéro.',
			control: 'object',
			table: {
				type: {
					summary: 'array',
				},
			},
		},
		customKeyRules: {
			description: 'Règles de validation personnalisées pour le champ clé.',
			control: 'object',
			table: {
				type: {
					summary: 'array',
				},
			},
		},
		bgColor: {
			description: 'Définit la couleur de fond du champ.',
			control: 'color',
			default: undefined,
			table: {
				type: {
					summary: 'string',
				},
			},
		},
		isDisabled: {
			description: 'Indique si le champ est désactivé.',
			control: 'boolean',
			default: false,
			table: {
				type: {
					summary: 'boolean',
				},
			},
		},
		width: {
			description: 'Définit la largeur du champ NIR. Accepte toute valeur CSS valide (%, px, rem, etc.). Le champ numéro occupera 80% de cette largeur et le champ clé 20%.',
			control: 'text',
			default: '100%',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: {
					summary: '100%',
				},
			},
		},
		// Propriétés natives de Vuetify
		density: {
			description: 'Contrôle la densité du champ.',
			control: 'select',
			options: ['default', 'comfortable', 'compact'],
			default: 'default',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: {
					summary: 'default',
				},
			},
		},
		hideDetails: {
			description: 'Masque les détails du champ (messages d\'erreur, compteur, etc.).',
			control: 'boolean',
			default: false,
			table: {
				type: {
					summary: 'boolean | "auto"',
				},
				defaultValue: {
					summary: 'false',
				},
			},
		},
		hideSpinButtons: {
			description: 'Masque les boutons de spin pour les champs numériques.',
			control: 'boolean',
			default: false,
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: {
					summary: 'false',
				},
			},
		},
		placeholder: {
			description: 'Texte à afficher lorsque le champ est vide.',
			control: 'text',
			table: {
				type: {
					summary: 'string',
				},
			},
		},
		readonly: {
			description: 'Rend le champ en lecture seule.',
			control: 'boolean',
			default: false,
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: {
					summary: 'false',
				},
			},
		},
		variant: {
			description: 'Style du champ.',
			control: 'select',
			options: ['filled', 'outlined', 'plain', 'underlined', 'solo'],
			default: 'outlined',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: {
					summary: 'outlined',
				},
			},
		},
		clearable: {
			description: 'Permet d\'afficher un bouton pour effacer le contenu.',
			control: 'boolean',
			default: false,
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: {
					summary: 'false',
				},
			},
		},
		counter: {
			description: 'Affiche un compteur de caractères.',
			control: 'boolean',
			default: false,
			table: {
				type: {
					summary: 'boolean | number | string',
				},
				defaultValue: {
					summary: 'false',
				},
			},
		},
		hint: {
			description: 'Texte d\'aide affiché sous le champ.',
			control: 'text',
			table: {
				type: {
					summary: 'string',
				},
			},
		},
		persistentHint: {
			description: 'Affiche toujours l\'indice, même lorsque le champ n\'est pas en focus.',
			control: 'boolean',
			default: false,
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: {
					summary: 'false',
				},
			},
		},
		persistentPlaceholder: {
			description: 'Affiche toujours le placeholder, même lorsque le champ est en focus.',
			control: 'boolean',
			default: false,
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: {
					summary: 'false',
				},
			},
		},
	},
} satisfies Meta<typeof NirField>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		modelValue: '',
		outlined: true,
		required: false,
		numberLabel: 'Numéro de sécurité sociale',
		keyLabel: 'Clé',
		displayKey: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
    <template>
     <NirField
      v-model="value"
      :required="false"
      numberLabel="Numéro de sécurité sociale"
      keyLabel="Clé"
      :displayKey="true"
     />
    </template>
    `,
			},
			{
				name: 'Script',
				code: `
    <script setup lang="ts">
     import NirField  from '@cnamts/synapse'
     import { ref } from 'vue'
     
     const value = ref('')
    </script>
    `,
			},
		],
	},
}

export const Required: Story = {
	args: {
		...Default.args,
		required: true,
	},
	parameters: {
		docs: {
			description: {
				story: `
### Champs requis sans astérisque

Cette story montre des champs requis sans astérisque.
Pour afficher l'astérisque sur des champs requis, il faut activer la prop \`displayAsterisk\`.`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<NirField
		v-model="value"
		required
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { NirField } from '@cnamts/synapse'
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
		displayAsterisk: true,
		required: true,
	},
	parameters: {
		docs: {
			description: {
				story: `
### Champs non requis avec astérisque

Cette story montre que des champs non requis ne peuvent pas avoir d'astérisque.
Même si \`displayAsterisk\` est à \`true\`, l'astérisque ne s'affichera pas car les champs ne sont pas requis.`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<NirField
		v-model="value"
		display-asterisk
		required
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { NirField } from '@cnamts/synapse'
import { ref } from 'vue'

const value = ref('')
</script>`,
			},
		],
	},
}

export const WithoutKey: Story = {
	args: {
		...Default.args,
		displayKey: false,
	},
	parameters: {
		...Default.parameters,
		sourceCode: [
			{
				name: 'Template',
				code: `
    <template>
     <NirField
      v-model="value"
      :required="false"
      numberLabel="Numéro de sécurité sociale"
      keyLabel="Clé"
      :displayKey="false"
     />
    </template>
    `,
			},
			{
				name: 'Script',
				code: `
    <script setup lang="ts">
     import NirField  from '@cnamts/synapse'
     import { ref } from 'vue'
     
     const value = ref('')
    </script>
    `,
			},
		],
	},
}

export const WithSuccessMessages: Story = {
	args: {
		...Default.args,
		showSuccessMessages: true,
	},
	parameters: {
		...Default.parameters,
		sourceCode: [
			{
				name: 'Template',
				code: `
    <template>
     <NirField
      v-model="value"
      :required="false"
      numberLabel="Numéro de sécurité sociale"
      keyLabel="Clé"
      :showSuccessMessages="true"
     />
    </template>
    `,
			},
			{
				name: 'Script',
				code: `
    <script setup lang="ts">
     import NirField  from '@cnamts/synapse'
     import { ref } from 'vue'
     
     const value = ref('')
    </script>
    `,
			},
		],
	},
}

export const CustomRules: Story = {
	args: {
		...Default.args,
		customNumberRules: [
			{
				type: 'minLength',
				options: {
					length: 10,
					message: 'Le numéro de sécurité sociale doit avoir au moins 10 caractères.',
					successMessage: 'Le numéro de sécurité sociale a une longueur valide.',
					ignoreSpace: true,
				},
			},
		],
		customKeyRules: [
			{
				type: 'minLength',
				options: {
					length: 1,
					message: 'La clé doit avoir au moins 1 caractère.',
					successMessage: 'La clé a une longueur valide.',
				},
			},
		],
	},
	parameters: {
		...Default.parameters,
		sourceCode: [
			{
				name: 'Template',
				code: `
    <template>
     <NirField
      v-model="value"
      :required="false"
      numberLabel="Numéro de sécurité sociale"
      keyLabel="Clé"
      :displayKey="true"
      :customNumberRules="[{ type: 'minLength', options: { length: 10, ignoreSpace: true, message: 'Le numéro de sécurité sociale doit avoir au moins 10 caractères.', successMessage: 'Le numéro de sécurité sociale a une longueur valide.' } }]"
      :customKeyRules="[{ type: 'minLength', options: { length: 1, message: 'La clé doit avoir au moins 1 caractère.', successMessage: 'La clé a une longueur valide.' } }]"
     />
    </template>
    `,
			},
			{
				name: 'Script',
				code: `
    <script setup lang="ts">
     import NirField  from '@cnamts/synapse'
     import { ref } from 'vue'
     
     const value = ref('')
    </script>
    `,
			},
		],
	},
}

export const WithNirTooltip: Story = {
	args: {
		...Default.args,
		nirTooltip: 'Ceci est un tooltip pour le champs numéro de sécurité sociale si le champs `nirTooltip` est saisi',
		nirTooltipPosition: 'prepend',
	},
	parameters: {
		docs: {
			description: {
				story: `
### Tooltip sur le champ NIR

Cette story montre l'affichage d'une infobulle sur le champ du numéro de sécurité sociale.
L'infobulle est positionnée avant le champ et s'affiche au survol de l'icône d'information.`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
    <template>
     <NirField
      v-model="value"
      :required="false"
      numberLabel="Numéro de sécurité sociale"
      keyLabel="Clé"
      :displayKey="true"
      :nirTooltip="'Ceci est un tooltip pour le champs numéro de sécurité sociale'"
      nirTooltipPosition="prepend"
     />
    </template>
    `,
			},
			{
				name: 'Script',
				code: `
    <script setup lang="ts">
     import NirField  from '@cnamts/synapse'
     import { ref } from 'vue'
     
     const value = ref('')
    </script>
    `,
			},
		],
	},
}

export const WithKeyTooltip: Story = {
	args: {
		...Default.args,
		keyTooltip: 'Ceci est un tooltip pour la clef du numéro de sécurité sociale',
		keyTooltipPosition: 'append',
	},
	parameters: {
		docs: {
			description: {
				story: `
### Tooltip sur le champ clé

Cette story montre l'affichage d'une infobulle sur le champ de la clé.
L'infobulle est positionnée après le champ et s'affiche au survol de l'icône d'information.`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
    <template>
     <NirField
      v-model="value"
      :required="false"
      numberLabel="Numéro de sécurité sociale"
      keyLabel="Clé"
      :displayKey="true"
      :keyTooltip="'Ceci est un tooltip pour la clef du numéro de sécurité sociale'"
      keyTooltipPosition="append"
     />
    </template>
    `,
			},
			{
				name: 'Script',
				code: `
    <script setup lang="ts">
     import NirField  from '@cnamts/synapse'
     import { ref } from 'vue'
     
     const value = ref('')
    </script>
    `,
			},
		],
	},
}

export const WithWarnings: Story = {
	args: {
		...Default.args,
		showSuccessMessages: false,
		customNumberWarningRules: [
			{
				type: 'custom',
				options: {
					message: 'Attention : ce NIR commence par 1 (homme)',
					warningMessage: 'Attention : ce NIR commence par 1 (homme)',
					validate: (value: string) => {
						if (!value) return false
						// On retourne true si la règle n'est PAS respectée (= warning)
						return !value.startsWith('1')
					},
					isWarning: true,
				},
			},
			{
				type: 'custom',
				options: {
					message: 'Attention : ce NIR commence par 2 (femme)',
					warningMessage: 'Attention : ce NIR commence par 2 (femme)',
					validate: (value: string) => {
						if (!value) return false
						// On retourne true si la règle n'est PAS respectée (= warning)
						return !value.startsWith('2')
					},
					isWarning: true,
				},
			},
		],
		customKeyRules: [
			{
				type: 'custom',
				options: {
					message: 'La clé doit être comprise entre 01 et 97',
					validate: (value: string) => {
						if (!value) return true
						const numValue = parseInt(value)
						return numValue >= 1 && numValue <= 97
					},
				},
			},
		],
		customKeyWarningRules: [
			{
				type: 'custom',
				options: {
					message: 'Attention : la clé est supérieure à 50',
					warningMessage: 'Attention : la clé est supérieure à 50',
					validate: (value: string) => {
						if (!value) return false
						const numValue = parseInt(value)
						// On retourne true si la règle n'est PAS respectée (= warning)
						return !(numValue > 50)
					},
					isWarning: true,
				},
			},
		],
	},
	parameters: {
		...Default.parameters,
		docs: {
			description: {
				story: `
## Exemple d'utilisation des warnings

Le NirField peut afficher des warnings pour guider l'utilisateur sans bloquer la validation.

### Warnings sur le NIR
- Un warning s'affiche si le NIR commence par 1 (homme)
- Un warning s'affiche si le NIR commence par 2 (femme)

### Warnings sur la clé
- Un warning s'affiche si la clé est supérieure à 50
- Une erreur s'affiche si la clé n'est pas entre 01 et 97

### Exemples de NIR valides avec warnings :
- \`1234567891011\` (warning : homme)
- \`2234567891011\` (warning : femme)
- Clé \`51\` (warning : clé > 50)

Les warnings sont affichés en jaune avec une icône d'avertissement mais ne bloquent pas la validation.
Les erreurs sont affichées en rouge et bloquent la validation.
`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
    <template>
     <NirField
      v-model="value"
      :required="false"
      :show-success-messages="true"
      numberLabel="Numéro de sécurité sociale"
      keyLabel="Clé"
      :display-key="true"
      :customNumberWarningRules="[
        {
          type: 'custom',
          options: {
            message: 'Attention : ce NIR commence par 1 (homme)',
            warningMessage: 'Attention : ce NIR commence par 1 (homme)',
            validate: (value) => {
              if (!value) return false
              // On retourne true si la règle n'est PAS respectée (= warning)
              return !value.startsWith('1')
            },
            isWarning: true,
          },
        },
        {
          type: 'custom',
          options: {
            message: 'Attention : ce NIR commence par 2 (femme)',
            warningMessage: 'Attention : ce NIR commence par 2 (femme)',
            validate: (value) => {
              if (!value) return false
              // On retourne true si la règle n'est PAS respectée (= warning)
              return !value.startsWith('2')
            },
            isWarning: true,
          },
        },
      ]"
      :customKeyRules="[
        {
          type: 'custom',
          options: {
            message: 'La clé doit être comprise entre 01 et 97',
            validate: (value) => {
              if (!value) return true
              const numValue = parseInt(value)
              return numValue >= 1 && numValue <= 97
            },
          },
        },
      ]"
      :customKeyWarningRules="[
        {
          type: 'custom',
          options: {
            message: 'Attention : la clé est supérieure à 50',
            warningMessage: 'Attention : la clé est supérieure à 50',
            validate: (value) => {
              if (!value) return false
              const numValue = parseInt(value)
              // On retourne true si la règle n'est PAS respectée (= warning)
              return !(numValue > 50)
            },
            isWarning: true,
          },
        },
      ]"
     />
    </template>
    `,
			},
			{
				name: 'Script',
				code: `
    <script setup lang="ts">
     import { NirField } from '@cnamts/synapse'
     import { ref } from 'vue'
     
     const value = ref('')
    </script>
    `,
			},
		],
	},
}

export const FormValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: `
### Validation de formulaire

Cette story montre l'utilisation du NirField dans un formulaire avec validation. Le formulaire :
- Requiert un NIR valide (13 chiffres)
- Requiert une clé valide (2 chiffres)
- Affiche des messages de succès quand les champs sont valides
- Affiche des messages d'erreur quand les champs sont invalides
`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<form @submit.prevent="onSubmit">
	<NirField
		v-model="value"
		label="Numéro de sécurité sociale"
		required
		showSuccessMessages
		ref="nirField"
	/>
	<v-btn
		type="submit"
		color="primary"
		class="mt-4"
	>
		Valider
	</v-btn>
</form>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { NirField } from '@cnamts/synapse'

const value = ref('')
const nirField = ref()

const onSubmit = async () => {
	const isValid = await nirField.value?.validateOnSubmit()
	
	if (isValid) {
		alert('Formulaire soumis avec succès !')
	}
						else {
					alert('Formulaire non soumis !')
				}
}
</script>`,
			},
		],
	},
	render: args => ({
		components: { NirField, VBtn },
		setup() {
			const value = ref('')
			const nirField = ref()

			const onSubmit = async () => {
				const isValid = await nirField.value?.validateOnSubmit()

				if (isValid) {
					alert('Formulaire soumis avec succès !')
				}
				else {
					alert('Formulaire non soumis !')
				}
			}

			return { args, value, nirField, onSubmit }
		},
		template: `
			<form @submit.prevent="onSubmit">
				<NirField
					v-model="value"
					v-bind="args"
					label="Numéro de sécurité sociale"
					required
					showSuccessMessages
					ref="nirField"
				/>
				<v-btn
					type="submit"
					color="primary"
					class="mt-4"
				>
					Valider
				</v-btn>
			</form>
		`,
	}),
}

export const WithDisabledErrorHandling: Story = {
	args: {
		...Default.args,
		required: true,
		disableErrorHandling: true,
	},
	parameters: {
		docs: {
			description: {
				story: `
### Désactivation de la gestion des erreurs

Cette story démontre l'utilisation de l'option \`disableErrorHandling\` qui désactive complètement la validation des règles.
Même si le champ est marqué comme requis, aucune erreur ne sera affichée et la validation sera toujours considérée comme réussie.
Cette option est utile lorsque vous souhaitez utiliser le composant uniquement pour la saisie de données, sans validation.
				`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
    <template>
     <NirField
      v-model="value"
      :required="true"
      :disableErrorHandling="true"
      numberLabel="Numéro de sécurité sociale"
      keyLabel="Clé"
      :displayKey="true"
     />
    </template>
    `,
			},
			{
				name: 'Script',
				code: `
    <script setup lang="ts">
     import NirField  from '@cnamts/synapse'
     import { ref } from 'vue'
     
     const value = ref('')
    </script>
    `,
			},
		],
	},
}
