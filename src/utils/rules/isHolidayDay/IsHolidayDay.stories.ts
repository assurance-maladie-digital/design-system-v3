import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import DatePicker from '@/components/DatePicker/DatePicker/DatePicker.vue'
import { useHolidayDay } from '@/composables/date/useHolidayDay'

const meta: Meta<typeof DatePicker> = {
	title: 'Guide du dev/Règles De Validation/isHolidayDay',
	component: DatePicker,
	argTypes: {
		modelValue: {
			control: 'text',
		},
	},
}

export default meta
type Story = StoryObj<typeof DatePicker>

/**
 * Exemple d'utilisation de la règle isHolidayDay avec un DatePicker
 */
export const Default: Story = {
	render: () => ({
		components: {
			DatePicker,
		},
		setup() {
			const date = ref('')
			const { getJoursFeries } = useHolidayDay()
			const currentYear = new Date().getFullYear()
			const holidays = Array.from(getJoursFeries(currentYear)).sort()
			const holidayRules = [
				{
					type: 'isHolidayDay',
					options: {
						fieldName: 'La date',
						message: 'Vous ne pouvez pas sélectionner un jour férié.',
						successMessage: 'La date sélectionnée n\'est pas un jour férié.',
					},
				},
			]

			return {
				date,
				rules: holidayRules,
				holidays,
			}
		},
		template: `
			<div>
				<DatePicker
					v-model="date"
					label="Date (pas de jour férié)"
					:custom-rules="rules"
					placeholder="Sélectionnez une date"
				/>
				
				<div class="mt-4">
					<p>Date sélectionnée : <strong>{{ date || 'Aucune' }}</strong></p>
				</div>
				
				<div class="mt-4">
					<h4>Jours fériés de l'année en cours :</h4>
					<ul>
						<li v-for="(holiday, index) in holidays" :key="index">
							{{ holiday }}
						</li>
					</ul>
				</div>
			</div>
		`,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { isHolidayDay } from '@cnamts/synapse'
					import { datePicker } from '@cnamts/synapse'
					
					const date = ref('')
					const { getJoursFeries } = useHolidayDay()
					const currentYear = new Date().getFullYear()
					const holidays = Array.from(getJoursFeries(currentYear)).sort()
					const holidayRules = [
							{
								type: 'isHolidayDay',
								options: {
								fieldName: 'La date',
								message: 'Vous ne pouvez pas sélectionner un jour férié.',
								successMessage: 'La date sélectionnée n\\'est pas un jour férié.',
								},
							},
					]
				</script>
			`,
			},
			{
				name: 'Template',
				code: `
				<template>
				<div>
				<DatePicker
					v-model="date"
					label="Date (pas de jour férié)"
					:custom-rules="rules"
					placeholder="Sélectionnez une date"
				/>
				
				<div class="mt-4">
					<p>Date sélectionnée : <strong>{{ date || 'Aucune' }}</strong></p>
				</div>
				
				<div class="mt-4">
					<h4>Jours fériés de l'année en cours :</h4>
					<ul>
						<li v-for="(holiday, index) in holidays" :key="index">
							{{ holiday }}
						</li>
					</ul>
				</div>
			</div>
				</template>
				`,
			},
		],
	},
}
