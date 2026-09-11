import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
import { ref } from 'vue'
import { fn } from 'storybook/test'

const meta: Meta<typeof DatePicker> = {
	title: 'Composants/Formulaires/DatePicker/DateInput/GestionDesFormats',
	component: DatePicker,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['modelValue'] },
	},
	args: {
		'onUpdate:modelValue': fn(),
	},
}

export default meta

type Story = StoryObj<typeof meta>

export const EuropeanFormat: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
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
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { DatePicker } from '@cnamts/synapse'

					const date = ref<string | null>(null)
					const args = {
						noCalendar: true,
						format: 'DD/MM/YYYY',
						dateFormatReturn: 'YYYY/MM/DD',
						placeholder: 'JJ/MM/AAAA',
						label: 'Date (JJ/MM/AAAA)',
						required: true,
						noIcon: true,
					}
				</script>
				`,
			},
		],
	},
	args: {
		'noCalendar': true,
		'format': 'DD/MM/YYYY',
		'dateFormatReturn': 'YYYY/MM/DD',
		'placeholder': 'JJ/MM/AAAA',
		'label': 'Date (JJ/MM/AAAA)',
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
              placeholder="JJ/MM/AAAA"
              label="Date (JJ/MM/AAAA)"
              format="DD/MM/YYYY"
              noCalendar
              autoClamp
            />
            
            <h4 class="mt-4">Format JJ-MM-AAAA (séparateur -)</h4>
            <DatePicker
              v-model="dateDash"
              placeholder="JJ-MM-AAAA"
              label="Date (JJ-MM-AAAA)"
              format="DD-MM-YYYY"
              noCalendar
              autoClamp

            />
            
            <h4 class="mt-4">Format YYYY.MM.DD (séparateur .)</h4>
            <DatePicker
              v-model="dateDot"
              placeholder="AAAA.MM.JJ"
              label="Date (AAAA.MM.JJ)"
              format="YYYY.MM.DD"
              noCalendar
              autoClamp
            />
            
            <h4 class="mt-4">Mode plage de dates (séparateur /)</h4>
            <DatePicker
              v-model="dateRange"
              placeholder="JJ/MM/AAAA - JJ/MM/AAAA"
              label="Période (JJ/MM/AAAA - JJ/MM/AAAA)"
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
            placeholder="JJ/MM/AAAA"
            label="Date (JJ/MM/AAAA)"
            format="DD/MM/YYYY"
            noCalendar
            autoClamp
          />
          <div class="caption mb-4">Valeur actuelle: {{ dateSlash || 'aucune date saisie' }}</div>
          
          <h4 class="mb-2">Format JJ-MM-AAAA (séparateur -)</h4>
          <DatePicker
            v-model="dateDash"
            placeholder="JJ-MM-AAAA"
            label="Date (JJ-MM-AAAA)"
            format="DD-MM-YYYY"
            noCalendar
            autoClamp
          />
          <div class="caption mb-4">Valeur actuelle: {{ dateDash || 'aucune date saisie' }}</div>
          
          <h4 class="mb-2">Format AAAA.MM.JJ (séparateur .)</h4>
          <DatePicker
            v-model="dateDot"
            placeholder="AAAA.MM.JJ"
            label="Date (AAAA.MM.JJ)"
            format="YYYY.MM.DD"
            noCalendar
            autoClamp
          />
          <div class="caption mb-4">Valeur actuelle: {{ dateDot || 'aucune date saisie' }}</div>
          
          <h4 class="mb-2">Mode plage de dates (séparateur /)</h4>
          <DatePicker
            v-model="dateRange"
            placeholder="JJ/MM/AAAA - JJ/MM/AAAA"
            label="Période (JJ/MM/AAAA - JJ/MM/AAAA)"
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
							placeholder="JJ/MM/AAAA"
							label="Date (JJ/MM/AAAA)"
							format="DD/MM/YYYY"
							no-calendar
						/>
						<DatePicker
							v-model="value2"
							placeholder="MM/JJ/AAAA"
							label="Date (MM/JJ/AAAA)"
							format="MM/DD/YYYY"
							no-calendar
						/>
						<DatePicker
							v-model="value3"
							placeholder="AAAA-MM-JJ"
							label="Date (AAAA-MM-JJ)"
							format="YYYY-MM-DD"
							no-calendar
						/>
						<DatePicker
							v-model="value4"
							placeholder="JJ-MM-AA"
							label="Date (JJ-MM-AA)"
							format="DD-MM-YY"
							no-calendar
						/>
						<DatePicker
							v-model="value5"
							placeholder="JJ.MM.AAAA"
							label="Date (JJ.MM.AAAA)"
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
                    placeholder="JJ/MM/AAAA"
					label="Date (JJ/MM/AAAA)"
                    format="DD/MM/YYYY"
                    no-calendar
                    class="py-4"
                />
                <DatePicker
                    v-model="value2"
                    placeholder="MM/JJ/AAAA"
					label="Date (MM/JJ/AAAA)"
                    format="MM/DD/YYYY"
					no-calendar
					class="py-4"
                />
                <DatePicker
                    v-model="value3"
                    placeholder="AAAA-MM-JJ"
					label="Date (AAAA-MM-JJ)"
                    format="YYYY-MM-DD"
					no-calendar
					class="py-4"
                />
                <DatePicker
                    v-model="value4"
                    placeholder="JJ-MM-AA"
					label="Date (JJ-MM-AA)"
                    format="DD-MM-YY"
					no-calendar
					class="py-4"
                />
                <DatePicker
                    v-model="value5"
                    placeholder="JJ.MM.AAAA"
					label="Date (JJ.MM.AAAA)"
                    format="DD.MM.YYYY"
					no-calendar
					class="py-4"
                />
              </div>
            `,
		}
	},
}
