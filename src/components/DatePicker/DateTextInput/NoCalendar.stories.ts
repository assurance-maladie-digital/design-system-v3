import type { Meta, StoryObj } from '@storybook/vue3'
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
import { ref } from 'vue'
import { fn } from '@storybook/test'

const meta = {
	title: 'Composants/Formulaires/DatePicker/DateInput',
	component: DatePicker,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['modelValue'] },
		actions: { argTypesRegex: '^on.*' },
		events: {
			remapEvents: {
				'update:model-value': 'onUpdate:modelValue',
				'focus': 'onFocus',
				'blur': 'onBlur',
				'input': 'onInput',
				'date-selected': 'onDate-selected',
			},
		},
		docs: {
			description: {
				component: '\n## DatePicker en mode text input (noCalendar) - Incompatibilités entre props\n\n### Contrôle d\'affichage des icônes\n- `noIcon: true` masque toutes les icônes, rendant `displayIcon`, `displayAppendIcon` et `displayPrependIcon` sans effet\n- `displayIcon: false` désactive les icônes, rendant `displayAppendIcon` et `displayPrependIcon` sans effet\n- `displayAppendIcon` et `displayPrependIcon` sont mutuellement exclusifs; si les deux sont définis à `true`, `displayAppendIcon` est prioritaire\n\n### Validation et états de champ\n- `readonly: true` désactive toutes les validations, y compris `required` et les règles personnalisées\n- `disabled` et `readonly` sont mutuellement exclusifs\n- `disableErrorHandling: true` peut créer une incohérence avec `showSuccessMessages: true`\n\n### Format et saisie\n- `birthDate` et `isBirthDate` sont des alias, utiliser l\'un ou l\'autre mais pas les deux\n- `displayRange: true` nécessite que modelValue soit un tableau de deux dates `[startDate, endDate]`\n- `autoClamp: true` peut court-circuiter certaines validations manuelles\n',
			},
		},
	},
	argTypes: {
		'onUpdate:modelValue': {
			description: 'Émis lorsque la valeur du champ est mise à jour',
			table: {
				category: 'events',
				type: { summary: '(value: DateValue) => void' },
			},
		},
		'onFocus': {
			description: 'Émis lorsque le champ reçoit le focus',
			table: {
				category: 'events',
				type: { summary: '() => void' },
			},
		},
		'onBlur': {
			description: 'Émis lorsque le champ perd le focus',
			table: {
				category: 'events',
				type: { summary: '() => void' },
			},
		},
		'onInput': {
			description: 'Émis lors de la saisie dans le champ',
			table: {
				category: 'events',
				type: { summary: '(value: string) => void' },
			},
		},
		'onDate-selected': {
			description: 'Émis lorsqu\'une date complète est saisie manuellement',
			table: {
				category: 'events',
				type: { summary: '(value: DateValue) => void' },
			},
		},
		'validateOnSubmit': {
			description: 'Valide le champ et retourne true si valide, false sinon',
			table: {
				category: 'exposed',
				type: { summary: '() => boolean' },
			},
		},
		'focus': {
			description: 'Met le focus sur le champ de saisie de date',
			table: {
				category: 'exposed',
				type: { summary: '() => void' },
			},
		},
		'blur': {
			description: 'Retire le focus du champ de saisie',
			table: {
				category: 'exposed',
				type: { summary: '() => void' },
			},
		},
		'placeholder': {
			control: 'text',
			description: 'Texte indicatif affiché lorsque le champ est vide pour guider l\'utilisateur sur le format attendu',
			defaultValue: 'JJ/MM/AAAA',
		},
		'format': {
			control: 'select',
			options: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'],
			description: 'Format d\'affichage de la date dans le champ (ex: DD/MM/YYYY pour jour/mois/année)',
			defaultValue: 'DD/MM/YYYY',
		},
		'dateFormatReturn': {
			control: 'select',
			options: ['', 'DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'],
			description: 'Format de la date émise par le v-model. Si vide, utilise le même format que la prop "format"',
			defaultValue: '',
		},
		'label': {
			control: 'text',
			description: 'Libellé du champ affiché au-dessus ou dans le champ de saisie',
			defaultValue: 'Date',
		},
		'required': {
			control: 'boolean',
			description: 'Définit si le champ est obligatoire et active la validation correspondante',
			defaultValue: false,
		},
		'disabled': {
			control: 'boolean',
			description: 'Désactive le champ, empêchant toute interaction utilisateur et appliquant un style grisé. ⚠️ Incompatible avec readonly.',
			defaultValue: false,
		},
		'readonly': {
			control: 'boolean',
			description: 'Rend le champ en lecture seule, la valeur peut être affichée mais pas modifiée par l\'utilisateur. ⚠️ Désactive toutes les validations (required, customRules, customWarningRules). Incompatible avec disabled.',
			defaultValue: false,
		},
		'isOutlined': {
			control: 'boolean',
			description: 'Affiche le champ avec un contour complet (style outlined de Vuetify) plutôt qu\'un souligné simple',
			defaultValue: true,
		},
		'displayIcon': {
			control: 'boolean',
			description: 'Contrôle l\'affichage de l\'icône calendrier, à utiliser en conjonction avec displayPrependIcon ou displayAppendIcon. ⚠️ Sans effet si noIcon est true.',
			defaultValue: true,
		},
		'displayAppendIcon': {
			control: 'boolean',
			description: 'Affiche l\'icône calendrier à la fin du champ (à droite). ⚠️ Sans effet si displayIcon est false ou si noIcon est true. Prioritaire sur displayPrependIcon si les deux sont true.',
			defaultValue: false,
		},
		'noIcon': {
			control: 'boolean',
			description: 'Masque toutes les icônes du composant, remplace les props displayIcon, displayAppendIcon et displayPrependIcon. ⚠️ Incompatible avec displayIcon, displayAppendIcon et displayPrependIcon.',
			defaultValue: false,
		},
		'customRules': {
			control: 'object',
			description: 'Règles de validation personnalisées pour la date saisie, affichant des erreurs si non respectées',
			defaultValue: [],
		},
		'customWarningRules': {
			control: 'object',
			description: 'Règles d\'avertissement pour afficher des messages d\'attention sans bloquer la validation',
			defaultValue: [],
		},
		'displayPrependIcon': {
			control: 'boolean',
			description: 'Affiche l\'icône calendrier au début du champ (à gauche). ⚠️ Sans effet si displayIcon est false, si noIcon est true, ou si displayAppendIcon est true.',
			defaultValue: true,
		},
		'disableErrorHandling': {
			control: 'boolean',
			description: 'Désactive la gestion interne des erreurs, permettant à l\'application parente de gérer les validations. ⚠️ Peut créer une incohérence si showSuccessMessages est true.',
			defaultValue: false,
		},
		'showSuccessMessages': {
			control: 'boolean',
			description: 'Affiche les messages de succès quand la validation est passée avec succès',
			defaultValue: true,
		},
		'bgColor': {
			control: 'color',
			description: 'Couleur de fond du champ de saisie (ex: white, transparent, #f5f5f5)',
			defaultValue: 'white',
		},
		'displayRange': {
			control: 'boolean',
			description: 'Active la sélection de plage de dates (date début - date fin), le v-model retournera un tableau de deux dates. ⚠️ Nécessite que modelValue soit un tableau de deux dates [startDate, endDate] pour fonctionner correctement.',
			defaultValue: false,
		},
		'autoClamp': {
			control: 'boolean',
			description: 'Active la mise en forme automatique lors de la saisie (ajout des séparateurs automatiquement). ⚠️ Peut court-circuiter certaines validations manuelles.',
			defaultValue: false,
		},
		'noCalendar': {
			control: 'boolean',
			description: 'Désactive l\'affichage du calendrier, permettant uniquement la saisie manuelle (utile pour les tests automatisés)',
			defaultValue: true,
		},
		'displayAsterisk': {
			control: 'boolean',
			description: 'Affiche un astérisque (*) à côté du label pour indiquer visuellement que le champ est obligatoire',
			defaultValue: false,
		},
		'birthDate': {
			control: 'boolean',
			description: 'Alias pour isBirthDate (pour compatibilité avec l\'attribut kebab-case birth-date dans les templates). ⚠️ Utiliser soit birthDate soit isBirthDate, mais pas les deux.',
			defaultValue: false,
		},
		'isBirthDate': {
			control: 'boolean',
			description: 'Active le mode date de naissance qui commence la navigation du calendrier à l\'année en cours moins 30 ans',
			defaultValue: false,
		},
		'width': {
			control: 'text',
			description: 'Largeur du champ (peut être en px, %, em, rem ou toute unité CSS valide)',
			defaultValue: '100%',
		},
		'isValidateOnBlur': {
			control: 'boolean',
			description: 'Active la validation automatique lorsque le champ perd le focus (onBlur)',
			defaultValue: true,
		},
		'density': {
			control: 'select',
			options: ['default', 'comfortable', 'compact'],
			description: 'Densité du champ, affecte l\'espacement interne et la hauteur (standard Vuetify)',
			defaultValue: 'default',
		},
		'title': {
			control: 'text',
		},
	},
} as Meta<typeof DatePicker>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		'noCalendar': true,
		'format': 'DD/MM/YYYY',
		'dateFormatReturn': '',
		'placeholder': 'JJ/MM/AAAA',
		'label': 'Date avec règles de validation',
		'required': true,
		'disabled': false,
		'readonly': false,
		'isOutlined': true,
		'displayIcon': true,
		'displayAppendIcon': false,
		'noIcon': false,
		'displayRange': false,
		'displayPrependIcon': false,
		'showSuccessMessages': true,
		'disableErrorHandling': false,
		'onUpdate:modelValue': fn(),
		'onFocus': fn(),
		'onBlur': fn(),
	},
	render(args) {
		const date = ref<string | null>(null)
		return {
			components: { DatePicker },
			setup() {
				return { args, date }
			},
			template: `
				<div>
					<DatePicker
						v-model="date"
						v-bind="args"
					/>
					<div style="margin-top: 10px; font-family: monospace; color: #666;">
						Valeur : {{ date }}
					</div>
				</div>
			`,
		}
	},
}

export const Required: Story = {
	args: {
		'noCalendar': true,
		'format': 'DD/MM/YYYY',
		'dateFormatReturn': '',
		'placeholder': 'JJ/MM/AAAA',
		'label': 'Date avec règles de validation',
		'required': true,
		'disabled': false,
		'readonly': false,
		'isOutlined': true,
		'displayIcon': true,
		'displayAppendIcon': false,
		'noIcon': false,
		'displayRange': false,
		'displayPrependIcon': false,
		'showSuccessMessages': true,
		'disableErrorHandling': false,
		'onUpdate:modelValue': fn(),
		'onFocus': fn(),
		'onBlur': fn(),
	},
	render(args) {
		const date = ref<string | null>(null)
		return {
			components: { DatePicker },
			setup() {
				return { args, date }
			},
			template: `
				<div>
					<h4 class="mb-4">Sans astérisque :</h4>
					<DatePicker
						v-model="date"
						v-bind="args"
					/>
					<h4 class="mb-4">Avec astérisque :</h4>
					<DatePicker
						v-model="date"
						v-bind="args"
						displayAsterisk
					/>
				</div>
			`,
		}
	},
}

export const EuropeanFormat: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePicker
						v-model="date"
						format="DD/MM/YYYY"
						date-format-return="YYYY/MM/DD"
						placeholder="JJ/MM/AAAA"
						required
						no-icon
						no-calendar
					/>

					<DatePicker
						v-model="date"
						format="DD/MM/YYYY"
						date-format-return="YYYY/MM/DD"
						placeholder="JJ/MM/AAAA"
						required
						no-icon
						no-calendar
						displayAsterisk
					/>
				</template>
				`,
			},
		],
	},
	args: {
		'noCalendar': true,
		'format': 'DD/MM/YYYY',
		'dateFormatReturn': 'YYYY/MM/DD',
		'placeholder': 'JJ/MM/AAAA',
		'required': true,
		'noIcon': true,
		'onUpdate:modelValue': fn(),
		'onFocus': fn(),
		'onBlur': fn(),
	},
	render(args) {
		const date = ref<string | null>(null)
		return {
			components: { DatePicker },
			setup() {
				return { args, date }
			},
			template: `
				<div style="padding: 20px;">
					<h4 class="mb-4">Format européen avec règles de base (format de date valide) :</h4>
					<DatePicker
						v-model="date"
						v-bind="args"
					/>
					<div style="margin-top: 10px; font-family: monospace; color: #666;">
						Valeur (dateFormatReturn: 'YYYY/MM/DD') : {{ date }}
					</div>
				</div>
			`,
		}
	},
}

export const CustomRules: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePicker
						v-model="date"
						date-format-return="DD/MM/YYYY"
						format="DD/MM/YYYY"
						placeholder="DD/MM/YYYY"
						required
						no-calendar
						:custom-rules="[{
							type: 'custom',
							options: {
								validate: value => !value || !value.includes('2024'),
								message: 'Les dates en 2024 ne sont pas autorisées',
								successMessage: 'Les dates hors 2024 sont autorisées',
								fieldIdentifier: 'date'
							}
						}]"
					/>
				</template>
				`,
			},
		],
	},
	args: {
		'noCalendar': true,
		'format': 'DD/MM/YYYY',
		'dateFormatReturn': 'DD/MM/YYYY',
		'placeholder': 'DD/MM/YYYY',
		'required': true,
		'customRules': [{
			type: 'custom',
			options: {
				validate: (value: string) => !value || !value.includes('2024'),
				message: 'Les dates en 2024 ne sont pas autorisées',
				successMessage: 'Les dates hors 2024 sont autorisées',
				fieldIdentifier: 'date',
			},
		}],
		'onUpdate:modelValue': fn(),
		'onFocus': fn(),
		'onBlur': fn(),
	},
	render(args) {
		const date = ref<string | null>('21/12/2024')
		return {
			components: { DatePicker },
			setup() {
				return { args, date }
			},
			template: `
				<div style="padding: 20px;">
					<h4 class="mb-0">Format avec règles personnalisées :</h4>
					<p class="mb-4">Les dates en 2024 ne sont pas autorisées</p>
					<DatePicker
						v-model="date"
						v-bind="args"
					/>
					<div style="margin-top: 10px; font-family: monospace; color: #666;">
						Valeur : {{ date }}
					</div>
				</div>
			`,
		}
	},
}

export const WarningRules: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePicker
						v-model="date"
						format="DD/MM/YYYY"
						placeholder="JJ/MM/AAAA"
						no-calendar
						:custom-warning-rules="[{
							type: 'custom',
							options: {
								validate: value => !value || !value.includes('2025'),
								warningMessage: 'Les dates en 2025 ne sont pas autorisées',
								successMessage: 'Date hors 2025',
								fieldIdentifier: 'date',
								isWarning: true
							}
						}]"
					/>
				</template>
				`,
			},
		],
	},
	args: {
		'noCalendar': true,
		'format': 'DD/MM/YYYY',
		'placeholder': 'JJ/MM/AAAA',
		'customWarningRules': [{
			type: 'custom',
			options: {
				validate: (value: string) => !value || !value.includes('2025'),
				warningMessage: 'Les dates en 2025 ne sont pas autorisées',
				successMessage: 'Date hors 2025',
				fieldIdentifier: 'date',
				isWarning: true,
			},
		}],
		'onUpdate:modelValue': fn(),
		'onFocus': fn(),
		'onBlur': fn(),
	},
	render(args) {
		const date = ref<string | null>('20/12/2025')
		return {
			components: { DatePicker },
			setup() {
				return { args, date }
			},
			template: `
				<div style="padding: 20px;">
					<h4 class="mb-0">Format avec règles d'avertissement :</h4>
					<p class="mb-4">Les dates en 2025 ne sont pas autorisées</p>
					<DatePicker
						v-model="date"
						v-bind="args"
					/>
					<div style="margin-top: 10px; font-family: monospace; color: #666;">
						Valeur : {{ date }}
					</div>
				</div>
			`,
		}
	},
}

export const WithAppendIcon: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePicker
						v-model="date"
						format="DD/MM/YYYY"
						placeholder="JJ/MM/AAAA"
						no-calendar
						display-append-icon
					/>
				</template>
				`,
			},
		],
	},
	args: {
		'noCalendar': true,
		'format': 'DD/MM/YYYY',
		'placeholder': 'JJ/MM/AAAA',
		'displayAppendIcon': true,
		'onUpdate:modelValue': fn(),
		'onFocus': fn(),
		'onBlur': fn(),
	},
	render(args) {
		const date = ref<string | null>(null)
		return {
			components: { DatePicker },
			setup() {
				return { args, date }
			},
			template: `
				<div style="padding: 20px;">
					<h4 class="mb-4">Format avec icône en suffixe</h4>
					<DatePicker
						v-model="date"
						v-bind="args"
					/>
					<div style="margin-top: 10px; font-family: monospace; color: #666;">
						Valeur : {{ date }}
					</div>
				</div>
			`,
		}
	},
}

export const WithErrorDisabled: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<div class="d-flex">
						<div class="mr-4" style="width: 300px;">
							<p class="mb-3">Avec <code>disableErrorHandling</code>:</p>
							<DatePicker
								v-model="date1"
								format="DD/MM/YYYY"
								placeholder="Date requise sans erreur"
								required
								no-icon
								no-calendar
								:disableErrorHandling="true"
							/>
						</div>
						<div style="width: 300px;">
							<p class="mb-3">Sans <code>disableErrorHandling</code>:</p>
							<DatePicker
								v-model="date2"
								format="DD/MM/YYYY"
								placeholder="Date requise avec erreur"
								required
								no-icon
								no-calendar
							/>
						</div>
					</div>
				</template>
				`,
			},
		],
	},
	args: {
		noCalendar: true,
		format: 'DD/MM/YYYY',
		dateFormatReturn: 'YYYY/MM/DD',
		placeholder: 'Date requise sans erreur',
		required: true,
		noIcon: true,
		disableErrorHandling: true,
	},
	render(args) {
		const date1 = ref<string | null>(null)
		const date2 = ref<string | null>(null)
		return {
			components: { DatePicker },
			setup() {
				return { args, date1, date2 }
			},
			template: `
				<div style="padding: 20px;">
					<h4 class="mb-4">DateTextInput avec désactivation des erreurs</h4>
					<div class="d-flex mb-4">
						<div class="mr-4" style="width: 300px;">
							<p class="mb-3">Avec <code>disableErrorHandling</code>:</p>
							<DatePicker
								v-model="date1"
								v-bind="args"
							/>
							<div style="margin-top: 10px; font-family: monospace; color: #666;">
								Valeur : {{ date1 }}
							</div>
						</div>
						
						<div style="width: 300px;">
							<p class="mb-3">Sans <code>disableErrorHandling</code>:</p>
							<DatePicker
								v-model="date2"
								format="DD/MM/YYYY"
								placeholder="Date requise avec erreur"
								required
								no-icon
								no-calendar
							/>
							<div style="margin-top: 10px; font-family: monospace; color: #666;">
								Valeur : {{ date2 }}
							</div>
						</div>
					</div>
				</div>
			`,
		}
	},
}

export const AutoClampFeature: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<div class="d-flex flex-column">
						<h3>Démonstration de l'auto clamp dans DateTextInput</h3>
						
						<h4 class="mt-4">Format JJ/MM/AAAA (séparateur /)</h4>
						<DatePicker
							v-model="dateSlash"
							placeholder="Saisie avec auto clamp - séparateur /"
							format="DD/MM/YYYY"
							noCalendar
							autoClamp
						/>
						
						<h4 class="mt-4">Format JJ-MM-AAAA (séparateur -)</h4>
						<DatePicker
							v-model="dateDash"
							placeholder="Saisie avec auto clamp - séparateur -"
							format="DD-MM-YYYY"
							noCalendar
							autoClamp

						/>
						
						<h4 class="mt-4">Format YYYY.MM.DD (séparateur .)</h4>
						<DatePicker
							v-model="dateDot"
							placeholder="Saisie avec auto clamp - séparateur ."
							format="YYYY.MM.DD"
							noCalendar
							autoClamp
						/>
						
						<h4 class="mt-4">Mode plage de dates (séparateur /)</h4>
						<DatePicker
							v-model="dateRange"
							placeholder="Saisie plage avec auto clamp"
							format="DD/MM/YYYY"
							displayRange
							noCalendar
							autoClamp
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
					import { DatePicker } from '@cnamts/synapse'
					
					const dateSlash = ref('')
					const dateDash = ref('')
					const dateDot = ref('')
					const dateRange = ref('')
				</script>
				`,
			},
		],
	},
	render: () => {
		return {
			components: { DatePicker },
			setup() {
				const dateSlash = ref('')
				const dateDash = ref('')
				const dateDot = ref('')
				const dateRange = ref('')
				return { dateSlash, dateDash, dateDot, dateRange }
			},
			template: `
              <div class="d-flex flex-column pa-4">
                <h3>Démonstration de l'auto clamp dans DateTextInput</h3>
                <div class="mb-4 mt-2">Saisissez uniquement des chiffres - les séparateurs seront ajoutés automatiquement selon le format défini</div>
                
                <h4 class="mb-2">Format JJ/MM/AAAA (séparateur /)</h4>
                <DatePicker
                  v-model="dateSlash"
                  placeholder="Saisie avec auto clamp - séparateur /"
                  format="DD/MM/YYYY"
                  noCalendar
                  autoClamp
                />
                <div class="caption mb-4">Valeur actuelle: {{ dateSlash || 'aucune date saisie' }}</div>
                
                <h4 class="mb-2">Format JJ-MM-AAAA (séparateur -)</h4>
                <DatePicker
                  v-model="dateDash"
                  placeholder="Saisie avec auto clamp - séparateur -"
                  format="DD-MM-YYYY"
                  noCalendar
                  autoClamp
                />
                <div class="caption mb-4">Valeur actuelle: {{ dateDash || 'aucune date saisie' }}</div>
                
                <h4 class="mb-2">Format AAAA.MM.JJ (séparateur .)</h4>
                <DatePicker
                  v-model="dateDot"
                  placeholder="Saisie avec auto clamp - séparateur ."
                  format="YYYY.MM.DD"
                  noCalendar
                  autoClamp
                />
                <div class="caption mb-4">Valeur actuelle: {{ dateDot || 'aucune date saisie' }}</div>
                
                <h4 class="mb-2">Mode plage de dates (séparateur /)</h4>
                <DatePicker
                  v-model="dateRange"
                  placeholder="Saisie plage avec auto clamp"
                  format="DD/MM/YYYY"
                  displayRange
                  noCalendar
                  autoClamp
                />
                <div class="caption mb-4">Valeur actuelle: {{ dateRange || 'aucune plage saisie' }}</div>
              </div>
            `,
		}
	},
}

export const DifferentFormats: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<div class="d-flex flex-column gap-4">
						<DatePicker
							v-model="value1"
							placeholder="Format JJ/MM/AAAA"
							format="DD/MM/YYYY"
							no-calendar
						/>
						<DatePicker
							v-model="value2"
							placeholder="Format MM/JJ/AAAA"
							format="MM/DD/YYYY"
							no-calendar
						/>
						<DatePicker
							v-model="value3"
							placeholder="Format AAAA-MM-JJ"
							format="YYYY-MM-DD"
							no-calendar
						/>
						<DatePicker
							v-model="value4"
							placeholder="Format JJ-MM-AA"
							format="DD-MM-YY"
							no-calendar
						/>
						<DatePicker
							v-model="value5"
							placeholder="Format JJ.MM.AAAA"
							format="DD.MM.YYYY"
							no-calendar
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
					import { DatePicker } from '@cnamts/synapse'
					
				const value1 = ref('24/12/2025')
				const value2 = ref('12/24/2025')
				const value3 = ref('2025-12-24')
				const value4 = ref('24-12-25')
				const value5 = ref('24.12.2025')
				</script>
				`,
			},
		],
	},
	render: () => {
		return {
			components: { DatePicker: DatePicker },
			setup() {
				const value1 = ref('24/12/2025')
				const value2 = ref('12/24/2025')
				const value3 = ref('2025-12-24')
				const value4 = ref('24-12-25')
				const value5 = ref('25.12.2025')
				return { value1, value2, value3, value4, value5 }
			},
			template: `
              <div class="d-flex flex-column gap-4 pa-4">
                <DatePicker
                    v-model="value1"
                    placeholder="Format JJ/MM/AAAA"
                    format="DD/MM/YYYY"
                    no-calendar
                    class="py-4"
                />
                <DatePicker
                    v-model="value2"
                    placeholder="Format MM/JJ/AAAA"
                    format="MM/DD/YYYY"
					no-calendar
					class="py-4"
                />
                <DatePicker
                    v-model="value3"
                    placeholder="Format AAAA-MM-JJ"
                    format="YYYY-MM-DD"
					no-calendar
					class="py-4"
                />
                <DatePicker
                    v-model="value4"
                    placeholder="Format JJ-MM-AA"
                    format="DD-MM-YY"
					no-calendar
					class="py-4"
                />
                <DatePicker
                    v-model="value5"
                    placeholder="Format JJ.MM.AAAA"
                    format="DD.MM.YYYY"
					no-calendar
					class="py-4"
                />
              </div>
            `,
		}
	},
}
