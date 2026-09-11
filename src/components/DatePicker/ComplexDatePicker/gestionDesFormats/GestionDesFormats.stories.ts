import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
import { ref } from 'vue'
import { fn } from 'storybook/test'

const meta: Meta<typeof DatePicker> = {
	title: 'Composants/Formulaires/DatePicker/CombinedMode/GestionDesFormats',
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

export const DifferentFormats: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Démonstration de différents formats d\'affichage (JJ/MM/AAAA, MM/JJ/AAAA, AAAA-MM-JJ) avec le mode combiné.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<div class="d-flex flex-column">
						<DatePicker
							v-model="europeanDate"
							label="Date (JJ/MM/AAAA)"
							placeholder="JJ/MM/AAAA"
							format="DD/MM/YYYY"
							class="mb-4"
							useCombinedMode
						/>
						<DatePicker
							v-model="americanDate"
							label="Date (MM/JJ/AAAA)"
							placeholder="MM/JJ/AAAA"
							format="MM/DD/YYYY"
							class="mb-4"
							useCombinedMode
						/>
						<DatePicker
							v-model="isoDate"
							label="Date (AAAA-MM-JJ)"
							placeholder="AAAA-MM-JJ"
							format="YYYY-MM-DD"
							useCombinedMode
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
					
					const europeanDate = ref('')
					const americanDate = ref('')
					const isoDate = ref('')
				</script>
				`,
			},
		],
	},
	render: () => {
		return {
			components: { DatePicker },
			setup() {
				const europeanDate = ref('')
				const americanDate = ref('')
				const isoDate = ref('')

				return { europeanDate, americanDate, isoDate }
			},
			template: `
              <div class="d-flex flex-column pa-4">
                <DatePicker
                  v-model="europeanDate"
				  label="Date (JJ/MM/AAAA)"
                  placeholder="JJ/MM/AAAA"
                  format="DD/MM/YYYY"
                  class="mb-4"
				  useCombinedMode
                />
                <DatePicker
                  v-model="americanDate"
				  label="Date (MM/JJ/AAAA)"
                  placeholder="MM/JJ/AAAA"
                  format="MM/DD/YYYY"
                  class="mb-4"
				  useCombinedMode
                />
                <DatePicker
                  v-model="isoDate"
				  label="Date (AAAA-MM-JJ)"
                  placeholder="AAAA-MM-JJ"
                  format="YYYY-MM-DD"
				  useCombinedMode
                />
                <div class="mt-4 text-body-2">Valeur 1 : {{ europeanDate }} | Valeur 2 : {{ americanDate }} | Valeur 3 : {{ isoDate }}</div>
              </div>
            `,
		}
	},
}

export const WithDateFormatReturn: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Utilisation de `dateFormatReturn` pour obtenir un format de sortie différent du format d\'affichage.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<div class="d-flex flex-column">
						<DatePicker
							v-model="date"
							label="Date (JJ/MM/AAAA)"
							placeholder="JJ/MM/AAAA"
							format="DD/MM/YYYY"
							dateFormatReturn="YYYY-MM-DD"
							class="mb-4"
							useCombinedMode
						/>
						<div>Valeur du modèle: {{ date }}</div>
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
					
					const date = ref('')
				</script>
				`,
			},
		],
	},
	render: () => {
		return {
			components: { DatePicker },
			setup() {
				const date = ref('')
				return { date }
			},
			template: `
              <div class="d-flex flex-column pa-4">
                <DatePicker
                  v-model="date"
				  label="Date (JJ/MM/AAAA)"
                  placeholder="JJ/MM/AAAA"
                  format="DD/MM/YYYY"
                  dateFormatReturn="YYYY-MM-DD"
				  useCombinedMode
                />
                <div>Valeur du modèle: {{ date }}</div>
              </div>
            `,
		}
	},
}

export const AutoFormattingInput: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Le formatage automatique ajoute les séparateurs pendant la saisie des chiffres, en s\'adaptant au format spécifié.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<div class="d-flex flex-column">
						<DatePicker
							v-model="date"
							label="Date (JJ-MM-AAAA)"
							placeholder="JJ-MM-AAAA"
							format="DD-MM-YYYY"
							useCombinedMode
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
					
					const date = ref('')
				</script>
				`,
			},
		],
	},
	args: {
		label: 'Date (JJ-MM-AAAA)',
		placeholder: 'JJ-MM-AAAA',
		format: 'DD-MM-YYYY',
		useCombinedMode: true,
	},
	render: (args) => {
		return {
			components: { DatePicker },
			setup() {
				const value = ref('')
				return { args, value }
			},
			template: `
              <div class="d-flex flex-column pa-4">
                <div class="mb-2">Essayez de saisir des chiffres - les séparateurs seront ajoutés automatiquement</div>
                <DatePicker v-bind="args" v-model="value"/>
              </div>
            `,
		}
	},
}

export const CustomDateFormat: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Support des formats personnalisés avec détection automatique du séparateur (/, -, ., etc.).',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DatePicker
						v-model="date"
						label="Date (AAAA.MM.JJ)"
						placeholder="AAAA.MM.JJ"
						format="AAAA.MM.JJ"
						useCombinedMode
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { DatePicker } from '@cnamts/synapse'
					import { ref } from 'vue'
					
					const date = ref('')
				</script>
				`,
			},
		],
	},
	args: {
		label: 'Date (AAAA.MM.JJ)',
		placeholder: 'AAAA.MM.JJ',
		format: 'YYYY.MM.DD',
		useCombinedMode: true,
	},
	render: (args) => {
		return {
			components: { DatePicker },
			setup() {
				const value = ref('')
				return { args, value }
			},
			template: `
              <div class="d-flex flex-wrap align-center pa-4">
                <DatePicker v-bind="args" v-model="value"/>
                <div class="ml-4 mt-4">
                  <p>Valeur actuelle: {{ value }}</p>
                  <p>Le séparateur "." est automatiquement ajouté pendant la saisie.</p>
                </div>
              </div>
            `,
		}
	},
}

export const AutoClamp: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Démonstration de l\'auto clamp avec différents séparateurs (/, -, .). Les séparateurs sont ajoutés automatiquement pendant la saisie.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<div class="d-flex flex-column">
						<h3>Démonstration de l'auto clamp avec différents formats</h3>
						
						<h4 class="mt-4">Format JJ/MM/AAAA (séparateur /)</h4>
						<DatePicker
							v-model="dateSlash"
							label="Date (JJ/MM/AAAA)"
							placeholder="JJ/MM/AAAA"
							format="DD/MM/YYYY"
							useCombinedMode
							autoClamp
						/>
						
						<h4 class="mt-4">Format JJ-MM-AAAA (séparateur -)</h4>
						<DatePicker
							v-model="dateDash"
							label="Date (JJ-MM-AAAA)"
							placeholder="JJ-MM-AAAA"
							format="DD-MM-YYYY"
							useCombinedMode
							autoClamp
						/>
						
						<h4 class="mt-4">Format AAAA.MM.JJ (séparateur .)</h4>
						<DatePicker
							v-model="dateDot"
							label="Date (AAAA.MM.JJ)"
							placeholder="AAAA.MM.JJ"
							format="YYYY.MM.DD"
							useCombinedMode
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
				return { dateSlash, dateDash, dateDot }
			},
			template: `
              <div class="d-flex flex-column pa-4">
                <h3>Démonstration de l'auto clamp avec différents formats</h3>
                <div class="mb-4 mt-2">Saisissez uniquement des chiffres - les séparateurs seront ajoutés automatiquement selon le format défini</div>
                
                <h4 class="mb-2">Format JJ/MM/AAAA (séparateur /)</h4>
                <DatePicker
                  v-model="dateSlash"
				  label="Date (JJ/MM/AAAA)"
                  placeholder="JJ/MM/AAAA"
                  format="DD/MM/YYYY"
                  useCombinedMode
                  autoClamp
                />
                <div class="caption mb-4">Valeur actuelle: {{ dateSlash || 'aucune date saisie' }}</div>
                
                <h4 class="mb-2">Format JJ-MM-AAAA (séparateur -)</h4>
                <DatePicker
                  v-model="dateDash"
				  label="Date (JJ-MM-AAAA)"
                  placeholder="JJ-MM-AAAA"
                  format="DD-MM-YYYY"
                  useCombinedMode
                  autoClamp
                />
                <div class="caption mb-4">Valeur actuelle: {{ dateDash || 'aucune date saisie' }}</div>
                
                <h4 class="mb-2">Format AAAA.MM.JJ (séparateur .)</h4>
                <DatePicker
                  v-model="dateDot"
				  label="Date (AAAA.MM.JJ)"
                  placeholder="AAAA.MM.JJ"
                  format="YYYY.MM.DD"
                  useCombinedMode
                  autoClamp
                />
                <div class="caption mb-4">Valeur actuelle: {{ dateDot || 'aucune date saisie' }}</div>
              </div>
            `,
		}
	},
}
