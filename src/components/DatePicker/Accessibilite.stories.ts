import { VIcon } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3-vite'
import { mdiCheckboxMarkedCircle } from '@mdi/js'
import { ref } from 'vue'
import DatePicker from './CalendarMode/DatePicker.vue'
const checkIcon = mdiCheckboxMarkedCircle

export default {
	title: 'Composants/Formulaires/DatePicker/Accessibility',
}

export const BonnesPratiquesLabels: StoryObj = {
	parameters: {
		docs: {
			description: {
				story: `
**RGAA 11.1, 11.2 et 11.10** : chaque champ date doit avoir un intitulé explicite et distinct, les informations complémentaires (format attendu, contrainte) vont dans \`helpText\` (affiché sous le champ, y compris en cas d'erreur), et l'obligation est indiquée par un texte visible.

- **À faire** : \`label="Date de naissance"\`, \`help-text="Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres"\`.
- **À éviter** : \`label="Date (JJ/MM/AAAA)"\` (format répété, plusieurs fois annoncé par le lecteur d'écran), ou des intitulés identiques (« Date ») sur plusieurs champs.
- **Champs obligatoires** : \`required\` et \`displayAsterisk\`, accompagnés de la mention visible « Les champs marqués d'un astérisque (*) sont obligatoires ».
`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<p>Les champs marqués d'un astérisque (*) sont obligatoires.</p>
					<DatePicker
						v-model="birthDate"
						label="Date de naissance"
						help-text="Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres"
						required
						displayAsterisk
						isBirthDate
						format="DD/MM/YYYY"
					/>
					<DatePicker
						v-model="appointmentDate"
						label="Date du rendez-vous"
						help-text="Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres"
						format="DD/MM/YYYY"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { DatePicker } from '@cnamts/synapse'

					const birthDate = ref('')
					const appointmentDate = ref('')
				</script>
				`,
			},
		],
	},
	render: () => ({
		components: { DatePicker },
		setup() {
			const birthDate = ref('')
			const appointmentDate = ref('')
			return { birthDate, appointmentDate }
		},
		template: `
			<div class="pa-4">
				<p class="mb-4">Les champs marqués d'un astérisque (*) sont obligatoires.</p>
				<DatePicker
					v-model="birthDate"
					label="Date de naissance"
					help-text="Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres"
					required
					display-asterisk
					is-birth-date
					format="DD/MM/YYYY"
				/>
				<DatePicker
					v-model="appointmentDate"
					label="Date du rendez-vous"
					help-text="Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres"
					format="DD/MM/YYYY"
				/>
			</div>
		`,
	}),
}

export const Legende: StoryObj = {
	args: {
		icon: checkIcon,
	},
	render: (args) => {
		return {
			components: { VIcon },
			setup() {
				return { args }
			},
			template: `   
            `,
		}
	},
	tags: ['!dev'],
}
