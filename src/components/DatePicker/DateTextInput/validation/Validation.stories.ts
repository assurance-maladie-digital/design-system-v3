import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
import { ref } from 'vue'
import { fn } from 'storybook/test'
import DatePickerSyFormValidity from '../../docExamples/DatePickerSyFormValidity.vue'

const meta: Meta<typeof DatePicker> = {
	title: 'Composants/Formulaires/DatePicker/DateInput/Validation',
	component: DatePicker,
	decorators: [
		() => ({
			template: '<div class="pa-5"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['modelValue'] },
		actions: { argTypesRegex: '^on.*' },
	},
	args: {
		'onUpdate:modelValue': fn(),
	},
}

export default meta

type Story = StoryObj<typeof meta>

export const SyFormLiveValidity: Story = {
	name: 'Validité du SyForm avant soumission',
	parameters: {
		controls: { disable: true },
		docs: {
			description: {
				story: 'Une saisie invalide fait passer le formulaire à `false`. Après correction et sortie du champ, la validité passe à `true` avant la soumission.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyForm
    v-model="valid"
    class="pa-4"
    @submit="onSubmit"
  >
    <div class="d-flex flex-column align-start ga-4">
      <p>
        Saisissez 32/11/2026 et quittez le champ pour voir l’erreur. Corrigez en 30/11/2026, puis quittez à nouveau le champ.
      </p>
      <DatePicker
        v-model="date"
        label="Date"
        hint="Format attendu : JJ/MM/AAAA"
        persistent-hint
        placeholder="JJ/MM/AAAA"
        format="DD/MM/YYYY"
        required
        no-calendar
      />
      <p role="status">
        Validité du SyForm (<code>v-model</code>) <code>{{ String(valid) }}</code>
      </p>
      <div class="d-flex flex-wrap ga-3">
        <VBtn
          type="button"
          variant="outlined"
        >
          Sortir du champ
        </VBtn>
        <VBtn
          type="submit"
          color="primary"
          :disabled="valid !== true"
        >
          Soumettre
        </VBtn>
      </div>
      <p
        v-if="submitted !== null"
        role="status"
      >
        Dernière soumission <code>isValid = {{ submitted }}</code>
      </p>
    </div>
  </SyForm>
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker, SyForm } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

const date = ref<string | null>('')
const valid = ref<boolean | null>(null)
const submitted = ref<boolean | null>(null)

function onSubmit({ isValid }: { isValid: boolean }) {
  submitted.value = isValid
}
</script>`,
			},
		],
	},
	render: () => ({
		components: { DatePickerSyFormValidity },
		template: '<DatePickerSyFormValidity mode="text" />',
	}),
}

const baseArgs = {
	'noCalendar': true,
	'format': 'DD/MM/YYYY',
	'dateFormatReturn': '',
	'placeholder': 'JJ/MM/AAAA',
	'label': 'Date de la consultation',
	'helpText': 'Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres',
	'required': false,
	'disabled': false,
	'readonly': false,
	'isOutlined': true,
	'displayIcon': true,
	'displayAppendIcon': false,
	'noIcon': false,
	'displayRange': false,
	'displayPrependIcon': false,
	'showSuccessMessages': false,
	'disableErrorHandling': false,
	'onUpdate:modelValue': fn(),
	'onFocus': fn(),
	'onBlur': fn(),
} satisfies Record<string, unknown>

/** Rendu commun : le v-model local est initialisé depuis `args.modelValue`. */
const renderWithLocalModel: Story['render'] = args => ({
	components: { DatePicker },
	setup() {
		const date = ref(args.modelValue ?? null)
		return { args, date }
	},
	template: `
		<div>
			<DatePicker
				v-bind="args"
				v-model="date"
			/>
			<div class="mt-4 text-body-2">Valeur actuelle : {{ date }}</div>
		</div>
	`,
})

export const WithError: Story = {
	args: {
		...baseArgs,
		modelValue: '20/08/2026',
		errorMessages: ['Date invalide côté métier'],
		required: false,
	},
	parameters: {
		docs: {
			description: {
				story: 'Expose le cas standard d\'un message d\'erreur injecté par le parent, comme sur les autres composants migrés.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <DatePicker
    v-model="date"
    label="Date de la consultation"
    help-text="Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres"
    placeholder="JJ/MM/AAAA"
    format="DD/MM/YYYY"
    no-calendar
    :error-messages="['Date invalide côté métier']"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker } from '@cnamts/synapse'

const date = ref<string | null>('20/08/2026')
</script>`,
			},
		],
	},
	render: renderWithLocalModel,
}

export const WithWarning: Story = {
	args: {
		...baseArgs,
		modelValue: '20/08/2026',
		warningMessages: ['Date inhabituelle, à vérifier'],
		required: false,
	},
	parameters: {
		docs: {
			description: {
				story: 'Expose le cas standard d\'un message d\'avertissement injecté par le parent.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <DatePicker
    v-model="date"
    label="Date de la consultation"
    help-text="Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres"
    placeholder="JJ/MM/AAAA"
    format="DD/MM/YYYY"
    no-calendar
    :warning-messages="['Date inhabituelle, à vérifier']"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker } from '@cnamts/synapse'

const date = ref<string | null>('20/08/2026')
</script>`,
			},
		],
	},
	render: renderWithLocalModel,
}

export const WithSuccess: Story = {
	args: {
		...baseArgs,
		modelValue: '20/08/2026',
		showSuccessMessages: true,
		successMessages: ['Date validée'],
		required: false,
	},
	parameters: {
		docs: {
			description: {
				story: 'Expose le cas standard d\'un message de succès injecté par le parent.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <DatePicker
    v-model="date"
    label="Date de la consultation"
    help-text="Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres"
    placeholder="JJ/MM/AAAA"
    format="DD/MM/YYYY"
    no-calendar
    show-success-messages
    :success-messages="['Date validée']"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker } from '@cnamts/synapse'

const date = ref<string | null>('20/08/2026')
</script>`,
			},
		],
	},
	render: renderWithLocalModel,
}

export const CustomRules: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Règle personnalisée (`customRules`) : les dates en 2024 ne sont pas autorisées. Avec `showSuccessMessages`, le `successMessage` de la règle s\'affiche lorsque la date est valide.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <DatePicker
    v-model="date"
    date-format-return="DD/MM/YYYY"
    format="DD/MM/YYYY"
    placeholder="JJ/MM/AAAA"
    label="Date de la consultation"
    help-text="Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres. Les dates en 2024 ne sont pas autorisées"
    required
    no-calendar
    show-success-messages
    :custom-rules="customRules"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker } from '@cnamts/synapse'

const date = ref<string | null>('21/12/2024')
const customRules = [
  {
    type: 'custom',
    options: {
      validate: (value: unknown) => typeof value !== 'string' || !value.includes('2024'),
      message: 'Les dates en 2024 ne sont pas autorisées',
      successMessage: 'Les dates hors 2024 sont autorisées',
      fieldIdentifier: 'date',
    },
  },
]
</script>`,
			},
		],
	},
	args: {
		...baseArgs,
		modelValue: '21/12/2024',
		dateFormatReturn: 'DD/MM/YYYY',
		label: 'Date de la consultation',
		helpText: 'Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres. Les dates en 2024 ne sont pas autorisées',
		required: true,
		showSuccessMessages: true,
		customRules: [{
			type: 'custom',
			options: {
				validate: (value: unknown) => typeof value !== 'string' || !value.includes('2024'),
				message: 'Les dates en 2024 ne sont pas autorisées',
				successMessage: 'Les dates hors 2024 sont autorisées',
				fieldIdentifier: 'date',
			},
		}],
	},
	render: renderWithLocalModel,
}

export const WarningRules: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Règle d\'avertissement (`customWarningRules`) : une date en 2025 affiche un avertissement non bloquant, le champ reste valide.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <DatePicker
    v-model="date"
    format="DD/MM/YYYY"
    placeholder="JJ/MM/AAAA"
    label="Date de la consultation"
    help-text="Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres. Les dates en 2025 déclenchent un avertissement"
    no-calendar
    :custom-warning-rules="customWarningRules"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker } from '@cnamts/synapse'

const date = ref<string | null>('20/12/2025')
const customWarningRules = [
  {
    type: 'custom',
    options: {
      validate: (value: unknown) => typeof value !== 'string' || !value.includes('2025'),
      warningMessage: 'Attention : la date est en 2025, vérifiez-la',
      fieldIdentifier: 'date',
      isWarning: true,
    },
  },
]
</script>`,
			},
		],
	},
	args: {
		...baseArgs,
		modelValue: '20/12/2025',
		label: 'Date de la consultation',
		helpText: 'Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres. Les dates en 2025 déclenchent un avertissement',
		customWarningRules: [{
			type: 'custom',
			options: {
				validate: (value: unknown) => typeof value !== 'string' || !value.includes('2025'),
				warningMessage: 'Attention : la date est en 2025, vérifiez-la',
				fieldIdentifier: 'date',
				isWarning: true,
			},
		}],
	},
	render: renderWithLocalModel,
}

export const WithErrorDisabled: Story = {
	parameters: {
		// Chaque champ impose son propre libellé et sa propre valeur
		controls: { exclude: ['modelValue', 'label'] },
		docs: {
			description: {
				story: 'Comparaison entre un champ avec `disableErrorHandling` (validation interne désactivée) et un champ avec la gestion des erreurs par défaut. Laissez les deux champs vides puis quittez-les : seul le second affiche l\'erreur.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <div class="d-flex flex-wrap ga-4">
    <DatePicker
      v-model="date1"
      format="DD/MM/YYYY"
      date-format-return="YYYY/MM/DD"
      placeholder="JJ/MM/AAAA"
      label="Date sans gestion des erreurs"
      help-text="Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres"
      required
      no-icon
      no-calendar
      disable-error-handling
    />
    <DatePicker
      v-model="date2"
      format="DD/MM/YYYY"
      date-format-return="YYYY/MM/DD"
      placeholder="JJ/MM/AAAA"
      label="Date avec gestion des erreurs"
      help-text="Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres"
      required
      no-icon
      no-calendar
    />
  </div>
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker } from '@cnamts/synapse'

const date1 = ref<string | null>(null)
const date2 = ref<string | null>(null)
</script>`,
			},
		],
	},
	args: {
		...baseArgs,
		dateFormatReturn: 'YYYY/MM/DD',
		required: true,
		noIcon: true,
		disableErrorHandling: true,
	},
	render: args => ({
		components: { DatePicker },
		setup() {
			const date1 = ref<string | null>(null)
			const date2 = ref<string | null>(null)
			return { args, date1, date2 }
		},
		template: `
			<div class="d-flex flex-wrap ga-4">
				<div>
					<DatePicker
						v-bind="args"
						v-model="date1"
						label="Date sans gestion des erreurs"
					/>
					<div class="mt-4 text-body-2">Valeur : {{ date1 }}</div>
				</div>
				<div>
					<DatePicker
						v-bind="args"
						v-model="date2"
						label="Date avec gestion des erreurs"
						:disable-error-handling="false"
					/>
					<div class="mt-4 text-body-2">Valeur : {{ date2 }}</div>
				</div>
			</div>
		`,
	}),
}
