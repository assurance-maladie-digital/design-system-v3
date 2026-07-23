import type { StoryObj, Meta } from '@storybook/vue3-vite'
import { ref } from 'vue'
import NirField from './NirField.vue'
import { getValidationDocumentation } from '@/composables/unifyValidation/documentationValidationProps'

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
		...getValidationDocumentation('string'),
		customRulesPrecedence: {
			description: 'Définit si les règles personnalisées ont priorité sur la validation standard du NIR. `custom` = les règles personnalisées remplacent la validation standard (utile pour les NIR migrants), `default` = la validation standard est appliquée puis les règles personnalisées.',
			control: 'select',
			options: ['custom', 'default'],
			default: 'custom',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: {
					summary: 'custom',
				},
			},
		},
		modelValue: {
			description: 'La valeur du modèle pour le champ.',
			control: 'text',
			table: {
				type: {
					summary: 'string',
					detail: 'ex: 1840275123456 74',
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
		nirType: {
			description: 'Type de validation de NIR.',
			control: 'select',
			options: ['simple', 'complexe'],
			default: 'simple',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: {
					summary: 'simple',
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
		disabled: {
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
		numberHint: {
			description: 'Texte d\'aide spécifique affiché sous le champ numéro.',
			control: 'text',
			table: {
				type: {
					summary: 'string',
				},
			},
		},
		keyHint: {
			description: 'Texte d\'aide spécifique affiché sous le champ clé.',
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
		withoutFieldset: {
			description: 'Indique si le champ NIR est affiché sans fieldset. (Par défaut, le champ NIR est affiché dans un fieldset si displayKey est true pour des raisons d\'accessibilité)',
			control: 'boolean',
			default: false,
			table: {
				type: {
					summary: 'boolean',
				},
			},
		},
		helpText: {
			description: 'Texte d\'aide affiché sous le champ. Remplace la zone de messages quand il n\'y a pas d\'erreur, sinon s\'affiche en dessous des messages.',
			control: 'text',
			table: {
				type: { summary: 'string' },
				defaultValue: { summary: '\'\'' },
			},
		},
		successMessages: {
			description: 'Permet d\'injecter des messages de succès depuis le parent pour le champ numéro. Aucun calcul de validation n\'est exécuté.',
			control: 'object',
			table: {
				type: { summary: 'array<string>' },
			},
		},
		customLocale: {
			description: 'Objet permettant de surcharger les chaînes affichées à l\'utilisateur (libellés, hints et messages de validation). Clés supportées : `errorRequiredNumber`, `errorInvalidNumber`, `errorRequiredKey`, `errorInvalidKey`, `successNumberValid`, `successKeyValid`, `numberLabel`, `keyLabel`, `numberHint`, `keyHint`, `autoFocusNotice`.',
			control: 'object',
			table: {
				type: {
					summary: 'Partial<typeof locales>',
				},
				defaultValue: { summary: '{}' },
			},
		},
		errors: {
			description: 'Tableaux réactif contenant tous les messages d\'erreur. Combine les erreurs injectées via errorMessages et celles générées par la validation. Les doublons sont supprimés et le tableau est limité selon maxErrors. Accessible via template ref du composant.',
			table: {
				type: { summary: `{
	number: Readonly<Ref<readonly string[]>>,
	key: Readonly<Ref<readonly string[]>>
}` },
				category: 'expose',
			},
		},
		warnings: {
			description: 'Tableaux réactif contenant tous les messages d\'avertissement. Combine les avertissements injectés via warningMessages et ceux générés par customWarningRules. Les doublons sont supprimés et le tableau est limité selon maxErrors. Accessible via template ref du composant.',
			table: {
				type: { summary: `{
	number: Readonly<Ref<readonly string[]>>,
	key: Readonly<Ref<readonly string[]>>
}` },
				category: 'expose',
			},
		},
		successes: {
			description: 'Tableaux réactif contenant tous les messages de succès. Combine les succès injectés via successMessages et ceux générés par customSuccessRules. Les doublons sont supprimés et le tableau est limité selon maxErrors. Accessible via template ref du composant.',
			table: {
				type: { summary: `{
	number: Readonly<Ref<readonly string[]>>,
	key: Readonly<Ref<readonly string[]>>
}` },
				category: 'expose',
			},
		},
		hasErrorExpose: {
			name: 'hasError',
			description: 'Booléens réactifs indiquant si le champ numéro ou clé est en erreur (erreur de validation ou erreur injectée via la prop `hasError`). Accessible via template ref du composant.',
			table: {
				type: { summary: `{
	number: Readonly<Ref<boolean>>,
	key: Readonly<Ref<boolean>>
}` },
				category: 'expose',
			},
		},
		hasWarningExpose: {
			name: 'hasWarning',
			description: 'Booléens réactifs indiquant si le champ numéro ou clé est en avertissement. Accessible via template ref du composant.',
			table: {
				type: { summary: `{
	number: Readonly<Ref<boolean>>,
	key: Readonly<Ref<boolean>>
}` },
				category: 'expose',
			},
		},
		hasSuccessExpose: {
			name: 'hasSuccess',
			description: 'Booléens réactifs indiquant si le champ numéro ou clé est en succès. Accessible via template ref du composant.',
			table: {
				type: { summary: `{
	number: Readonly<Ref<boolean>>,
	key: Readonly<Ref<boolean>>
}` },
				category: 'expose',
			},
		},
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} as Record<string, any>,
} satisfies Meta<typeof NirField>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		modelValue: '',
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
     import { NirField } from '@cnamts/synapse'
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
     import { NirField } from '@cnamts/synapse'
     import { ref } from 'vue'
     
     const value = ref('')
    </script>
    `,
			},
		],
	},
}

export const WithHelpText: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Un texte d\'aide s\'affiche sous le champ quand il n\'y a pas de message de validation. Il se déplace sous les messages quand une erreur est présente.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <NirField
    v-model="value"
    label="Identifiant assuré"
    required
    help-text="Saisissez les 13 chiffres du numéro de sécurité sociale, puis la clé à 2 chiffres."
  />
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { NirField } from '@cnamts/synapse'

const value = ref('')
</script>`,
			},
		],
	},
	args: {
		label: 'Identifiant assuré',
		required: true,
		helpText: 'Saisissez les 13 chiffres du numéro de sécurité sociale, puis la clé à 2 chiffres.',
	},
	render: args => ({
		components: { NirField },
		setup() {
			const value = ref('')
			return { args, value }
		},
		template: `
			<NirField
				v-model="value"
				v-bind="args"
			/>
		`,
	}),
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
     import { NirField } from '@cnamts/synapse'
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
     import { NirField } from '@cnamts/synapse'
     import { ref } from 'vue'

     const value = ref('')
    </script>
    `,
			},
		],
	},
}

export const WithCustomLocale: Story = {
	args: {
		...Default.args,
		required: true,
		showSuccessMessages: true,
		customLocale: {
			numberLabel: 'Numéro de sécurité sociale',
			keyLabel: 'Clé',
			numberHint: '',
			keyHint: '',
			errorRequiredNumber: 'Veuillez renseigner votre numéro de sécurité sociale (13 caractères).',
			errorInvalidNumber: 'Format NIR non reconnu, merci de vérifier.',
			errorRequiredKey: 'La clé (2 chiffres) est requise.',
			errorInvalidKey: 'La clé ne correspond pas au NIR saisi.',
			successNumberValid: 'Numéro reconnu ✅',
			successKeyValid: 'Clé correspondante ✅',
			autoFocusNotice: 'Après la saisie des 13 caractères du numéro de sécurité sociale, le curseur sera automatiquement placé dans le champ clé de validation. Si le champ clé est vidé, le curseur reviendra automatiquement dans le champ numéro.',
		},
	},
	parameters: {
		docs: {
			description: {
				story: `
### Surcharger les messages avec customLocale

Utilisez la prop \`customLocale\` pour remplacer les messages par défaut sans toucher au composant.

Clés supportées :
- \`errorRequiredNumber\`
- \`erreurInvalidNumber\`
- \`errorRequiredKey\`
- \`errorInvalidKey\`
- \`successNumberValid\`
- \`successKeyValid\`
`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <NirField
    v-model="value"
    required
    show-success-messages
    :custom-locale="{
      errorRequiredNumber: 'Veuillez renseigner votre numéro de sécurité sociale (13 caractères).',
      errorInvalidNumber: 'Format NIR non reconnu, merci de vérifier.',
      errorRequiredKey: 'La clé (2 chiffres) est requise.',
      errorInvalidKey: 'La clé ne correspond pas au NIR saisi.',
      successNumberValid: 'Numéro reconnu ✅',
      successKeyValid: 'Clé correspondante ✅'
    }"
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

export const ComplexNirType: Story = {
	args: {
		modelValue: '712125233333340',
		required: false,
		numberLabel: 'Numéro de sécurité sociale',
		keyLabel: 'Clé',
		displayKey: true,
		nirType: 'complexe',
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
		  nirType="complexe"
		  :displayKey="true"
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
     
			const value = ref('712125233333340')

		return { value }
	</script>
    `,
			},
		],
	},
	render: () => ({
		components: { NirField },
		setup() {
			const value = ref('712125233333340')

			return { value }
		},
		template: `
          <div>
            <p class="mt-2">Cet exemple montre l'utilisation d'un NIR de type complexe<br/>(commençant par 7).</p>
			<p class="mb-4">Pour plus d'informations sur le NirType voir la <a href="/?path=/docs/composants-formulaires-nirfield--docs#ancre-nirtype">documentation</a>.</p>
          </div>
           <NirField
				v-model="value"
				:required="false"
				numberLabel="Numéro de sécurité sociale"
				keyLabel="Clé"
				nirType="complexe"
				:displayKey="true"
			/>
    `,
	}),
}

export const CustomRulesPrecedence: Story = {
	args: {
		modelValue: '',
		required: false,
		numberLabel: 'Numéro de sécurité sociale',
		keyLabel: 'Clé',
		displayKey: true,
		nirType: 'complexe',
		customNumberRules: [
			{
				type: 'custom',
				options: {
					validate: (value: string) => {
						if (!value) return true
						if (value.length < 13) return true

						// Accepte tous les codes sexe 1-8 (y compris 5 et 6 pour migrants)
						const migrantRegex = /^[1-8]\d{12}$/
						return migrantRegex.test(value.replace(/\s/g, ''))
					},
					message: 'Format du NIR invalide',
					successMessage: 'Le numéro de sécurité sociale est valide',
				},
			},
		],
		customKeyRules: [
			{
				type: 'custom',
				options: {
					validate: (value: string) => {
						if (!value) return true
						if (value.length !== 2) return true
						return /^\d{2}$/.test(value)
					},
					message: 'Format de clé invalide',
					successMessage: 'La clé de contrôle est valide',
				},
			},
		],
		customRulesPrecedence: true,
		showSuccessMessages: true,
	},
	parameters: {
		docs: {
			description: {
				story: `
### Custom Rules Precedence - Support des NIR migrants

Cette story démontre l'utilisation de la prop \`customRulesPrecedence\` pour contourner la validation standard 
et accepter des formats de NIR non prévus initialement, comme les NIR de migrants (codes sexe 5 et 6).

#### Cas d'usage
- **NIR migrants** : Codes sexe 5 (masculin) et 6 (féminin) non supportés par la validation standard
- **Formats spécifiques** : Besoin de valider des formats particuliers non couverts par la regex standard
- **Migration progressive** : Accepter temporairement des formats legacy en attendant une correction native

#### Fonctionnement
1. **customRulesPrecedence="true"** : Donne priorité absolue aux règles personnalisées
2. **Ignorer la validation standard** : La règle de validation NIR native n'est pas exécutée
3. **Contrôle total** : Vous définissez complètement la logique de validation

#### Exemples de NIR acceptés avec cette configuration :
- \`5900175120005\` (masculin migrant)
- \`6900175120005\` (féminin migrante)  
- \`1900175120005\` (masculin standard)
- \`2900175120005\` (féminin standard)

#### Limitations
- La clé de contrôle n'est pas calculée avec l'algorithme standard pour les NIR migrants
- C'est un contournement, pas une correction native du composant
- Nécessite de maintenir les règles personnalisées en parallèle

Pour plus d'informations, voir la [documentation technique](/?path=/docs/composants-formulaires-nirfield--docs#ancre-customrulesprecedent).`,
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
      nirType="complexe"
      :custom-number-rules="customNumberRules"
      :custom-key-rules="customKeyRules"
      custom-rules-precedence
      :show-success-messages="true"
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

     const customNumberRules = [
       {
         type: 'custom',
         options: {
           validate: (value: string) => {
             if (!value) return true
             if (value.length < 13) return true
             
             // Accepte tous les codes sexe 1-8 (y compris 5 et 6 pour migrants)
             const migrantRegex = /^[1-8]\\d{12}$/
             return migrantRegex.test(value.replace(/\\s/g, ''))
           },
           message: 'Format du NIR invalide',
           successMessage: 'Le numéro de sécurité sociale est valide',
         },
       },
     ]

     const customKeyRules = [
       {
         type: 'custom',
         options: {
           validate: (value: string) => {
             if (!value) return true
             if (value.length !== 2) return true
             return /^\\d{2}$/.test(value)
           },
           message: 'Format de clé invalide',
           successMessage: 'La clé de contrôle est valide',
         },
       },
     ]
    </script>
    `,
			},
		],
	},
	render: () => ({
		components: { NirField },
		setup() {
			const value = ref('')

			const customNumberRules = [
				{
					type: 'custom',
					options: {
						validate: (value: string) => {
							if (!value) return true
							if (value.length < 13) return true

							// Accepte tous les codes sexe 1-8 (y compris 5 et 6 pour migrants)
							const migrantRegex = /^[1-8]\d{12}$/
							return migrantRegex.test(value.replace(/\s/g, ''))
						},
						message: 'Format du NIR invalide',
						successMessage: 'Le numéro de sécurité sociale est valide',
					},
				},
			]

			const customKeyRules = [
				{
					type: 'custom',
					options: {
						validate: (value: string) => {
							if (!value) return true
							if (value.length !== 2) return true
							return /^\d{2}$/.test(value)
						},
						message: 'Format de clé invalide',
						successMessage: 'La clé de contrôle est valide',
					},
				},
			]

			return { value, customNumberRules, customKeyRules }
		},
		template: `
          <div>
            <p class="mt-2">Cette configuration utilise <code>customRulesPrecedence</code> pour accepter les NIR migrants (codes 5 et 6).</p>
			<p class="mb-4">Essayez de saisir : <strong>5900175120005</strong> ou <strong>6900175120005</strong></p>
          </div>
           <NirField
				v-model="value"
				:required="false"
				:numberLabel="'Numéro de sécurité sociale'"
				:keyLabel="'Clé'"
				:displayKey="true"
				nirType="complexe"
				:custom-number-rules="customNumberRules"
				:custom-key-rules="customKeyRules"
				custom-rules-precedence
				:show-success-messages="true"
			/>
    `,
	}),
}
