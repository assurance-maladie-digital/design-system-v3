import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DatePicker from '../DatePicker.vue'
import { ref, watch } from 'vue'
import { fn } from 'storybook/test'
import { useDateFormat } from '@/composables/date/useDateFormatDayjs'

const meta: Meta<typeof DatePicker> = {
	title: 'Composants/Formulaires/DatePicker/CalendarMode/GestionDesFormats',
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

export const DifferentFormats: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Démonstration des différents formats d\'affichage supportés par le DatePicker : DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD, DD-MM-YY, DD.MM.YYYY.',
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
      placeholder="JJ/MM/AAAA"
      label="Date (JJ/MM/AAAA)"
      format="DD/MM/YYYY"
    />
    <DatePicker
      v-model="value2"
      placeholder="MM/JJ/AAAA"
      label="Date (MM/JJ/AAAA)"
      format="MM/DD/YYYY"
    />
    <DatePicker
      v-model="value3"
      placeholder="AAAA-MM-JJ"
      label="Date (AAAA-MM-JJ)"
      format="YYYY-MM-DD"
    />
    <DatePicker
      v-model="value4"
      placeholder="JJ-MM-AA"
      label="Date (JJ-MM-AA)"
      format="DD-MM-YY"
    />
    <DatePicker
      v-model="value5"
      placeholder="JJ.MM.AAAA"
      label="Date (JJ.MM.AAAA)"
      format="DD.MM.YYYY"
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

const value1 = ref('24/12/2025')
const value2 = ref('12/24/2025')
const value3 = ref('2025-12-24')
const value4 = ref('24-12-25')
const value5 = ref('24.12.2025')
</script>`,
			},
		],
	},
	render: () => ({
		components: { DatePicker },
		setup() {
			const value1 = ref('24/12/2025')
			const value2 = ref('12/24/2025')
			const value3 = ref('2025-12-24')
			const value4 = ref('24-12-25')
			const value5 = ref('24.12.2025')
			return { value1, value2, value3, value4, value5 }
		},
		template: `
			<div class="d-flex flex-column gap-4 pa-4">
				<DatePicker
					v-model="value1"
					placeholder="JJ/MM/AAAA"
					label="Date (JJ/MM/AAAA)"
					format="DD/MM/YYYY"
					class="py-4"
				/>
				<DatePicker
					v-model="value2"
					placeholder="MM/JJ/AAAA"
					label="Date (MM/JJ/AAAA)"
					format="MM/DD/YYYY"
					class="py-4"
				/>
				<DatePicker
					v-model="value3"
					placeholder="AAAA-MM-JJ"
					label="Date (AAAA-MM-JJ)"
					format="YYYY-MM-DD"
					class="py-4"
				/>
				<DatePicker
					v-model="value4"
					placeholder="JJ-MM-AA"
					label="Date (JJ-MM-AA)"
					format="DD-MM-YY"
					class="py-4"
				/>
				<DatePicker
					v-model="value5"
					placeholder="JJ.MM.AAAA"
					label="Date (JJ.MM.AAAA)"
					format="DD.MM.YYYY"
					class="py-4"
				/>
				<div class="mt-4 text-body-2">
					Valeur 1 : {{ value1 }} | Valeur 2 : {{ value2 }} | Valeur 3 : {{ value3 }} | Valeur 4 : {{ value4 }} | Valeur 5 : {{ value5 }}
				</div>
			</div>
		`,
	}),
}

export const WithDateFormatReturn: Story = {
	parameters: {
		docs: {
			description: {
				story: 'La prop `dateFormatReturn` permet de définir un format différent pour la valeur émise par le v-model. Le champ affiche la date au format `format` (DD/MM/YYYY) mais émet la valeur au format `dateFormatReturn`.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <div class="d-flex flex-column gap-4 pa-4">
    <span class="mb-4">Date de retour : {{ value1 }}</span>
    <DatePicker
      v-model="value1"
      placeholder="JJ/MM/AAAA"
      label="Date (JJ/MM/AAAA)"
      format="DD/MM/YYYY"
    />

    <span class="mb-4">Date de retour : {{ value2 }}</span>
    <DatePicker
      v-model="value2"
      placeholder="JJ/MM/AAAA"
      label="Date (JJ/MM/AAAA)"
      format="DD/MM/YYYY"
      date-format-return="MM/DD/YYYY"
    />

    <span class="mb-4">Date de retour : {{ value3 }}</span>
    <DatePicker
      v-model="value3"
      placeholder="JJ/MM/AAAA"
      label="Date (JJ/MM/AAAA)"
      format="DD/MM/YYYY"
      date-format-return="YYYY-MM-DD"
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

const value1 = ref('24/12/2025')
const value2 = ref('25/12/2025')
const value3 = ref('26/12/2025')
</script>`,
			},
		],
	},
	render: () => ({
		components: { DatePicker },
		setup() {
			const value1 = ref('24/12/2025')
			const value2 = ref('25/12/2025')
			const value3 = ref('26/12/2025')
			return { value1, value2, value3 }
		},
		template: `
			<div class="d-flex flex-column gap-4 pa-4">
				<span class="mb-4">Date de retour : {{ value1 }}</span>
				<DatePicker
					v-model="value1"
					placeholder="JJ/MM/AAAA"
					label="Date (JJ/MM/AAAA)"
					format="DD/MM/YYYY"
				/>

				<span class="mb-4">Date de retour : {{ value2 }}</span>
				<DatePicker
					v-model="value2"
					placeholder="JJ/MM/AAAA"
					label="Date (JJ/MM/AAAA)"
					format="DD/MM/YYYY"
					date-format-return="MM/DD/YYYY"
				/>

				<span class="mb-4">Date de retour : {{ value3 }}</span>
				<DatePicker
					v-model="value3"
					placeholder="JJ/MM/AAAA"
					label="Date (JJ/MM/AAAA)"
					format="DD/MM/YYYY"
					date-format-return="YYYY-MM-DD"
				/>
			</div>
		`,
	}),
}

export const WithDayjsFormat: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Utilisation du composable `useDateFormat` (basé sur dayjs) pour parser et formater la date émise par le DatePicker. La date saisie est parsée puis reformatée avec dayjs.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <div>
    <DatePicker
      v-model="date"
      placeholder="JJ/MM/AAAA"
      label="Date (JJ/MM/AAAA)"
      format="DD/MM/YYYY"
    />
    <p class="mt-4">Date formatée avec dayjs: {{ formattedDate }}</p>
    <p>Date parsée avec dayjs: {{ parsedDate ? parsedDate.toLocaleDateString() : 'Aucune date' }}</p>
  </div>
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref, watch } from 'vue'
import { DatePicker } from '@cnamts/synapse'
import { useDateFormat } from '@cnamts/synapse'

const { parseDate, formatDate } = useDateFormat()

const date = ref('')
const formattedDate = ref('')
const parsedDate = ref<Date | null>(null)

watch(date, (newDate) => {
  if (newDate) {
    parsedDate.value = parseDate(newDate, 'DD/MM/YYYY')
    if (parsedDate.value) {
      formattedDate.value = formatDate(parsedDate.value, 'YYYY-MM-DD')
    }
  } else {
    formattedDate.value = ''
    parsedDate.value = null
  }
})
</script>`,
			},
		],
	},
	render: () => ({
		components: { DatePicker },
		setup() {
			const { parseDate, formatDate } = useDateFormat()

			const date = ref('')
			const formattedDate = ref('')
			const parsedDate = ref<Date | null>(null)

			watch(date, (newDate) => {
				if (newDate) {
					parsedDate.value = parseDate(newDate, 'DD/MM/YYYY')
					if (parsedDate.value) {
						formattedDate.value = formatDate(parsedDate.value, 'YYYY-MM-DD')
					}
				}
				else {
					formattedDate.value = ''
					parsedDate.value = null
				}
			})

			return { date, formattedDate, parsedDate }
		},
		template: `
			<div class="pa-4">
				<DatePicker
					v-model="date"
					placeholder="JJ/MM/AAAA"
					label="Date (JJ/MM/AAAA)"
					format="DD/MM/YYYY"
				/>
				<p class="mt-4">Date formatée avec dayjs: {{ formattedDate }}</p>
				<p>Date parsée avec dayjs: {{ parsedDate ? parsedDate.toLocaleDateString() : 'Aucune date' }}</p>
			</div>
		`,
	}),
}
