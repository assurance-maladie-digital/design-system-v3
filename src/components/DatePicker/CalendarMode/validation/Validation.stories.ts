import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DatePicker from '../DatePicker.vue'
import SyForm from '../../../Customs/SyForm/SyForm.vue'
import { computed, nextTick, onMounted, ref } from 'vue'
import { fn } from 'storybook/test'
import { VBtn, VForm } from 'vuetify/components'
import type { DatePickerRule } from '../../types'
import DatePickerSyFormValidity from '../../docExamples/DatePickerSyFormValidity.vue'

const meta: Meta<typeof DatePicker> = {
	title: 'Composants/Formulaires/DatePicker/CalendarMode/Validation',
	component: DatePicker,
	parameters: {
		layout: 'fullscreen',
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
				story: 'Une custom rule interdit le 15 du mois : sélectionnez-le pour voir le formulaire passer à `false`, puis un autre jour pour le faire repasser à `true` et activer le bouton Soumettre.',
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
        Ouvrez le calendrier et sélectionnez le 15 du mois : la custom rule affiche une erreur et le formulaire passe à
        <code>false</code>. Choisissez un autre jour puis quittez le champ : le formulaire redevient
        <code>true</code> avant la soumission.
      </p>
      <DatePicker
        v-model="date"
        label="Date"
        hint="Format attendu : JJ/MM/AAAA"
        persistent-hint
        placeholder="JJ/MM/AAAA"
        format="DD/MM/YYYY"
        required
        :custom-rules="customRules"
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

const customRules = [
  {
    type: 'custom',
    options: {
      validate: (value: unknown) => !(value instanceof Date && value.getDate() === 15),
      message: 'Le 15 du mois n\\'est pas autorisé',
    },
  },
]

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
		template: '<DatePickerSyFormValidity mode="calendar" />',
	}),
}

export const WithError: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Une date invalide (postérieure à aujourd\'hui) est présaisie et la validation est déclenchée au chargement.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <DatePicker
    ref="datePickerRef"
    v-model="value"
    label="Date de la consultation"
    placeholder="JJ/MM/AAAA"
    format="DD/MM/YYYY"
    :custom-rules="[
      { type: 'notAfterToday', options: { message: 'La date ne peut pas être après aujourd’hui' } }
    ]"
    show-success-messages
  />
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { DatePicker } from '@cnamts/synapse'

const value = ref('01/01/2100')
const datePickerRef = ref<InstanceType<typeof DatePicker> | null>(null)

onMounted(() => {
  datePickerRef.value?.validateOnSubmit()
})
</script>`,
			},
		],
	},
	args: {
		label: 'Date de la consultation',
		placeholder: 'JJ/MM/AAAA',
		format: 'DD/MM/YYYY',
		showSuccessMessages: true,
		customRules: [
			{ type: 'notAfterToday', options: { message: 'La date ne peut pas être après aujourd’hui' } },
		],
	},
	render: args => ({
		components: { DatePicker },
		setup() {
			const value = ref('01/01/2100')
			const datePickerRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

			onMounted(() => {
				datePickerRef.value?.validateOnSubmit()
			})

			return { args, value, datePickerRef }
		},
		template: `
			<div class="pa-4">
				<DatePicker
					ref="datePickerRef"
					v-model="value"
					v-bind="args"
				/>
				<div class="mt-4 text-body-2">Valeur actuelle : {{ value }}</div>
			</div>
		`,
	}),
}

export const WithWarning: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Un avertissement non bloquant s\'affiche si la date est antérieure à une date de référence. Le champ reste valide.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <DatePicker
    ref="datePickerRef"
    v-model="value"
    label="Date de la consultation"
    help-text="Une date antérieure au 01/01/2031 déclenche un avertissement"
    placeholder="JJ/MM/AAAA"
    format="DD/MM/YYYY"
    :custom-warning-rules="[
      {
        type: 'notBeforeDate',
        options: {
          warningMessage: 'Attention : la date est antérieure à la date de référence (01/01/2031)',
          date: '01/01/2031',
          isWarning: true
        }
      }
    ]"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { DatePicker } from '@cnamts/synapse'

const value = ref('20/12/2023')
const datePickerRef = ref<InstanceType<typeof DatePicker> | null>(null)

onMounted(() => {
  datePickerRef.value?.validateOnSubmit()
})
</script>`,
			},
		],
	},
	args: {
		label: 'Date de la consultation',
		helpText: 'Une date antérieure au 01/01/2031 déclenche un avertissement',
		placeholder: 'JJ/MM/AAAA',
		format: 'DD/MM/YYYY',
		customWarningRules: [
			{
				type: 'notBeforeDate',
				options: {
					warningMessage: 'Attention : la date est antérieure à la date de référence (01/01/2031)',
					date: '01/01/2031',
					isWarning: true,
				},
			},
		],
	},
	render: args => ({
		components: { DatePicker },
		setup() {
			const value = ref('20/12/2023')
			const datePickerRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

			onMounted(() => {
				datePickerRef.value?.validateOnSubmit()
			})

			return { args, value, datePickerRef }
		},
		template: `
			<div class="pa-4">
				<DatePicker
					ref="datePickerRef"
					v-model="value"
					v-bind="args"
				/>
				<div class="mt-4 text-body-2">Valeur actuelle : {{ value }}</div>
			</div>
		`,
	}),
}

export const WithSuccess: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Une date valide est présaisie et les messages de succès s\'affichent au chargement.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <DatePicker
    ref="datePickerRef"
    v-model="value"
    label="Date de la consultation"
    placeholder="JJ/MM/AAAA"
    format="DD/MM/YYYY"
    required
    show-success-messages
    :custom-rules="[
      { type: 'notWeekend', options: { message: 'La date ne peut pas être un weekend' } }
    ]"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { DatePicker } from '@cnamts/synapse'

const value = ref('22/01/2024')
const datePickerRef = ref<InstanceType<typeof DatePicker> | null>(null)

onMounted(() => {
  datePickerRef.value?.validateOnSubmit()
})
</script>`,
			},
		],
	},
	args: {
		label: 'Date de la consultation',
		placeholder: 'JJ/MM/AAAA',
		format: 'DD/MM/YYYY',
		required: true,
		showSuccessMessages: true,
		customRules: [
			{ type: 'notWeekend', options: { message: 'La date ne peut pas être un weekend' } },
		],
	},
	render: args => ({
		components: { DatePicker },
		setup() {
			const value = ref('22/01/2024')
			const datePickerRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

			onMounted(() => {
				datePickerRef.value?.validateOnSubmit()
			})

			return { args, value, datePickerRef }
		},
		template: `
			<div class="pa-4">
				<DatePicker
					ref="datePickerRef"
					v-model="value"
					v-bind="args"
				/>
				<div class="mt-4 text-body-2">Valeur actuelle : {{ value }}</div>
			</div>
		`,
	}),
}

export const DisableErrorHandling: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Comparaison entre un champ avec validation interne (défaut) et un champ avec `disableErrorHandling` activé. La validation interne est désactivée sur le deuxième champ.',
			},
		},
		controls: { exclude: ['modelValue', 'label', 'placeholder', 'format', 'disableErrorHandling'] },
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <div class="d-flex flex-column ga-4">
    <DatePicker
      v-model="value1"
      label="Avec validation interne (défaut)"
      placeholder="JJ/MM/AAAA"
      format="DD/MM/YYYY"
      required
    />
    <DatePicker
      v-model="value2"
      label="Validation interne désactivée"
      placeholder="JJ/MM/AAAA"
      format="DD/MM/YYYY"
      required
      disable-error-handling
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

const value1 = ref('')
const value2 = ref('')
</script>`,
			},
		],
	},
	args: {
		placeholder: 'JJ/MM/AAAA',
		format: 'DD/MM/YYYY',
		required: true,
	},
	render: args => ({
		components: { DatePicker },
		setup() {
			const value1 = ref('')
			const value2 = ref('')
			return { args, value1, value2 }
		},
		template: `
			<div class="pa-4 d-flex flex-column ga-4">
				<DatePicker
					v-bind="args"
					v-model="value1"
					label="Avec validation interne (défaut)"
					:disable-error-handling="false"
				/>
				<DatePicker
					v-bind="args"
					v-model="value2"
					label="Validation interne désactivée"
					:disable-error-handling="true"
				/>
				<div class="mt-4 text-body-2">Valeur 1 : {{ value1 }} | Valeur 2 : {{ value2 }}</div>
			</div>
		`,
	}),
}

export const CustomRules: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Règles personnalisées combinées : la date doit être comprise entre le 01/01/1995 et le 31/12/2005. Saisissez une date hors plage pour voir l\'erreur.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <DatePicker
    v-model="value"
    label="Date de la consultation"
    placeholder="JJ/MM/AAAA"
    format="DD/MM/YYYY"
    :custom-rules="[
      {
        type: 'notBeforeDate',
        options: {
          date: '01/01/1995',
          message: 'La date doit être postérieure ou égale au 01/01/1995'
        }
      },
      {
        type: 'notAfterDate',
        options: {
          date: '31/12/2005',
          message: 'La date doit être antérieure ou égale au 31/12/2005'
        }
      }
    ]"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker } from '@cnamts/synapse'

const value = ref('')
</script>`,
			},
		],
	},
	args: {
		label: 'Date de la consultation',
		placeholder: 'JJ/MM/AAAA',
		format: 'DD/MM/YYYY',
		customRules: [
			{
				type: 'notBeforeDate',
				options: {
					date: '01/01/1995',
					message: 'La date doit être postérieure ou égale au 01/01/1995',
				},
			},
			{
				type: 'notAfterDate',
				options: {
					date: '31/12/2005',
					message: 'La date doit être antérieure ou égale au 31/12/2005',
				},
			},
		],
	},
	render: args => ({
		components: { DatePicker },
		setup() {
			const value = ref('')
			return { args, value }
		},
		template: `
			<div class="pa-4">
				<DatePicker
					v-model="value"
					v-bind="args"
				/>
				<div class="mt-4 text-body-2">Valeur actuelle : {{ value }}</div>
			</div>
		`,
	}),
}

export const CustomRulesReturnFormat: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Avec `validateWithReturnFormat`, le `validate` d\'une règle personnalisée reçoit la saisie au format `dateFormatReturn` (ici `YYYY-MM-DD`), comme le v-model. Saisissez ou sélectionnez une date en 2024 pour voir l\'erreur. La règle gère les deux types reçus : une chaîne (saisie clavier) et un objet `Date` (sélection calendrier).',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <DatePicker
    v-model="value"
    label="Date de la consultation"
    help-text="Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres"
    placeholder="JJ/MM/AAAA"
    format="DD/MM/YYYY"
    date-format-return="YYYY-MM-DD"
    validate-with-return-format
    use-combined-mode
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

const value = ref('')
const customRules = [
  {
    type: 'custom',
    options: {
      // Saisie clavier : '2026-10-07' (format dateFormatReturn) ; calendrier : objet Date ; champ vide : null
      validate: (value: unknown) => {
        const year = value instanceof Date ? value.getFullYear() : typeof value === 'string' ? Number(value.slice(0, 4)) : null
        return year !== 2024
      },
      message: 'Les dates en 2024 ne sont pas autorisées',
    },
  },
]
</script>`,
			},
		],
	},
	args: {
		label: 'Date de la consultation',
		helpText: 'Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres',
		placeholder: 'JJ/MM/AAAA',
		format: 'DD/MM/YYYY',
		dateFormatReturn: 'YYYY-MM-DD',
		validateWithReturnFormat: true,
		useCombinedMode: true,
		customRules: [
			{
				type: 'custom',
				options: {
					validate: (value: unknown) => {
						const year = value instanceof Date ? value.getFullYear() : typeof value === 'string' ? Number(value.slice(0, 4)) : null
						return year !== 2024
					},
					message: 'Les dates en 2024 ne sont pas autorisées',
				},
			},
		],
	},
	render: args => ({
		components: { DatePicker },
		setup() {
			const value = ref('')
			return { args, value }
		},
		template: `
			<div class="pa-4">
				<DatePicker
					v-model="value"
					v-bind="args"
				/>
				<div class="mt-4 text-body-2">Valeur actuelle : {{ value }}</div>
			</div>
		`,
	}),
}

export const NoValidateOnBlur: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Avec `isValidateOnBlur: false`, la validation n\'attend plus la sortie du champ : elle devient en temps réel et s\'exécute à chaque modification de la valeur. Les boutons simulent une valeur programmatique suivie d\'une validation manuelle via `validateOnSubmit()`.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <div class="d-flex flex-column ga-4 pa-4">
    <DatePicker
      ref="datePickerRef"
      :model-value="value"
      label="Date de la consultation"
      placeholder="JJ/MM/AAAA"
      format="DD/MM/YYYY"
      required
      :is-validate-on-blur="false"
      :show-success-messages="true"
      :custom-rules="[
        { type: 'notAfterToday', options: { message: 'La date ne peut pas être dans le futur' } }
      ]"
      @update:model-value="handleChange"
    />
    <div class="d-flex ga-4 mt-2">
      <VBtn color="primary" @mousedown.prevent @click="applyValue('01/01/2100')">Valeur invalide</VBtn>
      <VBtn color="primary" @mousedown.prevent @click="applyValue('22/01/2024')">Valeur valide</VBtn>
      <VBtn @mousedown.prevent @click="resetValue()">Réinitialiser</VBtn>
    </div>
  </div>
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { DatePicker } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

const value = ref('')
const datePickerRef = ref<InstanceType<typeof DatePicker> | null>(null)

const handleChange = (newValue: string) => {
  value.value = newValue
}

const applyValue = async (newValue: string) => {
  value.value = newValue
  // Attendre la propagation de la prop avant de valider
  await nextTick()
  await datePickerRef.value?.validateOnSubmit()
}

const resetValue = () => {
  datePickerRef.value?.reset()
}
</script>`,
			},
		],
	},
	args: {
		label: 'Date de la consultation',
		placeholder: 'JJ/MM/AAAA',
		format: 'DD/MM/YYYY',
		isValidateOnBlur: false,
		showSuccessMessages: true,
		required: true,
		customRules: [
			{ type: 'notAfterToday', options: { message: 'La date ne peut pas être dans le futur' } },
		],
	},
	render: args => ({
		components: { DatePicker, VBtn },
		setup() {
			const value = ref('')
			const datePickerRef = ref<{ validateOnSubmit: () => Promise<boolean>, reset: () => void } | null>(null)

			const handleChange = (newValue: string) => {
				value.value = newValue
			}

			const applyValue = async (newValue: string) => {
				value.value = newValue
				// Attendre la propagation de la prop avant de valider
				await nextTick()
				await datePickerRef.value?.validateOnSubmit()
			}

			const resetValue = () => {
				datePickerRef.value?.reset()
			}

			return { args, value, datePickerRef, handleChange, applyValue, resetValue }
		},
		template: `
			<div class="d-flex flex-column ga-4 pa-4">
				<DatePicker
					ref="datePickerRef"
					:model-value="value"
					v-bind="args"
					@update:model-value="handleChange"
				/>
				<div class="d-flex ga-4 mt-2">
					<VBtn color="primary" @mousedown.prevent @click="applyValue('01/01/2100')">Valeur invalide</VBtn>
					<VBtn color="primary" @mousedown.prevent @click="applyValue('22/01/2024')">Valeur valide</VBtn>
					<VBtn @mousedown.prevent @click="resetValue()">Réinitialiser</VBtn>
				</div>
				<div class="mt-4 text-body-2">Valeur actuelle : {{ value }}</div>
			</div>
		`,
	}),
}

export const BidirectionalValidation: Story = {
	parameters: {
		controls: { exclude: ['modelValue', 'label', 'placeholder', 'format', 'customRules'] },
		docs: {
			description: {
				story: 'Validation bidirectionnelle entre deux DatePickers : la date de début ne peut pas être postérieure à la date de fin, et inversement. Les règles de chaque champ dépendent de la valeur de l\'autre : quand ses `customRules` changent, le DatePicker revalide automatiquement sa date, sans appel manuel à `validateOnSubmit()`.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <div class="d-flex flex-wrap ga-4">
    <DatePicker
      v-model="startDate"
      label="Date de début"
      placeholder="JJ/MM/AAAA"
      format="DD/MM/YYYY"
      required
      :custom-rules="startDateRules"
    />
    <DatePicker
      v-model="endDate"
      label="Date de fin"
      placeholder="JJ/MM/AAAA"
      format="DD/MM/YYYY"
      required
      :custom-rules="endDateRules"
    />
  </div>
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { computed, ref } from 'vue'
import { DatePicker } from '@cnamts/synapse'

const startDate = ref<string | null>(null)
const endDate = ref<string | null>(null)

// Une date de référence vide désactive la règle.
// Le DatePicker revalide sa date dès que ses customRules changent.
const startDateRules = computed(() => [
  {
    type: 'notAfterDate',
    options: {
      date: endDate.value ?? '',
      message: 'La date de début ne peut pas être postérieure à la date de fin',
    },
  },
])

const endDateRules = computed(() => [
  {
    type: 'notBeforeDate',
    options: {
      date: startDate.value ?? '',
      message: 'La date de fin ne peut pas être antérieure à la date de début',
    },
  },
])
</script>`,
			},
		],
	},
	args: {
		format: 'DD/MM/YYYY',
		required: true,
	},
	render: args => ({
		components: { DatePicker },
		setup() {
			const startDate = ref<string | null>(null)
			const endDate = ref<string | null>(null)

			// Une date de référence vide désactive la règle.
			// Le DatePicker revalide sa date dès que ses customRules changent.
			const startDateRules = computed<DatePickerRule[]>(() => [
				{
					type: 'notAfterDate',
					options: {
						date: endDate.value ?? '',
						message: 'La date de début ne peut pas être postérieure à la date de fin',
					},
				},
			])

			const endDateRules = computed<DatePickerRule[]>(() => [
				{
					type: 'notBeforeDate',
					options: {
						date: startDate.value ?? '',
						message: 'La date de fin ne peut pas être antérieure à la date de début',
					},
				},
			])

			return { args, startDate, endDate, startDateRules, endDateRules }
		},
		template: `
			<div class="pa-4">
				<div class="d-flex flex-wrap ga-4">
					<DatePicker
						v-bind="args"
						v-model="startDate"
						label="Date de début"
						placeholder="JJ/MM/AAAA"
						:custom-rules="startDateRules"
					/>
					<DatePicker
						v-bind="args"
						v-model="endDate"
						label="Date de fin"
						placeholder="JJ/MM/AAAA"
						:custom-rules="endDateRules"
					/>
				</div>
				<div class="mt-4 text-body-2">Date de début : {{ startDate || 'non sélectionnée' }} | Date de fin : {{ endDate || 'non sélectionnée' }}</div>
			</div>
		`,
	}),
}

export const SyFormValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Le DatePicker s\'intègre automatiquement dans un SyForm via `formRegistration`. La soumission du formulaire déclenche la validation sans configuration supplémentaire.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyForm @submit="onSubmit">
    <DatePicker
      v-model="value"
      label="Date de la consultation"
      placeholder="JJ/MM/AAAA"
      format="DD/MM/YYYY"
      required
      display-asterisk
      show-success-messages
      class="mb-4"
    />
    <VBtn type="submit" color="primary" class="mt-4">
      Soumettre
    </VBtn>
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

const value = ref('')

const onSubmit = (event: { isValid: boolean }) => {
  if (event.isValid) {
    alert('Formulaire valide : ' + value.value)
  } else {
    alert('Formulaire invalide.')
  }
}
</script>`,
			},
		],
	},
	args: {
		label: 'Date de la consultation',
		placeholder: 'JJ/MM/AAAA',
		format: 'DD/MM/YYYY',
		required: true,
		displayAsterisk: true,
		showSuccessMessages: true,
	},
	render: args => ({
		components: { DatePicker, SyForm, VBtn },
		setup() {
			const value = ref('')

			const onSubmit = (event: { isValid: boolean }) => {
				if (event.isValid) {
					alert(`Formulaire valide : ${value.value}`)
				}
				else {
					alert('Formulaire invalide.')
				}
			}

			return { args, value, onSubmit }
		},
		template: `
			<div class="pa-4">
				<SyForm @submit="onSubmit">
					<DatePicker
						v-model="value"
						v-bind="args"
						class="mb-4"
					/>
					<VBtn
						type="submit"
						color="primary"
						class="mt-4"
					>
						Soumettre
					</VBtn>
				</SyForm>
				<div class="mt-4 text-body-2">Valeur actuelle : {{ value }}</div>
			</div>
		`,
	}),
}

export const VFormValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Intégration avec `VForm` natif Vuetify. La soumission appelle `validateOnSubmit()` manuellement sur le champ pour déclencher la validation Synapse.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <VForm @submit.prevent="onSubmit">
    <DatePicker
      ref="datePickerRef"
      v-model="value"
      label="Date de la consultation"
      placeholder="JJ/MM/AAAA"
      format="DD/MM/YYYY"
      required
      display-asterisk
      show-success-messages
      class="mb-4"
    />
    <VBtn type="submit" color="primary" class="mt-4">Soumettre</VBtn>
  </VForm>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker } from '@cnamts/synapse'
import { VBtn, VForm } from 'vuetify/components'

const value = ref('')
const datePickerRef = ref<InstanceType<typeof DatePicker> | null>(null)

async function onSubmit() {
  const isValid = await datePickerRef.value?.validateOnSubmit()
  if (isValid) {
    alert('Formulaire valide : ' + value.value)
  } else {
    alert('Formulaire invalide.')
  }
}
</script>
`,
			},
		],
	},
	args: {
		label: 'Date de la consultation',
		placeholder: 'JJ/MM/AAAA',
		format: 'DD/MM/YYYY',
		required: true,
		displayAsterisk: true,
		showSuccessMessages: true,
	},
	render: args => ({
		components: { DatePicker, VBtn, VForm },
		setup() {
			const value = ref('')
			const datePickerRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

			async function onSubmit() {
				const isValid = await datePickerRef.value?.validateOnSubmit()
				if (isValid) {
					alert(`Formulaire valide : ${value.value}`)
				}
				else {
					alert('Formulaire invalide.')
				}
			}

			return { args, value, datePickerRef, onSubmit }
		},
		template: `
      <div class="pa-4">
        <VForm @submit.prevent="onSubmit">
          <DatePicker
            ref="datePickerRef"
            v-model="value"
            v-bind="args"
            class="mb-4"
          />
          <VBtn type="submit" color="primary" class="mt-4">Soumettre</VBtn>
        </VForm>
        <div class="mt-4 text-body-2">Valeur actuelle : {{ value }}</div>
      </div>
    `,
	}),
}

export const SyFormCustomRulesValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: 'SyForm avec règles personnalisées Synapse (`customRules`). La date doit être un jour ouvré (lundi à vendredi) et ne pas être dans le futur. La soumission du formulaire déclenche la validation automatiquement.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyForm @submit="onSubmit">
    <DatePicker
      v-model="value"
      label="Date de la consultation"
      placeholder="JJ/MM/AAAA"
      format="DD/MM/YYYY"
      required
      display-asterisk
      show-success-messages
      :custom-rules="[
        {
          type: 'notAfterToday',
          options: { message: 'La date ne peut pas être dans le futur.' }
        },
        {
          type: 'notWeekend',
          options: { message: 'La date ne peut pas être un week-end.' }
        }
      ]"
      class="mb-4"
    />
    <VBtn type="submit" color="primary" class="mt-4">
      Soumettre
    </VBtn>
  </SyForm>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker, SyForm } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

const value = ref('')

const onSubmit = (event: { isValid: boolean }) => {
  if (event.isValid) {
    alert('Formulaire valide : ' + value.value)
  } else {
    alert('Formulaire invalide.')
  }
}
</script>
`,
			},
		],
	},
	args: {
		label: 'Date de la consultation',
		placeholder: 'JJ/MM/AAAA',
		format: 'DD/MM/YYYY',
		required: true,
		displayAsterisk: true,
		showSuccessMessages: true,
		customRules: [
			{
				type: 'notAfterToday',
				options: { message: 'La date ne peut pas être dans le futur.' },
			},
			{
				type: 'notWeekend',
				options: { message: 'La date ne peut pas être un week-end.' },
			},
		],
	},
	render: args => ({
		components: { DatePicker, SyForm, VBtn },
		setup() {
			const value = ref('')

			const onSubmit = (event: { isValid: boolean }) => {
				if (event.isValid) {
					alert(`Formulaire valide : ${value.value}`)
				}
				else {
					alert('Formulaire invalide.')
				}
			}

			return { args, value, onSubmit }
		},
		template: `
      <div class="pa-4">
        <SyForm @submit="onSubmit">
          <DatePicker
            v-model="value"
            v-bind="args"
            class="mb-4"
          />
          <VBtn
            type="submit"
            color="primary"
            class="mt-4"
          >
            Soumettre
          </VBtn>
        </SyForm>
        <div class="mt-4 text-body-2">Valeur actuelle : {{ value }}</div>
      </div>
    `,
	}),
}

export const VFormVuetifyValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Validation native Vuetify (`useVuetifyValidation`) intégrée dans un `VForm` natif. Les règles sont au format Vuetify (fonctions retournant `true` ou un message d\'erreur), passées via `rules`. La soumission appelle `validateOnSubmit()` manuellement sur le champ pour déclencher la validation.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <VForm @submit.prevent="onSubmit">
    <DatePicker
      ref="datePickerRef"
      v-model="value"
      label="Date de la consultation"
      placeholder="JJ/MM/AAAA"
      format="DD/MM/YYYY"
      use-vuetify-validation
      required
      :rules="rules"
      class="mb-4"
    />
    <VBtn type="submit" color="primary" class="mt-4">Soumettre</VBtn>
  </VForm>
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker } from '@cnamts/synapse'
import { VBtn, VForm } from 'vuetify/components'

const value = ref('')
const datePickerRef = ref<InstanceType<typeof DatePicker> | null>(null)
const rules = [
  (v: string) => !!v || 'La date est requise.',
  (v: string) => (v && v.length >= 8) || 'La date doit contenir au moins 8 caractères (JJ/MM/AAAA).',
]

async function onSubmit() {
  const isValid = await datePickerRef.value?.validateOnSubmit()
  if (isValid) {
    alert('Formulaire valide : ' + value.value)
  } else {
    alert('Formulaire invalide.')
  }
}
</script>`,
			},
		],
	},
	args: {
		label: 'Date de la consultation',
		placeholder: 'JJ/MM/AAAA',
		format: 'DD/MM/YYYY',
		useVuetifyValidation: true,
		required: true,
		rules: [
			(v: string) => !!v || 'La date est requise.',
			(v: string) => (v && v.length >= 8) || 'La date doit contenir au moins 8 caractères (JJ/MM/AAAA).',
		],
	},
	render: args => ({
		components: { DatePicker, VBtn, VForm },
		setup() {
			const value = ref('')
			const datePickerRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

			async function onSubmit() {
				const isValid = await datePickerRef.value?.validateOnSubmit()
				if (isValid) {
					alert(`Formulaire valide : ${value.value}`)
				}
				else {
					alert('Formulaire invalide.')
				}
			}

			return { args, value, datePickerRef, onSubmit }
		},
		template: `
			<div class="pa-4">
				<VForm @submit.prevent="onSubmit">
					<DatePicker
						ref="datePickerRef"
						v-model="value"
						v-bind="args"
						class="mb-4"
					/>
					<VBtn type="submit" color="primary" class="mt-4">Soumettre</VBtn>
				</VForm>
				<div class="mt-4 text-body-2">Valeur actuelle : {{ value }}</div>
			</div>
		`,
	}),
}
