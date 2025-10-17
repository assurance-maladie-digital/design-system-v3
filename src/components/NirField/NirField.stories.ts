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
	},
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
     import { NirField } from '@cnamts/synapse'
     import { ref } from 'vue'
     
     const value = ref('')
    </script>
    `,
			},
		],
	},
}

export const WithoutSuccessMessages: Story = {
	parameters: {
		docs: {
			description: {
				story: `
### Messages de succès

Cette story illustre l'utilisation de la propriété \`showSuccessMessages\` qui permet de contrôler
l'affichage des messages de succès lors de la validation. Par défaut, cette propriété est à \`true\`.

Cela peut être utile pour réduire la verbosité de l'interface lorsque les messages de succès
ne sont pas nécessaires dans certains contextes.
`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <!-- Champ avec messages de succès (par défaut) -->
  <NirField
    v-model="value"
    label="NIR avec messages de succès"
    required
  />

  <!-- Champ sans messages de succès -->
  <NirField
    v-model="value"
    label="NIR sans messages de succès"
    required
    :showSuccessMessages="false"
  />
</template>`,
			},
		],
	},
	render: () => ({
		components: { NirField },
		setup() {
			const value1 = ref('184027512345674')
			const value2 = ref('184027512345674')

			return { value1, value2 }
		},
		template: `
      <div>
        <div>
          <div>
            <p class="text-subtitle-2 mb-2">Avec messages de succès</p>
            <NirField
              v-model="value1"
              label="NIR avec messages de succès"
              required
              showSuccessMessages
            />
          </div>

          <div>
            <p class="text-subtitle-2 mb-2">Sans messages de succès</p>
            <NirField
              v-model="value2"
              label="NIR sans messages de succès"
              required
              :showSuccessMessages="false"
            />
          </div>
        </div>

        <div class="mt-4 text-body-2">
          <p>Observations :</p>
          <ul>
            <li>Les deux champs ont la même valeur valide</li>
            <li>Le premier champ affiche un message de succès et un indicateur visuel vert au blur</li>
            <li>Le second champ n'affiche pas de message de succès, au blur</li>
            <li>Essayez de modifier les valeurs pour voir le comportement avec des données invalides puis valides</li>
          </ul>
        </div>
      </div>
    `,
	}),
}

export const CustomPatternRules: Story = {
	args: {
		...Default.args,
		customRulesPrecedence: true,
		customNumberRules: [
			{
				type: 'custom',
				options: {
					validate: (value: string) => {
						if (!value) return true

						// Supprimer les espaces pour la validation
						const valueWithoutSpaces = value.replace(/\s/g, '')

						// Vérifier la longueur
						if (valueWithoutSpaces.length !== 13) {
							return 'Le numéro de sécurité sociale doit contenir 13 caractères.'
						}

						// Vérifier le pattern selon les règles spécifiques du NIR français
						// Rang 1: sexe (1 pour homme, 2 pour femme)
						if (!/^[12]/.test(valueWithoutSpaces)) {
							return 'Le premier chiffre doit être 1 (homme) ou 2 (femme).'
						}

						// Rangs 2-3: deux derniers chiffres de l'année de naissance
						const anneeNaissance = valueWithoutSpaces.substring(1, 3)
						if (!/^[0-9]{2}$/.test(anneeNaissance)) {
							return 'Les chiffres 2 et 3 doivent représenter l\'année de naissance.'
						}

						// Rangs 4-5: mois de naissance (01-12)
						const moisNaissance = valueWithoutSpaces.substring(3, 5)
						if (!/^(0[1-9]|1[0-2])$/.test(moisNaissance)) {
							return 'Les chiffres 4 et 5 doivent représenter un mois valide (01-12).'
						}

						// Rangs 6-7: département de naissance
						const departement = valueWithoutSpaces.substring(5, 7)
						if (!((/^[0-9]{2}$/.test(departement) && departement !== '00')
							|| departement === '2A' || departement === '2B' || departement === '99')) {
							return 'Les chiffres 6 et 7 doivent représenter un département valide.'
						}

						// Rangs 8-10: code commune ou pays
						const codeCommune = valueWithoutSpaces.substring(7, 10)
						if (!/^[0-9]{3}$/.test(codeCommune)) {
							return 'Les chiffres 8 à 10 doivent représenter un code commune ou pays valide.'
						}

						// Rangs 11-13: numéro d'ordre
						const numeroOrdre = valueWithoutSpaces.substring(10, 13)
						if (!/^[0-9]{3}$/.test(numeroOrdre)) {
							return 'Les chiffres 11 à 13 doivent représenter un numéro d\'ordre valide.'
						}

						return true
					},
					message: 'Le numéro de sécurité sociale est invalide.',
					successMessage: 'Le numéro de sécurité sociale est valide.',
					fieldIdentifier: 'Numéro de sécurité sociale',
				},
			},
		],
	},
	parameters: {
		...Default.parameters,
		docs: {
			description: {
				story: 'Exemple d\'utilisation avec une règle personnalisée qui prend la prévalence sur la validation standard. Cette règle valide le format du NIR selon les règles officielles françaises : 1er chiffre pour le sexe, 2 chiffres pour l\'année de naissance, 2 chiffres pour le mois, 5 chiffres pour le lieu de naissance et 3 chiffres pour le numéro d\'ordre.',
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
      :customRulesPrecedence="true"
      :customNumberRules="[
        {
          type: 'custom',
          options: {
            validate: (value) => {
              if (!value) return true;
              
              // Supprimer les espaces pour la validation
              const valueWithoutSpaces = value.replace(/\\s/g, '');
              
              // Vérifier la longueur
              if (valueWithoutSpaces.length !== 13) {
                return 'Le numéro de sécurité sociale doit contenir 13 caractères.';
              }
              
              // Vérification selon les règles spécifiques du NIR français
              // Rang 1: sexe (1 pour homme, 2 pour femme)
              if (!/^[12]/.test(valueWithoutSpaces)) {
                return 'Le premier chiffre doit être 1 (homme) ou 2 (femme).';
              }

              // Rangs 2-3: deux derniers chiffres de l'année de naissance
              if (!/^[12][0-9]{2}/.test(valueWithoutSpaces)) {
                return 'Les chiffres 2 et 3 doivent représenter l'année de naissance.';
              }

              // Rangs 4-5: mois de naissance (01-12)
              const moisNaissance = valueWithoutSpaces.substring(3, 5);
              if (!/^(0[1-9]|1[0-2])$/.test(moisNaissance)) {
                return 'Les chiffres 4 et 5 doivent représenter un mois valide (01-12).';
              }

              // Vérification complète du format
              const formatComplet = /^[12][0-9]{2}(0[1-9]|1[0-2])[0-9]{8}$/;
              if (!formatComplet.test(valueWithoutSpaces)) {
                return 'Le format du numéro de sécurité sociale est invalide.';
              }
              
              return true;
            },
            message: 'Le numéro de sécurité sociale est invalide.',
            successMessage: 'Le numéro de sécurité sociale est valide.',
            fieldIdentifier: 'Numéro de sécurité sociale',
          }
        }
      ]"
     />
    </template>
    `,
			},
		],
	},
	render: args => ({
		components: { NirField },
		setup() {
			const value = ref('')
			return { args, value }
		},
		template: `
      <div>
        <h3>Validation avec pattern personnalisé et prévalence</h3>
        <p>Cette démonstration utilise une règle personnalisée qui valide le format du NIR selon le pattern suivant :</p>
        <pre>X XX XX XXX XXX XXX</pre>
        <p>Où :</p>
        <ul>
          <li><strong>X</strong> (rang 1) : sexe (1 pour les hommes, 2 pour les femmes)</li>
          <li><strong>XX</strong> (rangs 2-3) : deux derniers chiffres de l'année de naissance</li>
          <li><strong>XX</strong> (rangs 4-5) : mois de naissance (01-12)</li>
          <li><strong>XXX</strong> (rangs 6-10) : lieu de naissance
            <ul>
              <li>Rangs 6-7 : département (99 si étranger, 2A/2B pour la Corse)</li>
              <li>Rangs 8-10 : code commune ou pays</li>
            </ul>
          </li>
          <li><strong>XXX</strong> (rangs 11-13) : numéro d’ordre</li>
        </ul>
        <p>La propriété <code>customRulesPrecedence</code> est définie à <code>true</code> pour que cette règle soit appliquée avant la validation standard.</p>
        <NirField
          v-model="value"
          v-bind="args"
		  class="mt-4"
        />
        <div class="mt-4">Valeur actuelle : {{ value }}</div>
      </div>
    `,
	}),
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
     import { NirField } from '@cnamts/synapse'
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
		label="NirField"
		required
		:displayKey="false"
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
					label="NirField"
					required
					showSuccessMessages
                    :displayKey="false"
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

export const DisableErrorHandling: Story = {
	parameters: {
		docs: {
			description: {
				story: `
### Désactivation de la gestion des erreurs

Cette story illustre l'utilisation de la propriété \`disableErrorHandling\` qui permet de désactiver complètement
la gestion et l'affichage des erreurs dans un champ, même si des règles de validation sont définies.

Cela peut être utile dans des cas particuliers où vous souhaitez définir des règles de validation
mais gérer leur affichage différemment, ou utiliser la validation uniquement au niveau du formulaire parent.
`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <!-- Champ avec validation normale -->
  <NirField
    v-model="value"
    label="NIR avec validation"
    required
  />
  
  <!-- Champ avec gestion d'erreurs désactivée -->
  <NirField
    v-model="value"
    label="NIR sans gestion d'erreurs"
    required
    disableErrorHandling
  />
</template>`,
			},
		],
	},
	render: () => ({
		components: { NirField },
		setup() {
			const value1 = ref('')
			const value2 = ref('')

			return { value1, value2 }
		},
		template: `
      <div>
        <div>
          <div>
            <p class="text-subtitle-2 mb-2">Validation normale</p>
            <NirField
              v-model="value1"
              label="NIR avec validation"
              required
            />
          </div>
          
          <div>
            <p class="text-subtitle-2 mb-2">Sans gestion d'erreurs</p>
            <NirField
              v-model="value2"
              label="NIR sans gestion d'erreurs"
              required
              disableErrorHandling
            />
          </div>
        </div>
        
        <div class="mt-4 text-body-2">
          <p>Instructions :</p>
          <ol>
            <li class="ml-4">Cliquez dans un champ puis en dehors pour déclencher la validation</li>
            <li class="ml-4">Essayez de saisir des valeurs invalides (moins de 13 chiffres)</li>
            <li class="ml-4">Notez que le premier champ affiche des erreurs, mais pas le second</li>
          </ol>
        </div>
      </div>
    `,
	}),
}
