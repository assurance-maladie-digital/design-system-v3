import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DatePicker from '../DatePicker.vue'
import SyForm from '../../../Customs/SyForm/SyForm.vue'
import { onMounted, ref, watch, computed } from 'vue'
import { fn } from 'storybook/test'
import { VBtn, VForm } from 'vuetify/components'
import { useDateFormat } from '@/composables/date/useDateFormatDayjs'

const meta: Meta<typeof DatePicker> = {
	title: 'Composants/Formulaires/DatePicker/CalendarMode/Validation',
	component: DatePicker,
	parameters: {
		layout: 'fullscreen',
	},
	args: {
		'onUpdate:modelValue': fn(),
	},
} as Meta<typeof DatePicker>

export default meta

type Story = StoryObj<typeof meta>

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
    label="Date (JJ/MM/AAAA)"
    placeholder="JJ/MM/AAAA"
    format="DD/MM/YYYY"
    :custom-rules="[
      { type: 'notAfterToday', options: { message: 'La date ne peut pas être après aujourd'hui' } }
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
const datePickerRef = ref(null)

onMounted(() => {
  datePickerRef.value?.validateOnSubmit()
})
</script>`,
			},
		],
	},
	args: {
		label: 'Date (JJ/MM/AAAA)',
		placeholder: 'JJ/MM/AAAA',
		format: 'DD/MM/YYYY',
		showSuccessMessages: true,
		customRules: [
			{ type: 'notAfterToday', options: { message: 'La date ne peut pas être après aujourd hui' } },
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
    label="Date avec avertissement (JJ/MM/AAAA)"
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
const datePickerRef = ref(null)

onMounted(() => {
  datePickerRef.value?.validateOnSubmit()
})
</script>`,
			},
		],
	},
	args: {
		label: 'Date avec avertissement (JJ/MM/AAAA)',
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
    label="Date valide (JJ/MM/AAAA)"
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
const datePickerRef = ref(null)

onMounted(() => {
  datePickerRef.value?.validateOnSubmit()
})
</script>`,
			},
		],
	},
	args: {
		label: 'Date valide (JJ/MM/AAAA)',
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
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <div class="d-flex flex-column gap-4">
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
	render: () => ({
		components: { DatePicker },
		setup() {
			const value1 = ref('')
			const value2 = ref('')
			return { value1, value2 }
		},
		template: `
			<div class="pa-4 d-flex flex-column" style="gap: 16px;">
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
    label="Date (JJ/MM/AAAA)"
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
		label: 'Date (JJ/MM/AAAA)',
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

export const NoValidateOnBlur: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Avec `isValidateOnBlur: false`, la validation ne se déclenche pas au blur. Les boutons permettent de simuler une valeur programmatique avec validation manuelle.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <div class="d-flex flex-column gap-4 pa-4">
    <DatePicker
      ref="datePickerRef"
      :model-value="value"
      label="Date (JJ/MM/AAAA)"
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
    <div class="d-flex gap-4 mt-2">
      <VBtn color="primary" @mousedown.prevent @click="applyValue('01/01/2100')">Valeur invalide</VBtn>
      <VBtn color="primary" @mousedown.prevent @click="applyValue('22/01/2024')">Valeur valide</VBtn>
      <VBtn @mousedown.prevent @click="applyValue('')">Réinitialiser</VBtn>
    </div>
  </div>
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

const value = ref('')
const datePickerRef = ref(null)

const handleChange = (newValue: string) => {
  value.value = newValue
}

const applyValue = async (newValue: string) => {
  value.value = newValue
  await datePickerRef.value?.validateOnSubmit()
}
</script>`,
			},
		],
	},
	args: {
		label: 'Date (JJ/MM/AAAA)',
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
			const datePickerRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

			const handleChange = (newValue: string) => {
				value.value = newValue
			}

			const applyValue = async (newValue: string) => {
				value.value = newValue
				await datePickerRef.value?.validateOnSubmit()
			}

			return { args, value, datePickerRef, handleChange, applyValue }
		},
		template: `
			<div class="d-flex flex-column gap-4 pa-4">
				<DatePicker
					ref="datePickerRef"
					:model-value="value"
					v-bind="args"
					@update:model-value="handleChange"
				/>
				<div class="d-flex gap-4 mt-2">
					<VBtn color="primary" class="mr-1" @mousedown.prevent @click="applyValue('01/01/2100')">Valeur invalide</VBtn>
					<VBtn color="primary" class="mr-1" @mousedown.prevent @click="applyValue('22/01/2024')">Valeur valide</VBtn>
					<VBtn @mousedown.prevent @click="applyValue('')">Réinitialiser</VBtn>
				</div>
				<div class="mt-4 text-body-2">Valeur actuelle : {{ value }}</div>
			</div>
		`,
	}),
}

export const BidirectionalValidation: Story = {
	parameters: {
		controls: { disable: true },
		docs: {
			description: {
				story: 'Démonstration de la validation bidirectionnelle entre deux DatePickers. Modifier une date revalide l\'autre automatiquement.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <div class="date-validation-playground">
    <h1>Validation bidirectionnelle des dates</h1>
    <p>Démonstration de la validation bidirectionnelle entre les DatePickers.</p>
    <div class="date-range-container">
      <div>
        <h2>Date de début</h2>
        <DatePicker
          ref="startDatePickerRef"
          v-model="startDate"
          label="Date de début (JJ/MM/AAAA)"
          placeholder="JJ/MM/AAAA"
          :custom-rules="startDateRules"
          required
          @update:model-value="validateEndDate"
        />
      </div>
      <div>
        <h2>Date de fin</h2>
        <DatePicker
          ref="endDatePickerRef"
          v-model="endDate"
          label="Date de fin (JJ/MM/AAAA)"
          placeholder="JJ/MM/AAAA"
          :custom-rules="endDateRules"
          required
          @update:model-value="validateStartDate"
        />
      </div>
    </div>
  </div>
</template>`,
			},
			{
				name: 'Script',
				code: `
<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { DatePicker } from '@cnamts/synapse'
import { useDateFormat } from '@cnamts/synapse'

const { parseDate } = useDateFormat()

const startDate = ref<string | null>(null)
const endDate = ref<string | null>(null)
const startDatePickerRef = ref(null)
const endDatePickerRef = ref(null)

const createEndDateValidationRule = () => ({
  type: 'custom',
  options: {
    validate: (value: string) => {
      if (!value) return true
      if (!startDate.value) return 'Veuillez d\u2019abord sélectionner une date de début'
      const start = parseDate(startDate.value, 'DD/MM/YYYY')
      const end = parseDate(value, 'DD/MM/YYYY')
      if (!start || !end) return true
      return end >= start || 'La date de fin ne peut pas être antérieure à la date de début'
    },
    message: 'La date de fin ne peut pas être antérieure à la date de début',
  },
})

const createStartDateValidationRule = () => ({
  type: 'custom',
  options: {
    validate: (value: string) => {
      if (!value || !endDate.value) return true
      const start = parseDate(value, 'DD/MM/YYYY')
      const end = parseDate(endDate.value, 'DD/MM/YYYY')
      if (!start || !end) return true
      return start <= end || 'La date de début ne peut pas être postérieure à la date de fin'
    },
    message: 'La date de début ne peut pas être postérieure à la date de fin',
  },
})

const startDateRules = computed(() => [
  { type: 'required', options: { message: 'La date de début est requise.' } },
  createStartDateValidationRule(),
])

const endDateRules = computed(() => [
  { type: 'required', options: { message: 'La date de fin est requise.' } },
  createEndDateValidationRule(),
])

const validateEndDate = () => {
  if (endDatePickerRef.value && endDate.value) {
    endDatePickerRef.value.validateOnSubmit()
  }
}

const validateStartDate = () => {
  if (startDatePickerRef.value && startDate.value) {
    startDatePickerRef.value.validateOnSubmit()
  }
}

watch(startDate, () => {
  setTimeout(() => validateEndDate(), 0)
})

watch(endDate, () => {
  setTimeout(() => validateStartDate(), 0)
})
</script>`,
			},
		],
	},
	render: () => {
		return {
			components: { DatePicker },
			setup() {
				const { parseDate } = useDateFormat()

				const startDate = ref<string | null>(null)
				const endDate = ref<string | null>(null)

				const startDatePickerRef = ref<InstanceType<typeof DatePicker> | null>(null)
				const endDatePickerRef = ref<InstanceType<typeof DatePicker> | null>(null)

				const createEndDateValidationRule = () => ({
					type: 'custom',
					options: {
						validate: (value: string) => {
							if (!value) return true
							if (!startDate.value) return 'Veuillez d\u2019abord sélectionner une date de début'
							const start = parseDate(startDate.value, 'DD/MM/YYYY')
							const end = parseDate(value, 'DD/MM/YYYY')
							if (!start || !end) return true
							return end >= start || 'La date de fin ne peut pas être antérieure à la date de début'
						},
						message: 'La date de fin ne peut pas être antérieure à la date de début',
					},
				})

				const createStartDateValidationRule = () => ({
					type: 'custom',
					options: {
						validate: (value: string) => {
							if (!value || !endDate.value) return true
							const start = parseDate(value, 'DD/MM/YYYY')
							const end = parseDate(endDate.value, 'DD/MM/YYYY')
							if (!start || !end) return true
							return start <= end || 'La date de début ne peut pas être postérieure à la date de fin'
						},
						message: 'La date de début ne peut pas être postérieure à la date de fin',
					},
				})

				const startDateRules = computed(() => [
					{
						type: 'required',
						options: {
							message: 'La date de début est requise.',
						},
					},
					createStartDateValidationRule(),
				])

				const endDateRules = computed(() => [
					{
						type: 'required',
						options: {
							message: 'La date de fin est requise.',
						},
					},
					createEndDateValidationRule(),
				])

				const validateEndDate = () => {
					if (endDatePickerRef.value && endDate.value) {
						endDatePickerRef.value.validateOnSubmit()
					}
				}

				const validateStartDate = () => {
					if (startDatePickerRef.value && startDate.value) {
						startDatePickerRef.value.validateOnSubmit()
					}
				}

				watch(startDate, () => {
					setTimeout(() => {
						validateEndDate()
					}, 0)
				})

				watch(endDate, () => {
					setTimeout(() => {
						validateStartDate()
					}, 0)
				})

				return {
					startDate,
					endDate,
					startDatePickerRef,
					endDatePickerRef,
					startDateRules,
					endDateRules,
					validateEndDate,
					validateStartDate,
				}
			},

			template: `
				<div class="date-validation-playground pa-4">
					<h1>Validation bidirectionnelle des dates</h1>
					<p class="description">
						Démonstration de la validation bidirectionnelle entre les DatePickers.
						Les messages d'erreur apparaissent directement dans les composants.
					</p>
					<div class="date-range-container">
						<div class="date-picker-wrapper">
							<h2>Date de début</h2>
							<DatePicker
								ref="startDatePickerRef"
								v-model="startDate"
								label="Date de début (JJ/MM/AAAA)"
								placeholder="JJ/MM/AAAA"
								:custom-rules="startDateRules"
								required
								@update:model-value="validateEndDate"
							/>
						</div>
						<div class="date-picker-wrapper">
							<h2>Date de fin</h2>
							<DatePicker
								ref="endDatePickerRef"
								v-model="endDate"
								label="Date de fin (JJ/MM/AAAA)"
								placeholder="JJ/MM/AAAA"
								:custom-rules="endDateRules"
								required
								@update:model-value="validateStartDate"
							/>
						</div>
					</div>
					<div class="current-values">
						<p><strong>Date de début:</strong> {{ startDate || 'Non sélectionnée' }}</p>
						<p><strong>Date de fin:</strong> {{ endDate || 'Non sélectionnée' }}</p>
					</div>
				</div>
			`,
		}
	},
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
      label="Date (JJ/MM/AAAA)"
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

const onSubmit = (event) => {
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
		label: 'Date (JJ/MM/AAAA)',
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
      label="Date (JJ/MM/AAAA)"
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
const datePickerRef = ref(null)

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
		label: 'Date (JJ/MM/AAAA)',
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
      label="Date (JJ/MM/AAAA)"
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

const onSubmit = (event) => {
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
		label: 'Date (JJ/MM/AAAA)',
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
  <VForm ref="formRef" @submit.prevent="onSubmit">
    <DatePicker
      v-model="value"
      label="Date (JJ/MM/AAAA)"
      placeholder="JJ/MM/AAAA"
      format="DD/MM/YYYY"
      use-vuetify-validation
      required
      :rules="[
        v => !!v || 'La date est requise.',
        v => (v && v.length >= 8) || 'La date doit contenir au moins 8 caractères (JJ/MM/AAAA).'
      ]"
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
const datePickerRef = ref(null)

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
		label: 'Date (JJ/MM/AAAA)',
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
